'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { installationService, Installation, InstallationNote } from '@/services/installationService';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import TechnicianAssignment from '@/components/erp/technician-assignment';
import InstallationNoteForm from '@/components/erp/installation-note-form';
import { useAuth } from '@/context/AuthContext';
import NoteCard from '@/components/erp/installation-note-card';
import { 
    ChevronDown, 
    Check, 
    ArrowLeft, 
    Building2, 
    Calendar, 
    MapPin, 
    FileText, 
    Wrench, 
    MessageSquare 
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
    { 
        id: 'scheduled', 
        label: 'Scheduled', 
        badgeClass: 'bg-[#E2D6FE] text-neutral-900 border-purple-200/80 hover:bg-[#d8c7fd]',
        dotClass: 'bg-purple-600',
    },
    { 
        id: 'in_progress', 
        label: 'In Progress', 
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100',
        dotClass: 'bg-amber-500',
    },
    { 
        id: 'on_hold', 
        label: 'On Hold', 
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100',
        dotClass: 'bg-rose-500',
    },
    { 
        id: 'completed', 
        label: 'Completed', 
        badgeClass: 'bg-[#E6F9F7] text-[#0D9488] border-teal-200/60 hover:bg-teal-100',
        dotClass: 'bg-[#0D9488]',
    },
];

const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map(opt => [opt.id, opt]));

