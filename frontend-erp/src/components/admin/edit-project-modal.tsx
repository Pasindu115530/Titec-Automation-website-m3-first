import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Calendar, User, Edit2, MapPin, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { getImageUrl } from '@/utils/image-utils';

interface Project {
    id: number;
    title: string;
    client: string;
    location?: string;
    description: string;
    completion_date: string;
    status: string;
    technologies?: string[];
    thumbnail_path?: string;
    logo_path?: string;
    project_image_urls?: string[];
}

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
    onSuccess: () => void;
}

export default function EditProjectModal({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    // Gallery State
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
    const [deletedGalleryImages, setDeletedGalleryImages] = useState<string[]>([]);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        client: '',
        location: '',
        description: '',
        completion_date: '',
        status: 'In Progress',
        technologies: '',
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to normalize status for UI
    const normalizeStatus = (status: string) => {
        if (!status) return 'In Progress';
        const s = status.toLowerCase();
        if (s === 'completed') return 'Completed';
        if (s === 'maintenance') return 'Maintenance';
        if (s === 'in progress') return 'In Progress';
        return status;
    };

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                client: project.client || '',
                location: project.location || '',
                description: project.description || '',
                completion_date: project.completion_date || '',
                status: normalizeStatus(project.status),
                technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
            });
            setThumbnailPreview(project.thumbnail_path ? getImageUrl(project.thumbnail_path, '') : '');
            setLogoPreview(project.logo_path ? getImageUrl(project.logo_path, '') : '');

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

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target?.result as string);
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
            if (formData.location) submitData.append('location', formData.location);
            submitData.append('description', formData.description);
            submitData.append('completion_date', formData.completion_date);
            submitData.append('status', formData.status);

            // Handle Technologies array
            const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
            techArray.forEach((tech, index) => {
                submitData.append(`technologies[${index}]`, tech);
            });

            if (thumbnail) {
                submitData.append('thumbnail', thumbnail);
            }

            if (logo) {
                submitData.append('logo', logo);
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
                                <Edit2 className="h-5 w-5 text-neutral-800" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Edit Project</h2>
                                <p className="text-xs text-neutral-500 mt-0.5 font-medium">Update project portfolio details</p>
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
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Project Title</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Client</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="client"
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        value={formData.client}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="location"
                                        placeholder="e.g. Colombo"
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Technologies</label>
                                <div className="relative">
                                    <Cpu className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="technologies"
                                        placeholder="e.g. PLC, SCADA (comma separated)"
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        value={formData.technologies}
                                        onChange={handleInputChange}
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
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Completion Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <Input
                                        name="completion_date"
                                        type="date"
                                        className="pl-10 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                        value={formData.completion_date}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Status</label>
                                <select
                                    name="status"
                                    className="flex h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200/80 transition-all font-medium cursor-pointer"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Thumbnail</label>
                                <div className="flex items-center gap-3">
                                    {thumbnailPreview ? (
                                        <div className="h-16 w-16 rounded-2xl border border-neutral-200 overflow-hidden relative group shrink-0">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setThumbnail(null);
                                                    setThumbnailPreview('');
                                                }}
                                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : null}
                                    <label className="flex-1 h-16 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-[#7C3AED] hover:bg-purple-50/20 flex items-center justify-center gap-2 cursor-pointer transition-all px-4 group">
                                        <Upload className="h-4 w-4 text-neutral-400 group-hover:text-[#7C3AED] transition-colors" />
                                        <span className="text-xs font-bold text-neutral-600 group-hover:text-[#7C3AED]">
                                            {thumbnailPreview ? 'Change' : 'Upload Thumbnail'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                                            onChange={handleThumbnailChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Logo (Client Brand)</label>
                                <div className="flex items-center gap-3">
                                    {logoPreview ? (
                                        <div className="h-16 w-16 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center p-2 relative group shrink-0">
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="max-h-full max-w-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLogo(null);
                                                    setLogoPreview('');
                                                }}
                                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : null}
                                    <label className="flex-1 h-16 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-[#7C3AED] hover:bg-purple-50/20 flex items-center justify-center gap-2 cursor-pointer transition-all px-4 group">
                                        <Upload className="h-4 w-4 text-neutral-400 group-hover:text-[#7C3AED] transition-colors" />
                                        <span className="text-xs font-bold text-neutral-600 group-hover:text-[#7C3AED]">
                                            {logoPreview ? 'Change' : 'Upload Logo'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/gif, image/webp, video/webm, .svg, .xml, .webm"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Gallery Images</label>
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 border border-neutral-200/80 rounded-2xl p-3 bg-neutral-50/50">
                                {/* Existing Images */}
                                {existingGalleryImages.map((path, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden group border border-neutral-200 bg-white shadow-2xs">
                                        <img
                                            src={getImageUrl(path, '')}
                                            alt="Gallery"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(path)}
                                            className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* New Images Previews */}
                                {newGalleryPreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden group border border-neutral-200 bg-white shadow-2xs">
                                        <img src={preview} alt="New Gallery" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-[#7C3AED]/90 text-white text-[10px] font-bold text-center py-0.5">
                                            New
                                        </div>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <label
                                    className="aspect-square border-2 border-dashed border-neutral-300 hover:border-[#7C3AED] rounded-xl flex flex-col items-center justify-center text-center hover:bg-white transition-all cursor-pointer group"
                                >
                                    <Upload className="h-4 w-4 text-neutral-400 group-hover:text-[#7C3AED] mb-1 transition-colors" />
                                    <span className="text-[10px] font-bold text-neutral-500 group-hover:text-[#7C3AED]">Add</span>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                                        multiple
                                        onChange={handleGalleryChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
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
                            {isLoading ? 'Saving...' : (
                                <>
                                    <Edit2 className="h-4 w-4 stroke-[2.5]" />
                                    Save Changes
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
