'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Upload, ImageIcon, Wrench, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    const [mounted, setMounted] = useState(false);
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

    useEffect(() => {
        setMounted(true);
    }, []);

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
            formData.append('title', title.trim());
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-[32px]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#F1EBFF] text-[#7C3AED] flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <Wrench className="h-5 w-5 text-[#7C3AED]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                                    {isEditing ? 'Edit Service Category' : 'Add New Service Category'}
                                </h2>
                                <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                                    {isEditing ? 'Update service details, items, and image' : 'Create a new service category in catalog'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                            {/* Title & Slug */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Title *</label>
                                    <Input
                                        type="text"
                                        value={title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="e.g. Industrial Automation Solutions"
                                        className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Slug</label>
                                    <Input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="auto-generated-from-title"
                                        className="h-11 rounded-2xl bg-neutral-50/80 border border-neutral-200 text-neutral-600 font-mono text-sm shadow-2xs font-medium"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of this service category..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-900 shadow-2xs placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200/80 transition-all font-medium resize-none"
                                />
                            </div>

                            {/* Sort Order & Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Sort Order</label>
                                    <Input
                                        type="number"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                        className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Image</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-3 bg-white/80 border border-neutral-200/80 rounded-2xl p-2.5 shadow-2xs">
                                        <div className="h-14 w-20 rounded-xl border border-neutral-200/80 bg-neutral-50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-5 w-5 text-neutral-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-9 px-3 rounded-xl bg-white text-xs font-bold text-neutral-800 border-neutral-200/80 shadow-2xs hover:bg-neutral-50 gap-1.5 cursor-pointer"
                                            >
                                                <Upload className="h-3.5 w-3.5 text-[#7C3AED]" />
                                                {imageFile ? 'Change' : 'Upload'}
                                            </Button>
                                            {imagePreview && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setImageFile(null);
                                                        setImagePreview(null);
                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                    }}
                                                    className="h-9 px-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Items */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Service Items *</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addItem}
                                        className="h-8 px-3 rounded-xl bg-[#F1EBFF] hover:bg-[#e7dcff] text-[#7C3AED] border border-[#d8c7fd] text-xs font-bold shadow-2xs gap-1 cursor-pointer"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Item
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex gap-3 p-4 bg-white/70 rounded-2xl border border-neutral-200/80 shadow-2xs">
                                            <span className="text-xs font-bold font-mono text-[#7C3AED] mt-2 px-2 py-0.5 rounded-lg bg-[#F1EBFF] border border-[#d8c7fd] shrink-0 h-fit">
                                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                            </span>
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                                                    placeholder="Item title..."
                                                    className="h-10 rounded-xl bg-white border border-neutral-200 text-sm shadow-2xs font-medium"
                                                />
                                                <textarea
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    placeholder="Item description..."
                                                    rows={2}
                                                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-sm shadow-2xs outline-none resize-none font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                                />
                                            </div>
                                            {items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => removeItem(index)}
                                                    className="mt-1 h-8 w-8 p-0 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-neutral-200/60 shadow-2xs cursor-pointer self-start"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 flex justify-end gap-3 rounded-b-[32px] sticky bottom-0 z-10 backdrop-blur-md">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={submitting}
                                className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="h-11 px-6 rounded-2xl bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold border border-sky-200 shadow-[0_8px_20px_rgba(125,211,252,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : isEditing ? (
                                    'Update Service'
                                ) : (
                                    'Create Service'
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
