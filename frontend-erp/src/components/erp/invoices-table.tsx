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
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return <div className="p-8 text-center text-gray-500">No invoices found.</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 border-green-400/30';
      case 'partial': return 'text-blue-400 border-blue-400/30';
      case 'unpaid': return 'text-amber-400 border-amber-400/30';
      case 'voided': return 'text-red-400 border-red-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  return (
    <div className="rounded-md border border-white/10 bg-[#111827]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-400 font-semibold">Invoice #</TableHead>
            <TableHead className="text-gray-400 font-semibold">Client</TableHead>
            <TableHead className="text-gray-400 font-semibold">Date</TableHead>
            <TableHead className="text-gray-400 font-semibold text-right">Amount</TableHead>
            <TableHead className="text-gray-400 font-semibold text-center">Status</TableHead>
            <TableHead className="text-gray-400 font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium text-blue-400">
                {invoice.invoice_number}
              </TableCell>
              <TableCell>
                <div className="text-white">{invoice.client?.company_name || invoice.client?.contact_person}</div>
                {invoice.client?.company_name && <div className="text-xs text-gray-400">{invoice.client.contact_person}</div>}
              </TableCell>
              <TableCell className="text-gray-300">
                {new Date(invoice.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right text-white font-bold">
                Rs. {Number(invoice.grand_total).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={`uppercase tracking-wider text-[10px] ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1f2937] border-white/10 text-white">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => onView(invoice)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => onPrint(invoice)}>
                      <Printer className="mr-2 h-4 w-4" /> Print / PDF
                    </DropdownMenuItem>
                    {invoice.status !== 'paid' && invoice.status !== 'voided' && (
                      <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-green-400" onClick={() => onPayment(invoice)}>
                        <CreditCard className="mr-2 h-4 w-4" /> Record Payment
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
