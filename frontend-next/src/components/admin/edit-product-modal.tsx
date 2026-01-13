
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Package, Tag, DollarSign, Package2, Image as ImageIcon, Grid3x3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    sku: string;
    image: string;
}

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sku: '',
        image: '',
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category || '',
                stock: product.stock || '',
                sku: product.sku || '',
                image: product.image || '',
            });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setError('');
        setIsLoading(true);

        try {
            await api.put(`/api/products/${product.id}`, {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to update product';
            setError(errorMessage);
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
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="pl-9 w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="food">Food</option>
                                        <option value="books">Books</option>
                                        <option value="home">Home & Garden</option>
                                        <option value="sports">Sports</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="pl-9"
                                    />
                                </div>
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
            </div>
        </AnimatePresence>
    );
}
