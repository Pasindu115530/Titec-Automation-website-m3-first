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
    { value: 'progress',         label: 'Progress',         icon: MessageSquare,  activeClass: 'bg-blue-100 text-blue-800 ring-1 ring-blue-300 shadow-sm',     description: 'General status update' },
    { value: 'completion',       label: 'Completion',       icon: CheckCircle,    activeClass: 'bg-green-100 text-green-800 ring-1 ring-green-300 shadow-sm',   description: 'Photo evidence of completed work' },
    { value: 'extra_cost',       label: 'Extra Cost',       icon: Receipt,        activeClass: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 shadow-sm',   description: 'Fuel, transport, on-site materials' },
    { value: 'defect',           label: 'Defect',           icon: AlertTriangle,  activeClass: 'bg-red-100 text-red-800 ring-1 ring-red-300 shadow-sm',         description: 'Defective part or component' },
    { value: 'additional_parts', label: 'Parts Request',    icon: Wrench,         activeClass: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300 shadow-sm', description: 'Additional parts needed' },
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
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* ── Type Selector Pills ─────────────────── */}
            <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 border-b border-gray-100">
                {NOTE_TYPES.map((noteType) => {
                    const Icon = noteType.icon;
                    const isActive = type === noteType.value;
                    return (
                        <button
                            key={noteType.value}
                            type="button"
                            onClick={() => setType(noteType.value)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
                                ${isActive
                                    ? noteType.activeClass
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            title={noteType.description}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{noteType.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="p-4 space-y-3">
                {/* ── Type description hint ───────────────── */}
                <p className="text-xs text-gray-500 italic">
                    {activeType.description}
                    {requiresImage && <span className="text-red-500 ml-1">• Photo required</span>}
                    {requiresCost && <span className="text-amber-600 ml-1">• Cost required</span>}
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
                    className="w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none outline-none text-gray-900 placeholder:text-gray-400"
                    disabled={isSubmitting}
                />

                {/* ── Cost Fields (conditional) ───────────── */}
                {showsCost && (
                    <div className="flex gap-3">
                        <div className="w-40">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Amount (Rs.) {requiresCost && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={costAmount}
                                onChange={(e) => setCostAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Cost Description</label>
                            <input
                                type="text"
                                value={costDescription}
                                onChange={(e) => setCostDescription(e.target.value)}
                                placeholder="e.g. Fuel from Kaduwela to Matara"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                )}

                {/* ── Image Previews ──────────────────────── */}
                {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative inline-block">
                                <img
                                    src={preview}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                                    title="Remove image"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Bottom Actions Bar ──────────────────── */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                        <label
                            htmlFor="note-images-upload"
                            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 cursor-pointer font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <ImageIcon className="w-4 h-4" />
                            <span>
                                {images.length > 0 ? `${images.length} photo${images.length > 1 ? 's' : ''}` : 'Attach Photos'}
                                {requiresImage && images.length === 0 && <span className="text-red-500 ml-0.5">*</span>}
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
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
