'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { serviceService } from '@/services/serviceService';
import { ServiceCategory } from '@/types';
import { toast } from 'sonner';

import ServicesTable from '@/components/admin/services-table';
import AddServiceModal from '@/components/admin/add-service-modal';

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredServices = services.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
            s.title?.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q) ||
            s.slug?.toLowerCase().includes(q)
        );
    });

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">Services Management</h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">Manage your service categories and items.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer text-sm"
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add New Service</span>
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/40 backdrop-blur-md p-2.5 sm:p-3 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-2 pl-3">
                        <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                            <Wrench className="w-3.5 h-3.5 mr-1.5 text-[#7C3AED]" />
                            Service Catalog
                        </span>
                    </div>
                    <div className="relative w-full sm:w-72 flex items-center">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search services..."
                            className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ServicesTable
                    services={filteredServices}
                    onRefresh={fetchServices}
                    onEdit={handleEdit}
                    isLoading={tableLoading}
                />
            </div>

            <AddServiceModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                editService={editingService}
                onSuccess={fetchServices}
            />
        </div>
    );
}
