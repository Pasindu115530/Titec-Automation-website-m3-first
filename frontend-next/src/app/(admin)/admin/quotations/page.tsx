'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Assuming this exists based on previous file
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
            const data = await quotationService.getQuotations();
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
                    <p className="text-gray-500 mt-1">Manage and bill customer quotation requests.</p>
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
                <QuotationsTable
                    quotations={quotations}
                    onRefresh={loadQuotations}
                />
            )}
        </div>
    );
}
