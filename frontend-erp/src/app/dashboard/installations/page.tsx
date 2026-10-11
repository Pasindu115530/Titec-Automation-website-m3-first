'use client';

import React, { useState, useEffect } from 'react';
import { installationService, Installation } from '@/services/installationService';
import InstallationKanban from '@/components/erp/installation-kanban';
import AddInstallationModal from '@/components/erp/add-installation-modal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Search } from 'lucide-react';

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
            loadInstallations();
        } catch (error) {
            toast.error('Failed to update status', { id: toastId });
        }
    };

    const handleViewDetail = (id: number) => {
        router.push(`/dashboard/installations/${id}`);
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                        Installations
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">
                        Manage and track installation jobs and technician assignments
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        onClick={() => loadInstallations()}
                        variant="outline"
                        className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 text-neutral-700 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="mr-1 h-4 w-4 stroke-[2.5]" /> New Installation
                    </Button>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="relative flex-1 w-full flex items-center">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                        placeholder="Search installations by job title, client, or location..." 
                        className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-amber-50/30 border-white focus:border-amber-200 text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Status Filter Tabs matching Quotation tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 overflow-x-auto no-scrollbar w-full md:w-auto">
                    <button
                        onClick={() => setStatusFilter('')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === ''
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('scheduled')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === 'scheduled'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Scheduled
                    </button>
                    <button
                        onClick={() => setStatusFilter('in_progress')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === 'in_progress'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => setStatusFilter('on_hold')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === 'on_hold'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        On Hold
                    </button>
                    <button
                        onClick={() => setStatusFilter('completed')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            statusFilter === 'completed'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Kanban Board Container */}
            <div className="w-full">
                <InstallationKanban 
                    installations={installations} 
                    loading={loading}
                    onStatusChange={handleStatusChange}
                    onViewDetail={handleViewDetail}
                    activeFilter={statusFilter}
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
