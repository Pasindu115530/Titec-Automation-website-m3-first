import React, { useState, useEffect } from 'react';
import { installationService } from '@/services/installationService';
import { clientService, Client } from '@/services/clientService';
import { toast } from 'sonner';

interface AddInstallationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddInstallationModal({ isOpen, onClose, onSuccess }: AddInstallationModalProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        client_id: '',
        description: '',
        priority: 'medium',
        scheduled_date: '',
        location_address: '',
    });

    useEffect(() => {
        if (isOpen) {
            loadClients();
            // Reset form
            setFormData({
                title: '',
                client_id: '',
                description: '',
                priority: 'medium',
                scheduled_date: '',
                location_address: '',
            });
        }
    }, [isOpen]);

    const loadClients = async () => {
        setLoadingClients(true);
        try {
            // Load a large enough page or search to get clients for dropdown
            const res = await clientService.getClients('', 1);
            setClients(res.data || []);
        } catch (error) {
            console.error('Failed to load clients', error);
        } finally {
            setLoadingClients(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.client_id) {
            toast.error('Title and Client are required.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Creating installation...');
        
        try {
            await installationService.createInstallation({
                ...formData,
                client_id: Number(formData.client_id)
            });
            toast.success('Installation created successfully!', { id: toastId });
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to create installation.', { id: toastId });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900">New Installation / Job</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. VFD Installation at Main Plant"
                        />
                    </div>

                    <div>
                        <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Client <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="client_id"
                            name="client_id"
                            required
                            value={formData.client_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="">Select a client...</option>
                            {loadingClients ? (
                                <option disabled>Loading clients...</option>
                            ) : (
                                clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name || client.contact_person}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-1">
                                Scheduled Date
                            </label>
                            <input
                                type="date"
                                id="scheduled_date"
                                name="scheduled_date"
                                value={formData.scheduled_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-1">
                            Location / Address
                        </label>
                        <input
                            type="text"
                            id="location_address"
                            name="location_address"
                            value={formData.location_address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Site address (leave blank to use client's address)"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description / Requirements
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            placeholder="Detailed requirements for the installation..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Installation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
