'use client';

import React, { useState, useEffect } from 'react';
import { activityLogService, ActivityLog } from '@/services/activityLogService';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Search, Package, ShoppingBag, Wrench, Box, Users, UserCog, Activity,
    ArrowRight, Clock, User, Eye, TrendingUp, TrendingDown,
    FileText, CalendarDays, Hash, RefreshCw
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ── Helpers ──────────────────────────────────────────

const MODULE_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
    pos:            { color: 'text-[#0D9488]',   bg: 'bg-[#E6F9F7] border-white/80', icon: ShoppingBag, label: 'POS / Sales' },
    installations:  { color: 'text-sky-800',     bg: 'bg-sky-100 border-white/80',   icon: Wrench,      label: 'Installations' },
    inventory:      { color: 'text-[#E0781E]',   bg: 'bg-[#FFF4E8] border-white/80', icon: Package,     label: 'Inventory' },
    products:       { color: 'text-[#7C3AED]',   bg: 'bg-[#F1EBFF] border-white/80', icon: Box,         label: 'Products' },
    clients:        { color: 'text-teal-800',    bg: 'bg-teal-50 border-white/80',   icon: Users,       label: 'Clients' },
    users:          { color: 'text-neutral-800', bg: 'bg-white/80 border-white/80', icon: UserCog,     label: 'Users' },
};

function getModuleConfig(logName: string) {
    return MODULE_CONFIG[logName] || { color: 'text-neutral-700', bg: 'bg-white/80 border-white/80', icon: Activity, label: logName || 'System' };
}

function getEventStyle(event: string) {
    switch (event) {
        case 'created':
            return {
                badge: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/80',
                dot: 'bg-emerald-500',
                label: 'Created',
            };
        case 'updated':
            return {
                badge: 'text-amber-700 bg-amber-50/80 border-amber-200/80',
                dot: 'bg-amber-500',
                label: 'Updated',
            };
        case 'deleted':
            return {
                badge: 'text-rose-700 bg-rose-50/80 border-rose-200/80',
                dot: 'bg-rose-500',
                label: 'Deleted',
            };
        default:
            return {
                badge: 'text-neutral-700 bg-neutral-100 border-neutral-200/80',
                dot: 'bg-neutral-400',
                label: event || 'Action',
            };
    }
}

function formatFieldName(key: string): string {
    return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/Id$/, 'ID')
        .replace(/At$/, 'Date');
}

function formatFieldValue(value: any): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

// Fields we don't want to show to end-users in the changes list
const HIDDEN_FIELDS = ['updated_at', 'created_at', 'deleted_at', 'id', 'uuid', 'sync_status', 'synced_at', 'pdf_path'];

// ── Detail Modal Content Renderers ───────────────────

