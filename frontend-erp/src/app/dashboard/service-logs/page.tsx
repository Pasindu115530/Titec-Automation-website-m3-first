'use client';

import React, { useState, useEffect } from 'react';
import { serviceLogService, ServiceLog } from '@/services/serviceLogService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Plus, 
    RefreshCw, 
    Search, 
    ClipboardList, 
    Wrench, 
    ShieldCheck, 
    CheckCircle2, 
    Eye 
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AddServiceLogModal from '@/components/erp/add-service-log-modal';
import ServiceLogDetailModal from '@/components/erp/service-log-detail-modal';
import Loader from '@/components/loader';

export default function ServiceLogsPage() {
    const [logs, setLogs] = useState<ServiceLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    
    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ServiceLog | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        loadLogs();
    }, [searchTerm, typeFilter]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const response = await serviceLogService.getServiceLogs({
                search: searchTerm || undefined,
                type: typeFilter || undefined,
            });
            setLogs(response.data || response);
        } catch (error) {
            toast.error('Failed to load service logs.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (log: ServiceLog) => {
        setSelectedLog(log);
        setIsDetailModalOpen(true);
    };

    // Calculate summary statistics
    const stats = {
        total: logs.length,
        warranty: logs.filter(l => l.service_type === 'warranty').length,
        repair: logs.filter(l => l.service_type === 'repair').length,
        maintenance: logs.filter(l => l.service_type === 'maintenance').length,
    };

    const renderTypeBadge = (type: string) => {
        switch (type) {
            case 'warranty':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E2D6FE] text-neutral-900 border border-purple-200/80 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Warranty
                    </span>
                );
            case 'repair':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                        <Wrench className="w-3.5 h-3.5 text-amber-600" />
                        Repair
                    </span>
                );
            case 'maintenance':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60 shadow-2xs">
                        Maintenance
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-purple-200/60 shadow-2xs">
                        {type}
                    </span>
                );
        }
    };

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                        Completed
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        In Progress
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                        Service Logs
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">
                        Track maintenance, repairs, and warranty services
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        onClick={() => loadLogs()}
                        variant="outline"
                        className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 text-neutral-700 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="mr-1 h-4 w-4 stroke-[2.5]" /> New Service Log
                    </Button>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total */}
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total Logs</p>
                        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
                            {stats.total}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <ClipboardList className="w-6 h-6 text-[#7C3AED]" />
                    </div>
                </div>

                {/* Warranty */}
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Warranty</p>
                        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
                            {stats.warranty}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-[#E2D6FE] text-neutral-900 border border-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-neutral-800" />
                    </div>
                </div>

                {/* Repairs */}
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Repairs</p>
                        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
                            {stats.repair}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <Wrench className="w-6 h-6 text-amber-600" />
                    </div>
                </div>

                {/* Maintenance */}
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:scale-[1.01]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Maintenance</p>
                        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
                            {stats.maintenance}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-[#0D9488]" />
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="relative flex-1 w-full flex items-center">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input 
                        placeholder="Search service logs by client, title, or diagnosis..." 
                        className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-amber-50/30 border-white focus:border-amber-200 text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Type Filter Tabs matching Quotation tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 overflow-x-auto w-full md:w-auto">
                    <button
                        onClick={() => setTypeFilter('')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            typeFilter === ''
                                ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setTypeFilter('warranty')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            typeFilter === 'warranty'
                                ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Warranty
                    </button>
                    <button
                        onClick={() => setTypeFilter('repair')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            typeFilter === 'repair'
                                ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Repair
                    </button>
                    <button
                        onClick={() => setTypeFilter('maintenance')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            typeFilter === 'maintenance'
                                ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Maintenance
                    </button>
                    <button
                        onClick={() => setTypeFilter('installation')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                            typeFilter === 'installation'
                                ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Installation
                    </button>
                </div>
            </div>

            {/* Table or Empty State */}
            {loading ? (
                <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
                    <Loader variant="inline" size={80} text="Loading service logs..." />
                </div>
            ) : logs.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
                    <div className="h-16 w-16 rounded-3xl bg-neutral-100/80 border border-white/80 shadow-2xs flex items-center justify-center text-neutral-400 mx-auto mb-4">
                        <ClipboardList className="h-8 w-8 text-neutral-400" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight">No service logs found</h3>
                    <p className="text-sm text-neutral-500 max-w-sm mx-auto mt-1 mb-6 font-medium">
                        Try adjusting your filters or record a new service log to start tracking maintenance and repairs.
                    </p>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] px-6 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer inline-flex items-center gap-2"
                    >
                        <Plus className="mr-1 h-4 w-4 stroke-[2.5]" /> Record Service Log
                    </Button>
                </div>
            ) : (
                <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-neutral-200/70 hover:bg-transparent bg-white/40">
                                <TableHead className="py-3 px-6">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                        Service Title
                                    </span>
                                </TableHead>
                                <TableHead className="py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                        Client
                                    </span>
                                </TableHead>
                                <TableHead className="py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                                        Type
                                    </span>
                                </TableHead>
                                <TableHead className="py-3 text-center">
                                    <div className="flex justify-center">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                            Status
                                        </span>
                                    </div>
                                </TableHead>
                                <TableHead className="py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                        Date
                                    </span>
                                </TableHead>
                                <TableHead className="py-3 px-6 text-right">
                                    <div className="flex justify-end">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/80 text-neutral-600 border border-white/80 shadow-2xs">
                                            Actions
                                        </span>
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id} className="border-b border-neutral-200/50 hover:bg-white/60 transition-colors">
                                    <TableCell className="py-4 px-6">
                                        <div>
                                            <div className="font-bold text-neutral-900 text-sm tracking-tight">
                                                {log.title}
                                            </div>
                                            <div className="text-xs text-neutral-500 font-medium truncate max-w-sm mt-0.5">
                                                Tech: {log.technician?.name || 'Unassigned'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="text-sm font-semibold text-neutral-800">
                                            {log.client?.company_name || log.client?.contact_name || 'Unspecified'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {renderTypeBadge(log.service_type)}
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        <div className="flex justify-center">
                                            {renderStatusBadge(log.status)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <span className="font-mono text-xs font-semibold text-neutral-700">
                                            {new Date(log.service_date).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-right">
                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewDetail(log)}
                                                className="h-8 px-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 shadow-2xs font-semibold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                                            >
                                                <Eye className="h-3.5 w-3.5 text-neutral-500" /> View Details
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Modals */}
            <AddServiceLogModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadLogs}
            />

            <ServiceLogDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                log={selectedLog}
                onUpdated={loadLogs}
            />
        </div>
    );
}
