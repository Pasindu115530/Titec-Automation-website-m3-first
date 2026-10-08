import React, { useState, useEffect, useRef } from 'react';
import { inventoryService } from '@/services/inventoryService';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { toast } from 'sonner';
import { Search, Plus, Package, Trash2, X } from 'lucide-react';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';

interface NewStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onAddNewProduct: () => void;
}

interface SelectedProductItem {
    product: Product;
    quantity: number | '';
}

const STORAGE_KEY = 'titec_new_stock_draft';

export default function NewStockModal({ isOpen, onClose, onSuccess, onAddNewProduct }: NewStockModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const [selectedProducts, setSelectedProducts] = useState<SelectedProductItem[]>([]);
    const [movementType, setMovementType] = useState<'received' | 'adjustment' | 'damaged' | 'return'>('received');
    const [notes, setNotes] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load draft from local storage when modal opens
    useEffect(() => {
        if (isOpen) {
            try {
                const draft = localStorage.getItem(STORAGE_KEY);
                if (draft) {
                    const parsed = JSON.parse(draft);
                    if (parsed.selectedProducts) setSelectedProducts(parsed.selectedProducts);
                    if (parsed.movementType) setMovementType(parsed.movementType);
                    if (parsed.notes) setNotes(parsed.notes);
                    toast.info('Recovered unsaved stock movement draft');
                }
            } catch (e) {
                console.error('Failed to parse stock draft', e);
            }
        }
    }, [isOpen]);

    // Save draft to local storage when state changes
    useEffect(() => {
        if (!isOpen) return;
        
        const draft = {
            selectedProducts,
            movementType,
            notes
        };
        
        // Only save if there's actually some data
        if (selectedProducts.length > 0 || notes.trim() !== '') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [selectedProducts, movementType, notes, isOpen]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await productService.getProducts(query, true);
                // Filter out already selected products
                const filteredResults = (results || []).filter(
                    (p: Product) => !selectedProducts.some(sp => sp.product.id === p.id)
                );
                setSearchResults(filteredResults);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const handleSelectProduct = (product: Product) => {
        if (selectedProducts.some(sp => sp.product.id === product.id)) return;
        
        setSelectedProducts([...selectedProducts, { product, quantity: '' }]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleUpdateQuantity = (productId: string | number, newQuantity: number | '') => {
        setSelectedProducts(prev => prev.map(item => 
            item.product.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemoveProduct = (productId: string | number) => {
        setSelectedProducts(prev => prev.filter(item => item.product.id !== productId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedProducts.length === 0) {
            toast.error('Please select at least one product.');
            return;
        }
        
        const invalidItems = selectedProducts.filter(
            item => item.quantity === '' || isNaN(Number(item.quantity)) || Number(item.quantity) === 0
        );
        
        if (invalidItems.length > 0) {
            toast.error('Please enter a valid non-zero quantity for all selected products.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Recording stock movements...');
        
        try {
            const items = selectedProducts.map(item => ({
                product_id: item.product.id,
                quantity: Number(item.quantity)
            }));
            
            await inventoryService.createBulkMovements(items, movementType, notes);
            
            toast.success('Bulk stock movements recorded successfully!', { id: toastId });
            
            // Clear draft and state
            localStorage.removeItem(STORAGE_KEY);
            setSelectedProducts([]);
            setNotes('');
            setMovementType('received');
            
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to record stock movements. Please try again.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // We don't clear the draft here so they can resume later
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleClose} />
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_24px_60px_rgba(0,0,0,0.15)] border border-white/80 w-full max-w-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white/95 backdrop-blur-md rounded-t-[32px] shrink-0 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-[#E2D6FE] text-neutral-900 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                            <Package className="h-5 w-5 text-neutral-800" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">New Bulk Stock Movement</h3>
                            <p className="text-xs text-neutral-500 mt-0.5 font-medium">Record newly acquired inventory and supplier deliveries</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer z-10">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
                    
                    {/* Product Search */}
                    <div className="relative">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 block">
                            Search & Add Products
                        </label>
                        
                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 h-11 bg-neutral-50/80 border border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all placeholder:text-neutral-400 text-sm font-medium shadow-2xs"
                                    placeholder="Search product by name or SKU..."
                                />
                                {isSearching && (
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                        <Loader size={16} />
                                    </div>
                                )}
                            </div>
                            
                            {searchResults.length > 0 && (
                                <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-hidden">
                                    {searchResults.map(product => (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => handleSelectProduct(product)}
                                            className="w-full text-left px-4 py-3 flex flex-col hover:bg-neutral-50 border-b border-neutral-100 last:border-0 transition-colors"
                                        >
                                            <span className="font-bold text-neutral-900 text-sm tracking-tight">{product.name}</span>
                                            <span className="text-xs text-neutral-500 font-medium mt-0.5">
                                                SKU: {product.sku || product.model_number || '-'} <span className="mx-1">•</span> Stock: <span className="text-neutral-700 font-bold">{product.stock || 0}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {searchQuery && searchResults.length === 0 && !isSearching && (
                                <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-xl p-5 text-center">
                                    <p className="text-sm text-neutral-500 font-medium mb-3">No products found matching "{searchQuery}"</p>
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            handleClose();
                                            onAddNewProduct();
                                        }}
                                        className="h-10 px-4 rounded-xl text-sky-600 hover:text-sky-700 hover:bg-sky-50 font-bold text-xs border border-sky-200 shadow-xs transition-all w-full flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add New Product Instead
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Products List */}
                    {selectedProducts.length > 0 && (
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 block">
                                Selected Products
                            </label>
                            <div className="space-y-3">
                                {selectedProducts.map((item) => (
                                    <div key={item.product.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/70 backdrop-blur-md border border-neutral-200/70 rounded-2xl p-4 shadow-2xs gap-4 transition-all">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Product</span>
                                            <h4 className="font-bold text-neutral-900 text-sm tracking-tight leading-snug truncate">
                                                {item.product.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                {item.product.sku && (
                                                    <span className="inline-block font-mono text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/80">
                                                        SKU: {item.product.sku}
                                                    </span>
                                                )}
                                                <span className="text-xs text-neutral-500 font-medium">Stock: <span className="font-bold text-neutral-700">{item.product.stock || 0}</span></span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    required
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(item.product.id, e.target.value === '' ? '' : Number(e.target.value))}
                                                    className="w-full h-10 px-3 text-sm bg-neutral-50/80 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all placeholder:text-neutral-400 font-mono shadow-xs"
                                                    placeholder="Qty"
                                                    min={movementType !== 'adjustment' ? 1 : undefined}
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveProduct(item.product.id)}
                                                className="text-neutral-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                                                title="Remove product"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Movement Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-neutral-200/70 shadow-2xs">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                Movement Type
                            </label>
                            <select
                                value={movementType}
                                onChange={(e) => setMovementType(e.target.value as any)}
                                className="w-full px-4 h-11 bg-neutral-50/80 border border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium shadow-2xs cursor-pointer"
                            >
                                <option value="received">New Stock Received (Increase)</option>
                                <option value="return">Customer Return (Increase)</option>
                                <option value="damaged">Damaged / Defective (Decrease)</option>
                                <option value="adjustment">Manual Adjustment (Any)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                Shared Notes / Reference
                            </label>
                            <textarea
                                id="notes"
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-3 h-[44px] sm:h-auto min-h-[44px] bg-neutral-50/80 border border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all resize-none placeholder:text-neutral-400 text-sm shadow-2xs"
                                placeholder="e.g. PO-1024, or damaged in transit..."
                            />
                        </div>
                    </div>
                </form>
                
                <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 flex flex-wrap sm:flex-nowrap justify-between gap-3 rounded-b-[32px] sticky bottom-0 z-10 backdrop-blur-md">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            localStorage.removeItem(STORAGE_KEY);
                            setSelectedProducts([]);
                            setNotes('');
                            setMovementType('received');
                        }}
                        className="h-11 px-5 rounded-2xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-sm transition-all cursor-pointer shadow-none"
                    >
                        Clear Draft
                    </Button>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="h-11 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 font-bold text-sm shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || selectedProducts.length === 0}
                            className="h-11 px-7 rounded-2xl bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold border border-sky-200 shadow-[0_4px_16px_rgba(125,211,252,0.4)] text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save All Movements'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
