import React from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@/services/clientService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Eye, FileText, Building2, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientsTable({ clients, isLoading, onEdit, onView, onDelete }: ClientsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
        <div className="animate-spin h-9 w-9 border-3 border-neutral-900 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-neutral-500 font-semibold text-sm">Loading clients...</p>
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
                Name / Company
              </span>
            </TableHead>
            <TableHead className="py-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                Contact Info
              </span>
            </TableHead>
            <TableHead className="py-3 text-center">
              <div className="flex justify-center">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                  Type
                </span>
              </div>
            </TableHead>
            <TableHead className="py-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                Location
              </span>
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
          {clients.map((client) => (
            <TableRow key={client.id} className="border-b border-neutral-200/50 hover:bg-white/60 transition-colors">
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border border-white/80 shadow-2xs ${
                    client.client_type === 'business'
                      ? 'bg-[#F1EBFF] text-[#7C3AED]'
                      : 'bg-[#E6F9F7] text-[#0D9488]'
                  }`}>
                    {client.client_type === 'business' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 text-sm tracking-tight">
                      {client.client_type === 'business' ? (client.company_name || client.contact_person) : client.contact_person}
                    </div>
                    {client.client_type === 'business' && client.contact_person && (
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">
                        {client.contact_person}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="font-semibold text-neutral-900 text-sm font-mono">
                  {client.phone || '-'}
                </div>
                <div className="text-xs text-neutral-500 font-medium mt-0.5">
                  {client.email || 'No email provided'}
                </div>
              </TableCell>
              <TableCell className="py-4 text-center">
                <div className="flex justify-center">
                  {client.client_type === 'business' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-purple-200/60 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                      Business
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                      Individual
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 text-neutral-700 text-sm font-medium">
                {client.city ? (
                  <div>
                    <div className="font-bold text-neutral-900 text-sm">{client.city}</div>
                    {client.district && (
                      <div className="text-xs text-neutral-500 font-medium mt-0.5">{client.district}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-neutral-400 italic text-xs">Not provided</span>
                )}
              </TableCell>
              <TableCell className="py-4 px-6 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-900 hover:bg-white/80 rounded-xl transition-all cursor-pointer">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border border-neutral-200/80 rounded-2xl shadow-xl text-neutral-800 p-1.5 min-w-[170px]">
                    <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5">Client Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="rounded-xl px-3 py-2 text-xs font-semibold hover:bg-neutral-100 cursor-pointer flex items-center gap-2 text-neutral-700" onClick={() => onView(client)}>
                      <Eye className="h-3.5 w-3.5 text-neutral-600" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl px-3 py-2 text-xs font-semibold hover:bg-neutral-100 cursor-pointer flex items-center gap-2 text-neutral-700" onClick={() => onEdit(client)}>
                      <Edit className="h-3.5 w-3.5 text-neutral-600" /> Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl px-3 py-2 text-xs font-semibold hover:bg-neutral-100 cursor-pointer flex items-center gap-2 text-sky-700" onClick={() => router.push(`/dashboard/pos?clientId=${client.id}`)}>
                      <FileText className="h-3.5 w-3.5 text-sky-600" /> Create Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neutral-100 my-1" />
                    <DropdownMenuItem className="rounded-xl px-3 py-2 text-xs font-semibold hover:bg-rose-50 text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-2" onClick={() => onDelete(client)}>
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-16 text-center text-neutral-500 font-medium">
                No clients found matching your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
