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
            <DialogContent className="sm:max-w-[480px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-6 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#E6F9F7] text-[#0D9488] flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <ArrowDownToLine className="h-5 w-5 text-[#0D9488]" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">Receive Stock</DialogTitle>
                                <p className="text-xs text-neutral-500 font-medium mt-0.5">Add newly acquired inventory items</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-[#E6F9F7]/60 border border-teal-100 rounded-2xl p-3.5 shadow-2xs">
                            <p className="text-xs font-semibold text-neutral-600">Product: <span className="font-bold text-neutral-900">{item.name}</span></p>
                            <p className="text-xs font-semibold text-neutral-600 mt-1">Current Stock: <span className="font-bold text-neutral-900 font-mono">{item.stock_quantity}</span></p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quantity" className="text-xs font-semibold text-neutral-700">
                                Quantity Received *
                            </Label>
                            <Input
                                type="number"
                                id="quantity"
                                required
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                                className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                placeholder="e.g. 10"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs font-semibold text-neutral-700">
                                Reference / Notes
                            </Label>
                            <Textarea
                                id="notes"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors resize-none"
                                placeholder="e.g. PO-12345 or supplier delivery note"
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
                            {isSubmitting ? 'Receiving...' : 'Confirm Stock'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
