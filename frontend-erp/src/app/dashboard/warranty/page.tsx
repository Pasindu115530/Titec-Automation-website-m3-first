'use client';

import React, { useState } from 'react';
import { serviceLogService } from '@/services/serviceLogService';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import Link from 'next/link';

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
            // Based on backend implementation, this would return details if valid, or a not found/expired message
            setWarrantyData(data.data || data); 
        } catch (error: any) {
            if (error.response?.status === 404) {
                setWarrantyData({ error: 'Serial number not found or no warranty records available.' });
            } else {
                toast.error('Failed to check warranty status.');
                setWarrantyData(null);
            }
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Warranty Checker</h1>
                    <p className="text-gray-500 mt-1">Verify product warranty status by serial number.</p>
                </div>
                <Link 
                    href="/dashboard/service-logs"
                    className="px-4 py-2 bg-white/80 border border-white/80 rounded-2xl text-neutral-800 hover:bg-white font-medium transition-all shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
                >
                    View Service Logs
                </Link>
            </div>

            <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] border border-white/80 overflow-hidden">
                <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100">
                    <form onSubmit={handleCheck} className="max-w-2xl mx-auto">
                        <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            Product Serial Number / Invoice Reference
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                id="serialNumber"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                                placeholder="Enter S/N (e.g. SN-2026-10492)"
                                className="flex-1 px-4 py-3 border border-gray-300/80 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs text-lg bg-white/90"
                            />
                            <button
                                type="submit"
                                disabled={isChecking || !serialNumber.trim()}
                                className="px-6 py-3 bg-neutral-900 text-white font-medium rounded-2xl hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 disabled:opacity-50 transition-colors shadow-sm min-w-[140px] flex justify-center items-center"
                            >
                                {isChecking ? 'Checking...' : 'Check Status'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="p-6 md:p-8 min-h-[300px]">
                    {!hasChecked && !isChecking && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p>Enter a serial number above to check its warranty status.</p>
                        </div>
                    )}

                    {isChecking && (
                        <div className="h-full flex flex-col items-center justify-center py-12">
                            <Loader size={48} />
                            <p className="text-gray-500 mt-4">Querying database...</p>
                        </div>
                    )}

                    {hasChecked && !isChecking && warrantyData && (
                        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {warrantyData.error ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                    <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-red-800">No Warranty Found</h3>
                                    <p className="text-red-600 mt-1">{warrantyData.error}</p>
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                                    {/* Status Banner */}
                                    <div className={`p-4 text-center border-b ${
                                        warrantyData.status === 'active' || warrantyData.is_valid
                                            ? 'bg-green-50 border-green-100 text-green-800'
                                            : 'bg-yellow-50 border-yellow-100 text-yellow-800'
                                    }`}>
                                        <div className="flex justify-center mb-2">
                                            {warrantyData.status === 'active' || warrantyData.is_valid ? (
                                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            ) : (
                                                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold uppercase tracking-wide">
                                            {warrantyData.status === 'active' || warrantyData.is_valid ? 'Warranty Active' : 'Warranty Expired'}
                                        </h3>
                                    </div>
                                    
                                    {/* Details */}
                                    <div className="p-6">
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Product</dt>
                                                <dd className="mt-1 text-base font-medium text-gray-900">{warrantyData.product_name || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Client</dt>
                                                <dd className="mt-1 text-base text-gray-900">{warrantyData.client_name || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                                                <dd className="mt-1 text-base text-gray-900">
                                                    {warrantyData.purchase_date ? new Date(warrantyData.purchase_date).toLocaleDateString() : 'N/A'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                                                <dd className="mt-1 text-base text-gray-900 font-semibold">
                                                    {warrantyData.expiry_date ? new Date(warrantyData.expiry_date).toLocaleDateString() : 'N/A'}
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Invoice Reference</dt>
                                                <dd className="mt-1 text-base text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1">
                                                    {warrantyData.invoice_number || 'N/A'}
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                </dd>
                                            </div>
                                        </dl>
                                        
                                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                                            <button 
                                                className="px-6 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                                                onClick={() => toast.info('Creating a service log for this item...')}
                                            >
                                                Create Service Log
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
