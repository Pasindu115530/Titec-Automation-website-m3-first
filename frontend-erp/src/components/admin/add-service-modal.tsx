'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCategory } from '@/types';
import { serviceService } from '@/services/serviceService';
import { getImageUrl } from '@/utils/image-utils';
import { toast } from 'sonner';

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editService: ServiceCategory | null;
}

interface ServiceItemInput {
    title: string;
    description: string;
}

export default function AddServiceModal({ isOpen, onClose, onSuccess, editService }: AddServiceModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [items, setItems] = useState<ServiceItemInput[]>([{ title: '', description: '' }]);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditing = !!editService;

    // Populate form when editing
    useEffect(() => {
        if (editService) {
            setTitle(editService.title);
            setDescription(editService.description || '');
            setSlug(editService.slug);
            setSortOrder(editService.sort_order);
            setImagePreview(editService.image_path ? getImageUrl(editService.image_path, '') : null);
            setItems(
                editService.items.length > 0
                    ? editService.items.map((item) => ({ title: item.title, description: item.description || '' }))
                    : [{ title: '', description: '' }]
            );
        } else {
            resetForm();
        }
    }, [editService, isOpen]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSlug('');
        setSortOrder(0);
        setImageFile(null);
        setImagePreview(null);
        setItems([{ title: '', description: '' }]);
    };

    // Auto-generate slug from title
    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!isEditing) {
            setSlug(
                value
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim()
            );
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const addItem = () => {
        setItems([...items, { title: '', description: '' }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof ServiceItemInput, value: string) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        // Filter out empty items
        const filteredItems = items.filter((item) => item.title.trim());
        if (filteredItems.length === 0) {
            toast.error('At least one service item is required');
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('slug', slug);
            formData.append('sort_order', sortOrder.toString());

            if (imageFile) {
                formData.append('image', imageFile);
            }

            filteredItems.forEach((item, index) => {
                formData.append(`items[${index}][title]`, item.title);
                formData.append(`items[${index}][description]`, item.description);
            });

            if (isEditing) {
                await serviceService.updateService(editService!.id, formData);
                toast.success('Service updated successfully');
            } else {
                await serviceService.createService(formData);
                toast.success('Service created successfully');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to save service', error);
            const message = error?.response?.data?.message || 'Failed to save service';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 animate-in fade-in-0 zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gray-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditing ? 'Edit Service Category' : 'Add New Service Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="e.g. Industrial Automation Solutions"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="auto-generated-from-title"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this service category..."
                            rows={3}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
                        />
                    </div>

                    {/* Sort Order & Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-4 py-2.5 border-2 border-dashed rounded-lg hover:border-indigo-400 transition flex items-center justify-center gap-2 text-sm text-gray-600"
                            >
                                <Upload className="h-4 w-4" />
                                {imageFile ? imageFile.name : 'Choose Image'}
                            </button>
                        </div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-32 rounded-lg overflow-hidden bg-gray-100 border">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    )}

                    {/* Service Items */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700">Service Items *</label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <span className="text-xs font-bold text-gray-400 mt-2.5 w-6 shrink-0">
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </span>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => updateItem(index, 'title', e.target.value)}
                                            placeholder="Item title..."
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                        />
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            placeholder="Item description..."
                                            rows={2}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
                                        />
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="mt-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition self-start"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                    <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Saving...
                            </>
                        ) : isEditing ? (
                            'Update Service'
                        ) : (
                            'Create Service'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
