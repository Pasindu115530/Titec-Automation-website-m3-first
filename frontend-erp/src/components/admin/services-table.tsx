'use client';

import React from 'react';
import { Trash2, Edit, GripVertical } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from './delete-confirmation-modal';
import { Button } from '@/components/ui/button';
import { ServiceCategory } from '@/types';
import { serviceService } from '@/services/serviceService';
import { toast } from 'sonner';
import { getImageUrl } from '@/utils/image-utils';

interface ServicesTableProps {
    services: ServiceCategory[];
    onRefresh: () => void;
    onEdit: (service: ServiceCategory) => void;
    isLoading: boolean;
}

export default function ServicesTable({ services, onRefresh, onEdit, isLoading }: ServicesTableProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<ServiceCategory | null>(null);

    const openDeleteModal = (service: ServiceCategory) => {
        setServiceToDelete(service);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!serviceToDelete) return;

        try {
            setDeletingId(serviceToDelete.id);
            await serviceService.deleteService(serviceToDelete.id);
            toast.success('Service permanently deleted');
            onRefresh();
            setDeleteModalOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Failed to delete service', error);
            const msg = error.response?.data?.message || 'Failed to delete service.';
            toast.error(msg);
        } finally {
            setDeletingId(null);
            setServiceToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border shadow-sm p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading services...</p>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
                <GripVertical className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No services yet</h3>
                <p className="text-gray-400">Add your first service category to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.map((service) => {
                            const imageUrl = service.image_path
                                ? getImageUrl(service.image_path, '')
                                : null;

                            return (
                                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-20 rounded-lg overflow-hidden bg-gray-100">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={service.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <GripVertical className="h-5 w-5" />
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
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{service.sort_order}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEdit(service)}
                                                className="gap-1"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDeleteModal(service)}
                                                disabled={deletingId === service.id}
                                                className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            >
                                                {deletingId === service.id ? (
                                                    <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={serviceToDelete?.title || ''}
                itemType="Service Category"
                isDeleting={!!deletingId}
            />
        </div>
    );
}
