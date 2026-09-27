import React from 'react';
import { InstallationNote } from '@/services/installationService';
import {
    MessageSquare, CheckCircle, Receipt, AlertTriangle, Wrench,
    Check, X
} from 'lucide-react';

export const NOTE_TYPE_CONFIG: Record<string, {
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

export interface NoteCardProps {
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

export default function NoteCard({
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
