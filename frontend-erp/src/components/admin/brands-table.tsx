'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ImageIcon } from 'lucide-react';
import DeleteConfirmationModal from './delete-confirmation-modal';
import { Brand } from '@/types';
import { getImageUrl } from '@/utils/image-utils';
import { brandService } from '@/services/brandService';
import { toast } from 'sonner';
import Loader from '@/components/loader';

interface BrandsTableProps {
    brands: Brand[];
    onRefresh: () => void;
    isLoading: boolean;
    onEdit: (brand: Brand) => void;
}

export default function BrandsTable({ brands, onRefresh, isLoading, onEdit }: BrandsTableProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = (brand: Brand) => {
        setBrandToDelete(brand);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!brandToDelete) return;
        setIsDeleting(true);
        try {
            await brandService.deleteBrand(brandToDelete.id);
            toast.success('Brand deleted successfully');
            setDeleteModalOpen(false);
            onRefresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete brand');
        } finally {
            setIsDeleting(false);
            setBrandToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
                <div className="p-4 sm:px-6 border-b border-neutral-200/70 bg-white/40">
                    <h3 className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">Existing Brands</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="border-b border-neutral-200/70 bg-white/30">
                            <tr className="hover:bg-transparent">
                                <th className="px-6 py-3 w-[120px]">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] dark:text-purple-300 border border-white/80 dark:border-purple-500/20 shadow-2xs">
                                        Logo
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] dark:text-teal-300 border border-white/80 dark:border-teal-500/20 shadow-2xs">
                                        Brand Name
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-right">
                                    <div className="flex justify-end">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs">
                                            Actions
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100/80 dark:divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="py-20 text-center">
                                        <Loader variant="inline" size={80} text="Loading brands..." />
                                    </td>
                                </tr>
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-12 text-center text-neutral-500 font-medium text-sm">
                                        No brands found.
                                    </td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand.id} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="brand-logo-tile h-12 w-20 relative flex items-center justify-center bg-white rounded-2xl border border-neutral-200/80 dark:border-white/20 p-2 shadow-2xs dark:shadow-md overflow-hidden transition-all duration-200 group-hover:scale-105">
                                                {brand.logo_path ? (
                                                    <img
                                                        src={getImageUrl(brand.logo_path)}
                                                        alt={brand.name}
                                                        className="max-h-8 max-w-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-neutral-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">{brand.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(brand)}
                                                    className="h-8 w-8 p-0 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white border border-neutral-200/70 dark:border-white/10 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteModal(brand)}
                                                    className="h-8 w-8 p-0 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-neutral-400 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 border border-neutral-200/70 dark:border-white/10 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                    disabled={isDeleting && brandToDelete?.id === brand.id}
                                                >
                                                    {isDeleting && brandToDelete?.id === brand.id ? (
                                                        <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={brandToDelete?.name || ''}
                itemType="Brand"
                isDeleting={isDeleting}
            />
        </>
    );
}
