'use client';

import React, { useState } from 'react';
import { serviceLogService } from '@/services/serviceLogService';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';

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
        <div className="space-y-6">
            {/* Top Header matching Quotations & Activity Logs */}
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
                        <ClipboardList className="h-4 w-4 text-[#7C3AED]" />
                        View Service Logs
                    </Link>
                </div>
            </div>

            {/* Search Form Pill Container (Quotation Filter Bar Style) */}
            <div className="bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <form onSubmit={handleCheck} className="flex gap-3 items-center w-full">
                    <div className="relative flex-1 w-full flex items-center">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            type="text"
                            id="serialNumber"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            placeholder="Search by serial number, invoice reference, or product code..."
                            className="w-full pl-10 pr-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
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

                    <Button
                        type="submit"
                        disabled={isChecking || !serialNumber.trim()}
                        className="h-11 px-6 bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 text-sm"
                    >
                        <Search className="h-4 w-4 stroke-[2.5]" />
                        {isChecking ? 'Checking...' : 'Check Status'}
                    </Button>
                </form>
            </div>

            {/* Main Content Card */}
            <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden">
                {/* Initial State - Simple & Clean */}
                {!hasChecked && !isChecking && (
                    <div className="py-20 px-4 text-center max-w-sm mx-auto">
                        <ShieldCheck className="mx-auto h-12 w-12 text-neutral-400 stroke-[1.5]" />
                        <h3 className="mt-4 text-base font-bold text-neutral-900">No Serial Number Entered</h3>
                        <p className="mt-1 text-sm text-neutral-500 font-medium">
                            Enter a serial number or invoice reference above to verify warranty coverage.
                        </p>
                    </div>
                )}

                {/* Loading State with Titec Loader */}
                {isChecking && (
                    <div className="py-20 text-center w-full">
                        <Loader variant="inline" size={80} text="Verifying warranty records..." />
                    </div>
                )}

                {/* Error / Not Found State */}
                {hasChecked && !isChecking && warrantyData?.error && (
                    <div className="py-16 px-4 text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
                        <ShieldAlert className="mx-auto h-12 w-12 text-rose-500 stroke-[1.5]" />
                        <h3 className="mt-4 text-base font-bold text-neutral-900">No Warranty Record Found</h3>
                        <p className="mt-1 text-sm text-neutral-500 font-medium">
                            {warrantyData.error || 'The entered serial number is not associated with any active warranty records.'}
                        </p>
                        <div className="mt-5 flex justify-center">
                            <Button
                                type="button"
                                onClick={handleReset}
                                variant="outline"
                                className="h-10 px-5 bg-white/80 hover:bg-white text-neutral-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-white/80 shadow-xs transition-all cursor-pointer"
                            >
                                Try Another Serial
                            </Button>
                        </div>
                    </div>
                )}

                {/* Warranty Result Details */}
                {hasChecked && !isChecking && warrantyData && !warrantyData.error && (
                    <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                        {/* Status Banner */}
                        <div className={cn(
                            "p-6 sm:p-8 text-center border-b transition-all",
                            isActive
                                ? "bg-gradient-to-r from-[#E6F9F7]/70 via-white/80 to-[#E6F9F7]/70 border-[#0D9488]/20"
                                : "bg-gradient-to-r from-[#FFF4E8]/70 via-white/80 to-[#FFF4E8]/70 border-[#E0781E]/20"
                        )}>
                            <div className="flex justify-center mb-3">
                                <span className={cn(
                                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs border",
                                    isActive
                                        ? "bg-[#E6F9F7] text-[#0D9488] border-[#0D9488]/30"
                                        : "bg-[#FFF4E8] text-[#E0781E] border-[#E0781E]/30"
                                )}>
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                                    )} />
                                    {isActive ? 'Active Coverage' : 'Warranty Expired'}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center justify-center gap-2.5">
                                {isActive ? (
                                    <>
                                        <CheckCircle2 className="h-7 w-7 text-emerald-600 shrink-0" />
                                        <span>Warranty Active</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="h-7 w-7 text-[#E0781E] shrink-0" />
                                        <span>Warranty Expired</span>
                                    </>
                                )}
                            </h2>

                            {daysRemaining !== undefined && daysRemaining !== null && isActive && (
                                <div className="mt-2.5">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-[#0D9488]/20">
                                        {daysRemaining > 0 ? `${daysRemaining} days remaining in coverage` : 'Valid warranty coverage'}
                                    </span>
                                </div>
                            )}
                            {!isActive && expiryDate && (
                                <div className="mt-2.5">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-[#E0781E]/20">
                                        Coverage ended on {new Date(expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Details Grid & Actions */}
                        <div className="p-6 sm:p-8 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                {/* Product */}
                                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white/80 shadow-2xs">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                        <Package className="h-3 w-3 mr-1" />
                                        Product
                                    </span>
                                    <p className="text-base font-bold text-neutral-900 mt-2 truncate">
                                        {productName}
                                    </p>
                                </div>

                                {/* Client */}
                                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white/80 shadow-2xs">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                        <User className="h-3 w-3 mr-1" />
                                        Client
                                    </span>
                                    <p className="text-base font-bold text-neutral-900 mt-2 truncate">
                                        {clientName}
                                    </p>
                                </div>

                                {/* Purchase / Start Date */}
                                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white/80 shadow-2xs">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        Start Date
                                    </span>
                                    <p className="text-base font-bold text-neutral-900 mt-2">
                                        {purchaseDate ? new Date(purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>

                                {/* Expiry Date */}
                                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white/80 shadow-2xs">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        Expiry Date
                                    </span>
                                    <p className="text-base font-bold text-neutral-900 mt-2">
                                        {expiryDate ? new Date(expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Invoice Reference Bar */}
                            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-white/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-[#F1EBFF] flex items-center justify-center text-[#7C3AED] border border-white/80 shadow-2xs shrink-0">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Invoice Reference</p>
                                        <p className="text-sm font-extrabold text-neutral-900 font-mono">#{invoiceNumber}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard/invoices"
                                    className="bg-sky-200/90 hover:bg-sky-300 text-sky-950 font-semibold text-xs px-3.5 h-8 rounded-xl border border-white/80 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1.5 w-fit"
                                >
                                    <span>View Invoices</span>
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-3 border-t border-neutral-200/60 flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href="/dashboard/service-logs"
                                    className="h-11 px-6 bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-sm"
                                >
                                    <Wrench className="h-4 w-4 stroke-[2.2]" />
                                    Create Service Log
                                </Link>
                                <Button
                                    type="button"
                                    onClick={handleReset}
                                    variant="outline"
                                    className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                                >
                                    <RotateCcw className="h-4 w-4 text-[#7C3AED]" />
                                    Check Another Serial
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
