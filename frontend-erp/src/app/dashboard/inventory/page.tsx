'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Package, Search, Plus, Filter, Tag, DollarSign, PackageMinus, PackageX, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import { Product } from '@/types';
import { motion } from 'framer-motion';
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

export default function ProductAndInventoryHubPage() {
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
        { id: 'all' as FilterType, label: 'Total Products', value: stats.total, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'on_web' as FilterType, label: 'On Website', value: stats.onWeb, icon: Tag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'show_price' as FilterType, label: 'Showing Price', value: stats.showingPrice, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 'low_stock' as FilterType, label: 'Low Stock (≤5)', value: stats.lowStock, icon: PackageMinus, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 'out_of_stock' as FilterType, label: 'Out of Stock', value: stats.outOfStock, icon: PackageX, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">
                        Products & Stock Hub
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your catalog, inventory, and web visibility in one place.</p>
                </div>
                <div className="flex gap-3">
                    {canCreate && (
                        <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="gap-2 border-gray-300">
                            <Plus className="h-4 w-4" />
                            <span>Add Product</span>
                        </Button>
                    )}
                    {(hasPermission('inventory.adjust') || hasPermission('inventory.receive')) && (
                        <Button onClick={() => setIsNewStockModalOpen(true)} className="gap-2 btn-gradient-primary border-0 shadow-md">
                            <Plus className="h-4 w-4" />
                            <span>New Stock</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setActiveFilter(stat.id)}
                        className={`bg-white rounded-xl p-4 border shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:border-gray-300 ${
                            activeFilter === stat.id ? 'ring-2 ring-indigo-500 border-indigo-500' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                    {/* Filter Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'on_web', label: 'On Web' },
                            { id: 'off_web', label: 'Off Web' },
                            { id: 'low_stock', label: 'Low Stock' },
                            { id: 'out_of_stock', label: 'Out of Stock' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id as FilterType)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                                    activeFilter === tab.id
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, SKU, category..."
                            className="pl-9 bg-gray-50 border-gray-200 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Unified Table */}
                <ProductHubTable
                    products={filteredProducts}
                    onRefresh={fetchProducts}
                    isLoading={loading}
                    onEdit={setEditingProduct}
                    onDelete={setProductToDelete}
                    onViewHistory={setStockHistoryItem}
                />
            </div>

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
