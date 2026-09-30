import React, { useState } from 'react';
import { InventoryItem, inventoryService } from '@/services/inventoryService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SlidersHorizontal } from 'lucide-react';

interface StockAdjustModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onSuccess: () => void;
}

export default function StockAdjustModal({ isOpen, onClose, item, onSuccess }: StockAdjustModalProps) {
    const [quantity, setQuantity] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!item) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (quantity === '' || isNaN(quantity)) {
            toast.error('Please enter a valid number for adjustment.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Adjusting stock...');
        try {
            await inventoryService.adjustStock(item.id, Number(quantity), notes);
            toast.success('Stock adjusted successfully!', { id: toastId });
            setQuantity('');
            setNotes('');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to adjust stock. Please try again.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-6 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#F1EBFF] text-[#7C3AED] flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <SlidersHorizontal className="h-5 w-5 text-[#7C3AED]" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">Adjust Stock</DialogTitle>
                                <p className="text-xs text-neutral-500 font-medium mt-0.5">Correct inventory discrepancies</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-[#F1EBFF]/60 border border-purple-100 rounded-2xl p-3.5 shadow-2xs">
                            <p className="text-xs font-semibold text-neutral-600">Product: <span className="font-bold text-neutral-900">{item.name}</span></p>
                            <p className="text-xs font-semibold text-neutral-600 mt-1">Current Stock: <span className="font-bold text-neutral-900 font-mono">{item.stock_quantity}</span></p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quantity" className="text-xs font-semibold text-neutral-700">
                                Adjustment Amount (e.g. -2 or +5) *
                            </Label>
                            <Input
                                type="number"
                                id="quantity"
                                required
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                                className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                placeholder="-2 or 5"
                            />
                            <p className="text-[11px] text-neutral-400 font-medium">Use negative values to deduct stock (e.g., damaged items).</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-semibold text-neutral-700">
                                Reason / Notes
                            </Label>
                            <Textarea
                                id="notes"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors resize-none"
                                placeholder="Reason for adjustment (e.g., Damaged item, inventory count discrepancy)"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4 mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="bg-rose-200 border border-rose-300 text-red-600 hover:bg-rose-300 rounded-xl font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || quantity === ''}
                            className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold border border-[#E9FF7A] shadow-[0_8px_20px_rgba(215,252,69,0.35)] rounded-xl px-5 transition-all"
                        >
                            {isSubmitting ? 'Adjusting...' : 'Confirm Adjustment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