function InvoiceDetail({ log }: { log: ActivityLog }) {
    const invoice = log.subject;
    if (!invoice) return <GenericDetail log={log} />;

    return (
        <div className="space-y-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={FileText} label="Invoice No." value={invoice.invoice_number} />
                <InfoCard icon={User} label="Client" value={invoice.client?.company_name || invoice.client?.contact_person || '—'} />
                <InfoCard icon={Hash} label="Status" value={<span className="capitalize">{invoice.status}</span>} />
                <InfoCard icon={CalendarDays} label="Date" value={new Date(invoice.created_at).toLocaleDateString()} />
            </div>

            {/* Financials */}
            <div className="bg-[#E6F9F7]/70 border border-[#0D9488]/20 rounded-2xl p-4 shadow-2xs">
                <h4 className="text-xs font-bold text-[#0D9488] uppercase tracking-wider mb-3">Financials</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white/80 p-3 rounded-xl border border-white/80 shadow-2xs">
                        <div className="text-base font-bold text-neutral-900">LKR {Number(invoice.grand_total || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mt-0.5">Grand Total</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-white/80 shadow-2xs">
                        <div className="text-base font-bold text-emerald-700">LKR {Number(invoice.amount_paid || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mt-0.5">Amount Paid</div>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-white/80 shadow-2xs">
                        <div className="text-base font-bold text-rose-600">LKR {Number((invoice.grand_total || 0) - (invoice.amount_paid || 0)).toLocaleString()}</div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mt-0.5">Balance Due</div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            {invoice.items && invoice.items.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Products in this Invoice</h4>
                    <div className="border border-neutral-200/70 rounded-2xl overflow-hidden shadow-2xs bg-white/60">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-100/70 border-b border-neutral-200/60">
                                <tr>
                                    <th className="px-4 py-2.5 text-left text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-2.5 text-center text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Qty</th>
                                    <th className="px-4 py-2.5 text-right text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-4 py-2.5 text-right text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/40">
                                {invoice.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/80 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-neutral-900">{item.product?.name || item.description || '—'}</td>
                                        <td className="px-4 py-3 text-center text-neutral-600 font-medium">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right text-neutral-600 font-medium">LKR {Number(item.unit_price || 0).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-bold text-neutral-900">LKR {Number(item.line_total || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Changes */}
            <ChangesSection log={log} />
        </div>
    );
}

function StockMovementDetail({ log }: { log: ActivityLog }) {
    const movement = log.subject;
    if (!movement) return <GenericDetail log={log} />;

    const isPositive = movement.quantity > 0;

    return (
        <div className="space-y-5">
            {/* Movement Summary */}
            <div className={cn(
                "rounded-2xl p-5 border shadow-2xs backdrop-blur-xs",
                isPositive ? "bg-[#E6F9F7]/70 border-[#0D9488]/30" : "bg-rose-50/70 border-rose-200"
            )}>
                <div className="flex items-center gap-3 mb-2">
                    {isPositive ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-rose-600" />}
                    <span className={cn("text-base font-bold capitalize", isPositive ? "text-emerald-900" : "text-rose-900")}>
                        {movement.type === 'sale' ? 'Sold' : movement.type}
                    </span>
                </div>
                <div className={cn("text-3xl font-black tracking-tight", isPositive ? "text-emerald-700" : "text-rose-700")}>
                    {isPositive ? '+' : ''}{movement.quantity} units
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={Box} label="Product" value={movement.product?.name || 'Unknown Product'} />
                <InfoCard icon={Hash} label="Movement Type" value={<span className="capitalize">{movement.type}</span>} />
            </div>

            {/* Stock Level Visual */}
            <div className="bg-white/80 border border-white/90 rounded-2xl p-4 shadow-2xs">
                <h4 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-3">Stock Level Change</h4>
                <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-neutral-400">{movement.stock_before}</div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mt-1">Before</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                    <div className="text-center">
                        <div className={cn("text-2xl font-bold", isPositive ? "text-emerald-600" : "text-rose-600")}>
                            {movement.stock_after}
                        </div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mt-1">After</div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {movement.notes && (
                <div className="bg-[#FFF4E8]/80 border border-[#E0781E]/20 rounded-2xl p-3.5 shadow-2xs">
                    <h4 className="text-xs font-bold text-[#E0781E] uppercase tracking-wider mb-1">Notes</h4>
                    <p className="text-sm text-neutral-800 font-medium">{movement.notes}</p>
                </div>
            )}

            <ChangesSection log={log} />
        </div>
    );
}

function StockReceivingDetail({ log }: { log: ActivityLog }) {
    const batch = log.subject;
    if (!batch) return <GenericDetail log={log} />;

    return (
        <div className="space-y-5">
            {/* Batch Info */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={Hash} label="Reference" value={batch.reference_number} />
                <InfoCard icon={Hash} label="Type" value={<span className="capitalize">{batch.type}</span>} />
                <InfoCard icon={CalendarDays} label="Date" value={new Date(batch.created_at).toLocaleDateString()} />
                <InfoCard icon={Package} label="Total Products" value={`${batch.items?.length || 0} unique products`} />
            </div>

            {/* Notes */}
            {batch.notes && (
                <div className="bg-[#FFF4E8]/80 border border-[#E0781E]/20 rounded-2xl p-3.5 shadow-2xs">
                    <h4 className="text-xs font-bold text-[#E0781E] uppercase tracking-wider mb-1">Notes</h4>
                    <p className="text-sm text-neutral-800 font-medium">{batch.notes}</p>
                </div>
            )}

            {/* Items Table */}
            {batch.items && batch.items.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Restocked Items</h4>
                    <div className="border border-neutral-200/70 rounded-2xl overflow-hidden shadow-2xs bg-white/60">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-100/70 border-b border-neutral-200/60">
                                <tr>
                                    <th className="px-4 py-2.5 text-left text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-2.5 text-center text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Before</th>
                                    <th className="px-4 py-2.5 text-center text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Quantity</th>
                                    <th className="px-4 py-2.5 text-center text-[11px] font-bold text-neutral-600 uppercase tracking-wider">After</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/40">
                                {batch.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-white/80 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-neutral-900">{item.product?.name || 'Unknown Product'}</td>
                                        <td className="px-4 py-3 text-center text-neutral-500 font-medium">{item.stock_before}</td>
                                        <td className="px-4 py-3 text-center font-bold text-emerald-600">+{item.quantity}</td>
                                        <td className="px-4 py-3 text-center text-neutral-900 font-bold">{item.stock_after}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ChangesSection log={log} />
        </div>
    );
}

function InstallationDetail({ log }: { log: ActivityLog }) {
    const installation = log.subject;
    if (!installation) return <GenericDetail log={log} />;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={Hash} label="Reference" value={installation.reference_number} />
                <InfoCard icon={Hash} label="Status" value={<span className="capitalize">{installation.status?.replace(/_/g, ' ')}</span>} />
                <InfoCard icon={CalendarDays} label="Scheduled" value={installation.scheduled_date ? new Date(installation.scheduled_date).toLocaleDateString() : '—'} />
                <InfoCard icon={Activity} label="Priority" value={<span className="capitalize">{installation.priority || '—'}</span>} />
            </div>

            {installation.title && (
                <div className="bg-sky-50 border border-sky-200/60 rounded-2xl p-3.5 shadow-2xs">
                    <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1">Title</h4>
                    <p className="text-sm text-sky-950 font-semibold">{installation.title}</p>
                </div>
            )}

            {installation.technicians && installation.technicians.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Assigned Technicians</h4>
                    <div className="flex flex-wrap gap-2">
                        {installation.technicians.map((tech: any, idx: number) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-900 border border-sky-200 rounded-full px-3 py-1 text-xs font-bold shadow-2xs">
                                <User className="w-3 h-3" />
                                {tech.name}
                                {tech.pivot?.role && <span className="text-sky-700 font-normal">({tech.pivot.role})</span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <ChangesSection log={log} />
        </div>
    );
}

function ProductDetail({ log }: { log: ActivityLog }) {
    const product = log.subject;
    if (!product) return <GenericDetail log={log} />;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={Box} label="Product Name" value={product.name} />
                <InfoCard icon={Hash} label="SKU / Model" value={product.sku || product.model_number || '—'} />
                <InfoCard icon={Hash} label="Current Stock" value={`${product.stock} ${product.unit || 'units'}`} />
                <InfoCard icon={Hash} label="Price" value={product.price ? `LKR ${Number(product.price).toLocaleString()}` : '—'} />
            </div>

            {product.brand && (
                <InfoCard icon={Hash} label="Brand" value={product.brand.name} />
            )}

            <ChangesSection log={log} />
        </div>
    );
}

function ClientDetail({ log }: { log: ActivityLog }) {
    const client = log.subject;
    if (!client) return <GenericDetail log={log} />;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={User} label="Contact Person" value={client.contact_person || '—'} />
                <InfoCard icon={Users} label="Company" value={client.company_name || '—'} />
                <InfoCard icon={Hash} label="Phone" value={client.phone || '—'} />
                <InfoCard icon={Hash} label="Email" value={client.email || '—'} />
                <InfoCard icon={Hash} label="City" value={client.city || '—'} />
                <InfoCard icon={Hash} label="Client Type" value={<span className="capitalize">{client.client_type || '—'}</span>} />
            </div>
            <ChangesSection log={log} />
        </div>
    );
}

function GenericDetail({ log }: { log: ActivityLog }) {
    return (
        <div className="space-y-5">
            {log.subject && (
                <div>
                    <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Record Details</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(log.subject)
                            .filter(([key]) => !HIDDEN_FIELDS.includes(key) && !key.endsWith('_id') && key !== 'brand' && key !== 'items' && key !== 'client' && key !== 'technicians')
                            .slice(0, 8)
                            .map(([key, value]) => (
                                <InfoCard key={key} icon={Hash} label={formatFieldName(key)} value={formatFieldValue(value)} />
                            ))
                        }
                    </div>
                </div>
            )}
            <ChangesSection log={log} />
        </div>
    );
}

// ── Shared Components ────────────────────────────────

function InfoCard({ icon: IconComp, label, value }: { icon: any; label: string; value: any }) {
    return (
        <div className="bg-white/80 rounded-2xl p-3.5 border border-white/90 shadow-2xs backdrop-blur-xs">
            <div className="flex items-center gap-1.5 mb-1">
                <IconComp className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{label}</span>
            </div>
            <div className="text-sm font-bold text-neutral-900 truncate">{value}</div>
        </div>
    );
}

function ChangesSection({ log }: { log: ActivityLog }) {
    const changes = log.properties;
    if (!changes) return null;

    const oldVals = changes.old;
    const newVals = changes.attributes;

    // If we have before/after diffs, show them as a clean table
    if (oldVals && newVals) {
        const changedKeys = Object.keys(newVals).filter(k => !HIDDEN_FIELDS.includes(k));
        if (changedKeys.length === 0) return null;

        return (
            <div>
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">What Changed</h4>
                <div className="border border-neutral-200/70 rounded-2xl overflow-hidden shadow-2xs bg-white/60">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-100/70 border-b border-neutral-200/60">
                            <tr>
                                <th className="px-4 py-2.5 text-left text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Field</th>
                                <th className="px-4 py-2.5 text-left text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Before</th>
                                <th className="px-4 py-2.5 text-center text-[11px] text-neutral-400 w-8"></th>
                                <th className="px-4 py-2.5 text-left text-[11px] font-bold text-neutral-600 uppercase tracking-wider">After</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200/40">
                            {changedKeys.map(key => (
                                <tr key={key} className="hover:bg-white/80 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-neutral-800 text-xs">{formatFieldName(key)}</td>
                                    <td className="px-4 py-3 font-mono text-xs">
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700">
                                            {formatFieldValue(oldVals[key])}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 mx-auto" />
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                                            {formatFieldValue(newVals[key])}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // For non-diff properties (like items_bought from manual logs)
    const filteredKeys = Object.keys(changes).filter(k => k !== 'old' && k !== 'attributes');
    if (filteredKeys.length === 0) return null;

    return (
        <div>
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Additional Details</h4>
            <div className="space-y-2">
                {filteredKeys.map(key => (
                    <div key={key} className="bg-white/80 rounded-2xl p-3.5 border border-white/90 shadow-2xs">
                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{formatFieldName(key)}</span>
                        {Array.isArray(changes[key]) ? (
                            <ul className="mt-1 space-y-1">
                                {changes[key].map((item: any, idx: number) => (
                                    <li key={idx} className="text-sm text-neutral-800 font-medium">• {typeof item === 'string' ? item : JSON.stringify(item)}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm font-bold text-neutral-900 mt-1">{formatFieldValue(changes[key])}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [logNameFilter, setLogNameFilter] = useState('');
    const [eventFilter, setEventFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

    useEffect(() => {
        loadLogs();
    }, [searchTerm, logNameFilter, eventFilter, page]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const response = await activityLogService.getActivityLogs({
                search: searchTerm || undefined,
                log_name: logNameFilter || undefined,
                event: eventFilter || undefined,
                page,
            });
            setLogs(response.data || []);
            setTotalPages(response.last_page || 1);
        } catch (error) {
            toast.error('Failed to load activity logs.');
        } finally {
            setLoading(false);
        }
    };

    const renderModalContent = (log: ActivityLog) => {
        const subjectType = log.subject_type?.split('\\').pop(); // e.g. "Invoice"
        switch (subjectType) {
            case 'Invoice':       return <InvoiceDetail log={log} />;
            case 'StockReceiving':return <StockReceivingDetail log={log} />;
            case 'StockMovement': return <StockMovementDetail log={log} />;
            case 'Installation':  return <InstallationDetail log={log} />;
            case 'Product':       return <ProductDetail log={log} />;
            case 'Client':        return <ClientDetail log={log} />;
            default:              return <GenericDetail log={log} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                        Activity Logs
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">
                        Audit trail of system modifications and administrative actions
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        onClick={() => {
                            setPage(1);
                            loadLogs();
                        }}
                        variant="outline"
                        className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 text-neutral-700 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                {/* Search Input */}
                <div className="relative flex-1 w-full flex items-center">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                        placeholder="Search logs by description, user, or record..."
                        className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Module Dropdown Selector */}
                <div className="shrink-0 w-full sm:w-auto">
                    <select
                        className="h-11 px-4 bg-white hover:bg-white border border-white text-neutral-800 rounded-2xl shadow-2xs text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer transition-all w-full sm:w-44"
                        value={logNameFilter}
                        onChange={(e) => {
                            setLogNameFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Modules</option>
                        <option value="pos">POS / Sales</option>
                        <option value="installations">Installations</option>
                        <option value="inventory">Inventory</option>
                        <option value="products">Products</option>
                        <option value="clients">Clients</option>
                        <option value="users">Users</option>
                    </select>
                </div>

                {/* Event Action Pill Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 w-full md:w-auto overflow-x-auto scrollbar-none">
                    {[
                        { id: '', label: 'All Actions' },
                        { id: 'created', label: 'Created' },
                        { id: 'updated', label: 'Updated' },
                        { id: 'deleted', label: 'Deleted' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setEventFilter(tab.id);
                                setPage(1);
                            }}
                            className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                                eventFilter === tab.id
                                    ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Content */}
            {loading && logs.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
                    <Loader variant="inline" size={80} text="Loading activity logs..." />
                </div>
            ) : logs.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
                    <Activity className="mx-auto h-12 w-12 text-neutral-400" />
                    <h3 className="mt-4 text-base font-bold text-neutral-900">No activity logs found</h3>
                    <p className="mt-1 text-sm text-neutral-500 font-medium">Try adjusting your filters or search term.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-neutral-200/70 hover:bg-transparent bg-white/40">
                                    <TableHead className="py-3 px-6">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                            Module
                                        </span>
                                    </TableHead>
                                    <TableHead className="py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                            Action & Description
                                        </span>
                                    </TableHead>
                                    <TableHead className="py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                            User
                                        </span>
                                    </TableHead>
                                    <TableHead className="py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                            Date & Time
                                        </span>
                                    </TableHead>
                                    <TableHead className="py-3 px-6 text-right">
                                        <div className="flex justify-end">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/80 text-neutral-600 border border-white/80 shadow-2xs">
                                                Details
                                            </span>
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => {
                                    const modConfig = getModuleConfig(log.log_name);
                                    const eventStyle = getEventStyle(log.event);
                                    const Icon = modConfig.icon;

                                    return (
                                        <TableRow
                                            key={log.id}
                                            className="border-b border-neutral-200/50 hover:bg-white/60 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            <TableCell className="py-4 px-6">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs border",
                                                    modConfig.bg,
                                                    modConfig.color
                                                )}>
                                                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                                                    {modConfig.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="font-bold text-neutral-900 text-sm">
                                                    {log.description}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border",
                                                        eventStyle.badge
                                                    )}>
                                                        <span className={cn("w-1.5 h-1.5 rounded-full", eventStyle.dot)} />
                                                        {eventStyle.label}
                                                    </span>
                                                    {log.subject_type && (
                                                        <span className="text-xs text-neutral-400 font-medium font-mono">
                                                            {log.subject_type.split('\\').pop()} #{log.subject_id}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-950 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                                                        {log.causer?.name?.[0]?.toUpperCase() || 'S'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-neutral-900">
                                                            {log.causer?.name || 'System Auto'}
                                                        </div>
                                                        <div className="text-xs text-neutral-500 font-medium">
                                                            {log.causer ? `User #${log.causer.id}` : 'Automated Task'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="text-sm font-bold text-neutral-900">
                                                    {new Date(log.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                                <div className="text-xs text-neutral-500 font-medium mt-0.5 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-neutral-400" />
                                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLog(log);
                                                    }}
                                                    className="bg-sky-200/90 hover:bg-sky-300 text-sky-950 font-semibold text-xs px-3.5 h-8 rounded-xl border border-white/80 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> View Log
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="p-4 bg-white/40 border-t border-neutral-200/60 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 bg-white/60 px-4 py-2 rounded-xl border border-white/80">
                                    Page {page} of {totalPages}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        variant="outline"
                                        className="px-5 h-10 bg-white/80 hover:bg-white text-neutral-900 border border-white/80 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        variant="outline"
                                        className="px-5 h-10 bg-white/80 hover:bg-white text-neutral-900 border border-white/80 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Detail Modal ─────────────────────────── */}
            <Dialog open={!!selectedLog} onOpenChange={(open) => { if (!open) setSelectedLog(null); }}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6">
                    {selectedLog && (() => {
                        const modConfig = getModuleConfig(selectedLog.log_name);
                        const eventStyle = getEventStyle(selectedLog.event);
                        const Icon = modConfig.icon;
                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-2xs",
                                            modConfig.bg,
                                            modConfig.color
                                        )}>
                                            <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                                            {modConfig.label}
                                        </span>
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border",
                                            eventStyle.badge
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", eventStyle.dot)} />
                                            {eventStyle.label}
                                        </span>
                                    </div>
                                    <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">
                                        {selectedLog.description}
                                    </DialogTitle>
                                    <DialogDescription className="flex items-center gap-4 text-xs font-medium text-neutral-500 mt-1">
                                        <span className="inline-flex items-center gap-1 font-semibold text-neutral-700">
                                            <User className="w-3.5 h-3.5 text-neutral-400" />
                                            {selectedLog.causer?.name || 'System Auto'}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                            {new Date(selectedLog.created_at).toLocaleString()}
                                        </span>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                    {renderModalContent(selectedLog)}
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
