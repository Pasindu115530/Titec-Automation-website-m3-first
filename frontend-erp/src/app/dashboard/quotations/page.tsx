'use client';

import React, { useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';
import { Quotation } from '@/types/quotation';
import QuotationsTable from '@/components/admin/quotations-table';
import Loader from '@/components/loader';

import QuotationModal from '@/components/admin/quotation-modal';

import { toast } from 'sonner';

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filter & Pagination State
    const [statusFilter, setStatusFilter] = useState<'pending' | 'quoted'>('pending');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Modal State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'reply' | 'direct'>('reply');

    // Race condition handling
    const activeStatus = React.useRef(statusFilter);

    useEffect(() => {
        activeStatus.current = statusFilter;
        // Reset and load when filter changes
        setPage(1);
        setQuotations([]);
        loadQuotations(1, statusFilter, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const loadQuotations = async (pageNum: number, status: string, isInitial: boolean) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const response = await quotationService.getQuotationRequests(pageNum, status);

            // Check if this response matches the current active filter
            if (status !== activeStatus.current) {
                return;
            }

            // Laravel pagination response: { data: [], current_page: 1, last_page: 1, ... }
            const newQuotations = response.data;

            if (isInitial) {
                setQuotations(newQuotations);
            } else {
                setQuotations(prev => [...prev, ...newQuotations]);
            }

            setHasMore(response.current_page < response.last_page);
        } catch (error) {
            console.error('Failed to load quotations', error);
            toast.error('Failed to load quotations');
        } finally {
            // Only update loading state if we are still on the same filter
            if (status === activeStatus.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadQuotations(nextPage, statusFilter, false);
    };

    const handleReplyClick = (request: any) => {
        setSelectedRequest(request);
        setModalMode('reply');
        setIsModalOpen(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSendQuotation = async (data: any) => {
        const toastId = toast.loading('Sending quotation...');
        try {
            if (modalMode === 'reply') {
                if (!selectedRequest) return;
                await quotationService.replyToRequest(selectedRequest.id, data);

                if (statusFilter === 'pending') {
                    setQuotations(prev => prev.filter(q => q.id !== selectedRequest.id));
                } else {
                    setPage(1);
                    loadQuotations(1, statusFilter, true);
                }
                toast.success('Reply sent successfully', { id: toastId });
            } else {
                // Direct Quote
                await quotationService.sendDirectQuote(data);
                if (statusFilter === 'quoted') {
                    setPage(1);
                    loadQuotations(1, 'quoted', true);
                }
                toast.success('Direct quote sent successfully', { id: toastId });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to send quotation', error);
            toast.error('Failed to send quotation.', { id: toastId });
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quotation Requests</h1>
                    <p className="text-gray-500 mt-1">Manage incoming requests from customers.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => { setPage(1); loadQuotations(1, statusFilter, true); }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => {
                            setModalMode('direct');
                            setSelectedRequest(null); // Clear selected request for direct mode
                            setIsModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 btn-gradient-primary text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg border-0"
                    >
                        Create Direct Quote
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="-mb-px flex space-x-6 sm:space-x-8 min-w-max" aria-label="Tabs">
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${statusFilter === 'pending'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                    >
                        Pending Requests
                    </button>
                    <button
                        onClick={() => setStatusFilter('quoted')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${statusFilter === 'quoted'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                    >
                        Quoted History
                    </button>
                </nav>
            </div>

            {loading ? (
                <Loader variant="inline" size={100} />
            ) : (
                <div className="space-y-4">
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {quotations.map((q: any) => (
                                    <tr key={q.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{q.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="font-medium">{q.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{q.email || 'No Email'}</div>
                                            {q.phone && <div className="text-xs text-gray-400">{q.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(q.created_at).toLocaleString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${q.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                q.status === 'quoted' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                                }`}>
                                                {q.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {q.products?.length || 0}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                                            {q.customer_notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {q.status === 'pending' && (
                                                <button
                                                    onClick={() => handleReplyClick(q)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100"
                                                >
                                                    Reply
                                                </button>
                                            )}
                                            {q.status === 'quoted' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        // optionally view the reply
                                                        className="text-gray-400 text-sm cursor-default"
                                                    >
                                                        Sent
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            const toastId = toast.loading('Downloading PDF...');
                                                            try {
                                                                await quotationService.downloadQuotationPDF(q.id);
                                                                toast.success('Download started', { id: toastId });
                                                            } catch {
                                                                toast.error('Failed to download PDF. File may not exist.', { id: toastId });
                                                            }
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 text-sm font-medium bg-blue-50 px-3 py-1 rounded-md border border-blue-100"
                                                    >
                                                        View PDF
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {quotations.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No {statusFilter} quotations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <QuotationModal
                key={modalMode === 'reply' ? selectedRequest?.id : 'new-direct'}
                isOpen={isModalOpen}
                mode={modalMode}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
                onSend={handleSendQuotation}
            />
        </div>
    );
}
