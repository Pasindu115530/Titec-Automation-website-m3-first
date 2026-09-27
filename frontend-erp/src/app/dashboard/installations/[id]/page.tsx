'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { installationService, Installation, InstallationNote } from '@/services/installationService';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import TechnicianAssignment from '@/components/erp/technician-assignment';
import InstallationNoteForm from '@/components/erp/installation-note-form';
import { useAuth } from '@/context/AuthContext';
import {
    MessageSquare, CheckCircle, Receipt, AlertTriangle, Wrench,
    Check, X, Clock
} from 'lucide-react';

// ── Note type visual config ─────────────────────
const NOTE_TYPE_CONFIG: Record<string, {
    icon: React.ElementType;
    borderColor: string;
    bgColor: string;
    badgeColor: string;
    label: string;
}> = {
    progress:         { icon: MessageSquare,  borderColor: 'border-l-blue-400',   bgColor: 'bg-blue-50',   badgeColor: 'bg-blue-100 text-blue-800',     label: 'Progress Update' },
    completion:       { icon: CheckCircle,    borderColor: 'border-l-green-500',  bgColor: 'bg-green-50',  badgeColor: 'bg-green-100 text-green-800',   label: 'Completion Photo' },
    extra_cost:       { icon: Receipt,        borderColor: 'border-l-amber-500',  bgColor: 'bg-amber-50',  badgeColor: 'bg-amber-100 text-amber-800',   label: 'Extra Cost' },
    defect:           { icon: AlertTriangle,  borderColor: 'border-l-red-500',    bgColor: 'bg-red-50',    badgeColor: 'bg-red-100 text-red-800',       label: 'Defect Report' },
    additional_parts: { icon: Wrench,         borderColor: 'border-l-orange-500', bgColor: 'bg-orange-50', badgeColor: 'bg-orange-100 text-orange-800', label: 'Parts Request' },
};

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

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
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
                <Loader size={48} />
            </div>
        );
    }

    if (!installation) {
        return <div className="p-6 text-center text-gray-500">Installation not found.</div>;
    }

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
            {/* Header & Breadcrumbs */}
            <div>
                <button
                    onClick={() => router.push('/dashboard/installations')}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Installations
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{installation.title}</h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span>Client: <strong className="text-gray-700">{installation.client?.company_name || installation.client?.contact_name}</strong></span>
                            <span>&bull;</span>
                            <span>ID: #{installation.id}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <select
                            value={installation.status}
                            onChange={handleStatusChange}
                            className={`text-sm font-semibold rounded-md border-0 py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500
                                ${installation.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                                  installation.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700' :
                                  installation.status === 'on_hold' ? 'bg-red-50 text-red-700' :
                                  'bg-green-50 text-green-700'}`}
                        >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Details & Techs */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Key Details Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 border-b pb-2">Job Details</h3>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="text-gray-500 font-medium">Priority</dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${installation.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                          installation.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                          installation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'}`}>
                                        {installation.priority}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 font-medium">Scheduled Date</dt>
                                <dd className="mt-1 font-medium text-gray-900">
                                    {installation.scheduled_date ? new Date(installation.scheduled_date).toLocaleDateString() : 'Not scheduled'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500 font-medium">Location</dt>
                                <dd className="mt-1 text-gray-900">
                                    {installation.location || installation.client?.address || 'N/A'}
                                </dd>
                            </div>
                            {installation.invoice && (
                                <div>
                                    <dt className="text-gray-500 font-medium">Linked Invoice</dt>
                                    <dd className="mt-1 font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => router.push(`/dashboard/invoices/${installation.invoice?.id}`)}>
                                        {installation.invoice.invoice_number}
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
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Description / Requirements</h3>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                            {installation.description || 'No description provided.'}
                        </div>
                    </div>

                    {/* Notes & Updates Timeline */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Job Updates</h3>

                        {/* Note Form */}
                        <div className="mb-6">
                            <InstallationNoteForm
                                installationId={installation.id}
                                onNoteAdded={loadInstallation}
                            />
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4">
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
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    No updates or notes yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ── Note Card Component ─────────────────────────
interface NoteCardProps {
    note: InstallationNote;
    canReview: boolean;
    isReviewing: boolean;
    isRejecting: boolean;
    rejectionReason: string;
    onReject: (noteId: number) => void;
    onCancelReject: () => void;
    onRejectionReasonChange: (reason: string) => void;
    onReview: (noteId: number, action: 'approve' | 'reject') => void;
    resolveImageUrl: (url: string) => string;
}

function NoteCard({
    note, canReview, isReviewing, isRejecting,
    rejectionReason, onReject, onCancelReject,
    onRejectionReasonChange, onReview, resolveImageUrl
}: NoteCardProps) {
    const config = NOTE_TYPE_CONFIG[note.type] || NOTE_TYPE_CONFIG.progress;
    const Icon = config.icon;
    const imageUrls = note.image_urls || (note.image_url ? [note.image_url] : []);
    const hasCost = note.cost_amount && note.cost_amount > 0;
    const isPending = note.review_status === 'pending';
    const isApproved = note.review_status === 'approved';
    const isRejected = note.review_status === 'rejected';

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-100 border-l-4 ${config.borderColor} overflow-hidden`}>
            <div className="p-4">
                {/* ── Header Row ────────────────────── */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900">{note.user?.name}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.badgeColor}`}>
                                    {config.label}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {new Date(note.created_at).toLocaleString('en-US', {
                                    month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Cost badge */}
                    {hasCost && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                            Rs. {Number(note.cost_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    )}
                </div>

                {/* ── Cost description ──────────────── */}
                {note.cost_description && (
                    <p className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded ml-10 mb-2 border border-gray-100">
                        💰 {note.cost_description}
                    </p>
                )}

                {/* ── Content ──────────────────────── */}
                <p className="text-sm text-gray-800 whitespace-pre-wrap mt-2 pl-10">
                    {note.content}
                </p>

                {/* ── Image Gallery ─────────────────── */}
                {imageUrls.length > 0 && (
                    <div className="mt-3 pl-10 flex flex-wrap gap-2">
                        {imageUrls.map((url, idx) => (
                            <a key={idx} href={resolveImageUrl(url)} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={resolveImageUrl(url)}
                                    alt={`Attachment ${idx + 1}`}
                                    className="max-h-36 rounded border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
                                />
                            </a>
                        ))}
                    </div>
                )}

                {/* ── Review Status Badge ──────────── */}
                {note.review_status && (
                    <div className="mt-3 pl-10">
                        {isPending && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-800 text-xs font-medium border border-yellow-200">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                Pending Accountant Review
                            </div>
                        )}
                        {isApproved && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-800 text-xs font-medium border border-green-200">
                                <Check className="w-3 h-3" />
                                Approved by {note.reviewed_by_user?.name || 'Accountant'}
                                {note.reviewed_at && (
                                    <span className="text-green-600">
                                        • {new Date(note.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                )}
                            </div>
                        )}
                        {isRejected && (
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-800 text-xs font-medium border border-red-200">
                                    <X className="w-3 h-3" />
                                    Rejected by {note.reviewed_by_user?.name || 'Accountant'}
                                </div>
                                {note.rejection_reason && (
                                    <p className="text-xs text-red-700 bg-red-50 px-3 py-1.5 rounded border border-red-100">
                                        Reason: {note.rejection_reason}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Accountant Review Actions ──────── */}
                {canReview && isPending && (
                    <div className="mt-3 pl-10 pt-3 border-t border-gray-100">
                        {!isRejecting ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onReview(note.id, 'approve')}
                                    disabled={isReviewing}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => onReject(note.id)}
                                    disabled={isReviewing}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-600 text-xs font-semibold rounded-md border border-red-300 hover:bg-red-50 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <textarea
                                    rows={2}
                                    value={rejectionReason}
                                    onChange={(e) => onRejectionReasonChange(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    className="w-full p-2 text-xs border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 resize-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onReview(note.id, 'reject')}
                                        disabled={isReviewing || !rejectionReason.trim()}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                        Confirm Reject
                                    </button>
                                    <button
                                        onClick={onCancelReject}
                                        className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
