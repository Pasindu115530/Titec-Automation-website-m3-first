'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServicesTable from '@/components/admin/services-table';
import AddServiceModal from '@/components/admin/add-service-modal';
import { serviceService } from '@/services/serviceService';
import { ServiceCategory } from '@/types';
import { toast } from 'sonner';

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceCategory | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await serviceService.getServices();
            setServices(data || []);
        } catch (error) {
            console.error('Failed to fetch services', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
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
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4" />
                    <span>Add New Service</span>
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-indigo-600" />
                        Service Categories
                    </h3>
                    <span className="text-sm text-gray-500">{services.length} categories</span>
                </div>

                <ServicesTable
                    services={services}
                    onRefresh={fetchServices}
                    onEdit={handleEdit}
                    isLoading={loading}
                />
            </div>

            <AddServiceModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchServices}
                editService={editingService}
            />
        </div>
    );
}
