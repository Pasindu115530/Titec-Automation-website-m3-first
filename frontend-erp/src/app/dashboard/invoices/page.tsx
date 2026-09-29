'use client';

import React, { useState, useEffect } from 'react';
import { invoiceService } from '@/services/invoiceService';
import { InvoicesTable } from '@/components/erp/invoices-table';
import { InvoiceDetailModal } from '@/components/erp/invoice-detail-modal';
import { RecordPaymentModal } from '@/components/erp/record-payment-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (searchTerm = search) => {
    setIsLoading(true);
    try {
      const data = await invoiceService.getInvoices({ search: searchTerm });
      setInvoices(data.data || []);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices(search);
  };

  const handleInvoiceUpdated = (updatedInvoice: any) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    if (selectedInvoice && selectedInvoice.id === updatedInvoice.id) {
      setSelectedInvoice(updatedInvoice);
    }
  };

  const openDetailModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const openPaymentModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
    // Ensure detail modal is closed so they don't overlap awkwardly
    setIsDetailModalOpen(false); 
  };

  const handlePrint = async (invoice: any) => {
    toast.info('Printing... In a real app, this would open a PDF.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">Invoices</h1>
          <p className="text-neutral-500 mt-1 text-sm font-medium">Manage billing and payment history</p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/pos')} 
          className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
        >
          <Plus className="mr-1 h-4 w-4 stroke-[2.5]" /> New Invoice (POS)
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <form onSubmit={handleSearch} className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input 
            placeholder="Search by invoice # or client..." 
            className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" className="hidden">Search</Button>
        </form>
        <div className="flex gap-2 w-full md:w-auto pr-1 shrink-0">
          <Button 
            variant="outline" 
            className="h-11 px-5 rounded-2xl bg-sky-300 hover:bg-sky-400 text-sky-950 border border-sky-400 shadow-2xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Filter className="mr-2 h-4 w-4 text-sky-950" /> Filters
          </Button>
        </div>
      </div>

      <InvoicesTable 
        invoices={invoices} 
        isLoading={isLoading} 
        onView={openDetailModal}
        onPrint={handlePrint}
        onPayment={openPaymentModal}
      />

      <InvoiceDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        invoice={selectedInvoice}
        onPayment={openPaymentModal}
      />

      <RecordPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        invoice={selectedInvoice}
        onPaymentRecorded={handleInvoiceUpdated}
      />
    </div>
  );
}
