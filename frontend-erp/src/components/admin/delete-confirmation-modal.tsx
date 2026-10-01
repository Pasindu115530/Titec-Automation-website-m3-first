import React, { useState, useEffect } from 'react';
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
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setConfirmText('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Permanent Deletion</h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                            You are about to <strong>permanently delete</strong>:
                        </p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="font-medium text-gray-900">{itemName}</p>
                            {itemIdentifier && (
                                <p className="text-xs text-gray-500 font-mono mt-1">{itemIdentifier}</p>
                            )}
                        </div>
                    </div>

                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                        <p className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Warning: Irreversible Action
                        </p>
                        <p className="mt-1 text-red-600/90 ml-6">
                            This {itemType.toLowerCase()} will be permanently removed from the database and cannot be recovered.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium text-gray-700 block">
                            Type <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border font-bold">DELETE</span> to confirm:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-mono text-sm transition-all"
                            placeholder="Type DELETE here"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl border-t">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="border-gray-200 hover:bg-gray-100 text-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={confirmText !== 'DELETE' || isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                    >
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Deleting...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Forever</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
