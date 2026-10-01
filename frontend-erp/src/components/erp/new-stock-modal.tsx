import React, { useState, useEffect, useRef } from 'react';
import { inventoryService } from '@/services/inventoryService';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { toast } from 'sonner';
import { Search, Plus, Package, Trash2 } from 'lucide-react';
import Loader from '@/components/loader';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">New Bulk Stock Movement</h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
                    
                    {/* Product Search */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search & Add Products
                        </label>
                        
                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Search product by name or SKU..."
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-2.5">
                                        <Loader size={16} />
                                    </div>
                                )}
                            </div>
                            
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {searchResults.map(product => (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => handleSelectProduct(product)}
                                            className="w-full text-left px-4 py-2 flex flex-col hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                                        >
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                            <span className="text-xs text-gray-500">
                                                SKU: {product.sku || product.model_number || '-'} | Stock: {product.stock || 0}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {searchQuery && searchResults.length === 0 && !isSearching && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
                                    <p className="text-sm text-gray-500 mb-2">No products found matching "{searchQuery}"</p>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            handleClose();
                                            onAddNewProduct();
                                        }}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 w-full"
                                    >
                                        <Plus className="w-4 h-4" /> Add New Product Instead
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Products List */}
                    {selectedProducts.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selected Products
                            </label>
                            <div className="space-y-3">
                                {selectedProducts.map((item) => (
                                    <div key={item.product.id} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg p-3 gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 flex items-center gap-2 truncate">
                                                <Package className="w-4 h-4 text-blue-500 shrink-0" />
                                                <span className="truncate">{item.product.name}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                SKU: {item.product.sku || item.product.model_number || '-'} | Current Stock: <span className="font-medium text-gray-700">{item.product.stock || 0}</span>
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    required
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(item.product.id, e.target.value === '' ? '' : Number(e.target.value))}
                                                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                    placeholder="Qty"
                                                    min={movementType !== 'adjustment' ? 1 : undefined}
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveProduct(item.product.id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Movement Type
                            </label>
                            <select
                                value={movementType}
                                onChange={(e) => setMovementType(e.target.value as any)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            >
                                <option value="received">New Stock Received (Increase)</option>
                                <option value="return">Customer Return (Increase)</option>
                                <option value="damaged">Damaged / Defective (Decrease)</option>
                                <option value="adjustment">Manual Adjustment (Any)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Shared Notes / Reference
                            </label>
                            <textarea
                                id="notes"
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                placeholder="e.g. PO-1024, or damaged in transit..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between gap-3 border-t border-gray-100 shrink-0 mt-auto">
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem(STORAGE_KEY);
                                setSelectedProducts([]);
                                setNotes('');
                                setMovementType('received');
                            }}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Clear Draft
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedProducts.length === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? 'Saving...' : 'Save All Movements'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
