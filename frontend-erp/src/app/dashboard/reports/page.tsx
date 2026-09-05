'use client';

import React, { useState, useEffect } from 'react';
import { reportService } from '@/services/reportService';
import Loader from '@/components/loader';
import ReportChart from '@/components/erp/report-chart';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'warranty'>('sales');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    // Sales Report State
    const [dateRange, setDateRange] = useState('month'); // week, month, year

    useEffect(() => {
        loadReportData();
    }, [activeTab, dateRange]);

    const loadReportData = async () => {
        setLoading(true);
        setData(null);
        try {
            if (activeTab === 'sales') {
                const res = await reportService.getSalesSummary({ interval: dateRange });
                setData(res.data || res);
            } else if (activeTab === 'inventory') {
                const res = await reportService.getInventoryValuation();
                setData(res.data || res);
            } else if (activeTab === 'warranty') {
                const res = await reportService.getWarrantyExpiry({ period: '30' });
                setData(res.data || res);
            }
        } catch (error) {
            console.error('Failed to load report data', error);
        } finally {
            setLoading(false);
        }
    };

    const renderSalesSummary = () => {
        if (!data) return null;
        
        // Transform daily/monthly data for chart (mock format from backend)
        const chartData = data.chart_data || [
            { label: 'Week 1', value: 150000 },
            { label: 'Week 2', value: 320000 },
            { label: 'Week 3', value: 210000 },
            { label: 'Week 4', value: 450000 },
        ];

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Sales Summary</h2>
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                        <p className="text-2xl font-bold text-gray-900">Rs. {Number(data.total_sales || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500 font-medium">Invoices</p>
                        <p className="text-2xl font-bold text-gray-900">{data.invoice_count || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                        <p className="text-sm text-green-600 font-medium">Payments Received</p>
                        <p className="text-2xl font-bold text-green-700">Rs. {Number(data.payments_received || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                        <p className="text-sm text-red-500 font-medium">Outstanding</p>
                        <p className="text-2xl font-bold text-red-600">Rs. {Number(data.outstanding || 0).toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-6">Revenue Trend</h3>
                    <ReportChart data={chartData} color="bg-blue-500" />
                </div>
                
                {data.top_products && (
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Selling Products</h3>
                        <div className="space-y-3">
                            {data.top_products.map((prod: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                                        <span className="font-medium text-gray-900">{prod.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-500 mr-4">{prod.quantity_sold} units</span>
                                        <span className="font-semibold text-gray-900">Rs. {Number(prod.revenue).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderStockValuation = () => {
        if (!data) return null;
        
        const items = data.items || [];
        
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Stock Valuation Report</h2>
                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm">
                        Export CSV
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500 font-medium">Total SKUs</p>
                        <p className="text-2xl font-bold text-gray-900">{data.total_skus || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm md:col-span-2">
                        <p className="text-sm text-blue-600 font-medium">Total Stock Value</p>
                        <p className="text-2xl font-bold text-blue-700">Rs. {Number(data.total_value || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-yellow-100 shadow-sm">
                        <p className="text-sm text-yellow-600 font-medium">Low Stock Items</p>
                        <p className="text-2xl font-bold text-yellow-700">{data.low_stock_count || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Price (Rs)</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Stock</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Total Value (Rs)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {items.length > 0 ? items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600 text-right">{Number(item.price).toLocaleString()}</td>
                                        <td className="px-6 py-3 text-sm font-bold text-gray-900 text-center">{item.stock_quantity}</td>
                                        <td className="px-6 py-3 text-sm font-semibold text-blue-600 text-right">
                                            {(Number(item.price) * Number(item.stock_quantity)).toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                                            No inventory items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderWarrantyExpiry = () => {
        if (!data) return null;
        
        const warranties = data.expiring_warranties || [];
        
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Warranty Expiry Alerts</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Period:</span>
                        <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white">
                            <option value="30">Next 30 days</option>
                            <option value="60">Next 60 days</option>
                            <option value="90">Next 90 days</option>
                        </select>
                    </div>
                </div>
                
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                        <h4 className="text-sm font-bold text-red-800">{warranties.length} warranties expiring soon</h4>
                        <p className="text-sm text-red-600 mt-1">Recommendation: Contact these clients for warranty renewal or offer a maintenance contract upsell.</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product & S/N</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Expiry Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {warranties.length > 0 ? warranties.map((w: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{w.client_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{w.product_name}</div>
                                        <div className="text-xs text-gray-500">S/N: {w.serial_number}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-red-600 text-right">
                                        {new Date(w.expiry_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200">
                                            Send Reminder
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                                        No warranties expiring in the selected period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1">Key metrics and insights for your business.</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print Report
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'sales'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Sales Summary
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'inventory'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Stock Valuation
                    </button>
                    <button
                        onClick={() => setActiveTab('warranty')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'warranty'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Warranty Expiry
                    </button>
                </nav>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader size={48} />
                    </div>
                ) : (
                    <>
                        {activeTab === 'sales' && renderSalesSummary()}
                        {activeTab === 'inventory' && renderStockValuation()}
                        {activeTab === 'warranty' && renderWarrantyExpiry()}
                    </>
                )}
            </div>
        </div>
    );
}
