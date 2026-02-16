'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Trash2, Edit, Save, X, Upload } from 'lucide-react';
import { serviceService } from '@/services/serviceService';
import { ServiceCategory } from '@/types';
import { getImageUrl } from '@/utils/image-utils';
import { toast } from 'sonner';

interface ServiceItemInput {
    title: string;
    description: string;
}

export default function AdminServicesPage() {
    // Data
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [items, setItems] = useState<ServiceItemInput[]>([{ title: '', description: '' }]);
    const [submitting, setSubmitting] = useState(false);
    const [formOpen, setFormOpen] = useState(false);

    const isEditing = editingId !== null;

    // Fetch services
    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await serviceService.getServices();
            setServices(data || []);
        } catch (error) {
            console.error('Failed to fetch services', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // ── Form helpers ──
    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setSlug('');
        setSortOrder(0);
        setImageFile(null);
        setImagePreview(null);
        setItems([{ title: '', description: '' }]);
    };

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

    const addItem = () => setItems([...items, { title: '', description: '' }]);

    const removeItem = (index: number) => {
        if (items.length > 1) setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof ServiceItemInput, value: string) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    // ── Edit row ──
    const handleEdit = (service: ServiceCategory) => {
        setEditingId(service.id);
        setTitle(service.title);
        setDescription(service.description || '');
        setSlug(service.slug);
        setSortOrder(service.sort_order);
        setImagePreview(service.image_path ? getImageUrl(service.image_path, '') : null);
        setImageFile(null);
        setItems(
            service.items.length > 0
                ? service.items.map((item) => ({ title: item.title, description: item.description || '' }))
                : [{ title: '', description: '' }]
        );
        setFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Delete ──
    const handleDelete = async (service: ServiceCategory) => {
        if (!confirm(`Delete "${service.title}" and all its items?`)) return;
        try {
            await serviceService.deleteService(service.id);
            toast.success('Service deleted');
            fetchServices();
        } catch {
            toast.error('Failed to delete service');
        }
    };

    // ── Submit (create / update) ──
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { toast.error('Title is required'); return; }
        const filteredItems = items.filter((i) => i.title.trim());
        if (filteredItems.length === 0) { toast.error('At least one item is required'); return; }

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('description', description);
            fd.append('slug', slug);
            fd.append('sort_order', sortOrder.toString());
            if (imageFile) fd.append('image', imageFile);
            filteredItems.forEach((item, i) => {
                fd.append(`items[${i}][title]`, item.title);
                fd.append(`items[${i}][description]`, item.description);
            });

            if (isEditing) {
                await serviceService.updateService(editingId!, fd);
                toast.success('Service updated');
            } else {
                await serviceService.createService(fd);
                toast.success('Service created');
            }
            resetForm();
            setFormOpen(false);
            fetchServices();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
                    <p className="text-gray-500 mt-1">Add, edit, or remove service categories and their items.</p>
                </div>
                <button
                    onClick={() => { if (formOpen && !isEditing) { setFormOpen(false); } else { resetForm(); setFormOpen(true); } }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
                >
                    {formOpen && !isEditing ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {formOpen && !isEditing ? 'Close Form' : 'Add New Service'}
                </button>
            </div>

            {/* ── Inline Form ── */}
            {formOpen && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-blue-600" />
                            {isEditing ? 'Edit Service Category' : 'New Service Category'}
                        </h2>
                        {isEditing && (
                            <button type="button" onClick={() => { resetForm(); setFormOpen(false); }}
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                                <X className="h-4 w-4" /> Cancel Edit
                            </button>
                        )}
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Row 1 — Title / Slug / Sort */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="e.g. Industrial Automation" required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                            </div>
                        </div>

                        {/* Row 2 — Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description..." rows={2}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm" />
                        </div>

                        {/* Row 3 — Image upload */}
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition text-sm text-gray-600">
                                    <Upload className="h-4 w-4" />
                                    <span className="sr-only">Upload service category image</span>
                                    {imageFile ? imageFile.name : 'Choose file...'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        aria-label="Upload service category image"
                                    />
                                </label>
                            </div>
                            {imagePreview && (
                                <div className="flex items-center gap-3">
                                    <img src={imagePreview} alt="Preview" className="h-16 w-24 rounded-lg object-cover border" />
                                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="text-xs text-red-500 hover:text-red-700">Remove</button>
                                </div>
                            )}
                        </div>

                        {/* Service Items */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Service Items *</label>
                                <button type="button" onClick={addItem}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                                    <Plus className="h-3.5 w-3.5" /> Add Item
                                </button>
                            </div>
                            <div className="space-y-2">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border">
                                        <span className="text-xs font-bold text-gray-400 mt-2 w-6 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <input type="text" value={item.title} onChange={(e) => updateItem(index, 'title', e.target.value)}
                                                placeholder="Item title..." className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                            <input type="text" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                placeholder="Item description..." className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        {items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(index)} className="p-1.5 text-red-400 hover:text-red-600 mt-1">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                        <button type="button" onClick={() => { resetForm(); setFormOpen(false); }}
                            className="px-5 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow-sm">
                            {submitting ? (
                                <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
                            ) : (
                                <><Save className="h-4 w-4" /> {isEditing ? 'Update Service' : 'Create Service'}</>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* ── Services Table ── */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-blue-600" />
                        Service Categories
                    </h3>
                    <span className="text-sm text-gray-500">{services.length} categories</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-gray-500">Loading services...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="p-12 text-center">
                        <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No services yet</h3>
                        <p className="text-gray-400">Click "Add New Service" to get started.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map((service) => {
                                const imgUrl = service.image_path ? getImageUrl(service.image_path, '') : null;
                                return (
                                    <tr key={service.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="h-12 w-20 rounded-lg overflow-hidden bg-gray-100 border">
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={service.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Wrench className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{service.title}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{service.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{service.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {service.items?.length || 0} items
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(service)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
                                                    <Edit className="h-3.5 w-3.5" /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(service)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
