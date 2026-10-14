import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [defaultClients, setDefaultClients] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch initial/recent 4 clients
  const fetchDefaultClients = useCallback(async () => {
    try {
      const response = await clientService.getClients('');
      const clientsList: Client[] = response.data || [];
      const top4 = clientsList.slice(0, 4);
      setDefaultClients(top4);
      return top4;
    } catch (error) {
      console.error('Failed to fetch default clients:', error);
      return [];
    }
  }, []);

  // Pre-fetch default clients on mount for instantaneous dropdown display
  useEffect(() => {
    fetchDefaultClients();
  }, [fetchDefaultClients]);

  // Search when typing
  useEffect(() => {
    if (!query.trim()) {
      if (defaultClients.length > 0) {
        setResults(defaultClients);
      }
      return;
    }

    const searchClients = async () => {
      setIsSearching(true);
      try {
        const response = await clientService.getClients(query.trim());
        const data: Client[] = response.data || [];
        setResults(data.slice(0, 4));
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to search clients:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchClients, 250);
    return () => clearTimeout(debounce);
  }, [query, defaultClients]);

  // Handle click / focus to immediately show 4 records
  const handleFocus = async () => {
    setIsOpen(true);
    if (!query.trim()) {
      if (defaultClients.length > 0) {
        setResults(defaultClients);
      } else {
        const list = await fetchDefaultClients();
        setResults(list);
      }
    }
  };

  const handleSelect = (client: Client) => {
    onSelectClient(client);
    setQuery('');
    setIsOpen(false);
  };

  const handleClientAdded = (client: Client) => {
    onSelectClient(client);
    setIsAddModalOpen(false);
    fetchDefaultClients();
  };

  if (selectedClient) {
    return (
      <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0F172A]/90 border border-neutral-200/90 dark:border-white/10 rounded-2xl shadow-xs transition-all">
        <div className="flex items-center gap-3 pl-2">
          <div className="h-11 w-11 bg-neutral-900 dark:bg-sky-500/20 text-sky-300 dark:text-sky-300 rounded-2xl flex items-center justify-center shadow-xs shrink-0 border border-transparent dark:border-sky-500/30">
            {selectedClient.client_type === 'business' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
          </div>
          <div>
            <div className="font-bold text-neutral-900 dark:text-white text-base">
              {selectedClient.client_type === 'business' ? selectedClient.company_name : selectedClient.contact_person}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2">
              <span>{selectedClient.phone}</span>
              <span className="text-neutral-300 dark:text-neutral-600">•</span>
              <span className="capitalize">{selectedClient.client_type}</span>
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onSelectClient(null)} 
          className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-white/10 rounded-full h-9 w-9 mr-1 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center bg-white/40 dark:bg-white/[0.04] backdrop-blur-md rounded-full p-1 pl-4 pr-1.5 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] focus-within:border-sky-500/80 dark:focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 dark:focus-within:ring-sky-400/25 focus-within:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all">
        <div className="pr-2 text-neutral-400 dark:text-neutral-500 shrink-0">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search client by name, phone, or NIC..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 h-11 px-1 rounded-full"
          style={{ outline: 'none', boxShadow: 'none' }}
          onFocus={handleFocus}
          onClick={handleFocus}
        />
        {isSearching && (
          <div className="pr-3 shrink-0">
            <div className="animate-spin h-4 w-4 border-2 border-neutral-900 dark:border-sky-400 border-t-transparent rounded-full"></div>
          </div>
        )}
        <Button 
          type="button"
          onClick={() => {
            setIsOpen(false);
            setIsAddModalOpen(true);
          }} 
          className="bg-sky-300 hover:bg-sky-400 text-neutral-950 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 dark:text-white dark:border-blue-400/40 dark:shadow-[0_4px_18px_rgba(37,99,235,0.45)] rounded-full px-4 h-10 font-semibold shadow-xs whitespace-nowrap transition-all shrink-0 text-xs sm:text-sm shadow-[0_8px_24px_rgba(125,211,252,0.45),0_2px_6px_rgba(0,0,0,0.06)] border border-sky-200 scale-[1.02] cursor-pointer"
        >
          <UserPlus className="h-4 w-4 mr-1.5" /> New
        </Button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/10 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.45)] z-50 overflow-hidden p-1.5 modal-scroll max-h-64">
          {!query.trim() && (
            <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
              <span>Suggested Clients</span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">({results.length} records)</span>
            </div>
          )}
          {results.map((client) => (
            <div
              key={client.id}
              onClick={() => handleSelect(client)}
              className="px-3.5 py-2 hover:bg-neutral-100/80 dark:hover:bg-white/[0.06] rounded-xl cursor-pointer border-b border-neutral-100 dark:border-white/5 last:border-0 flex justify-between items-center transition-colors group"
            >
              <div className="min-w-0 pr-2">
                <div className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                  {client.client_type === 'business' ? client.company_name : client.contact_person}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                  <span>{client.phone}</span>
                  {client.client_type === 'business' && client.contact_person && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-600">•</span>
                      <span className="truncate">{client.contact_person}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-[11px] px-2 py-0.5 bg-neutral-100 dark:bg-white/[0.08] rounded-md text-neutral-600 dark:text-neutral-300 font-medium capitalize border border-neutral-200/60 dark:border-white/10 shrink-0">
                {client.client_type}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/10 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.45)] z-50 p-4 text-center text-neutral-500 dark:text-neutral-400 text-xs">
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
