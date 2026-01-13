'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    User,
    Calendar,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Search,
    Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type QuotationStatus = 'pending' | 'reviewed' | 'quoted' | 'rejected';

type QuotationItem = {
    id: string;
    name: string;
    quantity: number;
    category?: string;
    description?: string;
};

type Quotation = {
    _id: string;
    customerId?: string;
    customerName?: string;
    customerEmail?: string;
    items: QuotationItem[];
    status: QuotationStatus;
    submittedAt: string;
    notes?: string;
};

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<QuotationStatus | 'all'>('all');
    const { user, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push('/admin/login');
            return;
        }
        fetchQuotations();
    }, [isAdmin, router]);

    const fetchQuotations = async () => {
        try {
            setIsLoading(true);
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
            const response = await fetch(`${backendUrl}/api/quotations`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setQuotations(data);
            }
        } catch (error) {
            console.error('Failed to fetch quotations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuotationStatus = async (id: string, status: QuotationStatus) => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
            const response = await fetch(`${backendUrl}/api/quotations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchQuotations();
            }
        } catch (error) {
            console.error('Failed to update quotation:', error);
        }
    };

    const getStatusIcon = (status: QuotationStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'reviewed': return <FileText className="w-4 h-4" />;
            case 'quoted': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: QuotationStatus) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'quoted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
        }
    };

    const filteredQuotations = quotations.filter(q => {
        const matchesSearch = q.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            q.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: quotations.length,
        pending: quotations.filter(q => q.status === 'pending').length,
        reviewed: quotations.filter(q => q.status === 'reviewed').length,
        quoted: quotations.filter(q => q.status === 'quoted').length,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Quotation Requests</h1>
                    <p className="text-gray-500 mt-1">Manage customer quotation requests</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <FileText className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                            <p className="text-sm text-gray-500">Total Requests</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
                            <p className="text-sm text-gray-500">Pending</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <FileText className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-900">{stats.reviewed}</h3>
                            <p className="text-sm text-gray-500">Reviewed</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-900">{stats.quoted}</h3>
                            <p className="text-sm text-gray-500">Quoted</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by customer name or email..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border rounded-lg"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as QuotationStatus | 'all')}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="quoted">Quoted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredQuotations.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No quotation requests found</p>
                            </div>
                        ) : (
                            filteredQuotations.map((quotation, index) => (
                                <motion.div
                                    key={quotation._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        {quotation.customerName || 'Unknown Customer'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{quotation.customerEmail}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(quotation.status)}`}>
                                                    {getStatusIcon(quotation.status)}
                                                    {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(quotation.submittedAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {quotation.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded p-3 space-y-2">
                                                <p className="text-xs font-medium text-gray-700">Requested Items:</p>
                                                {quotation.items.map((item, idx) => (
                                                    <div key={idx} className="text-sm flex justify-between">
                                                        <span>{item.name} {item.category && <span className="text-gray-500">({item.category})</span>}</span>
                                                        <span className="font-medium">Qty: {item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex lg:flex-col gap-2 lg:w-32">
                                            {quotation.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuotationStatus(quotation._id, 'reviewed')}
                                                        className="flex-1 lg:flex-none"
                                                    >
                                                        Mark Reviewed
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateQuotationStatus(quotation._id, 'quoted')}
                                                        className="flex-1 lg:flex-none"
                                                    >
                                                        Send Quote
                                                    </Button>
                                                </>
                                            )}
                                            {quotation.status === 'reviewed' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateQuotationStatus(quotation._id, 'quoted')}
                                                    className="flex-1 lg:flex-none"
                                                >
                                                    Send Quote
                                                </Button>
                                            )}
                                            {(quotation.status === 'pending' || quotation.status === 'reviewed') && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => updateQuotationStatus(quotation._id, 'rejected')}
                                                    className="flex-1 lg:flex-none"
                                                >
                                                    Reject
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
