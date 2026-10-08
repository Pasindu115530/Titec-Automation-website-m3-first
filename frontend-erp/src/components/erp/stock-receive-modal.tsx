import React, { useState } from 'react';
import { InventoryItem, inventoryService } from '@/services/inventoryService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDownToLine } from 'lucide-react';

interface StockReceiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onSuccess: () => void;
}

export default function StockReceiveModal({ isOpen, onClose, item, onSuccess }: StockReceiveModalProps) {
    const [quantity, setQuantity] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!item) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (quantity === '' || isNaN(quantity) || Number(quantity) <= 0) {
            toast.error('Please enter a valid positive number for receiving stock.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Receiving stock...');
        try {
            await inventoryService.receiveStock(item.id, Number(quantity), notes);
            toast.success('Stock received successfully!', { id: toastId });
            setQuantity('');
            setNotes('');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to receive stock. Please try again.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[640px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-7 sm:p-8 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3.5">
                            <div className="h-12 w-12 rounded-2xl bg-[#E6F9F7] text-[#0D9488] flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <ArrowDownToLine className="h-6 w-6 text-[#0D9488]" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-neutral-900 tracking-tight">Receive Stock</DialogTitle>
                                <p className="text-sm text-neutral-500 font-medium mt-0.5">Record newly acquired inventory and supplier deliveries</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Product Summary Card */}
                    <div className="bg-white/70 backdrop-blur-md border border-neutral-200/70 rounded-2xl p-4.5 shadow-2xs">
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
                                <span className="text-xs font-semibold text-neutral-500">Current Stock</span>
                                <span className="font-mono font-extrabold text-neutral-900 text-xl tracking-tight">
                                    {(item.stock_quantity ?? 0).toLocaleString()} <span className="text-xs text-neutral-400 font-normal">units</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                    Quantity Received <span className="text-rose-500">*</span>
                                </Label>
                                {quantity !== '' && !isNaN(Number(quantity)) && Number(quantity) > 0 && (
                                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                                        New Total: <span className="font-mono font-bold text-emerald-800">{(item.stock_quantity ?? 0) + Number(quantity)} units</span>
                                    </span>
                                )}
                            </div>
                            <Input
                                type="number"
                                id="quantity"
                                required
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                                className="h-12 px-4 text-base bg-neutral-50/80 border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all placeholder:text-neutral-400 font-mono"
                                placeholder="e.g. 10"
                            />
                            <p className="text-xs text-neutral-400 font-medium">Enter positive integer units received from supplier or production.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                Reference / Notes
                            </Label>
                            <Textarea
                                id="notes"
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="p-3.5 text-sm bg-neutral-50/80 border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all resize-none placeholder:text-neutral-400"
                                placeholder="e.g. PO-10492, Supplier delivery note #8372, or shipment batch details..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-3 pt-4 border-t border-neutral-100 flex items-center justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-11 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 font-bold text-sm shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || quantity === ''}
                            className="h-11 px-7 rounded-2xl bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold border border-sky-200 shadow-[0_4px_16px_rgba(125,211,252,0.4)] text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                        >
                            {isSubmitting ? 'Receiving...' : 'Confirm Stock'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
