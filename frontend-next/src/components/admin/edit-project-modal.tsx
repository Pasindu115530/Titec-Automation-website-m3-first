import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Save, X, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Project {
    id: number;
    title: string;
    client: string;
    description: string;
    completion_date: string;
    status: string;
    thumbnail_path?: string;
    project_image_urls?: string[];
}

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
    onSuccess: () => void;
}

export default function EditProjectModal({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

    // Gallery State
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
    const [deletedGalleryImages, setDeletedGalleryImages] = useState<string[]>([]);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        client: '',
        description: '',
        completion_date: '',
        status: 'In Progress',
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                client: project.client || '',
                description: project.description || '',
                completion_date: project.completion_date || '',
                status: project.status || 'In Progress',
            });
            setThumbnailPreview(project.thumbnail_path ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/storage/${project.thumbnail_path}` : '');

            // Initialize Gallery
            setExistingGalleryImages(project.project_image_urls || []);
            setDeletedGalleryImages([]);
            setNewGalleryImages([]);
            setNewGalleryPreviews([]);
        }
    }, [project]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setThumbnailPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewGalleryImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setNewGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeExistingImage = (path: string) => {
        setExistingGalleryImages(prev => prev.filter(p => p !== path));
        setDeletedGalleryImages(prev => [...prev, path]);
    };

    const removeNewImage = (index: number) => {
        setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
        setNewGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;

        setError('');
        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('_method', 'PUT'); // Laravel method spoofing
            submitData.append('title', formData.title);
            submitData.append('client', formData.client);
            submitData.append('description', formData.description);
            submitData.append('completion_date', formData.completion_date);
            submitData.append('status', formData.status);
            if (thumbnail) {
                submitData.append('thumbnail', thumbnail);
            }

            // Append deleted images
            deletedGalleryImages.forEach((path, index) => {
                submitData.append(`deleted_images[${index}]`, path);
            });

            // Append new gallery images
            newGalleryImages.forEach((image, index) => {
                submitData.append(`project_images[${index}]`, image);
            });

            await api.post(`/api/projects/${project.id}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Project updated successfully');
            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to update project';
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
                        <h2 className="text-xl font-semibold">Edit Project</h2>
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
                                <label className="text-sm font-medium">Project Title</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Client</label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="client"
                                        className="pl-9"
                                        value={formData.client}
                                        onChange={handleInputChange}
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
                                <label className="text-sm font-medium">Completion Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        name="completion_date"
                                        type="date"
                                        className="pl-9"
                                        value={formData.completion_date}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    name="status"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                    <option>Maintenance</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Thumbnail</label>
                            <div className="flex gap-4 items-center">
                                {thumbnailPreview && (
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="h-16 w-16 object-cover rounded-md border"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gallery Images</label>
                            <div className="grid grid-cols-4 gap-4 border rounded-lg p-4 bg-gray-50/50">
                                {/* Existing Images */}
                                {existingGalleryImages.map((path, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden group border bg-white">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/storage/${path}`}
                                            alt="Gallery"
                                            className="w-full h-full object-cover"
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
                                {newGalleryPreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden group border bg-white">
                                        <img src={preview} alt="New Gallery" className="w-full h-full object-cover" />
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
                                    onClick={() => document.getElementById('edit-gallery-input')?.click()}
                                >
                                    <Upload className="h-5 w-5 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">Add</span>
                                </div>
                            </div>
                            <input
                                id="edit-gallery-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </motion.div >
            </div >
        </AnimatePresence >
    );
}
