import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Printer, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InvoicesTableProps {
  invoices: any[];
  isLoading: boolean;
  onView: (invoice: any) => void;
  onPrint: (invoice: any) => void;
  onPayment: (invoice: any) => void;
}

export function InvoicesTable({ invoices, isLoading, onView, onPrint, onPayment }: InvoicesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-12 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
        <div className="animate-spin h-8 w-8 border-3 border-neutral-900 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-neutral-500 font-semibold text-sm">Loading invoices...</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-12 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
        <p className="text-neutral-700 font-bold text-base">No invoices found.</p>
        <p className="text-neutral-500 text-xs mt-1">Create an invoice from the POS tab to get started.</p>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'partial':
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Partially Paid
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Unpaid
          </span>
        );
      case 'voided':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Voided
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            {status || 'Draft'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-neutral-200/70 hover:bg-transparent bg-white/40">
            <TableHead className="py-3 px-6">
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                Invoice #
              </span>
            </TableHead>
            <TableHead className="py-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                Client
              </span>
            </TableHead>
            <TableHead className="py-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                Date
              </span>
            </TableHead>
            <TableHead className="py-3 text-right">
              <div className="flex justify-end">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                  Amount
                </span>
              </div>
            </TableHead>
            <TableHead className="py-3 text-center">
              <div className="flex justify-center">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
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
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="border-b border-neutral-200/50 hover:bg-white/60 transition-colors">
              <TableCell className="py-4 px-6">
                <button
                  onClick={() => onView(invoice)}
                  className="font-mono font-bold text-sm text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer inline-flex items-center"
                >
                  {invoice.invoice_number}
                </button>
              </TableCell>
              <TableCell className="py-4">
                <div className="font-bold text-neutral-900 text-sm">
                  {invoice.client?.company_name || invoice.client?.contact_person}
                </div>
                {invoice.client?.company_name && (
                  <div className="text-xs text-neutral-500 font-medium mt-0.5">
                    {invoice.client.contact_person}
                  </div>
                )}
              </TableCell>
              <TableCell className="py-4 text-neutral-600 text-sm font-medium">
                {new Date(invoice.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-4 text-right font-extrabold text-neutral-900 text-base">
                Rs. {Number(invoice.grand_total).toLocaleString()}
              </TableCell>
              <TableCell className="py-4 text-center">
                {getStatusDisplay(invoice.status)}
              </TableCell>
              <TableCell className="py-4 px-6 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 p-0 text-neutral-500 hover:text-neutral-900 hover:bg-white/80 rounded-xl transition-all cursor-pointer">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-neutral-200/90 text-neutral-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-1.5 min-w-[170px] z-50">
                    <DropdownMenuLabel className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-3 py-1.5">Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="hover:bg-neutral-100 rounded-xl cursor-pointer font-medium text-sm text-neutral-700 px-3 py-2 transition-colors" onClick={() => onView(invoice)}>
                      <Eye className="mr-2 h-4 w-4 text-neutral-500" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-neutral-100 rounded-xl cursor-pointer font-medium text-sm text-neutral-700 px-3 py-2 transition-colors" onClick={() => onPrint(invoice)}>
                      <Printer className="mr-2 h-4 w-4 text-neutral-500" /> Print / PDF
                    </DropdownMenuItem>
                    {invoice.status !== 'paid' && invoice.status !== 'voided' && (
                      <DropdownMenuItem className="hover:bg-emerald-50 text-emerald-700 font-semibold rounded-xl cursor-pointer px-3 py-2 transition-colors" onClick={() => onPayment(invoice)}>
                        <CreditCard className="mr-2 h-4 w-4 text-emerald-600" /> Record Payment
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
