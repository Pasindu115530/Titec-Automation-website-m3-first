'use client';

import React, { useState } from 'react';
import { installationService } from '@/services/installationService';
import { toast } from 'sonner';
import { Image as ImageIcon, X, Send, Loader2 } from 'lucide-react';

interface InstallationNoteFormProps {
    installationId: number;
    onNoteAdded: () => void;
}

export default function InstallationNoteForm({ installationId, onNoteAdded }: InstallationNoteFormProps) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) {
            toast.error('Please enter a note content');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Adding note...');

        try {
            await installationService.addNote(installationId, content, image || undefined);
            toast.success('Note added successfully', { id: toastId });
            setContent('');
            setImage(null);
            setImagePreview(null);
            onNoteAdded();
        } catch (error: any) {
            console.error('Failed to add note:', error);
            toast.error(error?.response?.data?.message || 'Failed to add note', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="mb-3">
                <textarea
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a progress update, technician note, or status report..."
                    className="w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none outline-none text-gray-900 placeholder:text-gray-400"
                    disabled={isSubmitting}
                />
            </div>

            {imagePreview && (
                <div className="relative inline-block mb-3">
                    <img 
                        src={imagePreview} 
                        alt="Attachment preview" 
                        className="w-24 h-24 object-cover rounded-md border border-gray-200" 
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                        title="Remove image"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                    <label 
                        htmlFor="note-image-upload" 
                        className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 cursor-pointer font-medium px-2.5 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span>{image ? 'Change Photo' : 'Attach Photo'}</span>
                    </label>
                    <input 
                        id="note-image-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
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
                            <span>Post Note</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
