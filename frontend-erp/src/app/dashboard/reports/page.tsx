'use client';

import React, { useState, useEffect, useRef } from 'react';
import { reportService } from '@/services/reportService';
import Loader from '@/components/loader';
import ReportChart from '@/components/erp/report-chart';
import { Input } from '@/components/ui/input';
import { Printer, Download, AlertTriangle, Search, Package, Coins, TrendingUp, AlertCircle, FileText, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'warranty'>('sales');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [stockSearch, setStockSearch] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchWrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">Sales Summary</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">Aggregated revenue, invoice counts, and payment collection rates</p>
                    </div>
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="h-10 px-4 bg-white/80 dark:bg-[#0F172A] hover:bg-white dark:hover:bg-[#1E293B] text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 backdrop-blur-md rounded-2xl font-semibold text-sm shadow-xs transition-all outline-none cursor-pointer"
                    >
                        <option value="week" className="dark:bg-[#0F172A] dark:text-white">This Week</option>
                        <option value="month" className="dark:bg-[#0F172A] dark:text-white">This Month</option>
                        <option value="year" className="dark:bg-[#0F172A] dark:text-white">This Year</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Total Sales</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1.5 font-mono">Rs. {Number(data.total_sales || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Invoices</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1.5 font-mono">{data.invoice_count || 0}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-white/10">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Payments Received</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1.5 font-mono">Rs. {Number(data.payments_received || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Outstanding</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1.5 font-mono">Rs. {Number(data.outstanding || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-white mb-6 uppercase tracking-wider">Revenue Trend</h3>
                    <ReportChart data={chartData} color="bg-blue-500" />
                </div>

                {data.top_products && (
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
                        <h3 className="text-sm font-bold text-neutral-800 dark:text-white mb-4 uppercase tracking-wider">Top Selling Products</h3>
                        <div className="space-y-2">
                            {data.top_products.map((prod: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm p-3.5 hover:bg-neutral-100/70 dark:hover:bg-white/[0.04] rounded-2xl transition-colors border border-transparent hover:border-neutral-200/60 dark:hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 flex items-center justify-center font-bold text-xs">{idx + 1}</div>
                                        <span className="font-semibold text-neutral-900 dark:text-white">{prod.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-neutral-500 dark:text-neutral-400 mr-4 font-medium">{prod.quantity_sold} units</span>
                                        <span className="font-bold text-neutral-900 dark:text-white font-mono">Rs. {Number(prod.revenue).toLocaleString()}</span>
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

        const rawItems = data.items || [];
        const items = rawItems.filter((item: any) =>
            !stockSearch.trim() ||
            (item.name || '').toLowerCase().includes(stockSearch.trim().toLowerCase())
        );

        const handleExportCSV = () => {
            if (!rawItems || rawItems.length === 0) return;
            const headers = ['Product', 'Price (Rs)', 'Stock', 'Total Value (Rs)'];
            const rows = rawItems.map((i: any) => [
                `"${(i.name || '').replace(/"/g, '""')}"`,
                i.price || 0,
                i.stock_quantity || 0,
                (Number(i.price || 0) * Number(i.stock_quantity || 0))
            ]);
            const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `stock_valuation_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">Stock Valuation Report</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">Real-time asset valuation and inventory stock distribution</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Total SKUs</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1.5 font-mono">{data.total_skus || 0}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 border border-neutral-200/50 dark:border-white/10">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all sm:col-span-2 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Total Stock Value</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-sky-700 dark:text-sky-300 mt-1.5 font-mono">Rs. {Number(data.total_value || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20">
                            <Coins className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md p-5 rounded-2xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Low Stock Items</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400 mt-1.5 font-mono">{data.low_stock_count || 0}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar - Matching Quotations, Invoices & POS Search Bar Style */}
                <div className="relative z-30 flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 dark:bg-white/[0.03] backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                    <div className="relative z-40 flex-1 w-full" ref={searchWrapperRef}>
                        <div className="relative flex items-center">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Search products by name..."
                                value={stockSearch}
                                onChange={(e) => {
                                    setStockSearch(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                onClick={() => setIsSearchOpen(true)}
                                className="w-full pl-10 pr-9 h-11 bg-white hover:bg-white dark:bg-white/[0.04] dark:hover:bg-white/[0.06] border-white dark:border-white/10 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-2xl shadow-2xs focus:bg-white dark:focus:bg-white/[0.08] focus:border-sky-400 dark:focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-400/20 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                            />
                            {stockSearch ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStockSearch('');
                                        setIsSearchOpen(false);
                                    }}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            ) : null}
                        </div>

                        {/* Quick 4-record dropdown matching other search bars & dark mode */}
                        {isSearchOpen && rawItems.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0F172A] border border-neutral-200/90 dark:border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-50 overflow-hidden p-1.5 modal-scroll max-h-72">
                                <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                                    <span>{stockSearch.trim() ? 'Matching Products' : 'Quick Select Products'}</span>
                                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                                        ({Math.min(items.length, 4)} records)
                                    </span>
                                </div>
                                {items.slice(0, 4).length > 0 ? (
                                    items.slice(0, 4).map((prod: any, idx: number) => (
                                        <div
                                            key={idx}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setStockSearch(prod.name);
                                                setIsSearchOpen(false);
                                            }}
                                            onClick={() => {
                                                setStockSearch(prod.name);
                                                setIsSearchOpen(false);
                                            }}
                                            className="px-3.5 py-2.5 hover:bg-neutral-100/80 dark:hover:bg-white/[0.06] rounded-xl cursor-pointer border-b border-neutral-100 dark:border-white/5 last:border-0 flex justify-between items-center transition-colors group gap-3"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200/70 dark:border-white/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <Package className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                                                        {prod.name}
                                                    </div>
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2 mt-0.5">
                                                        <span className={cn(
                                                            "px-1.5 py-0.2 rounded-full font-semibold text-[10px]",
                                                            Number(prod.stock_quantity || 0) > 0 
                                                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30" 
                                                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/30"
                                                        )}>
                                                            Stock: {prod.stock_quantity ?? 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold text-neutral-900 dark:text-white text-sm font-mono">
                                                    Rs. {Number(prod.price || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                                        No products match &quot;{stockSearch}&quot;
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto pr-0.5 shrink-0">
                        <button 
                            onClick={handleExportCSV}
                            className="h-11 px-5 rounded-2xl bg-white hover:bg-white dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 border border-white dark:border-white/10 backdrop-blur-md font-semibold text-sm shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
                        >
                            <Download className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                <div className="relative z-0 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-white/80 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.3)]">
                    <div className="overflow-x-auto max-h-[540px] modal-scroll">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="bg-white/70 dark:bg-[#0B111E]/95 backdrop-blur-md border-b border-neutral-200/70 dark:border-white/10 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Price (Rs)</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-center">Stock</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Total Value (Rs)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/60 dark:divide-white/5">
                                {items.length > 0 ? items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-neutral-50/70 dark:hover:bg-white/[0.04] transition-colors">
                                        <td className="px-6 py-3.5 text-sm font-semibold text-neutral-900 dark:text-white">{item.name}</td>
                                        <td className="px-6 py-3.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 text-right font-mono">
                                            {Number(item.price || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-center">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border",
                                                Number(item.stock_quantity || 0) > 0 
                                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/30"
                                                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/30"
                                            )}>
                                                {item.stock_quantity ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-sm font-extrabold text-sky-600 dark:text-sky-400 text-right font-mono">
                                            Rs. {(Number(item.price || 0) * Number(item.stock_quantity || 0)).toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-neutral-400 dark:text-neutral-500 text-sm font-medium">
                                            {stockSearch ? 'No inventory products match your search.' : 'No inventory items found.'}
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">Warranty Expiry Alerts</h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">Active installations nearing end of warranty coverage</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Period:</span>
                        <select className="h-10 px-4 pr-8 bg-white/80 dark:bg-[#0F172A] hover:bg-white dark:hover:bg-[#1E293B] text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 backdrop-blur-md rounded-2xl font-semibold text-sm shadow-xs transition-all outline-none cursor-pointer">
                            <option value="30" className="dark:bg-[#0F172A] dark:text-white">Next 30 days</option>
                            <option value="60" className="dark:bg-[#0F172A] dark:text-white">Next 60 days</option>
                            <option value="90" className="dark:bg-[#0F172A] dark:text-white">Next 90 days</option>
                        </select>
                    </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/40 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
                    <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">{warranties.length} warranties expiring soon</h4>
                        <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 mt-0.5 font-medium">Recommendation: Contact these clients for warranty renewal or offer a maintenance contract upsell.</p>
                    </div>
                </div>

                <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-white/80 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.3)]">
                    <div className="overflow-x-auto max-h-[540px] modal-scroll">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="bg-white/70 dark:bg-[#0B111E]/95 backdrop-blur-md border-b border-neutral-200/70 dark:border-white/10 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Product & S/N</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Expiry Date</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/60 dark:divide-white/5">
                                {warranties.length > 0 ? warranties.map((w: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/60 dark:hover:bg-white/[0.04] transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-neutral-900 dark:text-white">{w.client_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-neutral-900 dark:text-white">{w.product_name}</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">S/N: {w.serial_number}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-rose-600 dark:text-rose-400 text-right font-mono">
                                            {new Date(w.expiry_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-white bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 px-3.5 py-1.5 rounded-xl transition-all border border-sky-200 dark:border-sky-800/40 shadow-2xs cursor-pointer">
                                                Send Reminder
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-neutral-400 dark:text-neutral-500 text-sm font-medium">
                                            No warranties expiring in the selected period.
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

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">Reports & Analytics</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm font-medium">Key metrics and insights for your business.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-sky-300 hover:bg-sky-400 text-neutral-950 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 dark:text-white dark:border-blue-400/40 dark:shadow-[0_4px_16px_rgba(37,99,235,0.4)] border border-sky-200 rounded-full font-bold transition-all shadow-[0_4px_14px_rgba(125,211,252,0.35)] flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                    <Printer className="w-4 h-4 text-current" />
                    Print Report
                </button>
            </div>

            {/* Tab Navigation (Matching rounded-full elevated pills) */}
            <div className="flex space-x-2 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md p-1.5 rounded-full border border-white/80 dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] w-fit">
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${activeTab === 'sales'
                            ? 'bg-sky-300 text-neutral-950 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 dark:text-white shadow-[0_4px_14px_rgba(125,211,252,0.35)] dark:shadow-[0_4px_14px_rgba(37,99,235,0.4)]'
                            : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.08]'
                        }`}
                >
                    Sales Summary
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${activeTab === 'inventory'
                            ? 'bg-sky-300 text-neutral-950 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 dark:text-white shadow-[0_4px_14px_rgba(125,211,252,0.35)] dark:shadow-[0_4px_14px_rgba(37,99,235,0.4)]'
                            : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.08]'
                        }`}
                >
                    Stock Valuation
                </button>
                <button
                    onClick={() => setActiveTab('warranty')}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${activeTab === 'warranty'
                            ? 'bg-sky-300 text-neutral-950 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 dark:text-white shadow-[0_4px_14px_rgba(125,211,252,0.35)] dark:shadow-[0_4px_14px_rgba(37,99,235,0.4)]'
                            : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.08]'
                        }`}
                >
                    Warranty Expiry
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader variant="inline" size={90} text="Loading reports..." />
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
