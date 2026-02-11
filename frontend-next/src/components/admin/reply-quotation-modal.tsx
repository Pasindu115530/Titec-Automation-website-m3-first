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
    onSend: (data: { items?: any[], message: string, mode?: 'create' | 'upload', file?: File, vat?: number, includePdf?: boolean }) => Promise<void>;
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
    const [vat, setVat] = useLocalStorage(`admin_reply_vat_${request?.id || 'new'}`, 18, expirationMinutes);
    const [isSending, setIsSending] = useState(false);

    // New state for tabs and file
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [includePdf, setIncludePdf] = useLocalStorage(`admin_reply_include_pdf_${request?.id || 'new'}`, true, expirationMinutes);

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
            if (includePdf) {
                // PDF is included - require PDF-related data
                if (activeTab === 'create') {
                    if (!items.length) {
                        toast.warning('Please add items before sending.');
                        setIsSending(false);
                        return;
                    }

                    // Validate all items have required fields
                    const invalidItems = items.filter(item =>
                        !item.name || !item.name.trim() ||
                        !item.quantity || item.quantity <= 0 ||
                        item.price === undefined || item.price === null || item.price < 0
                    );

                    if (invalidItems.length > 0) {
                        toast.warning('Please ensure all items have a name, quantity, and price.');
                        setIsSending(false);
                        return;
                    }

                    console.log('Sending Reply - Mode: Create', { items, message, vat, includePdf });
                    await onSend({ items, message, mode: 'create', vat, includePdf });
                } else {
                    if (!pdfFile) {
                        toast.warning('Please select a PDF file.');
                        setIsSending(false);
                        return;
                    }
                    // Send file
                    console.log('Sending Reply - Mode: Upload', { file: pdfFile, message, includePdf });
                    await onSend({ file: pdfFile, message, mode: 'upload', includePdf });
                }
            } else {
                // No PDF - just send message
                if (!message || !message.trim()) {
                    toast.warning('Please enter a message to send to the customer.');
                    setIsSending(false);
                    return;
                }
                console.log('Sending Reply - Message Only', { message, includePdf });
                await onSend({ message, includePdf });
            }

            onClose();
            // Reset storage
            setItems([{ name: '', quantity: 1, price: 0 }]);
            setMessage('');
            setVat(18);
            setPdfFile(null);
        } catch (error: any) {
            console.error('Reply Error:', error);

            // Handle specific error types
            if (error.response?.status === 422) {
                // Validation error - show specific fields that failed
                const validationErrors = error.response?.data?.errors;
                if (validationErrors) {
                    const errorMessages = Object.entries(validationErrors)
                        .map(([field, messages]: [string, any]) => `${field}: ${messages.join(', ')}`)
                        .join('\n');
                    toast.error(`Validation failed:\n${errorMessages}`, { duration: 6000 });
                } else {
                    toast.error('Validation failed. Please check all fields and try again.');
                }
            } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                toast.error('Request timed out. Please try again.', { duration: 5000 });
            } else if (error.code === 'ERR_NETWORK' || !error.response) {
                toast.error('Network error. Please check your connection.', { duration: 5000 });
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please contact support if this persists.');
            } else {
                toast.error('Failed to send reply. Please try again.');
            }
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) return null;

    if (!isOpen) return null;

    const subTotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
    const vatAmount = subTotal * (vat / 100);
    const grandTotal = subTotal + vatAmount;

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
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 w-fit">
                                <button
                                    onClick={() => setActiveTab('create')}
                                    disabled={!includePdf}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'create'
                                        ? 'bg-white text-gray-900 shadow'
                                        : 'text-gray-500 hover:text-gray-900'
                                        } ${!includePdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Generate PDF
                                </button>
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    disabled={!includePdf}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'upload'
                                        ? 'bg-white text-gray-900 shadow'
                                        : 'text-gray-500 hover:text-gray-900'
                                        } ${!includePdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Upload PDF
                                </button>
                            </div>

                            {/* Include PDF Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Include PDF</span>
                                <div className="relative inline-block w-11 h-6">
                                    <input
                                        type="checkbox"
                                        checked={includePdf}
                                        onChange={(e) => setIncludePdf(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-300 transition-colors"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </div>
                            </label>
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
                                    <div className="text-gray-600 mt-1 max-h-32 overflow-y-auto bg-white p-2 rounded border border-gray-200 text-sm whitespace-pre-wrap">
                                        {request?.customer_notes || 'No message provided.'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {includePdf && (
                            <>
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
                                                        <th className="px-4 py-2 w-20">Unit</th>
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
                                                                                unit: product.unit || 'nos',
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
                                                                    type="text"
                                                                    value={item.unit || 'nos'}
                                                                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                                    className="h-8 w-20"
                                                                    placeholder="nos"
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
                                                        <td colSpan={3} className="px-4 py-2 text-right">Sub Total:</td>
                                                        <td className="px-4 py-2 text-right">{subTotal.toFixed(2)} LKR</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3} className="px-4 py-2 text-right flex items-center justify-end gap-2">
                                                            VAT (%):
                                                            <Input
                                                                type="number"
                                                                value={vat}
                                                                onChange={(e) => setVat(Number(e.target.value))}
                                                                className="w-20 h-8"
                                                                min={0}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 text-right">{vatAmount.toFixed(2)} LKR</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3} className="px-4 py-2 text-right text-lg">Grand Total:</td>
                                                        <td className="px-4 py-2 text-right text-lg">{grandTotal.toFixed(2)} LKR</td>
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
                            </>
                        )}

                        {/* Message Section */}
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
