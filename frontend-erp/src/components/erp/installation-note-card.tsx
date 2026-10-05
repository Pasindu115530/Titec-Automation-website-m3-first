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
    progress:         { icon: MessageSquare,  borderColor: 'border-l-sky-400',    bgColor: 'bg-sky-50 text-sky-700',       badgeColor: 'bg-sky-50 text-sky-800 border-sky-200/80',         label: 'Progress Update' },
    completion:       { icon: CheckCircle,    borderColor: 'border-l-teal-500',   bgColor: 'bg-[#E6F9F7] text-[#0D9488]',   badgeColor: 'bg-[#E6F9F7] text-[#0D9488] border-teal-200/80',   label: 'Completion Photo' },
    extra_cost:       { icon: Receipt,        borderColor: 'border-l-amber-500',  bgColor: 'bg-[#FFF4E8] text-[#E0781E]',  badgeColor: 'bg-[#FFF4E8] text-[#E0781E] border-amber-200/80',  label: 'Extra Cost' },
    defect:           { icon: AlertTriangle,  borderColor: 'border-l-rose-500',   bgColor: 'bg-[#FFE8EC] text-[#D82246]',   badgeColor: 'bg-[#FFE8EC] text-[#D82246] border-rose-200/80',   label: 'Defect Report' },
    additional_parts: { icon: Wrench,         borderColor: 'border-l-purple-500', bgColor: 'bg-[#F1EBFF] text-[#7C3AED]',  badgeColor: 'bg-[#F1EBFF] text-[#7C3AED] border-purple-200/80', label: 'Parts Request' },
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
        <div className={`bg-white/60 hover:bg-white/85 backdrop-blur-md rounded-3xl border border-white/80 border-l-4 ${config.borderColor} shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-5 transition-all overflow-hidden`}>
            <div>
                {/* ── Header Row ────────────────────── */}
                <div className="flex justify-between items-start mb-2.5">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-2xl ${config.bgColor} flex items-center justify-center border border-white/80 shadow-2xs`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-neutral-900">{note.user?.name}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${config.badgeColor}`}>
                                    {config.label}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 font-medium mt-0.5">
                                {new Date(note.created_at).toLocaleString('en-US', {
                                    month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Cost badge */}
                    {hasCost && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFF4E8] text-[#E0781E] text-xs font-bold border border-amber-200/80 shadow-2xs">
                            Rs. {Number(note.cost_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    )}
                </div>

                {/* ── Cost description ──────────────── */}
                {note.cost_description && (
                    <p className="text-xs font-semibold text-neutral-600 bg-white/70 px-3.5 py-2 rounded-xl ml-11 mb-2 border border-white/80 shadow-2xs">
                        💰 {note.cost_description}
                    </p>
                )}

                {/* ── Content ──────────────────────── */}
                <p className="text-sm font-medium text-neutral-800 whitespace-pre-wrap mt-2 pl-11 leading-relaxed">
                    {note.content}
                </p>

                {/* ── Image Gallery ─────────────────── */}
                {imageUrls.length > 0 && (
                    <div className="mt-3 pl-11 flex flex-wrap gap-2.5">
                        {imageUrls.map((url, idx) => (
                            <a key={idx} href={resolveImageUrl(url)} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={resolveImageUrl(url)}
                                    alt={`Attachment ${idx + 1}`}
                                    className="max-h-36 rounded-2xl border border-white/80 shadow-2xs hover:scale-[1.02] transition-transform cursor-pointer"
                                />
                            </a>
                        ))}
                    </div>
                )}

                {/* ── Review Status Badge ──────────── */}
                {note.review_status && (
                    <div className="mt-3.5 pl-11">
                        {isPending && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF4E8] text-[#E0781E] text-xs font-bold border border-amber-200/80 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                Pending Accountant Review
                            </div>
                        )}
                        {isApproved && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E6F9F7] text-[#0D9488] text-xs font-bold border border-teal-200/80 shadow-2xs">
                                <Check className="w-3.5 h-3.5" />
                                <span>Approved by {note.reviewed_by_user?.name || 'Accountant'}</span>
                                {note.reviewed_at && (
                                    <span className="opacity-80">
                                        • {new Date(note.reviewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                )}
                            </div>
                        )}
                        {isRejected && (
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFE8EC] text-[#D82246] text-xs font-bold border border-rose-200/80 shadow-2xs">
                                    <X className="w-3.5 h-3.5" />
                                    <span>Rejected by {note.reviewed_by_user?.name || 'Accountant'}</span>
                                </div>
                                {note.rejection_reason && (
                                    <p className="text-xs text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/70 font-medium">
                                        Reason: {note.rejection_reason}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Accountant Review Actions ──────── */}
                {canReview && isPending && (
                    <div className="mt-3.5 pl-11 pt-3 border-t border-neutral-200/60">
                        {!isRejecting ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onReview(note.id, 'approve')}
                                    disabled={isReviewing}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E6F9F7] hover:bg-[#d5f5f1] text-[#0D9488] border border-teal-200/80 text-xs font-bold rounded-xl shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => onReject(note.id)}
                                    disabled={isReviewing}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200/80 text-xs font-bold rounded-xl shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
                                    className="w-full p-3 text-xs bg-white border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-neutral-900 resize-none font-medium shadow-2xs"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onReview(note.id, 'reject')}
                                        disabled={isReviewing || !rejectionReason.trim()}
                                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        Confirm Reject
                                    </button>
                                    <button
                                        onClick={onCancelReject}
                                        className="px-3.5 py-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white/70 hover:bg-white rounded-xl border border-white/80 shadow-2xs transition-all cursor-pointer"
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
