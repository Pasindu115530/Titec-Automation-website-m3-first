'use client';

import React, { useState, useEffect } from 'react';
import { installationService, Installation } from '@/services/installationService';
import InstallationKanban from '@/components/erp/installation-kanban';
import AddInstallationModal from '@/components/erp/add-installation-modal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function InstallationsPage() {
    const router = useRouter();
    const [installations, setInstallations] = useState<Installation[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        loadInstallations();
    }, [searchTerm, statusFilter]);

    const loadInstallations = async () => {
        setLoading(true);
        try {
            const response = await installationService.getInstallations({
                search: searchTerm || undefined,
                status: statusFilter || undefined,
            });
            // Assuming response data contains the array directly, or response.data.data
            // depending on the backend pagination structure. For now, checking response.data
            setInstallations(response.data || response); 
        } catch (error) {
            toast.error('Failed to load installations.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        const toastId = toast.loading('Updating status...');
        try {
            await installationService.updateStatus(id, newStatus);
            toast.success('Status updated', { id: toastId });
            loadInstallations(); // Refresh data
        } catch (error) {
            toast.error('Failed to update status', { id: toastId });
        }
    };

    const handleViewDetail = (id: number) => {
        router.push(`/dashboard/installations/${id}`);
    };

    return (
        <div className="p-4 sm:p-6 h-full flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Installations</h1>
                    <p className="text-gray-500 mt-1">Manage and track installation jobs.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    New Installation
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 shrink-0">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search by job title or client..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Status filter can be useful even in Kanban view to only show certain lanes or just general filter */}
            </div>

            {/* Kanban Board Container */}
            <div className="flex-1 overflow-hidden min-h-[500px]">
                <InstallationKanban 
                    installations={installations} 
                    loading={loading}
                    onStatusChange={handleStatusChange}
                    onViewDetail={handleViewDetail}
                />
            </div>

            <AddInstallationModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadInstallations}
            />
        </div>
    );
}
