'use client';

import React, { useState } from 'react';
import { Trash2, Edit2, Wrench } from 'lucide-react';
import DeleteConfirmationModal from './delete-confirmation-modal';
import { Button } from '@/components/ui/button';
import { ServiceCategory } from '@/types';
import { serviceService } from '@/services/serviceService';
import { toast } from 'sonner';
import { getImageUrl } from '@/utils/image-utils';
import Loader from '@/components/loader';

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

    return (
        <>
            <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
                <div className="p-4 sm:px-6 border-b border-neutral-200/70 bg-white/40">
                    <h3 className="font-bold text-neutral-800 text-sm">Existing Services</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="border-b border-neutral-200/70 bg-white/30">
                            <tr className="hover:bg-transparent">
                                <th className="px-6 py-3 w-[120px]">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                        Image
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                        Title
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                        Description
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#6D28D9] border border-white/80 shadow-2xs">
                                        Items
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F6FFD3] text-[#4D6300] border border-[#E9FF7A]/80 shadow-2xs">
                                        Order
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
                        <tbody className="divide-y divide-neutral-100/80">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <Loader variant="inline" size={80} text="Loading services..." />
                                    </td>
                                </tr>
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-neutral-500 font-medium text-sm">
                                        No services found.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => {
                                    const imageUrl = service.image_path
                                        ? getImageUrl(service.image_path, '')
                                        : null;

                                    return (
                                        <tr key={service.id} className="hover:bg-white/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="h-12 w-20 relative flex items-center justify-center bg-white/80 rounded-2xl border border-neutral-200/80 p-1 shadow-2xs overflow-hidden">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={service.title}
                                                            className="w-full h-full object-cover rounded-xl"
                                                        />
                                                    ) : (
                                                        <Wrench className="h-5 w-5 text-neutral-300" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-neutral-900 text-sm">{service.title}</div>
                                                <div className="text-xs text-neutral-400 font-mono mt-0.5">{service.slug}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs text-neutral-600 font-medium line-clamp-2 max-w-sm">
                                                    {service.description || '-'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-sky-200/80 shadow-2xs">
                                                    {service.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-neutral-700 text-xs px-2.5 py-1 rounded-xl bg-neutral-100/90 border border-neutral-200/60 shadow-2xs">
                                                    {service.sort_order}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(service)}
                                                        className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(service)}
                                                        disabled={deletingId === service.id}
                                                        className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                    >
                                                        {deletingId === service.id ? (
                                                            <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={serviceToDelete?.title || ''}
                itemType="Service Category"
                isDeleting={!!deletingId}
            />
        </>
    );
}
