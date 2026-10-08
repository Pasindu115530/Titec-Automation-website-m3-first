import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Tag, DollarSign, Package2, Upload, FileText, Grid3x3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Brand } from '@/types';
import { brandService } from '@/services/brandService';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const fetchBrands = async () => {
                try {
                    const data = await brandService.getBrands();
                    setBrands(data);
                } catch (error) {
                    console.error('Failed to fetch brands', error);
                }
            };
            fetchBrands();
        }
    }, [isOpen]);

    // Gallery State
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [datasheetFile, setDatasheetFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        brand_id: '',
        stock: '',
        unit: 'nos',
        sku: '',
        on_store: true,
        show_price: true,
        warranty_months: 0,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            if (formData.brand_id) {
                data.append('brand_id', formData.brand_id);
            }
            if (formData.stock) {
                data.append('stock', formData.stock);
            }
            data.append('unit', formData.unit || 'nos');
            data.append('sku', formData.sku);
            data.append('on_store', formData.on_store ? '1' : '0');
            data.append('show_price', formData.show_price ? '1' : '0');
            data.append('warranty_months', String(formData.warranty_months));

            if (imageFiles.length > 0) {
                imageFiles.forEach((image, index) => {
                    data.append(`images[${index}]`, image);
                });
            }

            if (datasheetFile) {
                data.append('datasheet', datasheetFile);
            }

            await api.post('/api/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Product created successfully');

            // Reset Form state
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                brand_id: '',
                stock: '',
                unit: 'nos',
                sku: '',
                on_store: true,
                show_price: true,
                warranty_months: 0,
            });
            setImageFiles([]);
            setImagePreviews([]);
            setDatasheetFile(null);

            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to create product';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-[32px]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#E2D6FE] text-neutral-900 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <Package className="h-5 w-5 text-neutral-800" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Add New Product</h2>
                                <p className="text-xs text-neutral-500 mt-0.5 font-medium">Create a new product item in your catalog</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Product Name</label>
                                <div className="relative">
                                    <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        placeholder="Product Name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">SKU</label>
                                <div className="relative">
                                    <Grid3x3 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Description</label>
                            <textarea
                                name="description"
                                className="flex min-h-[100px] w-full rounded-2xl border border-neutral-200 bg-white p-3.5 text-sm text-neutral-900 shadow-2xs placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200/80 transition-all font-medium"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Product details..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Price</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Stock</label>
                                <div className="relative">
                                    <Package2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="stock"
                                        type="number"
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        value={formData.stock || ''}
                                        onChange={handleInputChange}
                                        placeholder="Qty"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Unit</label>
                                <div className="relative">
                                    <Input
                                        name="unit"
                                        className="px-3.5 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        placeholder="nos, m, kg..."
                                        list="units-list"
                                    />
                                    <datalist id="units-list">
                                        <option value="nos" />
                                        <option value="m" />
                                        <option value="cm" />
                                        <option value="kg" />
                                        <option value="l" />
                                        <option value="pcs" />
                                        <option value="set" />
                                    </datalist>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="Select or Type..."
                                        list="add-categories"
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                    />
                                    <datalist id="add-categories">
                                        <option value="PLC" />
                                        <option value="VFD" />
                                        <option value="Relay" />
                                        <option value="HMI" />
                                        <option value="Circuit Breaker" />
                                    </datalist>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Brand</label>
                                    <a href="/dashboard/brands" target="_blank" className="text-xs font-semibold text-[#7C3AED] hover:underline">+ New Brand</a>
                                </div>
                                <div className="relative">
                                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                                    <select
                                        name="brand_id"
                                        value={formData.brand_id}
                                        onChange={handleInputChange}
                                        className="flex h-11 w-full rounded-2xl border border-neutral-200 bg-white pl-10 pr-4 py-2 text-sm text-neutral-900 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium cursor-pointer"
                                    >
                                        <option value="">Select Brand (Optional)</option>
                                        {brands.map((b) => (
                                             <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Warranty Period (months)</label>
                                <div className="relative">
                                    <Input
                                        name="warranty_months"
                                        type="number"
                                        min="0"
                                        max="120"
                                        className="pl-3"
                                        value={formData.warranty_months}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Set to 0 for no warranty.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Product Images</label>
                            <div className="grid grid-cols-4 gap-3 border border-neutral-200/80 rounded-2xl p-4 bg-white/60 shadow-2xs">
                                {/* New Images Previews */}
                                {imagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-2xl overflow-hidden group border border-neutral-200 bg-white shadow-2xs">
                                        <img src={preview} alt="New Product" className="w-full h-full object-contain p-1" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1.5 right-1.5 bg-neutral-900/80 hover:bg-rose-600 text-white rounded-xl p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-xs cursor-pointer"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <div
                                    className="aspect-square border-2 border-dashed border-neutral-300 hover:border-neutral-500 rounded-2xl flex flex-col items-center justify-center text-center bg-white/80 hover:bg-white transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={() => document.getElementById('add-product-gallery-input')?.click()}
                                >
                                    <Upload className="h-5 w-5 text-neutral-500 mb-1" />
                                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Add</span>
                                </div>
                            </div>
                            <input
                                id="add-product-gallery-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Datasheet (PDF)</label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => e.target.files && setDatasheetFile(e.target.files[0])}
                                        className="text-xs rounded-2xl bg-white border border-neutral-200 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E2D6FE] file:text-neutral-900 hover:file:bg-[#d8c7fd] file:cursor-pointer shadow-2xs cursor-pointer"
                                    />
                                    {datasheetFile && <FileText className="w-5 h-5 text-emerald-600 shrink-0" />}
                                </div>
                            </div>
                        </div>

                        {/* On Store Toggle */}
                        <div className="space-y-3 py-4 px-5 bg-white/80 rounded-2xl border border-neutral-200/80 shadow-2xs">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="on_store"
                                    checked={formData.on_store}
                                    onChange={(e) => setFormData(prev => ({ ...prev, on_store: e.target.checked }))}
                                    className="w-4 h-4 text-neutral-900 accent-[#7C3AED] border-neutral-300 rounded focus:ring-neutral-400 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-bold text-neutral-900">Display in Store</span>
                                    <p className="text-xs text-neutral-500 font-medium">Show this product to customers on the storefront</p>
                                </div>
                            </label>

                            <div className="border-t border-neutral-100" />

                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="show_price"
                                    checked={formData.show_price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, show_price: e.target.checked }))}
                                    className="w-4 h-4 text-neutral-900 accent-[#7C3AED] border-neutral-300 rounded focus:ring-neutral-400 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-bold text-neutral-900">Show Price</span>
                                    <p className="text-xs text-neutral-500 font-medium">Display the price on the storefront</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 flex flex-wrap sm:flex-nowrap justify-end gap-3 rounded-b-[32px] sticky bottom-0 z-10 backdrop-blur-md">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs w-full sm:w-auto cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="h-11 px-6 rounded-2xl bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold border border-sky-200 shadow-[0_8px_20px_rgba(125,211,252,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto gap-2 cursor-pointer"
                        >
                            {isLoading ? 'Creating...' : (
                                <>
                                    <Package className="h-4 w-4 stroke-[2.5]" />
                                    Create Product
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
