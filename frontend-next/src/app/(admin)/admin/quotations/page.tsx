'use client';

import React, { useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';
import { Quotation } from '@/types/quotation';
import QuotationsTable from '@/components/admin/quotations-table';

import ReplyModal from '@/components/admin/reply-quotation-modal';
import DirectQuoteModal from '@/components/admin/direct-quote-modal';

import { toast } from 'sonner';

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(true);

    // Modal State
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isDirectQuoteModalOpen, setIsDirectQuoteModalOpen] = useState(false);

    useEffect(() => {
        loadQuotations();
    }, []);

    const loadQuotations = async () => {
        setLoading(true);
        try {
            const data = await quotationService.getQuotationRequests();
            setQuotations(data);
        } catch (error) {
            console.error('Failed to load quotations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReplyClick = (request: any) => {
        setSelectedRequest(request);
        setIsReplyModalOpen(true);
    };

    const handleSendReply = async (data: { items: any[], message: string }) => {
        if (!selectedRequest) return;
        const toastId = toast.loading('Sending reply...');
        try {
            await quotationService.replyToRequest(selectedRequest.id, data);
            // Refresh list
            loadQuotations();
            toast.success('Reply sent successfully', { id: toastId });
        } catch (error) {
            console.error('Failed to send reply', error);
            toast.error('Failed to send quotation. Please check console.', { id: toastId });
        }
    };

    const handleSendDirectQuote = async (data: { name: string, email: string, phone: string, items: any[], message: string }) => {
        const toastId = toast.loading('Sending direct quote...');
        try {
            await quotationService.sendDirectQuote(data);
            loadQuotations();
            toast.success('Direct quote sent successfully', { id: toastId });
        } catch (error) {
            console.error('Failed to send direct quote', error);
            toast.error('Failed to send direct quotation.', { id: toastId });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quotation Requests</h1>
                    <p className="text-gray-500 mt-1">Manage incoming requests from customers.</p>
                </div>
                <div className="flex">
                    <button
                        onClick={loadQuotations}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsDirectQuoteModalOpen(true)}
                        className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    >
                        Create Direct Quote
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
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
                            {quotations.map((q: any) => (
                                <tr key={q.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{q.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-medium">{q.name || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">{q.email || 'No Email'}</div>
                                        {q.phone && <div className="text-xs text-gray-400">{q.phone}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${q.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            q.status === 'quoted' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                            }`}>
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {q.products?.length || 0} items
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
                                            <span className="text-gray-400 text-sm">Sent</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ReplyModal
                key={selectedRequest?.id}
                isOpen={isReplyModalOpen}
                onClose={() => setIsReplyModalOpen(false)}
                request={selectedRequest}
                onSend={handleSendReply}
            />

            <DirectQuoteModal
                isOpen={isDirectQuoteModalOpen}
                onClose={() => setIsDirectQuoteModalOpen(false)}
                onSend={handleSendDirectQuote}
            />
        </div>
    );
}
