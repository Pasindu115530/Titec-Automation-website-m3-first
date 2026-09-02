'use client';

import React, { useState, useEffect } from 'react';
import { inventoryService, InventoryItem } from '@/services/inventoryService';
import InventoryTable from '@/components/erp/inventory-table';
import Loader from '@/components/loader';
import { toast } from 'sonner';
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

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">Track and manage product stock levels.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors shadow-sm">
                        Export CSV
                    </button>
                    {/* Bulk receive disabled for MVP, use item-level receive */}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total || inventory.length}</p>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.lowStock || 0}</p>
                    </div>
                    <div className="h-10 w-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-red-600 font-medium">Out of Stock</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.outOfStock || 0}</p>
                    </div>
                    <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Search products by name or SKU..." 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="sm:w-48">
                    <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
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
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
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
