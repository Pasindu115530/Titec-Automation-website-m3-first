'use client';

import React, { useState, useEffect } from 'react';
import { clientService, Client } from '@/services/clientService';
import { ClientsTable } from '@/components/erp/clients-table';
import { AddClientModal } from '@/components/erp/add-client-modal';
import { EditClientModal } from '@/components/erp/edit-client-modal';
import { ClientDetailDrawer } from '@/components/erp/client-detail-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'business' | 'individual'>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async (searchTerm = search) => {
    setIsLoading(true);
    try {
      const data = await clientService.getClients(searchTerm);
      setClients(data.data || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients(search);
  };

  const handleClientAdded = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  const handleClientUpdated = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDelete = async (client: Client) => {
    if (!window.confirm(`Are you sure you want to delete ${client.company_name || client.contact_person}?`)) {
      return;
    }

    try {
      await clientService.deleteClient(client.id);
      toast.success('Client deleted successfully');
      setClients(prev => prev.filter(c => c.id !== client.id));
    } catch (error) {
      console.error('Failed to delete client:', error);
      toast.error('Failed to delete client');
    }
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const openDetailDrawer = (client: Client) => {
    setSelectedClient(client);
    setIsDetailDrawerOpen(true);
  };

  const handleExportCSV = () => {
    if (clients.length === 0) {
      toast.error('No clients to export');
      return;
    }
    const headers = ['ID', 'Type', 'Name / Company', 'Contact Person', 'Phone', 'Email', 'Tax ID', 'NIC', 'City', 'District', 'Address'];
    const rows = filteredClients.map(c => [
      c.id,
      c.client_type,
      `"${(c.company_name || '').replace(/"/g, '""')}"`,
      `"${(c.contact_person || '').replace(/"/g, '""')}"`,
      `"${c.phone || ''}"`,
      `"${c.email || ''}"`,
      `"${c.tax_id || ''}"`,
      `"${c.nic || ''}"`,
      `"${c.city || ''}"`,
      `"${c.district || ''}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clients_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Clients exported to CSV');
  };

  const filteredClients = clients.filter(client => {
    if (typeFilter !== 'all' && client.client_type !== typeFilter) {
      return false;
    }
    if (!search) return true;
    const term = search.toLowerCase();
    const nameMatch = client.company_name?.toLowerCase().includes(term) || client.contact_person?.toLowerCase().includes(term);
    const phoneMatch = client.phone?.toLowerCase().includes(term);
    const emailMatch = client.email?.toLowerCase().includes(term);
    const cityMatch = client.city?.toLowerCase().includes(term);
    const taxMatch = client.tax_id?.toLowerCase().includes(term);
    const nicMatch = client.nic?.toLowerCase().includes(term);
    return nameMatch || phoneMatch || emailMatch || cityMatch || taxMatch || nicMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            Clients
          </h1>
          <p className="text-neutral-500 mt-1 text-sm font-medium">
            Manage your business and individual customers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button
            onClick={() => fetchClients()}
            variant="outline"
            className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 text-neutral-700 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-neutral-700" /> Export CSV
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
          >
            <Plus className="mr-1 h-4 w-4 stroke-[2.5]" /> Add Client
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <form onSubmit={handleSearch} className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input 
            placeholder="Search by name, phone, email, TIN, city..." 
            className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-amber-50/30 border-white focus:border-amber-200 text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" className="hidden">Search</Button>
        </form>

        {/* Client Type Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            All Clients ({clients.length})
          </button>
          <button
            onClick={() => setTypeFilter('business')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              typeFilter === 'business'
                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => setTypeFilter('individual')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              typeFilter === 'individual'
                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            Individual
          </button>
        </div>
      </div>

      <ClientsTable 
        clients={filteredClients} 
        isLoading={isLoading} 
        onEdit={openEditModal}
        onView={openDetailDrawer}
        onDelete={handleDelete}
      />

      <AddClientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onClientAdded={handleClientAdded}
      />

      <EditClientModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onClientUpdated={handleClientUpdated}
        client={selectedClient}
      />

      <ClientDetailDrawer 
        isOpen={isDetailDrawerOpen} 
        onClose={() => setIsDetailDrawerOpen(false)} 
        client={selectedClient}
      />
    </div>
  );
}