export default function InstallationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const id = params.id as string;

    const [installation, setInstallation] = useState<Installation | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewingNoteId, setReviewingNoteId] = useState<number | null>(null);
    const [rejectingNoteId, setRejectingNoteId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const canReviewCosts = (user?.permissions?.includes('installations.review_costs') ||
                           user?.roles?.includes('Super Admin')) ?? false;

    useEffect(() => {
        if (id !== 'new') {
            loadInstallation();
        }
    }, [id]);

    const loadInstallation = useCallback(async () => {
        setLoading(true);
        try {
            const data: any = await installationService.getInstallationById(id);
            setInstallation(data?.data ? data.data : data);
        } catch (error) {
            toast.error('Failed to load installation details.');
            router.push('/dashboard/installations');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    const handleStatusChange = async (newStatus: string) => {
        const toastId = toast.loading('Updating status...');
        try {
            await installationService.updateStatus(id, newStatus);
            toast.success('Status updated', { id: toastId });
            loadInstallation();
        } catch (error) {
            toast.error('Failed to update status', { id: toastId });
        }
    };

    const handleReviewNote = async (noteId: number, action: 'approve' | 'reject') => {
        if (action === 'reject' && !rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setReviewingNoteId(noteId);
        const toastId = toast.loading(action === 'approve' ? 'Approving...' : 'Rejecting...');

        try {
            await installationService.reviewNote(
                id,
                noteId,
                action,
                action === 'reject' ? rejectionReason : undefined
            );
            toast.success(
                action === 'approve'
                    ? 'Cost approved & added to invoice'
                    : 'Note rejected',
                { id: toastId }
            );
            setRejectingNoteId(null);
            setRejectionReason('');
            loadInstallation();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Review failed', { id: toastId });
        } finally {
            setReviewingNoteId(null);
        }
    };

    const resolveImageUrl = (url: string) => {
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${url}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader variant="inline" size={90} text="Loading installation details..." />
            </div>
        );
    }

    if (!installation) {
        return <div className="p-6 text-center text-gray-500">Installation not found.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header & Breadcrumbs */}
            <div>
                <button
                    onClick={() => router.push('/dashboard/installations')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/70 hover:bg-white text-neutral-600 hover:text-neutral-950 font-semibold text-xs border border-white/80 shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mb-3"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Installations</span>
                </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                                {installation.title}
                            </h1>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-[#F1EBFF] text-[#7C3AED] border border-purple-200/80 shadow-2xs">
                                #{installation.id}
                            </span>
                        </div>
                        <p className="text-neutral-500 mt-1 text-sm font-medium flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-neutral-400" />
                            <span>Client: <strong className="text-neutral-700 font-semibold">{installation.client?.company_name || installation.client?.contact_person || (installation.client as any)?.contact_name || 'N/A'}</strong></span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white/50 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xs border border-white/80">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Status:</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "inline-flex items-center gap-2 text-xs font-bold rounded-xl border py-1.5 px-3 shadow-2xs transition-all cursor-pointer select-none",
                                        STATUS_MAP[installation.status]?.badgeClass || "bg-neutral-50 text-neutral-700 border-neutral-200/80 hover:bg-white"
                                    )}
                                >
                                    <span className={cn("w-2 h-2 rounded-full shrink-0", STATUS_MAP[installation.status]?.dotClass || "bg-neutral-400")} />
                                    <span>{STATUS_MAP[installation.status]?.label || installation.status}</span>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                sideOffset={6}
                                className="w-44 p-1.5 bg-white/95 backdrop-blur-xl border border-neutral-200/80 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] space-y-0.5 z-50"
                            >
                                {STATUS_OPTIONS.map((opt) => {
                                    const isSelected = installation.status === opt.id;
                                    return (
                                        <DropdownMenuItem
                                            key={opt.id}
                                            onSelect={() => {
                                                if (installation.status !== opt.id) {
                                                    handleStatusChange(opt.id);
                                                }
                                            }}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all",
                                                isSelected
                                                    ? "bg-neutral-100 text-neutral-900 font-extrabold"
                                                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                                            )}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={cn("w-2 h-2 rounded-full shrink-0", opt.dotClass)} />
                                                <span>{opt.label}</span>
                                            </span>
                                            {isSelected && (
                                                <Check className="w-3.5 h-3.5 text-neutral-900 stroke-[2.5]" />
                                            )}
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left Column: Details & Techs */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Key Details Card */}
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                <Wrench className="w-3.5 h-3.5 mr-1" /> Job Details
                            </span>
                        </div>
                        
                        <dl className="space-y-3.5 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500">Priority</dt>
                                <dd>
                                    {installation.priority === 'urgent' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                            Urgent
                                        </span>
                                    ) : installation.priority === 'high' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            High
                                        </span>
                                    ) : installation.priority === 'medium' ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200/70 shadow-2xs">
                                            Medium
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-neutral-100 text-neutral-500 border border-neutral-200/70 shadow-2xs">
                                            Low
                                        </span>
                                    )}
                                </dd>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500">Scheduled Date</dt>
                                <dd className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white/70 px-2.5 py-1 rounded-xl border border-white/80 shadow-2xs">
                                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>
                                        {installation.scheduled_date 
                                            ? new Date(installation.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                                            : 'Not scheduled'}
                                    </span>
                                </dd>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500">Location</dt>
                                <dd className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white/70 px-2.5 py-1 rounded-xl border border-white/80 shadow-2xs max-w-[200px] truncate" title={installation.location || installation.client?.address || 'N/A'}>
                                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                    <span className="truncate">{installation.location || installation.client?.address || 'N/A'}</span>
                                </dd>
                            </div>
                            
                            {installation.invoice && (
                                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                                    <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500">Linked Invoice</dt>
                                    <dd 
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-xl border border-sky-200/80 shadow-2xs transition-all cursor-pointer"
                                        onClick={() => router.push(`/dashboard/invoices/${installation.invoice?.id}`)}
                                    >
                                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                                        <span>{installation.invoice.invoice_number}</span>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Technician Assignment */}
                    <TechnicianAssignment
                        installationId={installation.id}
                        currentTechnicians={installation.technicians || []}
                        onAssignmentSuccess={loadInstallation}
                    />
                </div>

                {/* Right Column: Description & Notes */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Description */}
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-3">
                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                <FileText className="w-3.5 h-3.5 mr-1" /> Description & Requirements
                            </span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap font-medium min-h-[60px]">
                            {installation.description || 'No description provided.'}
                        </div>
                    </div>

                    {/* Notes & Updates Timeline */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Job Updates</h3>

                        {/* Note Form */}
                        <InstallationNoteForm
                            installationId={installation.id}
                            onNoteAdded={loadInstallation}
                        />

                        {/* Timeline */}
                        <div className="space-y-3.5 pt-2">
                            {installation.notes && installation.notes.length > 0 ? (
                                [...installation.notes].reverse().map(note => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        canReview={canReviewCosts}
                                        isReviewing={reviewingNoteId === note.id}
                                        isRejecting={rejectingNoteId === note.id}
                                        rejectionReason={rejectionReason}
                                        onReject={(noteId) => {
                                            setRejectingNoteId(noteId);
                                            setRejectionReason('');
                                        }}
                                        onCancelReject={() => setRejectingNoteId(null)}
                                        onRejectionReasonChange={setRejectionReason}
                                        onReview={handleReviewNote}
                                        resolveImageUrl={resolveImageUrl}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 px-4 text-xs font-semibold text-neutral-400 border-2 border-dashed border-neutral-200/70 rounded-3xl bg-white/30 flex flex-col items-center justify-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-neutral-300" />
                                    <span>No updates or notes yet.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
