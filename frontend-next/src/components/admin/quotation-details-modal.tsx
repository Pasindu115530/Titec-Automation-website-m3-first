import React, { useState, useEffect } from 'react';
import { X, Send, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quotation, QuotationItem } from '@/types/quotation';
import { quotationService } from '@/services/quotationService';

import { toast } from 'sonner';

interface QuotationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotation: Quotation | null;
    onSuccess: () => void;
}

export default function QuotationDetailsModal({ isOpen, onClose, quotation, onSuccess }: QuotationDetailsModalProps) {
    const [items, setItems] = useState<QuotationItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (quotation) {
            // Initialize items with existing prices or 0
            setItems(quotation.items.map(item => ({ ...item, price: item.price || 0 })));
        }
    }, [quotation]);

    const handlePriceChange = (index: number, price: string) => {
        const newItems = [...items];
        newItems[index].price = parseFloat(price) || 0;
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    };

    const handleSend = async () => {
        if (!quotation) return;
        if (!confirm('Are you sure you want to send this quotation?')) return;

        setLoading(true);
        try {
            await quotationService.updateQuotation(quotation.id, {
                items: items,
                total_amount: calculateTotal(),
                status: 'sent'
            });
            toast.success('Quotation sent successfully');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to send quotation', error);
            toast.error('Failed to send quotation');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!quotation) return;
        if (!confirm('Are you sure you want to reject this quotation?')) return;

        setLoading(true);
        try {
            await quotationService.updateQuotation(quotation.id, {
                status: 'rejected'
            });
            toast.success('Quotation rejected');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to reject quotation', error);
            toast.error('Failed to reject quotation');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !quotation) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Quotation Details #{quotation.id}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Customer Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Customer Name</label>
                            <div className="mt-1 text-lg font-medium">{quotation.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <div className="mt-1">{quotation.email}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Phone</label>
                            <div className="mt-1">{quotation.phone || 'N/A'}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Date Requested</label>
                            <div className="mt-1">{new Date(quotation.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Requested Items (Bill)</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="pb-2 text-sm font-medium text-gray-500">Item</th>
                                        <th className="pb-2 text-sm font-medium text-gray-500">Qty</th>
                                        <th className="pb-2 text-sm font-medium text-gray-500">Notes</th>
                                        <th className="pb-2 text-sm font-medium text-gray-500 w-32">Unit Price ($)</th>
                                        <th className="pb-2 text-sm font-medium text-gray-500 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-2">{item.name}</td>
                                            <td className="py-2">{item.quantity}</td>
                                            <td className="py-2 text-sm text-gray-500">{item.notes || '-'}</td>
                                            <td className="py-2">
                                                <input
                                                    type="number"
                                                    disabled={quotation.status !== 'pending'}
                                                    value={item.price || ''}
                                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                                    className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="py-2 text-right font-medium">
                                                ${((item.price || 0) * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} className="pt-4 text-right font-bold text-gray-900">Total Amount:</td>
                                        <td className="pt-4 text-right font-bold text-xl text-blue-600">
                                            ${calculateTotal().toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {quotation.status === 'pending' && (
                        <>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Send Quotation
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
