'use client';

import React, { useState, useEffect } from 'react';
import { inventoryService, InventoryItem } from '@/services/inventoryService';
import InventoryTable from '@/components/erp/inventory-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, Download, RefreshCw, Package, AlertTriangle, AlertCircle } from 'lucide-react';
import StockAdjustModal from '@/components/erp/stock-adjust-modal';
import StockReceiveModal from '@/components/erp/stock-receive-modal';
import StockHistoryDrawer from '@/components/erp/stock-history-drawer';

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    // Pagination & Search
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });

    // Modals
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

    useEffect(() => {
        loadInventory(1, true);
    }, [searchTerm, statusFilter]);

    const loadInventory = async (pageNum: number, isInitial: boolean) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const response = await inventoryService.getInventory({
                page: pageNum,
                search: searchTerm || undefined,
                status: statusFilter || undefined,
            });

            const newItems = response.data;

            if (isInitial) {
                setInventory(newItems);
            } else {
                setInventory(prev => [...prev, ...newItems]);
            }
            
            setHasMore(response.current_page < response.last_page);
            
            if (isInitial && response.stats) {
                setStats(response.stats);
            }
        } catch (error) {
            toast.error('Failed to load inventory.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadInventory(nextPage, false);
    };

    const handleAdjustStock = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsAdjustModalOpen(true);
    };

    const handleReceiveStock = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsReceiveModalOpen(true);
    };

    const handleViewHistory = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsHistoryDrawerOpen(true);
    };

    const handleStockUpdated = () => {
        setPage(1);
        loadInventory(1, true);
    };

    const handleExportCSV = () => {
        if (inventory.length === 0) {
            toast.error('No inventory items to export.');
            return;
        }

        const headers = ['ID', 'Product Name', 'Code / SKU', 'Price', 'Stock Quantity', 'Min Stock Level', 'Status'];
        const rows = inventory.map(item => {
            const status = item.stock_quantity > (item.min_stock_level || 5) 
                ? 'In Stock' 
                : item.stock_quantity > 0 
                    ? 'Low Stock' 
                    : 'Out of Stock';
            return [
                item.id,
                `"${(item.name || '').replace(/"/g, '""')}"`,
                `"${(item.product_code || '').replace(/"/g, '""')}"`,
                item.price,
                item.stock_quantity,
                item.min_stock_level ?? '-',
                status
            ];
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Inventory exported to CSV');
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
                        Track and manage product stock levels
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        onClick={() => loadInventory(1, true)}
                        variant="outline"
                        className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 text-neutral-700 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Products</p>
                        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
                            {stats.total || inventory.length}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-[#7C3AED]" />
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Low Stock</p>
                        <p className="text-3xl font-extrabold text-amber-600 tracking-tight mt-1">
                            {stats.lowStock || 0}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-600">Out of Stock</p>
                        <p className="text-3xl font-extrabold text-rose-700 tracking-tight mt-1">
                            {stats.outOfStock || 0}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 border border-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="relative flex-1 w-full flex items-center">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                        placeholder="Search products by name, code, or SKU..." 
                        className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-amber-50/30 border-white focus:border-amber-200 text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Filter Tabs (Matching Quotation Tabs style) */}
                <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 overflow-x-auto w-full md:w-auto">
                    <button
                        onClick={() => setStatusFilter('')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === ''
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('in_stock')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === 'in_stock'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        In Stock
                    </button>
                    <button
                        onClick={() => setStatusFilter('low_stock')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === 'low_stock'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Low Stock
                    </button>
                    <button
                        onClick={() => setStatusFilter('out_of_stock')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === 'out_of_stock'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Out of Stock
                    </button>
                </div>
            </div>

            <InventoryTable 
                items={inventory} 
                loading={loading}
                onAdjustStock={handleAdjustStock}
                onReceiveStock={handleReceiveStock}
                onViewHistory={handleViewHistory}
            />

            {hasMore && !loading && (
                <div className="flex justify-center pt-2">
                    <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        variant="outline"
                        className="px-6 h-11 bg-white/80 hover:bg-white text-neutral-900 border border-white/80 rounded-2xl text-sm font-semibold shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                    >
                        {loadingMore ? 'Loading more products...' : 'Load More Products'}
                    </Button>
                </div>
            )}

            <StockAdjustModal 
                isOpen={isAdjustModalOpen} 
                onClose={() => setIsAdjustModalOpen(false)} 
                item={selectedItem}
                onSuccess={handleStockUpdated}
            />
            <StockReceiveModal
                isOpen={isReceiveModalOpen}
                onClose={() => setIsReceiveModalOpen(false)}
                item={selectedItem}
                onSuccess={handleStockUpdated}
            />
            <StockHistoryDrawer
                isOpen={isHistoryDrawerOpen}
                onClose={() => setIsHistoryDrawerOpen(false)}
                item={selectedItem}
            />
        </div>
    );
}
