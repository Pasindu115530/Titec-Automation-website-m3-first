import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryMovement, inventoryService } from '@/services/inventoryService';
import Loader from '@/components/loader';

interface StockHistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem | null;
}

export default function StockHistoryDrawer({ isOpen, onClose, item }: StockHistoryDrawerProps) {
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (isOpen && item) {
            setPage(1);
            setMovements([]);
            loadMovements(1, true);
        }
    }, [isOpen, item]);

    const loadMovements = async (pageNum: number, isInitial: boolean) => {
        if (!item) return;
        
        if (isInitial) setLoading(true);

        try {
            const response = await inventoryService.getMovements(item.id, pageNum);
            
            if (isInitial) {
                setMovements(response.data);
            } else {
                setMovements(prev => [...prev, ...response.data]);
            }
            
            setHasMore(response.current_page < response.last_page);
        } catch (error) {
            console.error('Failed to load history', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !item) return null;

    const getMovementIcon = (type: string) => {
        switch (type) {
            case 'receive':
                return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></div>;
            case 'sale':
                return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></div>;
            case 'adjust':
                return <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>;
            case 'return':
                return <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg></div>;
            default:
                return <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Stock History</h2>
                        <p className="text-sm text-gray-500 mt-1">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-1">Current Stock: <span className="font-semibold text-gray-700">{item.stock_quantity}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader size={40} />
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                            No stock history available.
                        </div>
                    ) : (
                        <div className="relative border-l border-gray-200 ml-4 space-y-8 pb-8">
                            {movements.map((movement) => (
                                <div key={movement.id} className="relative pl-6">
                                    <div className="absolute -left-4 top-0 bg-white p-1">
                                        {getMovementIcon(movement.type)}
                                    </div>
                                    <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize
                                                ${movement.type === 'receive' ? 'bg-green-100 text-green-700' : 
                                                  movement.type === 'sale' ? 'bg-blue-100 text-blue-700' : 
                                                  movement.type === 'return' ? 'bg-purple-100 text-purple-700' :
                                                  'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                {movement.type}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(movement.created_at).toLocaleString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-2 text-sm text-gray-800">
                                            Quantity change: <strong className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                            </strong>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Stock changed from {movement.previous_stock} to {movement.new_stock}
                                        </div>
                                        
                                        {movement.notes && (
                                            <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                                                {movement.notes}
                                            </div>
                                        )}
                                        
                                        {movement.reference_type && (
                                            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                Ref: {movement.reference_type} #{movement.reference_id}
                                            </div>
                                        )}
                                        
                                        {movement.user && (
                                            <div className="mt-2 text-xs text-gray-400 text-right">
                                                by {movement.user.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {hasMore && (
                                <div className="pl-6 pt-4">
                                    <button 
                                        onClick={() => {
                                            const nextPage = page + 1;
                                            setPage(nextPage);
                                            loadMovements(nextPage, false);
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Load older movements...
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
