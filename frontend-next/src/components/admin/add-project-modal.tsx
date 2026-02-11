import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddProjectModal({ isOpen, onClose, onSuccess }: AddProjectModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    // Gallery State
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        client: '',
        location: '',
        description: '',
        completion_date: '',
        status: 'In Progress',
        technologies: '',
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
            setGalleryImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const submitData = new FormData();
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

            // Append gallery images
            galleryImages.forEach((image, index) => {
                submitData.append(`project_images[${index}]`, image);
            });

            await api.post('/api/projects', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Project created successfully');

            // Reset Form
            setFormData({
                title: '',
                client: '',
                location: '',
                description: '',
                completion_date: '',
                status: 'In Progress',
                technologies: '',
            });
            setThumbnail(null);
            setThumbnailPreview('');
            setLogo(null);
            setLogoPreview('');
            setGalleryImages([]);
            setGalleryPreviews([]);

            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to create project';
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
                        <h2 className="text-xl font-semibold">Add New Project</h2>
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
                                    placeholder="Enter project title"
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
                                        placeholder="Client name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input
                                    name="location"
                                    placeholder="e.g. Colombo"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Technologies</label>
                                <Input
                                    name="technologies"
                                    placeholder="e.g. PLC, SCADA (comma separated)"
                                    value={formData.technologies}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Project description"
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
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div >
                        </div >

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
                                    accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                                    onChange={handleThumbnailChange}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Logo (Client Brand)</label>
                            <div className="flex gap-4 items-center">
                                {logoPreview && (
                                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded-md border p-2">
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/gif, image/webp"
                                    onChange={handleLogoChange}
                                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gallery Images</label>
                            <div className="grid grid-cols-4 gap-4 border rounded-lg p-4 bg-gray-50/50">
                                {/* New Images Previews */}
                                {galleryPreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-md overflow-hidden group border bg-white">
                                        <img src={preview} alt="New Gallery" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <div
                                    className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-center hover:bg-white hover:border-indigo-500 transition-all cursor-pointer"
                                    onClick={() => document.getElementById('add-gallery-input')?.click()}
                                >
                                    <Upload className="h-5 w-5 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-500">Add</span>
                                </div>
                            </div>
                            <input
                                id="add-gallery-input"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                                multiple
                                onChange={handleGalleryChange}
                                className="hidden"
                            />
                        </div>
                    </div >

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </Button>
                    </div>
                </motion.div >
            </div >
        </AnimatePresence >
    );
}
