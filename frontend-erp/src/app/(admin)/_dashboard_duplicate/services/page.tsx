'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { serviceService } from '@/services/serviceService';
import { ServiceCategory } from '@/types';
import { toast } from 'sonner';

import ServicesTable from '@/components/admin/services-table';
import AddServiceModal from '@/components/admin/add-service-modal';

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [tableLoading, setTableLoading] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceCategory | null>(null);

    const fetchServices = async () => {
        setTableLoading(true);
        try {
            const data = await serviceService.getServices();
            setServices(data || []);
        } catch (error) {
            console.error('Failed to fetch services', error);
            toast.error('Failed to load services');
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEdit = (service: ServiceCategory) => {
        setEditingService(service);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingService(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">Services Management</h1>
                    <p className="text-gray-500 mt-1">Manage your service categories and items.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 btn-gradient-primary border-0">
                    <Plus className="h-4 w-4" />
                    <span>Add New Service</span>
                </Button>
            </div>

            <AddServiceModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                editService={editingService}
                onSuccess={fetchServices}
            />

            <div className="space-y-4">
                <ServicesTable
                    services={services}
                    onRefresh={fetchServices}
                    onEdit={handleEdit}
                    isLoading={tableLoading}
                />
            </div>
        </div>
    );
}
