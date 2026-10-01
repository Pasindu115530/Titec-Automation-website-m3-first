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
      <div className="flex items-center justify-between p-3 bg-white border border-neutral-200/90 rounded-2xl shadow-xs transition-all">
        <div className="flex items-center gap-3 pl-2">
          <div className="h-11 w-11 bg-neutral-900 text-[#D7FC45] rounded-2xl flex items-center justify-center shadow-xs shrink-0">
            {selectedClient.client_type === 'business' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
          </div>
          <div>
            <div className="font-bold text-neutral-900 text-base">
              {selectedClient.client_type === 'business' ? selectedClient.company_name : selectedClient.contact_person}
            </div>
            <div className="text-xs text-neutral-500 font-medium flex items-center gap-2">
              <span>{selectedClient.phone}</span>
              <span className="text-neutral-300">•</span>
              <span className="capitalize">{selectedClient.client_type}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onSelectClient(null)} className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100/80 rounded-full h-9 w-9 mr-1">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center bg-white/40 backdrop-blur-md rounded-[32px] p-1 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]  focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-900/5 focus-within:shadow-sm transition-all">
        <div className="pl-3.5 pr-1.5 text-neutral-400 shrink-0">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search client by name, phone, or NIC..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm sm:text-base font-medium text-neutral-900 placeholder:text-neutral-400 h-11 px-2"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {isSearching && (
          <div className="pr-3 shrink-0">
            <div className="animate-spin h-5 w-5 border-2 border-neutral-900 border-t-transparent rounded-full"></div>
          </div>
        )}
        <Button 
          type="button"
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-[#D7FC45] hover:bg-[#d9fa4a] text-black rounded-[32px] px-4 h-10 font-semibold shadow-xs whitespace-nowrap transition-all mr-1 shrink-0 text-xs sm:text-sm shadow-[0_8px_24px_rgba(215,252,69,0.45),0_2px_6px_rgba(0,0,0,0.06)] border border-[#E9FF7A] scale-[1.02]"
        >
          <UserPlus className="h-4 w-4 mr-1.5" /> New
        </Button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 max-h-60 overflow-y-auto p-2">
          {results.map((client) => (
            <div
              key={client.id}
              onClick={() => handleSelect(client)}
              className="p-3.5 hover:bg-neutral-100/80 rounded-xl cursor-pointer border-b border-neutral-100 last:border-0 flex justify-between items-center transition-colors"
            >
              <div>
                <div className="font-bold text-neutral-900">
                  {client.client_type === 'business' ? client.company_name : client.contact_person}
                </div>
                <div className="text-xs text-neutral-500 font-medium mt-0.5">
                  {client.phone} {client.client_type === 'business' ? `• ${client.contact_person}` : ''}
                </div>
              </div>
              <div className="text-xs px-2.5 py-1 bg-neutral-100 rounded-full text-neutral-700 font-semibold capitalize">
                {client.client_type}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 p-6 text-center text-neutral-500 text-sm">
          No clients found matching &quot;{query}&quot;
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
