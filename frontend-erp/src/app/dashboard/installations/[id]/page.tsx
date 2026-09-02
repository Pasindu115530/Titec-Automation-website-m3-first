'use client';

import React, { useState, useEffect } from 'react';
import { installationService, Installation } from '@/services/installationService';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import TechnicianAssignment from '@/components/erp/technician-assignment';
import InstallationNoteForm from '@/components/erp/installation-note-form';

export default function InstallationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [installation, setInstallation] = useState<Installation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id !== 'new') {
            loadInstallation();
        }
    }, [id]);

    const loadInstallation = async () => {
        setLoading(true);
        try {
            const data: any = await installationService.getInstallationById(id);
            // Handling whether the backend nests it in { data: ... }
            setInstallation(data?.data ? data.data : data);
        } catch (error) {
            toast.error('Failed to load installation details.');
            router.push('/dashboard/installations');
        } finally {
            setLoading(false);
        }
    };

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
                                    {installation.location_address || installation.client?.address || 'N/A'}
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
                                    <div key={note.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {note.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{note.user?.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(note.created_at).toLocaleString('en-US', {
                                                            month: 'short', day: 'numeric', 
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap mt-3 pl-10">
                                            {note.content}
                                        </p>
                                        {note.image_url && (
                                            <div className="mt-3 pl-10">
                                                <img 
                                                    src={note.image_url.startsWith('http') ? note.image_url : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/storage/${note.image_url}`} 
                                                    alt="Update attachment" 
                                                    className="max-h-48 rounded border border-gray-200"
                                                />
                                            </div>
                                        )}
                                    </div>
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
