import React, { useState, useEffect } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [brands, setBrands] = useState<Brand[]>([]);

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
            data.append('category', formData.category);
            if (formData.brand_id) {
                data.append('brand_id', formData.brand_id);
            }
            data.append('stock', formData.stock);
            data.append('unit', formData.unit || 'nos');
            data.append('sku', formData.sku);
            data.append('on_store', formData.on_store ? '1' : '0');

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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold">Add New Product</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <div className="relative">
                                    <Package className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-9"
                                        placeholder="Product Name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SKU</label>
                                <div className="relative">
                                    <Grid3x3 className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        className="pl-9"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Product details..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        className="pl-9"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stock</label>
                                <div className="relative">
                                    <Package2 className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="stock"
                                        type="number"
                                        className="pl-9"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="Qty"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit</label>
                                <div className="relative">
                                    <Input
                                        name="unit"
                                        className="pl-3"
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="Select or Type..."
                                        list="add-categories"
                                        className="pl-9"
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
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Brand</label>
                                    <a href="/admin/brands" target="_blank" className="text-xs text-indigo-600 hover:underline">+ New Brand</a>
                                </div>
                                <div className="relative">
                                    <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <select
                                        name="brand_id"
                                        value={formData.brand_id}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Product Images</label>
                            <div className="grid grid-cols-4 gap-4 border rounded-lg p-4 bg-gray-50/50">
                                {/* New Images Previews */}
                                {imagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden group border bg-white">
                                        <img src={preview} alt="New Product" className="w-full h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <div
                                    className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center hover:bg-white hover:border-indigo-500 transition-all cursor-pointer"
                                    onClick={() => document.getElementById('add-product-gallery-input')?.click()}
                                >
                                    <Upload className="h-5 w-5 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">Add</span>
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
                            <label className="text-sm font-medium">Datasheet (PDF)</label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => e.target.files && setDatasheetFile(e.target.files[0])}
                                        className="text-xs"
                                    />
                                    {datasheetFile && <FileText className="w-5 h-5 text-green-600" />}
                                </div>
                            </div>

                            {/* On Store Toggle */}
                            <div className="space-y-2 py-3 px-4 bg-gray-50 rounded-lg border mt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="on_store"
                                        checked={formData.on_store}
                                        onChange={(e) => setFormData(prev => ({ ...prev, on_store: e.target.checked }))}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium">Display in Store</span>
                                        <p className="text-xs text-gray-500">Show this product to customers on the storefront</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
}
