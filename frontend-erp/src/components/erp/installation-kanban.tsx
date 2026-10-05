import React from 'react';
import { Installation } from '@/services/installationService';
import Loader from '@/components/loader';
import { 
    Calendar, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    Building2, 
    MapPin, 
    ChevronDown, 
    Check 
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface InstallationKanbanProps {
    installations: Installation[];
    loading: boolean;
    onStatusChange: (id: number, newStatus: string) => void;
    onViewDetail: (id: number) => void;
    activeFilter?: string;
}

const STATUS_OPTIONS = [
    { 
        id: 'scheduled', 
        title: 'Scheduled',
        label: 'Scheduled', 
        badgeClass: 'bg-[#E2D6FE] text-neutral-900 border border-purple-200/80 hover:bg-[#d8c7fd]',
        dotClass: 'bg-purple-600',
        icon: Calendar
    },
    { 
        id: 'in_progress', 
        title: 'In Progress',
        label: 'In Progress', 
        badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100',
        dotClass: 'bg-amber-500',
        icon: Clock
    },
    { 
        id: 'on_hold', 
        title: 'On Hold',
        label: 'On Hold', 
        badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100',
        dotClass: 'bg-rose-500',
        icon: AlertCircle
    },
    { 
        id: 'completed', 
        title: 'Completed',
        label: 'Completed', 
        badgeClass: 'bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60 hover:bg-teal-100',
        dotClass: 'bg-[#0D9488]',
        icon: CheckCircle2
    },
] as const;

const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map(opt => [opt.id, opt]));

export default function InstallationKanban({
    installations,
    loading,
    onStatusChange,
    onViewDetail,
    activeFilter
}: InstallationKanbanProps) {
    if (loading) {
        return (
            <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
                <Loader variant="inline" size={80} text="Loading installation board..." />
            </div>
        );
    }

    const allColumns = STATUS_OPTIONS;

    const columns = activeFilter 
        ? allColumns.filter(c => c.id === activeFilter) 
        : allColumns;

    const getInstallationsByStatus = (status: string) => {
        return installations.filter(inst => inst.status === status);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start pb-6">
            {columns.map(column => {
                const columnItems = getInstallationsByStatus(column.id);
                const ColumnIcon = column.icon;

                return (
                    <div 
                        key={column.id} 
                        className="bg-white/40 backdrop-blur-md rounded-3xl p-4.5 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)] flex flex-col min-h-[500px]"
                    >
                        {/* Column Header */}
                        <div className="flex justify-between items-center mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${column.dotClass}`} />
                                <h3 className="font-bold text-sm text-neutral-800 tracking-tight">
                                    {column.title}
                                </h3>
                            </div>
                            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-xl shadow-2xs ${column.badgeClass}`}>
                                {columnItems.length}
                            </span>
                        </div>
                        
                        {/* Column Cards */}
                        <div className="flex-1 space-y-3.5">
                            {columnItems.map(inst => (
                                <div 
                                    key={inst.id} 
                                    className="bg-white/85 hover:bg-white backdrop-blur-md p-4.5 rounded-2xl border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group space-y-3"
                                    onClick={() => onViewDetail(inst.id)}
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-bold text-neutral-900 text-sm tracking-tight group-hover:text-black line-clamp-2 leading-snug">
                                            {inst.title}
                                        </h4>
                                        
                                        {/* Priority Indicator */}
                                        {inst.priority === 'urgent' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                                Urgent
                                            </span>
                                        ) : inst.priority === 'high' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                High
                                            </span>
                                        ) : inst.priority === 'medium' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200/70 shrink-0">
                                                Medium
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-neutral-100 text-neutral-500 border border-neutral-200/70 shrink-0">
                                                Low
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Client info */}
                                    {inst.client && (
                                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                                            <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                            <span className="truncate">
                                                {inst.client.company_name || inst.client.contact_person || (inst.client as any).contact_name}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Scheduled Date */}
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                                        <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                        <span>
                                            {inst.scheduled_date 
                                                ? new Date(inst.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                                                : 'Unscheduled'}
                                        </span>
                                    </div>

                                    {/* Location Address */}
                                    {(inst.location || (inst as any).location_address) && (
                                        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium truncate">
                                            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                            <span className="truncate">{inst.location || (inst as any).location_address}</span>
                                        </div>
                                    )}
                                    
                                    {/* Card Footer: Technicians & Status Dropdown */}
                                    <div className="border-t border-neutral-100 pt-3 flex justify-between items-center gap-2">
                                        <div className="flex -space-x-1.5 overflow-hidden">
                                            {inst.technicians && inst.technicians.length > 0 ? (
                                                inst.technicians.map((tech, i) => (
                                                    <div 
                                                        key={tech.id} 
                                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#E2D6FE] text-neutral-900 flex items-center justify-center text-[10px] font-bold shadow-2xs"
                                                        title={tech.name}
                                                        style={{ zIndex: 10 - i }}
                                                    >
                                                        {tech.name.charAt(0).toUpperCase()}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs text-neutral-400 font-medium italic">Unassigned</span>
                                            )}
                                        </div>
                                        
                                        <div 
                                            onClick={(e) => e.stopPropagation()} 
                                            onPointerDown={(e) => e.stopPropagation()}
                                            className="relative"
                                        >
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "inline-flex items-center gap-1.5 text-xs font-bold rounded-xl border py-1 px-2.5 shadow-2xs transition-all cursor-pointer select-none",
                                                            STATUS_MAP[inst.status]?.badgeClass || "bg-neutral-50 text-neutral-700 border-neutral-200/80 hover:bg-white"
                                                        )}
                                                    >
                                                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_MAP[inst.status]?.dotClass || "bg-neutral-400")} />
                                                        <span>{STATUS_MAP[inst.status]?.label || inst.status}</span>
                                                        <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    sideOffset={6}
                                                    className="w-44 p-1.5 bg-white/95 backdrop-blur-xl border border-neutral-200/80 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] space-y-0.5 z-50"
                                                >
                                                    {STATUS_OPTIONS.map((opt) => {
                                                        const isSelected = inst.status === opt.id;
                                                        return (
                                                            <DropdownMenuItem
                                                                key={opt.id}
                                                                onSelect={() => {
                                                                    if (inst.status !== opt.id) {
                                                                        onStatusChange(inst.id, opt.id);
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all",
                                                                    isSelected
                                                                        ? "bg-neutral-100 text-neutral-900 font-extrabold"
                                                                        : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                                                                )}
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <span className={cn("w-2 h-2 rounded-full shrink-0", opt.dotClass)} />
                                                                    <span>{opt.label}</span>
                                                                </span>
                                                                {isSelected && (
                                                                    <Check className="w-3.5 h-3.5 text-neutral-900 stroke-[2.5]" />
                                                                )}
                                                            </DropdownMenuItem>
                                                        );
                                                    })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {columnItems.length === 0 && (
                                <div className="text-center py-12 px-4 text-xs font-semibold text-neutral-400 border-2 border-dashed border-neutral-200/70 rounded-2xl bg-white/30 flex flex-col items-center justify-center gap-1.5">
                                    <ColumnIcon className="w-5 h-5 text-neutral-300" />
                                    <span>No installations</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
