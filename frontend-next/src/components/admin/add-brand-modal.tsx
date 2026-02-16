'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brand } from '@/types';
import { brandService } from '@/services/brandService';
import { toast } from 'sonner';
import { getImageUrl } from '@/utils/image-utils';

interface AddBrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    brandToEdit?: Brand | null;
}

export default function AddBrandModal({ isOpen, onClose, onSuccess, brandToEdit }: AddBrandModalProps) {
    const [name, setName] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (brandToEdit) {
                setName(brandToEdit.name);
                if (brandToEdit.logo_path) {
                    setPreview(getImageUrl(brandToEdit.logo_path));
                } else {
                    setPreview(null);
                }
            } else {
                resetForm();
            }
        }
    }, [isOpen, brandToEdit]);

    const resetForm = () => {
        setName('');
        setLogo(null);
        setPreview(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error('Brand name is required');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        if (logo) {
            formData.append('logo', logo);
        }

        try {
            if (brandToEdit) {
                await brandService.updateBrand(brandToEdit.id, formData);
                toast.success('Brand updated successfully');
            } else {
                await brandService.createBrand(formData);
                toast.success('Brand created successfully');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(brandToEdit ? 'Failed to update brand' : 'Failed to create brand');
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
                    className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold">{brandToEdit ? 'Edit Brand' : 'Add New Brand'}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Brand Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter brand name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo</Label>
                            <div className="flex items-center gap-4 border rounded p-3">
                                <div className="h-16 w-16 border rounded bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center">No Logo</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="text-xs"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Recommended: PNG with transparent background</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {brandToEdit ? 'Update Brand' : 'Create Brand'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
