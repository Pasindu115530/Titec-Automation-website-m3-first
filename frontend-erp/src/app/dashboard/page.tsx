'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ClipboardList,
    Users,
    MoreHorizontal,
    ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dashboardService, DashboardStats } from '@/services/dashboardService';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

export default function AdminDashboard() {
    const { user, isAdmin, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isAuthLoading) return;
        if (!isAdmin) {
            router.push('/dashboard/login');
            return;
        }
        loadDashboardData();
    }, [isAdmin, isAuthLoading, router]);

    const loadDashboardData = async () => {
        try {
            setIsDataLoading(true);
            const data = await dashboardService.getStats();
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard statistics:', error);
        } finally {
            setIsDataLoading(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        );
    }

    // Colors matching the Starline design
    const colors = {
        orange: '#F59E0B',
        purple: '#8B5CF6',
        cyan: '#06B6D4',
        lime: '#D7FC45',
        green: '#10B981',
    };

    const overview = dashboardData?.sales_overview || {
        revenue: { value: '$85,500', change: '+10.5%', isPositive: true },
        orders: { value: '1000', change: '+10.5%', isPositive: true },
        customers: { value: '300', change: '+10.5%', isPositive: true },
        sales_metrics: {
            total: '9,586',
            this_month: '9,586',
            today: '9,586',
            change: '+20% increased',
            isPositive: true,
        },
    };

    const ordersChartData = dashboardData?.orders_chart || [
        { month: 'Jan', orders: 12, profit: 24 },
        { month: 'Feb', orders: 20, profit: 31 },
        { month: 'Mar', orders: 35, profit: 16 },
        { month: 'Apr', orders: 60, profit: 47 },
        { month: 'May', orders: 40, profit: 34 },
        { month: 'Jun', orders: 68, profit: 21 },
        { month: 'Jul', orders: 46, profit: 35 },
        { month: 'Aug', orders: 72, profit: 44 },
        { month: 'Sep', orders: 86, profit: 41 },
        { month: 'Oct', orders: 62, profit: 58 },
    ];

    const purchaseChartData = dashboardData?.purchase_analytics || [
        { month: 'Jan', sold: 45, purchased: 60 },
        { month: 'Feb', sold: 55, purchased: 40 },
        { month: 'Mar', sold: 70, purchased: 85 },
        { month: 'Apr', sold: 80, purchased: 75 },
        { month: 'May', sold: 65, purchased: 90 },
        { month: 'Jun', sold: 90, purchased: 70 },
        { month: 'Jul', sold: 75, purchased: 85 },
        { month: 'Aug', sold: 85, purchased: 95 },
        { month: 'Sep', sold: 95, purchased: 80 },
        { month: 'Oct', sold: 88, purchased: 92 },
    ];

    const donutData = [
        { name: 'Returned', value: 70, color: colors.cyan },
        { name: 'Completed', value: 20, color: colors.orange },
        { name: 'Distributed', value: 10, color: colors.purple },
    ];

    const topProducts = dashboardData?.top_products || [
        { name: 'Realistic', code: '8812', avatarBg: 'bg-gradient-to-tr from-purple-400 to-pink-400' },
        { name: 'Monstera', code: '8832', avatarBg: 'bg-gradient-to-tr from-indigo-800 to-purple-900' },
        { name: 'Product', code: '9871', avatarBg: 'bg-gradient-to-tr from-amber-500 to-orange-600' },
        { name: 'Product', code: '2211', avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-700' },
    ];

    const recentRequests = dashboardData?.recent_requests || [];

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'quoted':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'reviewed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Grid: Left (Sales Overview) & Right (Orders Overview, Analytics, Top Products) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* ── LEFT COLUMN (4 of 12 cols on desktop) ── */}
                <div className="lg:col-span-4 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-4">
                            Sales Overview
                        </h2>

                        {/* 1. Total Revenue Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#FFF4E8]/90 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_10px_30px_rgba(245,158,11,0.06),0_2px_6px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_16px_36px_rgba(245,158,11,0.1)] hover:-translate-y-0.5"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-[#FFE7D1] flex items-center justify-center shrink-0 shadow-2xs">
                                    <span className="text-[#E0781E] font-bold text-lg">$</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
                                        {overview.revenue.value}
                                    </h3>
                                    <p className="text-xs font-medium text-neutral-500 mt-1.5">
                                        Total Revenue
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-1 text-[#10B981] font-semibold text-xs">
                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                <span>{overview.revenue.change}</span>
                                <span className="text-neutral-500 font-normal ml-1">From Last Day</span>
                            </div>
                        </motion.div>

                        {/* 2. Total Orders Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.08 }}
                            className="bg-[#F1EBFF]/90 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_10px_30px_rgba(139,92,246,0.06),0_2px_6px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_16px_36px_rgba(139,92,246,0.1)] hover:-translate-y-0.5 mt-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-[#E2D6FE] flex items-center justify-center shrink-0 shadow-2xs">
                                    <ClipboardList className="w-5 h-5 text-[#7C3AED]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
                                        {overview.orders.value}
                                    </h3>
                                    <p className="text-xs font-medium text-neutral-500 mt-1.5">
                                        Total Orders
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-1 text-[#10B981] font-semibold text-xs">
                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                <span>{overview.orders.change}</span>
                                <span className="text-neutral-500 font-normal ml-1">From Last Day</span>
                            </div>
                        </motion.div>

                        {/* 3. Total Customers Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.16 }}
                            className="bg-[#E6F9F7]/90 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_10px_30px_rgba(6,182,212,0.06),0_2px_6px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_16px_36px_rgba(6,182,212,0.1)] hover:-translate-y-0.5 mt-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-[#C7F3ED] flex items-center justify-center shrink-0 shadow-2xs">
                                    <Users className="w-5 h-5 text-[#0D9488]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
                                        {overview.customers.value}
                                    </h3>
                                    <p className="text-xs font-medium text-neutral-500 mt-1.5">
                                        Total Customers
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-1 text-[#10B981] font-semibold text-xs">
                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                <span>{overview.customers.change}</span>
                                <span className="text-neutral-500 font-normal ml-1">From Last Day</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* 4. Sales Metric Card (3 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.22 }}
                        className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">
                            Sales
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <p className="text-[11px] font-medium text-neutral-400">Total Sales</p>
                                <p className="text-xl md:text-2xl font-extrabold text-neutral-900 mt-1 tracking-tight">
                                    {overview.sales_metrics.total}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-neutral-400">This Month</p>
                                <p className="text-xl md:text-2xl font-extrabold text-neutral-900 mt-1 tracking-tight">
                                    {overview.sales_metrics.this_month}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-neutral-400">Today</p>
                                <p className="text-xl md:text-2xl font-extrabold text-neutral-900 mt-1 tracking-tight">
                                    {overview.sales_metrics.today}
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 flex items-center gap-1 text-[#10B981] font-semibold text-xs">
                            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                            <span>{overview.sales_metrics.change}</span>
                        </div>
                    </motion.div>
                </div>

                {/* ── RIGHT COLUMN (8 of 12 cols on desktop) ── */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Orders Overview Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                                Orders Overview
                            </h2>
                            {/* Legend */}
                            <div className="flex items-center gap-5 text-xs font-medium text-neutral-600">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                                    <span>Orders</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                                    <span>Profit</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="h-64 w-full relative">
                            {/* Peak indicator badge matching design */}
                            <div className="absolute top-16 left-[58%] -translate-x-1/2 z-10 hidden sm:flex flex-col items-center pointer-events-none">
                                <div className="bg-[#D7FC45] text-neutral-950 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs">
                                    21,345
                                </div>
                                <div className="w-px h-16 bg-neutral-200 border-l border-dashed border-neutral-400/80" />
                            </div>

                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                                    <LineChart data={ordersChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                            tickFormatter={(val) => `${val}k`}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: '16px',
                                                border: '1px solid #F3F4F6',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                                fontSize: '12px',
                                            }}
                                            formatter={(value: any, name: any) => [`${value}k`, name === 'orders' ? 'Orders' : 'Profit']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#F59E0B"
                                            strokeWidth={2.5}
                                            dot={false}
                                            activeDot={{ r: 5, fill: '#F59E0B', stroke: '#FFF', strokeWidth: 2 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="profit"
                                            stroke="#8B5CF6"
                                            strokeWidth={2.5}
                                            dot={false}
                                            activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#FFF', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                                    Loading chart...
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Middle Two-Card Row: Sale Analytics & Top Products */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Sale Analytics Card with Donut Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.18 }}
                            className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                        >
                            <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-2">
                                Sale Analytics
                            </h3>

                            {/* Donut and Callouts */}
                            <div className="relative h-56 flex items-center justify-center my-2">
                                {isMounted ? (
                                    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                                        <PieChart>
                                            <Pie
                                                data={donutData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={88}
                                                paddingAngle={4}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {donutData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : null}

                                {/* Center Donut Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                                        100%
                                    </span>
                                    <span className="text-[11px] font-medium text-neutral-400">
                                        Completed
                                    </span>
                                </div>

                                {/* Callout Badges with pointer labels */}
                                <div className="absolute top-2 right-4 text-right">
                                    <span className="text-xs font-bold text-[#F59E0B]">20%</span>
                                    <p className="text-[10px] text-neutral-400">Completed</p>
                                </div>
                                <div className="absolute bottom-6 right-2 text-right">
                                    <span className="text-xs font-bold text-[#8B5CF6]">10%</span>
                                    <p className="text-[10px] text-neutral-400">Distributed</p>
                                </div>
                                <div className="absolute bottom-6 left-2 text-left">
                                    <span className="text-xs font-bold text-[#06B6D4]">70%</span>
                                    <p className="text-[10px] text-neutral-400">Returned</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Products Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.24 }}
                            className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                                        Top Products
                                    </h3>
                                    <Link
                                        href="/dashboard/products"
                                        className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                                    >
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs font-medium text-neutral-400 px-2 pb-2 border-b border-neutral-100">
                                        <span>Product</span>
                                        <span>Code</span>
                                    </div>

                                    {topProducts.map((prod, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full ${prod.avatarBg} flex items-center justify-center text-xs text-white font-bold shadow-2xs`}>
                                                    {prod.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-semibold text-neutral-800">
                                                    {prod.name}
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-neutral-500">
                                                {prod.code}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM FULL-WIDTH: Purchase Analytics ── */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.28 }}
                className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                        Purchase Analytics
                    </h3>
                    <div className="flex items-center gap-5 text-xs font-medium text-neutral-600">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                            <span>Sold</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                            <span>Purchased</span>
                        </div>
                    </div>
                </div>

                <div className="h-64 w-full">
                    {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                            <BarChart data={purchaseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                    tickFormatter={(val) => `${val}k`}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '16px',
                                        border: '1px solid #F3F4F6',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        fontSize: '12px',
                                    }}
                                    formatter={(value: any, name: any) => [`${value}k`, name === 'sold' ? 'Sold' : 'Purchased']}
                                />
                                <Bar dataKey="sold" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={32} />
                                <Bar dataKey="purchased" fill="#06B6D4" radius={[6, 6, 0, 0]} maxBarSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                            Loading chart...
                        </div>
                    )}
                </div>
            </motion.div>

            {/* ── RECENT INQUIRIES & ACTIONS (Preserving Administrative Power) ── */}
            {recentRequests.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.32 }}
                    className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                                Recent Quotation Requests
                            </h3>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Latest inquiries from store customers
                            </p>
                        </div>
                        <Link
                            href="/dashboard/quotations"
                            className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 transition-colors"
                        >
                            <span>View All</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-neutral-100 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-3">ID</th>
                                    <th className="py-3 px-3">Customer</th>
                                    <th className="py-3 px-3">Date</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3 text-right">Amount</th>
                                    <th className="py-3 px-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-sm">
                                {recentRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-neutral-50/60 transition-colors">
                                        <td className="py-3 px-3 font-semibold text-neutral-900">#{req.id}</td>
                                        <td className="py-3 px-3">
                                            <div className="font-semibold text-neutral-800">{req.customer || 'Guest'}</div>
                                            <div className="text-xs text-neutral-400">{req.email}</div>
                                        </td>
                                        <td className="py-3 px-3 text-xs text-neutral-500">{req.date}</td>
                                        <td className="py-3 px-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-right font-bold text-neutral-900">
                                            {req.amount !== '-' ? `$${req.amount}` : '-'}
                                        </td>
                                        <td className="py-3 px-3 text-right">
                                            <Link
                                                href={`/dashboard/quotations`}
                                                className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
