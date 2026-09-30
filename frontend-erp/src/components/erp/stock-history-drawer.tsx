import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryMovement, inventoryService } from '@/services/inventoryService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { History, ArrowDownToLine, ShoppingCart, SlidersHorizontal, Undo2, Calendar } from 'lucide-react';

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

    if (!item) return null;

    const renderMovementBadge = (type: string) => {
        switch (type) {
            case 'receive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60 shadow-2xs">
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        Received
                    </span>
                );
            case 'sale':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-purple-200/60 shadow-2xs">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Sale
                    </span>
                );
            case 'adjust':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                        Adjusted
                    </span>
                );
            case 'return':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60 shadow-2xs">
                        <Undo2 className="w-3.5 h-3.5" />
                        Return
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-2xs">
                        {type}
                    </span>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[720px] md:max-w-[760px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-7 sm:p-8 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
                <DialogHeader>
                    <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-2xl bg-[#E2D6FE] text-neutral-900 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                            <History className="h-6 w-6 text-neutral-800" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-neutral-900 tracking-tight">Stock History & Audit Log</DialogTitle>
                            <p className="text-sm text-neutral-500 font-medium mt-0.5">
                                Complete timeline of inventory movements for {item.name}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Product Summary Header Card */}
                <div className="bg-white/70 backdrop-blur-md border border-neutral-200/70 rounded-2xl p-4.5 shadow-2xs mt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Product</span>
                            <h4 className="font-bold text-neutral-900 text-base tracking-tight leading-snug">{item.name}</h4>
                            {item.product_code && (
                                <span className="inline-block font-mono text-xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-lg border border-neutral-200/80">
                                    SKU: {item.product_code}
                                </span>
                            )}
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 bg-neutral-50 sm:bg-transparent rounded-xl border sm:border-0 border-neutral-200/60 shrink-0">
                            <span className="text-xs font-semibold text-neutral-500">Current In-Stock</span>
                            <span className="font-mono font-extrabold text-neutral-900 text-xl tracking-tight">
                                {(item.stock_quantity ?? 0).toLocaleString()} <span className="text-xs text-neutral-400 font-normal">units</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Movements List Container */}
                <div className="mt-4 max-h-[50vh] overflow-y-auto pr-1 space-y-3.5">
                    {loading ? (
                        <div className="py-16 text-center">
                            <div className="animate-spin h-9 w-9 border-3 border-neutral-900 border-t-transparent rounded-full mx-auto mb-3" />
                            <p className="text-neutral-500 font-semibold text-sm">Loading movement history...</p>
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-neutral-50/50 border-2 border-dashed border-neutral-200/80 rounded-2xl">
                            <History className="h-10 w-10 text-neutral-300 mx-auto mb-2.5" />
                            <p className="text-neutral-700 font-bold text-sm">No stock movements recorded yet</p>
                            <p className="text-neutral-400 text-xs mt-1">Adjustments, receipts, and sales for this item will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {movements.map((movement) => (
                                <div 
                                    key={movement.id}
                                    className="p-4 rounded-2xl bg-white/80 border border-neutral-200/70 shadow-2xs hover:border-neutral-300/80 transition-all space-y-2.5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {renderMovementBadge(movement.type)}
                                            <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-xl border ${
                                                movement.quantity > 0 
                                                    ? 'bg-[#E6F9F7] text-[#0D9488] border-teal-200/60' 
                                                    : 'bg-rose-50 text-rose-600 border-rose-200/60'
                                            }`}>
                                                {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity} units
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                            {new Date(movement.created_at).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium pt-0.5">
                                        <span>Stock Level:</span>
                                        <span className="font-mono text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200/60 font-semibold">
                                            {movement.previous_stock ?? 0}
                                        </span>
                                        <span className="text-neutral-400">→</span>
                                        <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200/60">
                                            {movement.new_stock ?? 0} units
                                        </span>
                                    </div>

                                    {movement.notes && (
                                        <div className="text-xs text-neutral-700 bg-neutral-50/90 p-3 rounded-xl border border-neutral-200/60 font-medium leading-relaxed">
                                            {movement.notes}
                                        </div>
                                    )}

                                    {movement.reference_type && (
                                        <div className="text-[11px] text-neutral-400 font-mono">
                                            Reference: <span className="text-neutral-600 font-semibold">{movement.reference_type} #{movement.reference_id}</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {hasMore && (
                                <div className="pt-2 text-center">
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const nextPage = page + 1;
                                            setPage(nextPage);
                                            loadMovements(nextPage, false);
                                        }}
                                        className="h-10 px-5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/80 font-bold text-xs shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                    >
                                        Load older movements...
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="h-11 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 font-bold text-sm shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
