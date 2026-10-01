'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    const [mounted, setMounted] = useState(false);
    const [name, setName] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        if (!name.trim()) {
            toast.error('Brand name is required');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name.trim());
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

    if (!isOpen || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-[32px]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-[#FFF4E8] text-[#E0781E] flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <Sparkles className="h-5 w-5 text-[#E0781E]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                                    {brandToEdit ? 'Edit Brand' : 'Add New Brand'}
                                </h2>
                                <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                                    {brandToEdit ? 'Update partner brand details and logo' : 'Create a new partner brand in catalog'}
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
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                    Brand Name
                                </label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter brand name"
                                    required
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/80 focus-visible:ring-offset-0 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                    Logo
                                </label>
                                <div className="flex items-center gap-4 bg-white/80 border border-neutral-200/80 rounded-2xl p-3.5 shadow-2xs">
                                    <div className="h-16 w-20 border border-neutral-200/80 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="h-full w-full object-contain p-1" />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-neutral-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept=".svg, .png, .jpg, .jpeg, .webm, .gif, image/*"
                                            onChange={handleFileChange}
                                            className="text-xs rounded-xl bg-white border border-neutral-200 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#E2D6FE] file:text-neutral-900 hover:file:bg-[#d8c7fd] file:cursor-pointer shadow-2xs cursor-pointer"
                                        />
                                        <p className="text-[11px] text-neutral-400 mt-1 font-medium">Recommended: PNG with transparent background</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 flex justify-end gap-3 rounded-b-[32px] sticky bottom-0 z-10 backdrop-blur-md">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                                className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 px-6 rounded-2xl bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold border border-[#E9FF7A] shadow-[0_8px_20px_rgba(215,252,69,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {brandToEdit ? 'Update Brand' : 'Create Brand'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
