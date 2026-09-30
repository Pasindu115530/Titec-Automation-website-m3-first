import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryMovement, inventoryService } from '@/services/inventoryService';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, ArrowDownToLine, ShoppingCart, RefreshCw, Undo2, Package } from 'lucide-react';

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

    const getMovementIcon = (type: string) => {
        switch (type) {
            case 'receive':
                return (
                    <div className="h-8 w-8 rounded-xl bg-[#E6F9F7] border border-teal-200/60 shadow-2xs flex items-center justify-center text-[#0D9488]">
                        <ArrowDownToLine className="w-4 h-4" />
                    </div>
                );
            case 'sale':
                return (
                    <div className="h-8 w-8 rounded-xl bg-[#F1EBFF] border border-purple-200/60 shadow-2xs flex items-center justify-center text-[#7C3AED]">
                        <ShoppingCart className="w-4 h-4" />
                    </div>
                );
            case 'adjust':
                return (
                    <div className="h-8 w-8 rounded-xl bg-[#FFF4E8] border border-amber-200/60 shadow-2xs flex items-center justify-center text-[#E0781E]">
                        <RefreshCw className="w-4 h-4" />
                    </div>
                );
            case 'return':
                return (
                    <div className="h-8 w-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700">
                        <Undo2 className="w-4 h-4" />
                    </div>
                );
            default:
                return (
                    <div className="h-8 w-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600">
                        <Package className="w-4 h-4" />
                    </div>
                );
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md md:max-w-lg bg-white/95 backdrop-blur-xl border-l border-white/80 text-neutral-900 overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-[#E2D6FE] text-neutral-900 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                            <History className="h-5 w-5 text-neutral-800" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold text-neutral-900 tracking-tight">Stock History</SheetTitle>
                            <SheetDescription className="text-xs text-neutral-500 font-medium mt-0.5">
                                Movement timeline for {item.name}
                            </SheetDescription>
                        </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 shadow-2xs flex justify-between items-center text-xs">
                        <span className="font-semibold text-neutral-600">Current Stock</span>
                        <span className="font-extrabold text-neutral-900 text-sm font-mono">{item.stock_quantity} units</span>
                    </div>
                </SheetHeader>

                <div className="space-y-4">
                    {loading ? (
                        <div className="py-16 text-center">
                            <div className="animate-spin h-8 w-8 border-3 border-neutral-900 border-t-transparent rounded-full mx-auto mb-3" />
                            <p className="text-neutral-500 font-semibold text-xs">Loading movement history...</p>
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-16 text-neutral-400 font-medium text-sm border-2 border-dashed border-neutral-200 rounded-2xl">
                            No stock history available.
                        </div>
                    ) : (
                        <div className="relative border-l border-neutral-200 ml-4 space-y-6 pb-6">
                            {movements.map((movement) => (
                                <div key={movement.id} className="relative pl-6">
                                    <div className="absolute -left-4 top-0 bg-white p-0.5 rounded-full">
                                        {getMovementIcon(movement.type)}
                                    </div>
                                    <div className="bg-white/80 border border-neutral-200/70 shadow-2xs rounded-2xl p-4 transition-all">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                                movement.type === 'receive' ? 'bg-[#E6F9F7] text-[#0D9488] border-teal-200' :
                                                movement.type === 'sale' ? 'bg-[#F1EBFF] text-[#7C3AED] border-purple-200' :
                                                movement.type === 'return' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                'bg-[#FFF4E8] text-[#E0781E] border-amber-200'
                                            }`}>
                                                {movement.type}
                                            </Badge>
                                            <span className="text-[11px] text-neutral-400 font-medium">
                                                {new Date(movement.created_at).toLocaleString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        
                                        <div className="text-sm font-bold text-neutral-900">
                                            Quantity change: <span className={movement.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                            </span>
                                        </div>
                                        <div className="text-xs text-neutral-500 font-medium mt-0.5">
                                            Stock: {movement.previous_stock} → <span className="font-bold text-neutral-800">{movement.new_stock}</span>
                                        </div>
                                        
                                        {movement.notes && (
                                            <div className="mt-2.5 text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 font-medium">
                                                {movement.notes}
                                            </div>
                                        )}
                                        
                                        {movement.reference_type && (
                                            <div className="mt-2 text-[11px] text-neutral-400 font-mono">
                                                Ref: {movement.reference_type} #{movement.reference_id}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {hasMore && (
                                <div className="pl-6 pt-2">
                                    <Button 
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const nextPage = page + 1;
                                            setPage(nextPage);
                                            loadMovements(nextPage, false);
                                        }}
                                        className="w-full h-9 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 text-xs font-semibold"
                                    >
                                        Load older movements...
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
