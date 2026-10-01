import React from 'react';
import { InventoryItem } from '@/services/inventoryService';

interface InventoryTableProps {
    items: InventoryItem[];
    loading: boolean;
    onAdjustStock: (item: InventoryItem) => void;
    onReceiveStock: (item: InventoryItem) => void;
    onViewHistory: (item: InventoryItem) => void;
}

export default function InventoryTable({
    items,
    loading,
    onAdjustStock,
    onReceiveStock,
    onViewHistory
}: InventoryTableProps) {
    if (loading) {
        return <div className="text-center py-10">Loading inventory...</div>;
    }

    if (items.length === 0) {
        return <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">No inventory items found.</div>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code / SKU</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (Rs)</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.description || 'No description'}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {item.product_code || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <span className="text-sm font-bold text-gray-900">{item.stock_quantity}</span>
                                    {item.min_stock_level !== null && (
                                        <span className="text-xs text-gray-400 ml-2">(Min: {item.min_stock_level})</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    item.stock_quantity > (item.min_stock_level || 5)
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : item.stock_quantity > 0
                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                    {item.stock_quantity > (item.min_stock_level || 5) 
                                        ? 'In Stock' 
                                        : item.stock_quantity > 0 
                                            ? 'Low Stock' 
                                            : 'Out of Stock'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onAdjustStock(item)}
                                        className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md border border-indigo-200 transition-colors"
                                    >
                                        Adjust
                                    </button>
                                    <button
                                        onClick={() => onReceiveStock(item)}
                                        className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md border border-blue-200 transition-colors"
                                    >
                                        Receive
                                    </button>
                                    <button
                                        onClick={() => onViewHistory(item)}
                                        className="text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 transition-colors"
                                    >
                                        History
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
