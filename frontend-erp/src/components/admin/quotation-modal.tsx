import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

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
            if (!customerName.trim()) {
                toast.warning('Customer name is required.');
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

    if (!isOpen || !mounted) return null;

    if (isPreviewMode) {
        return createPortal(
            <AnimatePresence>
                <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-4xl max-h-[90vh] flex flex-col my-8 overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-[32px]">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-[#E2D6FE] text-neutral-900 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                    <FileText className="h-5 w-5 text-neutral-800" />
                                </div>
                                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                                    Quotation Preview
                                </h2>
                            </div>
                            <button onClick={() => setIsPreviewMode(false)} className="text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 bg-neutral-100/60 p-6 md:p-8 overflow-y-auto">
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
                        <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 flex justify-between items-center rounded-b-[32px] sticky bottom-0 z-10">
                            <Button variant="outline" onClick={() => setIsPreviewMode(false)} className="gap-2 h-11 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200/80 font-semibold shadow-xs">
                                <ArrowLeft className="h-4 w-4" /> Back to Edit
                            </Button>
                            <div className="flex gap-2">
                                <Button onClick={handleSubmit} disabled={isSending} className="gap-2 h-11 px-6 rounded-2xl bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold border border-[#E9FF7A] shadow-[0_8px_20px_rgba(215,252,69,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                                    {isSending ? 'Sending...' : (
                                        <>
                                            <Send className="h-4 w-4 stroke-[2.5]" />
                                            Confirm & Send
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>,
            document.body
        );
    }

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
                >
                    <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#E2D6FE] text-neutral-900 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <FileText className="h-5 w-5 text-neutral-800" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                                    {mode === 'reply' ? 'Reply to Quotation' : 'Create Direct Quotation'}
                                </h2>
                                <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                                    {mode === 'reply' ? `Replying to Request #${request?.id}` : 'Send a quotation directly to a customer'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="px-6 pt-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto bg-neutral-100/80 p-1.5 rounded-2xl border border-neutral-200/60">
                                <button
                                    onClick={() => setActiveTab('create')}
                                    disabled={!includePdf}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'create'
                                        ? 'bg-white text-neutral-950 shadow-xs'
                                        : 'text-neutral-600 hover:text-neutral-950'
                                        } ${!includePdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Generate PDF
                                </button>
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    disabled={!includePdf}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'upload'
                                        ? 'bg-white text-neutral-950 shadow-xs'
                                        : 'text-neutral-600 hover:text-neutral-950'
                                        } ${!includePdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Upload PDF
                                </button>
                            </div>

                            {/* Include PDF Toggle */}
                            <label className="flex items-center justify-between sm:justify-end gap-3 cursor-pointer w-full sm:w-auto bg-white/60 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none border sm:border-0 border-neutral-200/70">
                                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Include PDF</span>
                                <div className="relative inline-block w-11 h-6">
                                    <input
                                        type="checkbox"
                                        checked={includePdf}
                                        onChange={(e) => setIncludePdf(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:bg-neutral-900 transition-colors"></div>
                                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="px-6 flex-1 overflow-y-auto space-y-6">
                        {/* Customer Info Section */}
                        <div className="bg-white/80 p-5 rounded-2xl border border-neutral-200/70 shadow-2xs text-sm space-y-4">
                            {mode === 'reply' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <p><span className="font-bold text-neutral-700">Customer:</span> <span className="font-semibold text-neutral-900">{customerName}</span></p>
                                        <p><span className="font-bold text-neutral-700">Email:</span> <span className="text-neutral-600">{customerEmail}</span></p>
                                        <p><span className="font-bold text-neutral-700">Phone:</span> <span className="text-neutral-600">{customerPhone || '-'}</span></p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-700 mb-1">Original Request:</p>
                                        <div className="text-neutral-600 max-h-32 overflow-y-auto bg-white p-3 rounded-xl border border-neutral-200 text-sm whitespace-pre-wrap">
                                            {request?.customer_notes || 'No message provided.'}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Customer Name <span className="text-rose-500">*</span></label>
                                        <Input
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="John Doe"
                                            className="h-10 rounded-xl bg-white border-neutral-200 text-neutral-900 text-sm shadow-2xs focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Email <span className="text-rose-500">*</span></label>
                                        <Input
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="h-10 rounded-xl bg-white border-neutral-200 text-neutral-900 text-sm shadow-2xs focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Phone</label>
                                        <Input
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="+94 77..."
                                            className="h-10 rounded-xl bg-white border-neutral-200 text-neutral-900 text-sm shadow-2xs focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
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
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-neutral-900 text-base tracking-tight">Items</h3>
                                            <Button size="sm" onClick={addItem} className="h-9 px-4 rounded-xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer">
                                                <Plus className="h-4 w-4" /> Add Item
                                            </Button>
                                        </div>
                                        <div className="border border-neutral-200/80 rounded-2xl overflow-x-auto shadow-2xs bg-white">
                                            <table className="w-full text-sm min-w-[700px]">
                                                <thead className="bg-neutral-50/90 border-b border-neutral-200/70 text-neutral-600 font-bold text-xs uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left">Item Name</th>
                                                        <th className="px-4 py-3 w-24">Qty</th>
                                                        <th className="px-4 py-3 w-24">Unit</th>
                                                        <th className="px-4 py-3 w-32">Price (Rs.)</th>
                                                        <th className="px-4 py-3 w-36 text-right">Total</th>
                                                        <th className="px-4 py-3 w-12 text-center"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-100">
                                                    {items.map((item, index) => (
                                                        <tr key={index} className="hover:bg-neutral-50/50">
                                                            <td className="p-2.5">
                                                                {item.isOriginal ? (
                                                                    <div className="px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-800 font-medium">
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
                                                                                isUnitEditable: false
                                                                            };
                                                                            setItems(newItems);
                                                                        }}
                                                                        placeholder="Search product..."
                                                                        className="w-full"
                                                                        inputClassName="h-9 rounded-xl border-neutral-200 bg-white focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                                                    />
                                                                )}
                                                            </td>
                                                            <td className="p-2.5">
                                                                <Input
                                                                    type="number"
                                                                    value={item.quantity || ""}
                                                                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                                                    className="h-9 rounded-xl border-neutral-200 bg-white focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                                                />
                                                            </td>
                                                            <td className="p-2.5">
                                                                <Input
                                                                    type="text"
                                                                    value={item.unit || ''}
                                                                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                                    className={`h-9 w-20 rounded-xl border-neutral-200 bg-white focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors ${!item.isUnitEditable ? '!bg-neutral-100 text-neutral-500' : ''}`}
                                                                    placeholder="nos"
                                                                    readOnly={!item.isUnitEditable}
                                                                />
                                                            </td>
                                                            <td className="p-2.5">
                                                                <Input
                                                                    type="number"
                                                                    value={item.price}
                                                                    onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                                                    className="h-9 rounded-xl border-neutral-200 bg-white text-right focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                                                />
                                                            </td>
                                                            <td className="p-2.5 text-right font-bold text-neutral-900">
                                                                Rs. {((item.quantity || 0) * (item.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </td>
                                                            <td className="p-2.5 text-center">
                                                                <button onClick={() => removeItem(index)} className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
                                                                    <Trash className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {items.length === 0 && (
                                                        <tr>
                                                            <td colSpan={6} className="p-8 text-center text-neutral-400 font-medium">
                                                                No items added. Click &ldquo;Add Item&rdquo; to start.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                                <tfoot className="bg-neutral-50/80 font-semibold border-t border-neutral-200/70">
                                                    <tr>
                                                        <td colSpan={3} className="px-4 py-2.5 text-right text-neutral-600 text-xs">Sub Total:</td>
                                                        <td colSpan={2} className="px-4 py-2.5 text-right text-neutral-900 font-bold">Rs. {subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        <td></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3} className="px-4 py-2.5 text-right text-neutral-600 text-xs">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <span>VAT Rate:</span>
                                                                <Input
                                                                    type="number"
                                                                    value={vat}
                                                                    onChange={(e) => setVat(Number(e.target.value))}
                                                                    className="w-16 h-8 text-right rounded-lg border-neutral-200 bg-white focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                                                    min={0}
                                                                />
                                                                <span>%</span>
                                                            </div>
                                                        </td>
                                                        <td colSpan={2} className="px-4 py-2.5 text-right text-neutral-900 font-bold">+ Rs. {vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        {/* Grand Total Box (Matching POS summary styling) */}
                                        <div className="bg-sky-200/90 text-neutral-900 rounded-2xl p-4 border border-white/80 shadow-xs flex justify-between items-center mt-3">
                                            <div>
                                                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">Grand Total</span>
                                                <span className="text-xs text-neutral-500 font-medium">Including {vat}% VAT</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-none">
                                                    Rs. {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Upload Mode Content */
                                    <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-10 text-center hover:bg-neutral-50/60 transition-colors">
                                        <div className="space-y-4">
                                            <div className="mx-auto h-12 w-12 text-neutral-400">
                                                <FileText className="h-12 w-12" />
                                            </div>
                                            <div className="text-sm text-neutral-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-xl bg-white px-3 py-1 font-bold text-neutral-900 border border-neutral-200 shadow-2xs hover:bg-neutral-50 transition-colors">
                                                    <span>Upload a PDF file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} />
                                                </label>
                                                <p className="pt-2 text-xs text-neutral-400">or drag and drop here</p>
                                            </div>
                                            <p className="text-xs text-neutral-400">PDF documents up to 10MB</p>

                                            {pdfFile && (
                                                <div className="mt-4 p-2.5 bg-[#E2D6FE] border border-white/80 rounded-xl text-neutral-900 text-sm font-semibold flex items-center justify-center gap-2 max-w-md mx-auto shadow-2xs">
                                                    <FileText className="h-4 w-4" />
                                                    {pdfFile.name}
                                                    <button onClick={() => setPdfFile(null)} className="ml-2 text-neutral-600 hover:text-neutral-900">
                                                        <X className="h-3.5 w-3.5" />
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
                                <h3 className="font-bold text-neutral-900 text-sm">Terms & Conditions</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleEditTerms}
                                    className="h-8 gap-1 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl font-medium text-xs cursor-pointer"
                                >
                                    {isEditingTerms ? <><Check className="h-3 w-3" /> Done</> : <><Edit2 className="h-3 w-3" /> Edit Terms</>}
                                </Button>
                            </div>

                            {isEditingTerms ? (
                                <Textarea
                                    value={termsInput}
                                    onChange={(e) => setTermsInput(e.target.value)}
                                    className="min-h-[140px] font-mono text-xs rounded-2xl border-neutral-200 bg-white focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                    placeholder="Enter terms, one per line..."
                                />
                            ) : (
                                <div className="bg-white/80 border border-neutral-200/70 rounded-2xl p-4 text-xs text-neutral-600 space-y-1 shadow-2xs">
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
                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Message to Customer</label>
                            <Textarea
                                className="min-h-[100px] rounded-2xl border-neutral-200 bg-white focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                                placeholder="Add a personal note or message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 flex flex-wrap sm:flex-nowrap justify-end gap-3 rounded-b-[32px]">
                        <Button variant="outline" onClick={onClose} className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs w-full sm:w-auto order-last sm:order-first cursor-pointer">Cancel</Button>
                        {includePdf && activeTab === 'create' && (
                            <Button
                                variant="outline"
                                onClick={handlePreview}
                                disabled={items.length === 0}
                                className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold w-full sm:w-auto gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                            >
                                <Eye className="h-4 w-4" /> Preview
                            </Button>
                        )}
                        <Button onClick={handleSubmit} disabled={isSending || (activeTab === 'create' && items.length === 0) || (activeTab === 'upload' && !pdfFile)} className="h-11 px-6 rounded-2xl bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold border border-[#E9FF7A] shadow-[0_8px_20px_rgba(215,252,69,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto gap-2 cursor-pointer">
                            {isSending ? 'Sending...' : (
                                <>
                                    <Send className="h-4 w-4 stroke-[2.5]" />
                                    Send Quotation
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
