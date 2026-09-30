'use client';

import React, { useState } from 'react';
import { serviceLogService } from '@/services/serviceLogService';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    Search,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    AlertTriangle,
    Package,
    User,
    Calendar,
    FileText,
    ExternalLink,
    Wrench,
    ClipboardList,
    RotateCcw,
} from 'lucide-react';

export default function WarrantyCheckerPage() {
    const [serialNumber, setSerialNumber] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [warrantyData, setWarrantyData] = useState<any>(null);
    const [hasChecked, setHasChecked] = useState(false);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!serialNumber.trim()) {
            toast.error('Please enter a serial number.');
            return;
        }

        setIsChecking(true);
        setHasChecked(true);
        try {
            const data = await serviceLogService.checkWarranty(serialNumber.trim());
            setWarrantyData(data.data || data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                setWarrantyData({ error: error.response?.data?.message || 'Serial number not found or no warranty records available.' });
            } else {
                toast.error('Failed to check warranty status.');
                setWarrantyData(null);
            }
        } finally {
            setIsChecking(false);
        }
    };

    const handleReset = () => {
        setSerialNumber('');
        setHasChecked(false);
        setWarrantyData(null);
    };

    const isActive = Boolean(
        warrantyData &&
        !warrantyData.error &&
        (warrantyData.is_under_warranty || warrantyData.status === 'active' || warrantyData.is_valid)
    );

    const productName = warrantyData?.product_name || warrantyData?.product?.name || 'N/A';
    const clientName = typeof warrantyData?.client === 'object'
        ? (warrantyData.client?.company_name || warrantyData.client?.contact_person || warrantyData.client?.contact_name || 'N/A')
        : (warrantyData?.client_name || 'N/A');
    const purchaseDate = warrantyData?.warranty_start_date || warrantyData?.purchase_date;
    const expiryDate = warrantyData?.warranty_end_date || warrantyData?.expiry_date;
    const invoiceNumber = warrantyData?.invoice_number || warrantyData?.invoice?.invoice_number || 'N/A';
    const daysRemaining = warrantyData?.days_remaining;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Top Header matching Quotations & Service Logs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                        Warranty Checker
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">
                        Verify product warranty status, coverage periods, and service records
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Link
                        href="/dashboard/service-logs"
                        className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                        <ClipboardList className="h-4 w-4 text-purple-700" />
                        View Service Logs
                    </Link>
                </div>
            </div>

            {/* Main Glassmorphic Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden">
                {/* Search Form Header */}
                <div className="p-6 md:p-8 bg-white/50 backdrop-blur-md border-b border-neutral-200/70">
                    <form onSubmit={handleCheck} className="max-w-2xl mx-auto space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                Serial Verification
                            </span>
                            <label htmlFor="serialNumber" className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                                Product Serial Number / Invoice Reference
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    id="serialNumber"
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value)}
                                    placeholder="Enter S/N (e.g. SN-2026-10492)"
                                    className="w-full pl-11 pr-10 h-12 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus:outline-none transition-all text-sm font-semibold"
                                />
                                {serialNumber && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 rounded-full transition-colors cursor-pointer"
                                        title="Clear input"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isChecking || !serialNumber.trim()}
                                className="h-12 px-6 bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 text-sm"
                            >
                                <Search className="h-4 w-4 stroke-[2.5]" />
                                {isChecking ? 'Checking...' : 'Check Status'}
                            </button>
                        </div>

                        <div className="flex items-center gap-2 pt-1 text-xs text-neutral-500 font-medium">
                            <span className="font-semibold text-neutral-700">Tip:</span>
                            <span>Barcode labels and receipt references can be used to query warranty records.</span>
                        </div>
                    </form>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-10 min-h-[320px] flex items-center justify-center">
                    {/* Initial State */}
                    {!hasChecked && !isChecking && (
                        <div className="py-12 px-4 text-center max-w-md mx-auto">
                            <div className="h-16 w-16 rounded-3xl bg-[#F1EBFF] border border-white/80 shadow-2xs flex items-center justify-center text-[#7C3AED] mx-auto mb-4">
                                <ShieldCheck className="h-8 w-8 text-[#7C3AED]" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Ready to Verify Warranty</h3>
                            <p className="text-sm text-neutral-500 mt-1.5 font-medium leading-relaxed">
                                Enter a serial number or invoice reference above to verify product coverage, validity dates, and service records.
                            </p>
                        </div>
                    )}

                    {/* Loading State with Titec Loader */}
                    {isChecking && (
                        <div className="py-12 text-center w-full">
                            <Loader variant="inline" size={90} text="Querying warranty records..." />
                        </div>
                    )}

                    {/* Error / Not Found State */}
                    {hasChecked && !isChecking && warrantyData?.error && (
                        <div className="w-full max-w-lg mx-auto py-6">
                            <div className="p-8 rounded-3xl bg-[#FFF1F2]/80 backdrop-blur-md border border-rose-200/80 shadow-[0_8px_30px_rgba(244,63,94,0.06)] text-center animate-in fade-in zoom-in-95 duration-200">
                                <div className="h-16 w-16 rounded-3xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                                    <ShieldAlert className="h-8 w-8 text-rose-600" />
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs mb-2">
                                    Not Found
                                </span>
                                <h3 className="text-xl font-bold text-neutral-900 tracking-tight">No Warranty Record Found</h3>
                                <p className="text-sm text-neutral-600 mt-2 font-medium leading-relaxed">
                                    {warrantyData.error || 'The entered serial number is not associated with any active warranty records.'}
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="px-5 py-2.5 bg-white text-neutral-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-200/80 shadow-2xs hover:bg-neutral-50 transition-all cursor-pointer"
                                    >
                                        Try Another Serial
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Warranty Result Details */}
                    {hasChecked && !isChecking && warrantyData && !warrantyData.error && (
                        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
                            <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                                {/* Status Banner */}
                                <div className={`p-6 sm:p-8 text-center border-b ${
                                    isActive
                                        ? 'bg-gradient-to-r from-emerald-500/10 via-[#DCFCE7]/70 to-emerald-500/10 border-emerald-200/60'
                                        : 'bg-gradient-to-r from-amber-500/10 via-[#FEF3C7]/70 to-amber-500/10 border-amber-200/60'
                                }`}>
                                    <div className="flex justify-center mb-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs ${
                                            isActive
                                                ? 'bg-[#DCFCE7] text-[#15803D] border border-emerald-300'
                                                : 'bg-[#FEF3C7] text-[#B45309] border border-amber-300'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            {isActive ? 'Active Coverage' : 'Warranty Expired'}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center justify-center gap-2">
                                        {isActive ? (
                                            <>
                                                <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
                                                <span>Warranty Active</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-7 w-7 text-amber-600 shrink-0" />
                                                <span>Warranty Expired</span>
                                            </>
                                        )}
                                    </h2>

                                    {daysRemaining !== undefined && daysRemaining !== null && isActive && (
                                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mt-2">
                                            {daysRemaining > 0 ? `${daysRemaining} days remaining in coverage` : 'Valid warranty coverage'}
                                        </p>
                                    )}
                                    {!isActive && expiryDate && (
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mt-2">
                                            Coverage ended on {new Date(expiryDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                {/* Details Grid */}
                                <div className="p-6 sm:p-8 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        {/* Product */}
                                        <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xs">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-2xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                                <Package className="h-3 w-3 mr-1" />
                                                Product
                                            </span>
                                            <p className="text-base font-bold text-neutral-900 mt-2 truncate">
                                                {productName}
                                            </p>
                                        </div>

                                        {/* Client */}
                                        <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xs">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-2xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                                <User className="h-3 w-3 mr-1" />
                                                Client
                                            </span>
                                            <p className="text-base font-bold text-neutral-900 mt-2 truncate">
                                                {clientName}
                                            </p>
                                        </div>

                                        {/* Purchase / Start Date */}
                                        <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xs">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-2xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                Start Date
                                            </span>
                                            <p className="text-base font-bold text-neutral-900 mt-2">
                                                {purchaseDate ? new Date(purchaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                            </p>
                                        </div>

                                        {/* Expiry Date */}
                                        <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xs">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-2xs font-bold uppercase tracking-wider bg-[#F6FFD3] text-[#4D6300] border border-[#E9FF7A]/80 shadow-2xs">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                Expiry Date
                                            </span>
                                            <p className="text-base font-bold text-neutral-900 mt-2">
                                                {expiryDate ? new Date(expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Invoice Reference Bar */}
                                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-9 w-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-2xs font-bold uppercase tracking-wider text-neutral-500">Invoice Reference</p>
                                                <p className="text-sm font-extrabold text-neutral-900">{invoiceNumber}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/dashboard/invoices"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-neutral-200/80 shadow-2xs transition-all w-fit"
                                        >
                                            <span>View Invoices</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="pt-4 border-t border-neutral-200/60 flex flex-wrap items-center justify-center gap-3">
                                        <Link
                                            href="/dashboard/service-logs"
                                            className="h-11 px-6 bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-sm"
                                        >
                                            <Wrench className="h-4 w-4" />
                                            Create Service Log
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                                        >
                                            <RotateCcw className="h-4 w-4 text-neutral-500" />
                                            Check Another
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
