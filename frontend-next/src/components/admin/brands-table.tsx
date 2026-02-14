'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ImageIcon } from 'lucide-react';
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
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

    const openDeleteConfirm = (brand: Brand) => {
        setBrandToDelete(brand);
        setDeleteConfirmOpen(true);
        setDeleteId(null);
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setBrandToDelete(null);
        setDeleteId(null);
    };

    const handleDelete = async () => {
        if (!brandToDelete) return;
        setIsDeleting(true);
        try {
            await brandService.deleteBrand(brandToDelete.id);
            toast.success('Brand deleted successfully');
            closeDeleteConfirm();
            onRefresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete brand');
        } finally {
            setIsDeleting(false);
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
                                                    onClick={() => openDeleteConfirm(brand)}
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-red-600">Delete Brand</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-700">
                                Are you sure you want to delete <strong>{brandToDelete?.name}</strong>?
                            </p>
                            <p className="text-sm text-red-600 font-medium">
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                            <Button variant="outline" onClick={closeDeleteConfirm} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
