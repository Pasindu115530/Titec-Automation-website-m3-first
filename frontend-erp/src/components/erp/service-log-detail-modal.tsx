import React, { useState } from 'react';
import { ServiceLog, serviceLogService } from '@/services/serviceLogService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, Calendar, Building2, User, Wrench, ShieldCheck, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceLogDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: ServiceLog | null;
    onUpdated: () => void;
}

export default function ServiceLogDetailModal({
    isOpen,
    onClose,
    log,
    onUpdated
}: ServiceLogDetailModalProps) {
    const [updatingStatus, setUpdatingStatus] = useState(false);

    if (!log) return null;

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdatingStatus(true);
        const toastId = toast.loading('Updating service log status...');
        try {
            await serviceLogService.updateServiceLog(log.id, { status: newStatus });
            toast.success('Status updated successfully', { id: toastId });
            onUpdated();
            onClose();
        } catch (error) {
            toast.error('Failed to update status', { id: toastId });
        } finally {
            setUpdatingStatus(false);
        }
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[660px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-7 sm:p-8 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
                <DialogHeader>
                    <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-2xl bg-[#E2D6FE] text-neutral-900 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                            <ClipboardList className="h-6 w-6 text-neutral-800" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-2xl font-bold text-neutral-900 tracking-tight">Service Log Details</DialogTitle>
                                <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-neutral-100 font-bold text-neutral-600 border border-neutral-200">
                                    #{log.id}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-500 font-medium mt-0.5">Recorded service event information</p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Primary Card */}
                <div className="bg-white/70 backdrop-blur-md border border-neutral-200/70 rounded-2xl p-4.5 shadow-2xs mt-2 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-neutral-900 text-base">{log.title}</h4>
                        <div className="flex items-center gap-2">
                            {renderTypeBadge(log.service_type)}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs ${
                                log.status === 'completed'
                                    ? 'bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60'
                                    : log.status === 'in_progress'
                                        ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                    log.status === 'completed' ? 'bg-[#0D9488]' : log.status === 'in_progress' ? 'bg-amber-500' : 'bg-rose-500'
                                }`} />
                                {log.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 text-xs">
                        <div className="flex items-center gap-2 text-neutral-700 font-semibold">
                            <Building2 className="w-4 h-4 text-neutral-400" />
                            <span>Client: <span className="font-bold text-neutral-900">{log.client?.company_name || log.client?.contact_name || 'Unspecified'}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-700 font-semibold">
                            <User className="w-4 h-4 text-neutral-400" />
                            <span>Technician: <span className="font-bold text-neutral-900">{log.technician?.name || 'Unassigned'}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-500 font-medium">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                            <span>Service Date: <span className="font-mono text-neutral-800 font-semibold">{new Date(log.service_date).toLocaleDateString()}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-500 font-medium">
                            <DollarSign className="w-4 h-4 text-neutral-400" />
                            <span>Charge: <span className="font-mono text-neutral-900 font-bold">Rs. {Number(log.service_charge || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
                        </div>
                    </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-3.5 max-h-[40vh] overflow-y-auto pr-1">
                    {log.description && (
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Description / Report</span>
                            <div className="text-xs text-neutral-700 bg-neutral-50/80 p-3.5 rounded-2xl border border-neutral-200/60 leading-relaxed font-medium">
                                {log.description}
                            </div>
                        </div>
                    )}

                    {log.diagnosis && (
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Diagnosis</span>
                            <div className="text-xs text-neutral-700 bg-neutral-50/80 p-3.5 rounded-2xl border border-neutral-200/60 leading-relaxed font-medium">
                                {log.diagnosis}
                            </div>
                        </div>
                    )}

                    {log.resolution && (
                        <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Resolution / Actions Taken</span>
                            <div className="text-xs text-neutral-700 bg-[#E6F9F7]/40 p-3.5 rounded-2xl border border-teal-200/50 leading-relaxed font-medium">
                                {log.resolution}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-3 sm:gap-3 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    {/* Quick status toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-500">Quick Status:</span>
                        <select
                            disabled={updatingStatus}
                            value={log.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            className="h-9 px-3 rounded-xl text-xs font-bold bg-neutral-50 border border-neutral-200 text-neutral-800 shadow-2xs focus:bg-amber-50/40 focus:border-amber-200 cursor-pointer"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="h-11 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 font-bold text-sm shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
