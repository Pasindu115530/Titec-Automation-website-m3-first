import React, { useState, useEffect } from 'react';
import { installationService } from '@/services/installationService';
import { clientService, Client } from '@/services/clientService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench } from 'lucide-react';

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
        location: '',
    });

    useEffect(() => {
        if (isOpen) {
            loadClients();
            setFormData({
                title: '',
                client_id: '',
                description: '',
                priority: 'medium',
                scheduled_date: '',
                location: '',
            });
        }
    }, [isOpen]);

    const loadClients = async () => {
        setLoadingClients(true);
        try {
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
            toast.error('Job Title and Client are required.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Creating installation job...');
        
        try {
            const selectedClient = clients.find(c => c.id === Number(formData.client_id));
            const locationToUse = formData.location || selectedClient?.address || 'Unknown Location';

            await installationService.createInstallation({
                ...formData,
                location: locationToUse,
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[640px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-7 sm:p-8 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3.5">
                            <div className="h-12 w-12 rounded-2xl bg-[#F1EBFF] text-[#7C3AED] flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                <Wrench className="h-6 w-6 text-[#7C3AED]" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-neutral-900 tracking-tight">New Installation</DialogTitle>
                                <p className="text-sm text-neutral-500 font-medium mt-0.5">Create and schedule a new installation or engineering service job</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                Job Title <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="h-12 px-4 text-base bg-neutral-50/80 border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all placeholder:text-neutral-400"
                                placeholder="e.g. VFD Installation & Calibration at Main Plant"
                            />
                        </div>

                        {/* Client Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="client_id" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                Client <span className="text-rose-500">*</span>
                            </Label>
                            <select
                                id="client_id"
                                name="client_id"
                                required
                                value={formData.client_id}
                                onChange={handleChange}
                                className="w-full h-12 px-4 text-sm bg-neutral-50/80 border border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus:outline-none transition-all cursor-pointer"
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

                        {/* Priority & Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                    Priority
                                </Label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 text-sm bg-neutral-50/80 border border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus:outline-none transition-all cursor-pointer font-medium"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduled_date" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                    Scheduled Date
                                </Label>
                                <Input
                                    type="date"
                                    id="scheduled_date"
                                    name="scheduled_date"
                                    value={formData.scheduled_date}
                                    onChange={handleChange}
                                    className="h-12 px-4 text-sm bg-neutral-50/80 border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                Location / Site Address
                            </Label>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="h-12 px-4 text-base bg-neutral-50/80 border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all placeholder:text-neutral-400"
                                placeholder="Site address (leave blank to use client's registered address)"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                                Description / Requirements
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className="p-3.5 text-sm bg-neutral-50/80 border-neutral-200 text-neutral-900 rounded-2xl focus:bg-amber-50/40 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all resize-none placeholder:text-neutral-400"
                                placeholder="Specific instructions, technical requirements, or safety notes..."
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3 sm:gap-3 pt-4 border-t border-neutral-100 flex items-center justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-11 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 font-bold text-sm shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 px-7 rounded-2xl bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold border border-sky-200 shadow-[0_4px_16px_rgba(125,211,252,0.4)] text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Installation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
