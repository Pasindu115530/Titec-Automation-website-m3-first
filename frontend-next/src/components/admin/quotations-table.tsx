import React, { useState } from 'react';
import { Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quotation } from '@/types/quotation';
import QuotationDetailsModal from './quotation-details-modal';

interface QuotationsTableProps {
    quotations: Quotation[];
    onRefresh: () => void;
}

export default function QuotationsTable({ quotations, onRefresh }: QuotationsTableProps) {
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'sent': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Quotation Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Items</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {quotations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No quotation requests found.
                                    </td>
                                </tr>
                            ) : (
                                quotations.map((quotation) => (
                                    <tr key={quotation.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{quotation.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{quotation.name}</div>
                                            <div className="text-xs text-gray-500">{quotation.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {quotation.items.length} item(s)
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(quotation.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(quotation.status)}`}>
                                                {quotation.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                onClick={() => setSelectedQuotation(quotation)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <QuotationDetailsModal
                isOpen={!!selectedQuotation}
                onClose={() => setSelectedQuotation(null)}
                quotation={selectedQuotation}
                onSuccess={onRefresh}
            />
        </>
    );
}
