'use client';
import React, { useState } from 'react';
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
    MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Sales', value: '$24,560', change: '+12%', icon: DollarSign, trend: 'up' },
        { label: 'Active Orders', value: '45', change: '+5%', icon: ShoppingBag, trend: 'up' },
        { label: 'New Customers', value: '128', change: '-2%', icon: Users, trend: 'down' },
        { label: 'Pending Requests', value: '12', change: '+8%', icon: Activity, trend: 'up' },
    ];

    const orders = [
        { id: '#ORD-7234', customer: 'John Doe', date: 'Oct 24, 2024', amount: '$1,299.00', status: 'Pending', items: 3 },
        { id: '#ORD-7235', customer: 'Jane Smith', date: 'Oct 23, 2024', amount: '$549.50', status: 'Completed', items: 1 },
        { id: '#ORD-7236', customer: 'Robert Johnson', date: 'Oct 23, 2024', amount: '$2,300.00', status: 'Processing', items: 5 },
        { id: '#ORD-7237', customer: 'Emily Davis', date: 'Oct 22, 2024', amount: '$85.00', status: 'Cancelled', items: 2 },
        { id: '#ORD-7238', customer: 'Michael Wilson', date: 'Oct 21, 2024', amount: '$450.00', status: 'Completed', items: 1 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };


    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <Button>Download Report</Button>
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
                        <Card className="hover:shadow-md transition-shadow">
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
                        <CardTitle>Recent Orders</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">Manage your latest transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input placeholder="Search orders..." className="pl-9 w-[200px]" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-indigo-600">{order.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                {order.customer.charAt(0)}
                                            </div>
                                            {order.customer}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">{order.amount}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
