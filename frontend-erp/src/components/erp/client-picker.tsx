import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, UserPlus, X, Building2 } from 'lucide-react';
import { clientService, Client } from '@/services/clientService';
import { AddClientModal } from './add-client-modal';

interface ClientPickerProps {
  selectedClient: Client | null;
  onSelectClient: (client: Client | null) => void;
}

export function ClientPicker({ selectedClient, onSelectClient }: ClientPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchClients = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await clientService.getClients(query);
        setResults(response.data || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to search clients:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchClients, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (client: Client) => {
    onSelectClient(client);
    setQuery('');
    setIsOpen(false);
  };

  const handleClientAdded = (client: Client) => {
    onSelectClient(client);
    setIsAddModalOpen(false);
  };

  if (selectedClient) {
    return (
      <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
            {selectedClient.client_type === 'business' ? <Building2 className="h-5 w-5 text-white" /> : <User className="h-5 w-5 text-white" />}
          </div>
          <div>
            <div className="font-semibold text-white">
              {selectedClient.client_type === 'business' ? selectedClient.company_name : selectedClient.contact_person}
            </div>
            <div className="text-xs text-blue-300">{selectedClient.phone}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onSelectClient(null)} className="text-gray-400 hover:text-white hover:bg-white/10">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search client by name, phone, or NIC..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-[#1f2937] border-white/10 text-white w-full"
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
          <UserPlus className="h-4 w-4 mr-2" /> New
        </Button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1f2937] border border-white/10 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {results.map((client) => (
            <div
              key={client.id}
              onClick={() => handleSelect(client)}
              className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-white">
                  {client.client_type === 'business' ? client.company_name : client.contact_person}
                </div>
                <div className="text-xs text-gray-400">
                  {client.phone} {client.client_type === 'business' ? `• ${client.contact_person}` : ''}
                </div>
              </div>
              <div className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">
                {client.client_type}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1f2937] border border-white/10 rounded-lg shadow-xl z-50 p-4 text-center text-gray-400">
          No clients found matching "{query}"
        </div>
      )}

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
