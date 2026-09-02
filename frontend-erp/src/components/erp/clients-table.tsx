import React from 'react';
import { Client } from '@/services/clientService';
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
import { MoreHorizontal, Edit, Trash2, Eye, FileText } from 'lucide-react';
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
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading clients...</div>;
  }

  if (clients.length === 0) {
    return <div className="p-8 text-center text-gray-500">No clients found.</div>;
  }

  return (
    <div className="rounded-md border border-white/10 bg-[#111827]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-400 font-semibold">Name / Company</TableHead>
            <TableHead className="text-gray-400 font-semibold">Contact Info</TableHead>
            <TableHead className="text-gray-400 font-semibold">Type</TableHead>
            <TableHead className="text-gray-400 font-semibold">Location</TableHead>
            <TableHead className="text-gray-400 font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
              <TableCell>
                <div className="font-medium text-white">
                  {client.client_type === 'business' ? client.company_name : client.contact_person}
                </div>
                {client.client_type === 'business' && (
                  <div className="text-sm text-gray-400">{client.contact_person}</div>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm text-white">{client.phone}</div>
                <div className="text-xs text-gray-400">{client.email || 'No email'}</div>
              </TableCell>
              <TableCell>
                {client.client_type === 'business' ? (
                  <Badge variant="outline" className="text-indigo-400 border-indigo-400/30">Business</Badge>
                ) : (
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">Individual</Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-300">
                {client.city ? (
                  <>
                    {client.city}
                    {client.district && <span className="text-gray-500 text-xs block">{client.district}</span>}
                  </>
                ) : (
                  <span className="text-gray-500 italic">Not provided</span>
                )}
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
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => onView(client)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => onEdit(client)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-blue-400">
                      <FileText className="mr-2 h-4 w-4" /> Create Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="hover:bg-red-500/20 cursor-pointer text-red-400" onClick={() => onDelete(client)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
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
