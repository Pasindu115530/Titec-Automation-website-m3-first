'use client';
import React, { useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';
import { motion } from 'framer-motion';
import {
    Users,
    DollarSign,
    ShoppingBag,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreHorizontal,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        total: 0,
        pending: 0,
        reviewed: 0,
        quoted: 0
    });
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const { user, isAdmin, isRetailer, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Redirect to admin login if not authenticated as admin or retailer
        if (!isAdmin && !isRetailer) {
            router.push('/admin/login');
            return;
        }
        fetchDashboardData();
    }, [isAdmin, isRetailer, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const fetchDashboardData = async () => {
        try {
            // Import dynamically to avoid circular deps if any, or just standard import
            const { dashboardService } = await import('@/services/dashboardService');
            const data = await dashboardService.getStats();
            setStatsData(data.stats);
            setRecentRequests(data.recent_requests);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        }
    };

    const stats = [
        { label: 'Quotation Requests', value: statsData.total.toString(), change: '+12%', icon: FileText, trend: 'up' },
        { label: 'Pending Requests', value: statsData.pending.toString(), change: '+5%', icon: Activity, trend: 'up' },
        { label: 'Quoted', value: statsData.quoted.toString(), change: '+8%', icon: ShoppingBag, trend: 'up' },
        { label: 'Under Review', value: statsData.reviewed.toString(), change: '-2%', icon: Users, trend: 'down' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Quoted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Reviewed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gradient-tech font-orbitron">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/quotations">
                        <Button className="btn-gradient-primary border-0">View Quotations</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="tech-card-hover border-gray-100/50 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-sm font-medium flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change}
                                        {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Quotation Requests</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">Latest inquiries from customers</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-indigo-600">#{req.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                {req.customer ? req.customer.charAt(0).toUpperCase() : 'G'}
                                            </div>
                                            <div>
                                                <div className="font-medium">{req.customer || 'Guest'}</div>
                                                <div className="text-xs text-gray-500">{req.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{req.date}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                                            {req.amount !== '-' ? `$${req.amount}` : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link href={`/admin/quotations`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {recentRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">No recent activity.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
