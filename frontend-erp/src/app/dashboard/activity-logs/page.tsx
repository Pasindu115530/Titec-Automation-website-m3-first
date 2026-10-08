'use client';

import React, { useState, useEffect } from 'react';
import { activityLogService, ActivityLog } from '@/services/activityLogService';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import {
    Search, Package, ShoppingBag, Wrench, Box, Users, UserCog, Activity,
    ArrowRight, Clock, User, Eye, ArrowUpDown, TrendingUp, TrendingDown,
    FileText, CalendarDays, Hash
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

// ── Helpers ──────────────────────────────────────────

const MODULE_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
    pos:            { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: ShoppingBag, label: 'POS / Sales' },
    installations:  { color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',      icon: Wrench,      label: 'Installations' },
    inventory:      { color: 'text-orange-700',   bg: 'bg-orange-50 border-orange-200',   icon: Package,     label: 'Inventory' },
    products:       { color: 'text-purple-700',   bg: 'bg-purple-50 border-purple-200',   icon: Box,         label: 'Products' },
    clients:        { color: 'text-cyan-700',     bg: 'bg-cyan-50 border-cyan-200',       icon: Users,       label: 'Clients' },
    users:          { color: 'text-gray-700',     bg: 'bg-gray-100 border-gray-300',      icon: UserCog,     label: 'Users' },
};

function getModuleConfig(logName: string) {
    return MODULE_CONFIG[logName] || { color: 'text-gray-700', bg: 'bg-gray-100 border-gray-200', icon: Activity, label: logName || 'System' };
}

function getEventStyle(event: string) {
    switch (event) {
        case 'created': return { bg: 'bg-green-100 text-green-800', label: 'Created' };
        case 'updated': return { bg: 'bg-amber-100 text-amber-800', label: 'Updated' };
        case 'deleted': return { bg: 'bg-red-100 text-red-800', label: 'Deleted' };
        default:        return { bg: 'bg-gray-100 text-gray-800', label: event || 'Action' };
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
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">Financials</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-lg font-bold text-gray-900">LKR {Number(invoice.grand_total || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-medium">Grand Total</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-green-700">LKR {Number(invoice.amount_paid || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-medium">Amount Paid</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-red-600">LKR {Number((invoice.grand_total || 0) - (invoice.amount_paid || 0)).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-medium">Balance Due</div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            {invoice.items && invoice.items.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Products in this Invoice</h4>
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-2 text-center text-[10px] font-bold text-gray-500 uppercase">Qty</th>
                                    <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-500 uppercase">Unit Price</th>
                                    <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-500 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoice.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-2.5 font-medium text-gray-900">{item.product?.name || item.description || '—'}</td>
                                        <td className="px-4 py-2.5 text-center text-gray-600">{item.quantity}</td>
                                        <td className="px-4 py-2.5 text-right text-gray-600">LKR {Number(item.unit_price || 0).toLocaleString()}</td>
                                        <td className="px-4 py-2.5 text-right font-semibold text-gray-900">LKR {Number(item.line_total || 0).toLocaleString()}</td>
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
            <div className={`rounded-lg p-5 border ${isPositive ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center gap-3 mb-3">
                    {isPositive ? <TrendingUp className="w-6 h-6 text-green-600" /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                    <span className={`text-lg font-bold capitalize ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
                        {movement.type === 'sale' ? 'Sold' : movement.type}
                    </span>
                </div>
                <div className={`text-3xl font-black ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                    {isPositive ? '+' : ''}{movement.quantity} units
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={Box} label="Product" value={movement.product?.name || 'Unknown Product'} />
                <InfoCard icon={Hash} label="Movement Type" value={<span className="capitalize">{movement.type}</span>} />
            </div>

            {/* Stock Level Visual */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Stock Level Change</h4>
                <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">{movement.stock_before}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-medium mt-1">Before</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{movement.stock_after}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-medium mt-1">After</div>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {movement.notes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Notes</h4>
                    <p className="text-sm text-yellow-900">{movement.notes}</p>
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
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Notes</h4>
                    <p className="text-sm text-yellow-900">{batch.notes}</p>
                </div>
            )}

            {/* Items Table */}
            {batch.items && batch.items.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Restocked Items</h4>
                    <div className="border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-2 text-center text-[10px] font-bold text-gray-500 uppercase">Before</th>
                                    <th className="px-4 py-2 text-center text-[10px] font-bold text-gray-500 uppercase">Quantity</th>
                                    <th className="px-4 py-2 text-center text-[10px] font-bold text-gray-500 uppercase">After</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {batch.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-2.5 font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</td>
                                        <td className="px-4 py-2.5 text-center text-gray-500">{item.stock_before}</td>
                                        <td className="px-4 py-2.5 text-center font-bold text-green-600">+{item.quantity}</td>
                                        <td className="px-4 py-2.5 text-center text-gray-900">{item.stock_after}</td>
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
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Title</h4>
                    <p className="text-sm text-blue-900 font-medium">{installation.title}</p>
                </div>
            )}

            {installation.technicians && installation.technicians.length > 0 && (
                <div>
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Assigned Technicians</h4>
                    <div className="flex flex-wrap gap-2">
                        {installation.technicians.map((tech: any, idx: number) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full px-3 py-1 text-xs font-medium">
                                <User className="w-3 h-3" />
                                {tech.name}
                                {tech.pivot?.role && <span className="text-blue-500">({tech.pivot.role})</span>}
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
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Record Details</h4>
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
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
                <IconComp className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
            </div>
            <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
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
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">What Changed</h4>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">Field</th>
                                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">Before</th>
                                <th className="px-4 py-2 text-center text-[10px] text-gray-400 w-8"></th>
                                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase">After</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {changedKeys.map(key => (
                                <tr key={key}>
                                    <td className="px-4 py-2.5 font-medium text-gray-700">{formatFieldName(key)}</td>
                                    <td className="px-4 py-2.5 text-red-600 bg-red-50/50 font-mono text-xs">{formatFieldValue(oldVals[key])}</td>
                                    <td className="px-4 py-2.5 text-center"><ArrowRight className="w-3.5 h-3.5 text-gray-300 mx-auto" /></td>
                                    <td className="px-4 py-2.5 text-green-700 bg-green-50/50 font-mono text-xs">{formatFieldValue(newVals[key])}</td>
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
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Additional Details</h4>
            <div className="space-y-2">
                {filteredKeys.map(key => (
                    <div key={key} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{formatFieldName(key)}</span>
                        {Array.isArray(changes[key]) ? (
                            <ul className="mt-1 space-y-1">
                                {changes[key].map((item: any, idx: number) => (
                                    <li key={idx} className="text-sm text-gray-800">• {typeof item === 'string' ? item : JSON.stringify(item)}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm font-medium text-gray-900 mt-1">{formatFieldValue(changes[key])}</div>
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
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-orbitron">Activity Logs</h1>
                <p className="text-gray-500 mt-1">Audit trail of system modifications and administrative actions.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="sm:w-48">
                    <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                        value={logNameFilter}
                        onChange={(e) => { setLogNameFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Modules</option>
                        <option value="pos">POS</option>
                        <option value="installations">Installations</option>
                        <option value="inventory">Inventory</option>
                        <option value="products">Products</option>
                        <option value="clients">Clients</option>
                        <option value="users">Users</option>
                    </select>
                </div>
                <div className="sm:w-48">
                    <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                        value={eventFilter}
                        onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">All Events</option>
                        <option value="created">Created</option>
                        <option value="updated">Updated</option>
                        <option value="deleted">Deleted</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading && logs.length === 0 ? (
                <div className="flex justify-center py-12">
                    <Loader size={40} />
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Activity className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-sm font-semibold text-gray-900">No activity logs found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search term.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map((log) => {
                                    const modConfig = getModuleConfig(log.log_name);
                                    const eventStyle = getEventStyle(log.event);
                                    const Icon = modConfig.icon;

                                    return (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${modConfig.bg} ${modConfig.color}`}>
                                                    <Icon className="w-3.5 h-3.5" />
                                                    {modConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{log.description}</div>
                                                <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${eventStyle.bg}`}>
                                                    {eventStyle.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-950 flex items-center justify-center text-white text-[10px] font-bold">
                                                        {log.causer?.name?.[0] || '?'}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {log.causer?.name || 'System'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{new Date(log.created_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-400">{new Date(log.created_at).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 group-hover:text-blue-600 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                    <span className="hidden sm:inline">View</span>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Detail Modal ─────────────────────────── */}
            <Dialog open={!!selectedLog} onOpenChange={(open) => { if (!open) setSelectedLog(null); }}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    {selectedLog && (() => {
                        const modConfig = getModuleConfig(selectedLog.log_name);
                        const eventStyle = getEventStyle(selectedLog.event);
                        const Icon = modConfig.icon;
                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${modConfig.bg} ${modConfig.color}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                            {modConfig.label}
                                        </span>
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${eventStyle.bg}`}>
                                            {eventStyle.label}
                                        </span>
                                    </div>
                                    <DialogTitle className="text-lg">{selectedLog.description}</DialogTitle>
                                    <DialogDescription className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                        <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />{selectedLog.causer?.name || 'System'}</span>
                                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(selectedLog.created_at).toLocaleString()}</span>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-2">
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
