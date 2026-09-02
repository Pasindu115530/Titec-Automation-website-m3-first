/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
    FileText,
    ShoppingCart,
    Clock,
    CheckCircle,
    XCircle,
    LogOut,
    User,
    Package,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import Footer from '@/components/footer';
import { api } from '@/lib/api';
import Loader from '@/components/loader';

interface Quotation {
    id: number;
    quotation_number: string;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    project_details: string;
    status: string;
    total_amount?: number;
    created_at: string;
    updated_at: string;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    email: string;
    phone: string;
    product_details: string;
    quantity: number;
    status: string;
    total_amount?: number;
    delivery_date?: string;
    created_at: string;
    updated_at: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function CustomerDashboard() {
    const [user, setUser] = useState<UserData | null>(null);
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check authentication
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userData || !token) {
            router.push('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchDashboardData();
        } catch (err) {
            router.push('/login');
        }
    }, [router]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Fetch quotations
            const quotationsResponse = await api.get('/api/quotations');
            setQuotations(quotationsResponse.data.data || quotationsResponse.data || []);

            // Fetch orders
            const ordersResponse = await api.get('/api/orders');
            setOrders(ordersResponse.data.data || ordersResponse.data || []);
        } catch (err: unknown) {
            console.error('Error fetching dashboard data:', err);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as Record<string, any>;
                if (axiosError.response?.status === 401) {
                    handleLogout();
                }
            }
            setError('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
            pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <Clock className="w-3 h-3" /> },
            approved: { color: 'bg-green-100 text-green-800 border-green-300', icon: <CheckCircle className="w-3 h-3" /> },
            rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: <XCircle className="w-3 h-3" /> },
            processing: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <Package className="w-3 h-3" /> },
            completed: { color: 'bg-green-100 text-green-800 border-green-300', icon: <CheckCircle className="w-3 h-3" /> },
            cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: <XCircle className="w-3 h-3" /> },
        };

        const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

        return (
            <Badge className={`${config.color} border flex items-center gap-1`}>
                {config.icon}
                {status}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount?: number) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const stats = {
        totalQuotations: quotations.length,
        pendingQuotations: quotations.filter(q => q.status.toLowerCase() === 'pending').length,
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status.toLowerCase() === 'completed').length,
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
                                    <p className="text-gray-600">{user?.email}</p>
                                </div>
                            </div>
                            {/* <Button 
                                onClick={handleLogout}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button> */}
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-blue-100">Total Quotations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-bold">{stats.totalQuotations}</p>
                                    <FileText className="w-8 h-8 text-blue-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-yellow-500 to-yellow-600 text-white">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-yellow-100">Pending Quotations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-bold">{stats.pendingQuotations}</p>
                                    <Clock className="w-8 h-8 text-yellow-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-purple-100">Total Orders</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                                    <ShoppingCart className="w-8 h-8 text-purple-200" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-linear-to-br from-green-500 to-green-600 text-white">
                            <CardHeader className="pb-2">
                                <CardDescription className="text-green-100">Completed Orders</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-bold">{stats.completedOrders}</p>
                                    <TrendingUp className="w-8 h-8 text-green-200" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}

                    {/* Tabs for Quotations and Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Tabs defaultValue="quotations" className="space-y-4">
                            <TabsList className="bg-white">
                                <TabsTrigger value="quotations" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    My Quotations
                                </TabsTrigger>
                                <TabsTrigger value="orders" className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" />
                                    My Orders
                                </TabsTrigger>
                            </TabsList>

                            {/* Quotations Tab */}
                            <TabsContent value="quotations" className="space-y-4">
                                {quotations.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center">
                                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Quotations Yet</h3>
                                            <p className="text-gray-500">You haven&apos;t requested any quotations.</p>
                                            <Button className="mt-4" onClick={() => router.push('/quotation-form')}>
                                                Request a Quotation
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    quotations.map((quotation, index) => (
                                        <motion.div
                                            key={quotation.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Card className="hover:shadow-lg transition-shadow">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg">
                                                                Quotation #{quotation.quotation_number}
                                                            </CardTitle>
                                                            <CardDescription>
                                                                {quotation.company_name} • {formatDate(quotation.created_at)}
                                                            </CardDescription>
                                                        </div>
                                                        {getStatusBadge(quotation.status)}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-500">Contact Person</p>
                                                            <p className="font-medium">{quotation.contact_person}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Email</p>
                                                            <p className="font-medium">{quotation.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Phone</p>
                                                            <p className="font-medium">{quotation.phone}</p>
                                                        </div>
                                                        {quotation.total_amount && (
                                                            <div>
                                                                <p className="text-gray-500">Total Amount</p>
                                                                <p className="font-medium text-green-600">
                                                                    {formatCurrency(quotation.total_amount)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm mb-1">Project Details</p>
                                                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                                                            {quotation.project_details}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <Button variant="outline" size="sm">
                                                            View Details
                                                        </Button>
                                                        {quotation.status.toLowerCase() === 'approved' && (
                                                            <Button size="sm">
                                                                Place Order
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </TabsContent>

                            {/* Orders Tab */}
                            <TabsContent value="orders" className="space-y-4">
                                {orders.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center">
                                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                                            <p className="text-gray-500">You haven&apos;t placed any orders.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    orders.map((order, index) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Card className="hover:shadow-lg transition-shadow">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg">
                                                                Order #{order.order_number}
                                                            </CardTitle>
                                                            <CardDescription>
                                                                {formatDate(order.created_at)}
                                                                {order.delivery_date && ` • Delivery: ${formatDate(order.delivery_date)}`}
                                                            </CardDescription>
                                                        </div>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-500">Customer Name</p>
                                                            <p className="font-medium">{order.customer_name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Email</p>
                                                            <p className="font-medium">{order.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Phone</p>
                                                            <p className="font-medium">{order.phone}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Quantity</p>
                                                            <p className="font-medium">{order.quantity} units</p>
                                                        </div>
                                                        {order.total_amount && (
                                                            <div className="col-span-2">
                                                                <p className="text-gray-500">Total Amount</p>
                                                                <p className="text-xl font-bold text-green-600">
                                                                    {formatCurrency(order.total_amount)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-sm mb-1">Product Details</p>
                                                        <p className="text-sm bg-gray-50 p-3 rounded-md">
                                                            {order.product_details}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <Button variant="outline" size="sm">
                                                            Track Order
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            Download Invoice
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
}
