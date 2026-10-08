'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Package, Search, Plus, Tag, DollarSign, AlertTriangle, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/lib/rbac';

// Components
import ProductHubTable from '@/components/erp/product-hub-table';
import AddProductModal from '@/components/admin/add-product-modal';
import EditProductModal from '@/components/admin/edit-product-modal';
import DeleteConfirmationModal from '@/components/admin/delete-confirmation-modal';
import NewStockModal from '@/components/erp/new-stock-modal';
import StockHistoryDrawer from '@/components/erp/stock-history-drawer';
import { InventoryItem } from '@/services/inventoryService';
import { api } from '@/lib/api';

type FilterType = 'all' | 'on_web' | 'off_web' | 'low_stock' | 'out_of_stock' | 'show_price';

export default function InventoryPage() {
    const { hasPermission } = useAuth();
    const canCreate = hasPermission('products.create');
    const canDelete = hasPermission('products.delete');

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    
    const [isNewStockModalOpen, setIsNewStockModalOpen] = useState(false);
    const [stockHistoryItem, setStockHistoryItem] = useState<InventoryItem | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts(debouncedSearch, true);
            setProducts(data || []);
        } catch (error) {
            console.error('Failed to fetch products', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    // Handle Delete
    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            setDeletingId(productToDelete.id);
            await api.delete(`/api/products/${productToDelete.id}`);
            toast.success('Product permanently deleted');
            fetchProducts();
            setProductToDelete(null);
        } catch (error: any) {
            console.error('Failed to delete product', error);
            const msg = error.response?.data?.message || 'Failed to delete product.';
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    // Derived Stats
    const stats = useMemo(() => {
        const total = products.length;
        const onWeb = products.filter(p => p.on_store).length;
        const showingPrice = products.filter(p => p.show_price).length;
        const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
        const outOfStock = products.filter(p => (p.stock || 0) === 0).length;

        return { total, onWeb, showingPrice, lowStock, outOfStock };
    }, [products]);

    // Filtered Products
    const filteredProducts = useMemo(() => {
        switch (activeFilter) {
            case 'on_web': return products.filter(p => p.on_store);
            case 'off_web': return products.filter(p => !p.on_store);
            case 'low_stock': return products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5);
            case 'out_of_stock': return products.filter(p => (p.stock || 0) === 0);
            case 'show_price': return products.filter(p => p.show_price);
            default: return products;
        }
    }, [products, activeFilter]);

    const statCards = [
        { id: 'all' as FilterType, label: 'Total Products', value: stats.total, icon: Package, color: 'text-indigo-600', bg: 'bg-[#F1EBFF]' },
        { id: 'on_web' as FilterType, label: 'On Website', value: stats.onWeb, icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'show_price' as FilterType, label: 'Showing Price', value: stats.showingPrice, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'low_stock' as FilterType, label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 'out_of_stock' as FilterType, label: 'Out of Stock', value: stats.outOfStock, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const handleExportCSV = () => {
        if (products.length === 0) {
            toast.error('No products to export.');
            return;
        }

        const headers = ['ID', 'Product Name', 'Code / SKU', 'Price', 'Stock Quantity', 'On Store'];
        const rows = products.map(item => [
            item.id,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            `"${(item.sku || '').replace(/"/g, '""')}"`,
            item.price,
            item.stock || 0,
            item.on_store ? 'Yes' : 'No'
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Products exported to CSV');
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                        Inventory Management
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">
                        Manage your catalog, inventory, and web visibility in one place.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    {canCreate && (
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            variant="outline"
                            className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    )}
                    {(hasPermission('inventory.adjust') || hasPermission('inventory.receive')) && (
                        <Button
                            onClick={() => setIsNewStockModalOpen(true)}
                            className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4 text-neutral-700" />
                            New Stock
                        </Button>
                    )}
                    <Button
                        onClick={handleExportCSV}
                        variant="outline"
                        className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                        <Download className="h-4 w-4 text-neutral-700" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statCards.map((stat, i) => (
                    <div
                        key={stat.id}
                        onClick={() => setActiveFilter(stat.id)}
                        className={`bg-white/40 backdrop-blur-md p-5 rounded-3xl border shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.01] ${
                            activeFilter === stat.id ? 'ring-2 ring-sky-300 border-sky-300' : 'border-white/80'
                        }`}
                    >
                        <div>
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${stat.color}`}>{stat.label}</p>
                            <p className="text-2xl font-extrabold text-neutral-900 tracking-tight mt-1">
                                {stat.value}
                            </p>
                        </div>
                        <div className={`h-10 w-10 mt-3 rounded-2xl ${stat.bg} ${stat.color} border border-white/80 shadow-2xs flex items-center justify-center shrink-0`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="relative flex-1 w-full flex items-center">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                        placeholder="Search products by name, code, or SKU..." 
                        className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-amber-50/30 border-white focus:border-amber-200 text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Status Filter Tabs (Matching Quotation Tabs style) */}
                <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 overflow-x-auto w-full md:w-auto">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'on_web', label: 'On Web' },
                        { id: 'off_web', label: 'Off Web' },
                        { id: 'low_stock', label: 'Low Stock' },
                        { id: 'out_of_stock', label: 'Out Stock' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id as FilterType)}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                                activeFilter === tab.id
                                    ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <ProductHubTable
                products={filteredProducts}
                onRefresh={fetchProducts}
                isLoading={loading}
                onEdit={setEditingProduct}
                onDelete={setProductToDelete}
                onViewHistory={setStockHistoryItem}
            />

            {/* Modals */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProducts}
            />

            <EditProductModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
                onSuccess={fetchProducts}
            />

            <DeleteConfirmationModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDelete}
                itemName={productToDelete?.name || ''}
                itemIdentifier={productToDelete?.sku ? `SKU: ${productToDelete.sku}` : undefined}
                itemType="Product"
                isDeleting={!!deletingId}
            />

            <NewStockModal
                isOpen={isNewStockModalOpen}
                onClose={() => setIsNewStockModalOpen(false)}
                onSuccess={fetchProducts}
                onAddNewProduct={() => {
                    setIsNewStockModalOpen(false);
                    setIsAddModalOpen(true);
                }}
            />

            <StockHistoryDrawer
                isOpen={!!stockHistoryItem}
                onClose={() => setStockHistoryItem(null)}
                item={stockHistoryItem}
            />
        </div>
    );
}
