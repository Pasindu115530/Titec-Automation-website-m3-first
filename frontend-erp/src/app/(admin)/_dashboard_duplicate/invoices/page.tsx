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
          <h1 className="text-3xl font-bold text-white font-orbitron">Invoices</h1>
          <p className="text-gray-400 mt-1">Manage billing and payment history</p>
        </div>
        <Button onClick={() => router.push('/dashboard/pos')} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> New Invoice (POS)
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#111827] p-4 rounded-lg border border-white/10">
        <form onSubmit={handleSearch} className="relative w-full md:w-96 flex">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by invoice # or client..." 
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
