'use client';

import React, { useState, useRef } from 'react';
import { installationService, NoteType } from '@/services/installationService';
import { toast } from 'sonner';
import {
    Image as ImageIcon, X, Send, Loader2,
    MessageSquare, CheckCircle, Receipt, AlertTriangle, Wrench
} from 'lucide-react';

interface InstallationNoteFormProps {
    installationId: number;
    onNoteAdded: () => void;
}

const NOTE_TYPES: { value: NoteType; label: string; icon: React.ElementType; activeClass: string; description: string }[] = [
    { value: 'progress',         label: 'Progress',         icon: MessageSquare,  activeClass: 'bg-sky-300 text-neutral-950 border border-sky-200 shadow-[0_4px_14px_rgba(125,211,252,0.35)]',     description: 'General status update' },
    { value: 'completion',       label: 'Completion',       icon: CheckCircle,    activeClass: 'bg-[#E6F9F7] text-[#0D9488] border border-teal-200/80 shadow-2xs',   description: 'Photo evidence of completed work' },
    { value: 'extra_cost',       label: 'Extra Cost',       icon: Receipt,        activeClass: 'bg-[#FFF4E8] text-[#E0781E] border border-amber-200/80 shadow-2xs',   description: 'Fuel, transport, on-site materials' },
    { value: 'defect',           label: 'Defect',           icon: AlertTriangle,  activeClass: 'bg-[#FFE8EC] text-[#D82246] border border-rose-200/80 shadow-2xs',         description: 'Defective part or component' },
    { value: 'additional_parts', label: 'Parts Request',    icon: Wrench,         activeClass: 'bg-[#F1EBFF] text-[#7C3AED] border border-purple-200/80 shadow-2xs', description: 'Additional parts needed' },
];

const REQUIRES_IMAGE: NoteType[] = ['completion', 'extra_cost', 'defect'];
const REQUIRES_COST: NoteType[]  = ['extra_cost', 'additional_parts'];
const SHOWS_COST: NoteType[]     = ['extra_cost', 'defect', 'additional_parts'];

export default function InstallationNoteForm({ installationId, onNoteAdded }: InstallationNoteFormProps) {
    const [content, setContent] = useState('');
    const [type, setType] = useState<NoteType>('progress');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [costAmount, setCostAmount] = useState('');
    const [costDescription, setCostDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const requiresImage = REQUIRES_IMAGE.includes(type);
    const requiresCost = REQUIRES_COST.includes(type);
    const showsCost = SHOWS_COST.includes(type);

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newImages = [...images, ...files];
        setImages(newImages);

        // Generate previews for new files
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setContent('');
        setType('progress');
        setImages([]);
        setImagePreviews([]);
        setCostAmount('');
        setCostDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('Please enter a description');
            return;
        }
        if (requiresImage && images.length === 0) {
            toast.error(`A photo is required for ${NOTE_TYPES.find(t => t.value === type)?.label} updates`);
            return;
        }
        if (requiresCost && (!costAmount || parseFloat(costAmount) <= 0)) {
            toast.error('Please enter a valid cost amount');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Posting update...');

        try {
            await installationService.addNote(
                installationId,
                content,
                type,
                images.length > 0 ? images : undefined,
                costAmount ? parseFloat(costAmount) : undefined,
                costDescription || undefined
            );
            toast.success('Update posted successfully', { id: toastId });
            resetForm();
            onNoteAdded();
        } catch (error: any) {
            console.error('Failed to post update:', error);
            const msg = error?.response?.data?.message || 'Failed to post update';
            toast.error(msg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeType = NOTE_TYPES.find(t => t.value === type)!;

    return (
        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* ── Type Selector Pills ─────────────────── */}
            <div className="flex flex-wrap gap-1.5 p-3.5 bg-white/50 border-b border-white/80">
                {NOTE_TYPES.map((noteType) => {
                    const Icon = noteType.icon;
                    const isActive = type === noteType.value;
                    return (
                        <button
                            key={noteType.value}
                            type="button"
                            onClick={() => setType(noteType.value)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs transition-all duration-200 cursor-pointer
                                ${isActive
                                    ? `${noteType.activeClass} font-bold`
                                    : 'bg-white/70 text-neutral-600 hover:text-neutral-950 hover:bg-white border border-white/90 shadow-2xs font-semibold'
                                }`}
                            title={noteType.description}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{noteType.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="p-5 space-y-3.5">
                {/* ── Type description hint ───────────────── */}
                <p className="text-xs text-neutral-500 font-medium italic">
                    {activeType.description}
                    {requiresImage && <span className="text-rose-500 font-bold ml-1.5">• Photo required</span>}
                    {requiresCost && <span className="text-amber-700 font-bold ml-1.5">• Cost required</span>}
                </p>

                {/* ── Content textarea ────────────────────── */}
                <textarea
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                        type === 'progress' ? 'Describe the progress or status update...' :
                        type === 'completion' ? 'Describe the completed work...' :
                        type === 'extra_cost' ? 'Describe the extra cost (e.g. fuel from Kaduwela to site)...' :
                        type === 'defect' ? 'Describe the defect found (e.g. PLC module faulty)...' :
                        'Describe the additional parts needed...'
                    }
                    className="w-full p-3.5 text-sm bg-white/80 hover:bg-white focus:bg-white border border-white focus:border-neutral-200 text-neutral-900 rounded-2xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all resize-none placeholder:text-neutral-400 font-medium"
                    disabled={isSubmitting}
                />

                {/* ── Cost Fields (conditional) ───────────── */}
                {showsCost && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-44">
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                                Amount (Rs.) {requiresCost && <span className="text-rose-500">*</span>}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={costAmount}
                                onChange={(e) => setCostAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3.5 py-2 text-sm bg-white/80 hover:bg-white focus:bg-white border border-white focus:border-neutral-200 text-neutral-900 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all font-medium"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Cost Description</label>
                            <input
                                type="text"
                                value={costDescription}
                                onChange={(e) => setCostDescription(e.target.value)}
                                placeholder="e.g. Fuel from Kaduwela to Matara"
                                className="w-full px-3.5 py-2 text-sm bg-white/80 hover:bg-white focus:bg-white border border-white focus:border-neutral-200 text-neutral-900 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all font-medium"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                )}

                {/* ── Image Previews ──────────────────────── */}
                {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 pt-1">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative inline-block">
                                <img
                                    src={preview}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-2xl border border-white/80 shadow-2xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition-colors shadow-xs cursor-pointer"
                                    title="Remove image"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Bottom Actions Bar ──────────────────── */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200/60">
                    <div>
                        <label
                            htmlFor="note-images-upload"
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-950 font-bold px-3 py-2 rounded-xl bg-white/70 hover:bg-white border border-white/80 shadow-2xs transition-all cursor-pointer"
                        >
                            <ImageIcon className="w-4 h-4 text-neutral-500" />
                            <span>
                                {images.length > 0 ? `${images.length} photo${images.length > 1 ? 's' : ''}` : 'Attach Photos'}
                                {requiresImage && images.length === 0 && <span className="text-rose-500 ml-0.5">*</span>}
                            </span>
                        </label>
                        <input
                            ref={fileInputRef}
                            id="note-images-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="hidden"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-300 hover:bg-sky-400 text-neutral-950 text-xs font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Posting...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Post Update</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
