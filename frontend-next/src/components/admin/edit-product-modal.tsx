
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Package, Tag, DollarSign, Package2, Image as ImageIcon, Grid3x3, Upload, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

import { Product } from '@/types';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');



    // Gallery State
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [datasheetFile, setDatasheetFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sku: '',
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price ? String(product.price) : '',
                category: product.category || '',
                stock: product.stock ? String(product.stock) : '',
                sku: product.sku || '',
            });
            // Initialize Gallery
            setExistingImages(product.images || []);
            setDeletedImages([]);
            setNewImages([]);
            setNewImagePreviews([]);
            setDatasheetFile(null);
        }
    }, [product]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setNewImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeExistingImage = (path: string) => {
        setExistingImages(prev => prev.filter(p => p !== path));
        setDeletedImages(prev => [...prev, path]);
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setError('');
        setIsLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('stock', formData.stock);
            data.append('sku', formData.sku);
            // Since this is a PUT request, Laravel sometimes struggles with multipart/form-data on PUT.
            // Standard workaround is sending POST with _method=PUT
            data.append('_method', 'PUT');

            if (newImages.length > 0) {
                newImages.forEach((image, index) => {
                    data.append(`images[${index}]`, image);
                });
            }

            if (deletedImages.length > 0) {
                deletedImages.forEach((path, index) => {
                    data.append(`deleted_images[${index}]`, path);
                });
            }

            if (datasheetFile) {
                data.append('datasheet', datasheetFile);
            }

            // Using POST with _method=PUT
            await api.post(`/api/products/${product.id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Product updated successfully');
            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to update product';
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
                        <h2 className="text-xl font-semibold">Edit Product</h2>
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
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    />
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
                                        list="edit-categories"
                                        className="pl-9"
                                    />
                                    <datalist id="edit-categories">
                                        <option value="PLC" />
                                        <option value="VFD" />
                                        <option value="Relay" />
                                        <option value="HMI" />
                                        <option value="Circuit Breaker" />
                                    </datalist>
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium">Product Images</label>
                                <div className="grid grid-cols-4 gap-4 border rounded-lg p-4 bg-gray-50/50">
                                    {/* Existing Images */}
                                    {existingImages.map((path, index) => (
                                        <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden group border bg-white">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}${path.startsWith('/') ? '' : '/'}${path}`}
                                                alt="Product"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(path)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Images Previews */}
                                    {newImagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden group border bg-white">
                                            <img src={preview} alt="New Product" className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="absolute bottom-0 inset-x-0 bg-indigo-500/80 text-white text-[10px] text-center p-0.5">
                                                New
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Button */}
                                    <div
                                        className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center hover:bg-white hover:border-indigo-500 transition-all cursor-pointer"
                                        onClick={() => document.getElementById('edit-product-gallery-input')?.click()}
                                    >
                                        <Upload className="h-5 w-5 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">Add</span>
                                    </div>
                                </div>
                                <input
                                    id="edit-product-gallery-input"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Datasheet (PDF)</label>
                            <div className="flex flex-col gap-2">
                                {product?.datasheet_path && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded w-fit">
                                        <FileText className="h-4 w-4" />
                                        <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}${product.datasheet_path.startsWith('/') ? '' : '/'}${product.datasheet_path}`} target="_blank" rel="noreferrer" className="underline">
                                            View Current Datasheet
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => e.target.files && setDatasheetFile(e.target.files[0])}
                                        className="text-xs"
                                    />
                                    {datasheetFile && <FileText className="w-5 h-5 text-green-600" />}
                                </div>
                                <p className="text-[10px] text-gray-400">Upload new to replace existing.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </motion.div>
            </div >
        </AnimatePresence >
    );
}
