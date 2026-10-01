'use client';

import React, { useState, useEffect } from 'react';
import { clientService, Client } from '@/services/clientService';
import { ClientsTable } from '@/components/erp/clients-table';
import { AddClientModal } from '@/components/erp/add-client-modal';
import { EditClientModal } from '@/components/erp/edit-client-modal';
import { ClientDetailDrawer } from '@/components/erp/client-detail-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  // Debounced search could be implemented here, but simple fetch on enter/click for now
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
    // Optionally prepend to list or re-fetch
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-orbitron">Clients</h1>
          <p className="text-gray-400 mt-1">Manage your business and individual customers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111827] p-4 rounded-lg border border-white/10">
        <form onSubmit={handleSearch} className="relative w-full md:w-96 flex">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by name, phone, email, TIN..." 
            className="pl-9 bg-[#1f2937] border-white/10 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" className="hidden">Search</Button>
        </form>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      <ClientsTable 
        clients={clients} 
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
