'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ImageIcon } from 'lucide-react';
import DeleteConfirmationModal from './delete-confirmation-modal';
import { Brand } from '@/types';
import { getImageUrl } from '@/utils/image-utils';
import { brandService } from '@/services/brandService';
import { toast } from 'sonner';

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
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500 w-[100px]">Logo</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">Loading brands...</td>
                                </tr>
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-12 text-center text-gray-500">No brands found.</td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="h-10 w-16 relative flex items-center justify-center bg-gray-50 rounded border">
                                                {brand.logo_path ? (
                                                    <img
                                                        src={getImageUrl(brand.logo_path)}
                                                        alt={brand.name}
                                                        className="max-h-8 max-w-full object-contain"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-4 w-4 text-gray-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(brand)}
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteModal(brand)}
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    disabled={isDeleting && brandToDelete?.id === brand.id}
                                                >
                                                    {isDeleting && brandToDelete?.id === brand.id ? (
                                                        <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
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
            </div >

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
