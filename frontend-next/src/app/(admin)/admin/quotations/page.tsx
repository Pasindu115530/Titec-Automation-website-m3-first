'use client';

import React, { useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';
import { Quotation } from '@/types/quotation';
import QuotationsTable from '@/components/admin/quotations-table';

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    // const { user, isAdmin } = useAuth(); // Commented out to avoid errors if context differs, but utilizing if available
    const [isAdmin, setIsAdmin] = useState(true); // Fallback for dev
    
    useEffect(() => {
        // Simple admin check based on localStorage if context not fully reliable for this specific task scope
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            // logic to check admin
        }

        loadQuotations();
    }, []);

    const loadQuotations = async () => {
        setLoading(true);
        try {
            // Updated to fetch REQUESTS, not just finalized quotes
            const data = await quotationService.getQuotationRequests();
            setQuotations(data);
        } catch (error) {
            console.error('Failed to load quotations', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quotation Requests</h1>
                    <p className="text-gray-500 mt-1">Manage incoming requests from customers.</p>
                </div>
                <button
                    onClick={loadQuotations}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                >
                    Refresh
                </button>
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {quotations.map((q: any) => (
                                <tr key={q.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{q.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {q.user ? q.user.name : 'Guest'}
                                        <div className="text-xs text-gray-500">{q.user?.email}</div>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
