import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    itemName: string;
    itemIdentifier?: string; // e.g. SKU, ID
    itemType?: string; // e.g. "Product", "Brand"
    isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemIdentifier,
    itemType = 'Item',
    isDeleting = false
}: DeleteConfirmationModalProps) {
    const [mounted, setMounted] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setConfirmText('');
        }
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                        <AlertTriangle className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Permanent Deletion</h3>
                        <p className="text-xs text-neutral-500 mt-0.5 font-medium">This action cannot be undone</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                            You are about to permanently delete:
                        </p>
                        <div className="p-3.5 bg-white/80 rounded-2xl border border-neutral-200/80 shadow-2xs">
                            <p className="font-bold text-neutral-900 text-sm">{itemName}</p>
                            {itemIdentifier && (
                                <p className="text-xs text-neutral-500 font-mono mt-1">{itemIdentifier}</p>
                            )}
                        </div>
                    </div>

                    <div className="p-3.5 bg-rose-50/80 text-rose-800 text-xs rounded-2xl border border-rose-200/80 shadow-2xs">
                        <p className="font-bold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-rose-600" />
                            Warning: Irreversible Action
                        </p>
                        <p className="mt-1 text-rose-600/90 ml-6">
                            This {itemType.toLowerCase()} will be permanently removed from the database and cannot be recovered.
                        </p>
                    </div>

                    <div className="space-y-2 pt-1">
                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                            Type <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded-lg text-neutral-900 border border-neutral-200 font-bold">DELETE</span> to confirm:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full px-4 h-11 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 font-mono text-sm bg-white shadow-2xs transition-all"
                            placeholder="Type DELETE here"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="p-5 bg-neutral-50/80 flex justify-end gap-3 rounded-b-[32px] border-t border-neutral-100">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={confirmText !== 'DELETE' || isDeleting}
                        className="h-11 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold border border-rose-500 shadow-[0_8px_20px_rgba(225,29,72,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Deleting...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4 stroke-[2.5]" />
                                <span>Delete Forever</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
