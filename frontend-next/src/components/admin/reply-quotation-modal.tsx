import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash, Send, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

interface ReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: any; // Using any for now to match flexible backend response
    onSend: (data: { items: any[], message: string }) => Promise<void>;
}

export default function ReplyModal({ isOpen, onClose, request, onSend }: ReplyModalProps) {
    // Generate initial items from request if available
    const initialItems = request?.products?.map((p: any) => ({
        name: p.name,
        quantity: p.pivot?.quantity || 1,
        price: p.price || 0,
    })) || [];

    // Use persistence keyed by request ID
    // Note: Parent must provide key={request.id} to ensure this remounts and re-initializes for new requests
    const [items, setItems] = useLocalStorage<any[]>(`admin_reply_items_${request?.id || 'new'}`, initialItems.length ? initialItems : [{ name: '', quantity: 1, price: 0 }]);
    const [message, setMessage] = useLocalStorage(`admin_reply_message_${request?.id || 'new'}`, '');
    const [isSending, setIsSending] = useState(false);

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!items.length) {
            toast.warning('Please add items before sending.');
            return;
        }
        setIsSending(true);
        try {
            await onSend({ items, message });
            onClose();
            // Reset storage
            setItems([{ name: '', quantity: 1, price: 0 }]);
            setMessage('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send reply.');
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    const total = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
                >
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                Create Quotation
                            </h2>
                            <p className="text-sm text-gray-500">Replying to Request #{request?.id}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                            <p><span className="font-medium">Customer:</span> {request?.name || 'Guest'}</p>
                            <p><span className="font-medium">Email:</span> {request?.email || '-'}</p>
                            <p><span className="font-medium">Phone:</span> {request?.phone || '-'}</p>
                            <p><span className="font-medium">Original Request:</span></p>
                            <p className="text-gray-600 pl-2 border-l-2 border-gray-300 mt-1">
                                {request?.customer_notes}
                            </p>
                        </div>

                        {/* Items Table */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">Items</h3>
                                <Button variant="outline" size="sm" onClick={addItem} className="gap-1">
                                    <Plus className="h-4 w-4" /> Add Item
                                </Button>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Item Name</th>
                                            <th className="px-4 py-2 w-24">Qty</th>
                                            <th className="px-4 py-2 w-32">Price ($)</th>
                                            <th className="px-4 py-2 w-32 text-right">Total</th>
                                            <th className="px-4 py-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-2">
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                                        placeholder="Item description"
                                                        className="h-8"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                                        className="h-8"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                                        className="h-8"
                                                    />
                                                </td>
                                                <td className="p-2 text-right font-medium">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                                                        <Trash className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {items.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                                    No items added. Click "Add Item" to start.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-semibold">
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-right">Grand Total:</td>
                                            <td className="px-4 py-2 text-right">${total.toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Admin Message */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message to Customer</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Add a personal note or details about the quotation..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSending || items.length === 0} className="gap-2">
                            {isSending ? 'Sending...' : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Quotation
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
