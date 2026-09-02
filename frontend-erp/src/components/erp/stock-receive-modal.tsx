import React, { useState } from 'react';
import { InventoryItem, inventoryService } from '@/services/inventoryService';
import { toast } from 'sonner';

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

    if (!isOpen || !item) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">Receive Stock</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-green-50/50 border border-green-100 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600">Product: <span className="font-semibold text-gray-900">{item.name}</span></p>
                        <p className="text-sm text-gray-600">Current Stock: <span className="font-bold text-gray-900">{item.stock_quantity}</span></p>
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity Received
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            required
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. 10"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Reference / Notes
                        </label>
                        <textarea
                            id="notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="e.g. PO-12345 or supplier delivery note"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || quantity === ''}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Receiving...' : 'Receive Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
