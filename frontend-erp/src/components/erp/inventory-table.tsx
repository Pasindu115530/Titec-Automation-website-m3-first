import React from 'react';
import { InventoryItem } from '@/services/inventoryService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ArrowDownToLine, History } from 'lucide-react';

interface InventoryTableProps {
    items: InventoryItem[];
    loading: boolean;
    onAdjustStock: (item: InventoryItem) => void;
    onReceiveStock: (item: InventoryItem) => void;
    onViewHistory: (item: InventoryItem) => void;
}

export default function InventoryTable({
    items,
    loading,
    onAdjustStock,
    onReceiveStock,
    onViewHistory
}: InventoryTableProps) {
    if (loading) {
        return (
            <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
                <div className="animate-spin h-9 w-9 border-3 border-neutral-900 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-neutral-500 font-semibold text-sm">Loading inventory items...</p>
            </div>
        );
    }

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-neutral-200/70 hover:bg-transparent bg-white/40">
                        <TableHead className="py-3 px-6">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                Product
                            </span>
                        </TableHead>
                        <TableHead className="py-3">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                Code / SKU
                            </span>
                        </TableHead>
                        <TableHead className="py-3">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                Price (Rs.)
                            </span>
                        </TableHead>
                        <TableHead className="py-3">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                Stock
                            </span>
                        </TableHead>
                        <TableHead className="py-3 text-center">
                            <div className="flex justify-center">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                    Status
                                </span>
                            </div>
                        </TableHead>
                        <TableHead className="py-3 px-6 text-right">
                            <div className="flex justify-end">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/80 text-neutral-600 border border-white/80 shadow-2xs">
                                    Actions
                                </span>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id} className="border-b border-neutral-200/50 hover:bg-white/60 transition-colors">
                                <TableCell className="py-4 px-6">
                                    <div>
                                        <div className="font-bold text-neutral-900 text-sm tracking-tight">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-neutral-500 font-medium truncate max-w-sm mt-0.5">
                                            {item.description || 'No description provided'}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="font-mono text-sm font-semibold text-neutral-700">
                                        {item.product_code || '-'}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 font-mono font-bold text-sm text-neutral-900">
                                    Rs. {Number(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-neutral-900 text-sm font-mono">{item.stock_quantity}</span>
                                        {item.min_stock_level !== null && (
                                            <span className="text-xs text-neutral-400 font-medium">(Min: {item.min_stock_level})</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <div className="flex justify-center">
                                        {item.stock_quantity > (item.min_stock_level || 5) ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60 shadow-2xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                                                In Stock
                                            </span>
                                        ) : item.stock_quantity > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                            <TableCell className="py-4 px-6 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => onAdjustStock(item)}
                                        className="h-8 px-3 rounded-xl bg-[#F1EBFF] hover:bg-[#e7dcfe] text-[#7C3AED] border border-purple-200/60 font-bold text-xs shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1"
                                    >
                                        <SlidersHorizontal className="h-3 w-3 stroke-[2.5]" /> Adjust
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => onReceiveStock(item)}
                                        className="h-8 px-3 rounded-xl bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold border border-[#E9FF7A] shadow-2xs text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1"
                                    >
                                        <ArrowDownToLine className="h-3 w-3 stroke-[2.5]" /> Receive
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onViewHistory(item)}
                                        className="h-8 px-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 shadow-2xs font-semibold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-1"
                                    >
                                        <History className="h-3 w-3 text-neutral-500" /> History
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {items.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="py-16 text-center text-neutral-500 font-medium">
                                No inventory items found matching your criteria.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
