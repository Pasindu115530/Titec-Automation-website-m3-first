import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash, Send, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';
import { ProductAutocomplete } from './product-autocomplete';
import { Product } from '@/types';

interface ReplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: any; // Using any for now to match flexible backend response
    onSend: (data: { items?: any[], message: string, mode?: 'create' | 'upload', file?: File }) => Promise<void>;
}

export default function ReplyModal({ isOpen, onClose, request, onSend }: ReplyModalProps) {
    // Generate initial items from request if available
    const initialItems = request?.products?.map((p: any) => ({
        name: p.name,
        quantity: p.pivot?.quantity || 1,
        price: p.price || 0,
        isOriginal: true
    })) || [];

    // Use persistence keyed by request ID
    // Note: Parent must provide key={request.id} to ensure this remounts and re-initializes for new requests
    const expirationMinutes = Number(process.env.NEXT_PUBLIC_LOCAL_STORAGE_EXPIRATION_MINUTES) || 30;
    const [items, setItems] = useLocalStorage<any[]>(`admin_reply_items_${request?.id || 'new'}_v2`, initialItems.length ? initialItems : [{ name: '', quantity: 1, price: 0 }], expirationMinutes);
    const [message, setMessage] = useLocalStorage(`admin_reply_message_${request?.id || 'new'}_v2`, '', expirationMinutes);
    const [isSending, setIsSending] = useState(false);

    // New state for tabs and file
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
    const [pdfFile, setPdfFile] = useState<File | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setIsSending(true);
        try {
            if (activeTab === 'create') {
                if (!items.length) {
                    toast.warning('Please add items before sending.');
                    setIsSending(false);
                    return;
                }
                console.log('Sending Reply - Mode: Create', { items, message });
                await onSend({ items, message, mode: 'create' });
            } else {
                if (!pdfFile) {
                    toast.warning('Please select a PDF file.');
                    setIsSending(false);
                    return;
                }
                // Send file
                console.log('Sending Reply - Mode: Upload', { file: pdfFile, message });
                await onSend({ file: pdfFile, message, mode: 'upload' });
            }

            onClose();
            // Reset storage
            setItems([{ name: '', quantity: 1, price: 0 }]);
            setMessage('');
            setPdfFile(null);
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
                                Reply to Quotation
                            </h2>
                            <p className="text-sm text-gray-500">Replying to Request #{request?.id}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-4 w-fit">
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'create'
                                    ? 'bg-white text-gray-900 shadow'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Generate PDF
                            </button>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'upload'
                                    ? 'bg-white text-gray-900 shadow'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    <div className="px-6 flex-1 overflow-y-auto space-y-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p><span className="font-medium">Customer:</span> {request?.name || 'Guest'}</p>
                                    <p><span className="font-medium">Email:</span> {request?.email || '-'}</p>
                                    <p><span className="font-medium">Phone:</span> {request?.phone || '-'}</p>
                                </div>
                                <div>
                                    <p><span className="font-medium">Original Request:</span></p>
                                    <p className="text-gray-600 mt-1 line-clamp-2">
                                        {request?.customer_notes}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {activeTab === 'create' ? (
                            /* Create Mode Content */
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
                                                <th className="px-4 py-2 w-32">Price (LKR)</th>
                                                <th className="px-4 py-2 w-32 text-right">Total</th>
                                                <th className="px-4 py-2 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="p-2">
                                                        {item.isOriginal ? (
                                                            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700 font-medium">
                                                                {item.name}
                                                            </div>
                                                        ) : (
                                                            <ProductAutocomplete
                                                                value={item.name}
                                                                onChange={(val) => handleItemChange(index, 'name', val)}
                                                                onSelect={(product: Product) => {
                                                                    const newItems = [...items];
                                                                    newItems[index] = {
                                                                        ...newItems[index],
                                                                        name: product.name,
                                                                        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                                                                    };
                                                                    setItems(newItems);
                                                                }}
                                                                placeholder="Search product..."
                                                                className="h-8"
                                                            />
                                                        )}
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
                                                        {(item.quantity * item.price).toFixed(2)} LKR
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
                                                <td className="px-4 py-2 text-right">{total.toFixed(2)} LKR</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* Upload Mode Content */
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors">
                                <div className="space-y-4">
                                    <div className="mx-auto h-12 w-12 text-gray-400">
                                        <FileText className="h-12 w-12" />
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>Upload a PDF file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF up to 10MB</p>

                                    {pdfFile && (
                                        <div className="mt-4 p-2 bg-indigo-50 rounded text-indigo-700 text-sm font-medium flex items-center justify-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {pdfFile.name}
                                            <button onClick={() => setPdfFile(null)} className="ml-2 text-indigo-400 hover:text-indigo-600">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Admin Message */}
                        <div className="space-y-2 pb-6">
                            <label className="text-sm font-medium">Message to Customer</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Add a personal note..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isSending || (activeTab === 'create' && items.length === 0) || (activeTab === 'upload' && !pdfFile)} className="gap-2">
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
