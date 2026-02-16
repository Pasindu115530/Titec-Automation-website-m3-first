import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash, Send, FileText, Eye, Edit2, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';
import { ProductAutocomplete } from './product-autocomplete';
import { Product } from '@/types';
import QuotationPreview from './quotation-preview';

type ModalMode = 'reply' | 'direct';

interface QuotationModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
    request?: any; // For 'reply' mode
    onSend: (data: any) => Promise<void>;
}

export default function QuotationModal({ isOpen, onClose, mode, request, onSend }: QuotationModalProps) {
    // Unique key for local storage persistence based on mode and request ID
    const storageKeyInfo = mode === 'reply' ? `reply_${request?.id}` : 'direct_new';
    const expirationMinutes = Number(process.env.NEXT_PUBLIC_LOCAL_STORAGE_EXPIRATION_MINUTES) || 30;

    // --- State: Customer Info (Editable for Direct, Read-only/Derived for Reply) ---
    const [customerName, setCustomerName] = useLocalStorage(`admin_quote_name_${storageKeyInfo}`, '', expirationMinutes);
    const [customerEmail, setCustomerEmail] = useLocalStorage(`admin_quote_email_${storageKeyInfo}`, '', expirationMinutes);
    const [customerPhone, setCustomerPhone] = useLocalStorage(`admin_quote_phone_${storageKeyInfo}`, '', expirationMinutes);

    // Initialize customer info from request in reply mode
    useEffect(() => {
        if (isOpen && mode === 'reply' && request) {
            setCustomerName(request.name || 'Guest');
            setCustomerEmail(request.email || '');
            setCustomerPhone(request.phone || '');
        }
    }, [isOpen, mode, request, setCustomerName, setCustomerEmail, setCustomerPhone]);

    // --- State: Items & Calculations ---
    const initialItems = (mode === 'reply' && request?.products) ? request.products.map((p: any) => ({
        name: p.name,
        quantity: p.pivot?.quantity || 1,
        price: p.price || 0,
        isOriginal: true,
        isUnitEditable: true
    })) : [];

    const [items, setItems] = useLocalStorage<any[]>(`admin_quote_items_${storageKeyInfo}`, initialItems.length ? initialItems : [{ name: '', quantity: 1, price: 0, isUnitEditable: true }], expirationMinutes);
    const [vat, setVat] = useLocalStorage(`admin_quote_vat_${storageKeyInfo}`, 18, expirationMinutes);

    // --- State: Message & Terms ---
    const [message, setMessage] = useLocalStorage(`admin_quote_message_${storageKeyInfo}`, '', expirationMinutes);
    const defaultTerms = [
        "Advance Payment – 70% of the total project value is required as an advance payment to initiate work.",
        "Delivery Time – Standard delivery time is 30 days after receiving the Purchase Order (PO). However, this may vary depending on the project scope.",
        "Payment Terms – The remaining payment is to be made within 30 days from the date of delivery of the completed work.",
        "Warranty – A 1-year warranty is provided for manufacturing defects. This does not cover damages due to misuse, improper handling, or external factors."
    ];
    const [terms, setTerms] = useLocalStorage<string[]>(`admin_quote_terms_${storageKeyInfo}`, defaultTerms, expirationMinutes);
    const [isEditingTerms, setIsEditingTerms] = useState(false);
    const [termsInput, setTermsInput] = useState(defaultTerms.join('\n'));

    // --- State: UI & Tabs ---
    const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [includePdf, setIncludePdf] = useLocalStorage(`admin_quote_include_pdf_${storageKeyInfo}`, true, expirationMinutes);
    const [isSending, setIsSending] = useState(false);

    // --- State: Preview ---
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // --- Handlers ---

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0, isUnitEditable: true }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const toggleEditTerms = () => {
        if (isEditingTerms) {
            const newTerms = termsInput.split('\n').filter(t => t.trim() !== '');
            setTerms(newTerms);
        } else {
            setTermsInput(terms.join('\n'));
        }
        setIsEditingTerms(!isEditingTerms);
    };

    const validateForm = () => {
        // Direct Mode Specific Validation
        if (mode === 'direct') {
            if (!customerName.trim() || !customerEmail.trim()) {
                toast.warning('Customer name and email are required.');
                return false;
            }
        }

        if (includePdf && activeTab === 'create') {
            if (!items.length) {
                toast.warning('Please add items before sending.');
                return false;
            }
            const invalidItems = items.filter(item =>
                !item.name || !item.name.trim() ||
                !item.quantity || item.quantity <= 0 ||
                item.price === undefined || item.price === null || item.price < 0
            );
            if (invalidItems.length > 0) {
                toast.warning('Please ensure all items have a name, quantity, and price.');
                return false;
            }
        } else if (includePdf && activeTab === 'upload' && !pdfFile) {
            toast.warning('Please select a PDF file.');
            return false;
        } else if (!includePdf && (!message || !message.trim())) {
            toast.warning('Please enter a message to send.');
            return false;
        }
        return true;
    };

    const handlePreview = () => {
        if (!validateForm()) return;
        setIsPreviewMode(true);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSending(true);
        try {
            const payload: any = {
                message,
                includePdf,
                vat,
                terms
            };

            if (mode === 'direct') {
                payload.name = customerName;
                payload.email = customerEmail;
                payload.phone = customerPhone;
            }

            if (includePdf) {
                payload.mode = activeTab;
                if (activeTab === 'create') {
                    payload.items = items;
                } else {
                    payload.file = pdfFile!;
                }
            }

            await onSend(payload);
            onCloseAndReset();
        } catch (error: any) {
            console.error('Send Error:', error);
            toast.error('Failed to send quotation.');
        } finally {
            setIsSending(false);
        }
    };

    const onCloseAndReset = () => {
        onClose();
        // Reset Logic - consider if we want to clear local storage or keep it for drafts?
        // For now, let's minimally reset current session state
        setPdfFile(null);
        setIsPreviewMode(false);
        // We typically don't clear the form data here to allow "drafts" via local storage, 
        // but if it's sent successfully, maybe we should?
        // Let's reset items for 'direct-new' to generic default
        if (mode === 'direct') {
            setItems([{ name: '', quantity: 1, price: 0, isUnitEditable: true }]);
            setCustomerName('');
            setCustomerEmail('');
            setCustomerPhone('');
            setMessage('');
        }
    };

    // Calculations
    const subTotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
    const vatAmount = subTotal * (vat / 100);
    const grandTotal = subTotal + vatAmount;

    if (!isOpen) return null;

    if (isPreviewMode) {
        return (
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-4xl min-h-[90vh] flex flex-col my-8"
                    >
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 rounded-t-xl">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                Quotation Preview
                            </h2>
                            <button onClick={() => setIsPreviewMode(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                            <QuotationPreview
                                customer={{
                                    name: customerName || 'Guest',
                                    email: customerEmail || '',
                                    phone: customerPhone,
                                }}
                                items={items}
                                vat={vat}
                                terms={terms}
                                quotationId={request?.id || 'NEW'}
                            />
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-between items-center rounded-b-xl sticky bottom-0 z-10">
                            <Button variant="outline" onClick={() => setIsPreviewMode(false)} className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Edit
                            </Button>
                            <div className="flex gap-2">
                                <Button onClick={handleSubmit} disabled={isSending} className="gap-2 btn-gradient-primary border-0">
                                    {isSending ? 'Sending...' : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Confirm & Send
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

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
                                {mode === 'reply' ? 'Reply to Quotation' : 'Create Direct Quotation'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {mode === 'reply' ? `Replying to Request #${request?.id}` : 'Send a quotation directly to a customer'}
                            </p>
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
                        {/* Customer Info Section */}
                        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4">
                            {mode === 'reply' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p><span className="font-medium">Customer:</span> {customerName}</p>
                                        <p><span className="font-medium">Email:</span> {customerEmail}</p>
                                        <p><span className="font-medium">Phone:</span> {customerPhone || '-'}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-medium">Original Request:</span></p>
                                        <div className="text-gray-600 mt-1 max-h-32 overflow-y-auto bg-white p-2 rounded border border-gray-200 text-sm whitespace-pre-wrap">
                                            {request?.customer_notes || 'No message provided.'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-medium text-gray-700">Customer Name <span className="text-red-500">*</span></label>
                                        <Input
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="John Doe"
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                                        <Input
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-medium text-gray-700">Phone</label>
                                        <Input
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="+94 77..."
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            )}
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
                                                                                isUnitEditable: false // Lock unit for selected products
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
                                                                    value={item.quantity || ""}
                                                                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                                                    className="h-8"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    type="text"
                                                                    value={item.unit || ''}
                                                                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                                    className={`h-8 w-20 ${!item.isUnitEditable ? 'bg-gray-100 text-gray-500' : ''}`}
                                                                    placeholder="nos"
                                                                    readOnly={!item.isUnitEditable}
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
                                                                {((item.quantity || 0) * (item.price || 0)).toFixed(2)} LKR
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
                                                            <td colSpan={6} className="p-8 text-center text-gray-400">
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

                        {/* Terms Section */}
                        <div className="mt-6 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-sm text-gray-700">Terms & Conditions</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleEditTerms}
                                    className="h-8 gap-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                >
                                    {isEditingTerms ? <><Check className="h-3 w-3" /> Done</> : <><Edit2 className="h-3 w-3" /> Edit Terms</>}
                                </Button>
                            </div>

                            {isEditingTerms ? (
                                <Textarea
                                    value={termsInput}
                                    onChange={(e) => setTermsInput(e.target.value)}
                                    className="min-h-[150px] font-mono text-xs"
                                    placeholder="Enter terms, one per line..."
                                />
                            ) : (
                                <div className="bg-gray-50 border rounded-lg p-4 text-xs text-gray-500 space-y-1">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {terms.map((term, i) => (
                                            <li key={i}>{term}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Message Section */}
                        <div className="space-y-2 pb-6">
                            <label className="text-sm font-medium">Message to Customer</label>
                            <Textarea
                                className="min-h-[100px]"
                                placeholder="Add a personal note..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        {includePdf && activeTab === 'create' && (
                            <Button
                                variant="secondary"
                                onClick={handlePreview}
                                disabled={items.length === 0}
                                className="gap-2"
                            >
                                <Eye className="h-4 w-4" /> Preview
                            </Button>
                        )}
                        <Button onClick={handleSubmit} disabled={isSending || (activeTab === 'create' && items.length === 0) || (activeTab === 'upload' && !pdfFile)} className="gap-2 btn-gradient-primary border-0">
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
