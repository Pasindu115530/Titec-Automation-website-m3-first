'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Client } from '@/services/clientService';
import { PendingInvoiceItem } from '@/lib/offline-db';
import { ClientPicker } from '@/components/erp/client-picker';
import { POSProductSearch } from '@/components/erp/pos-product-search';
import { POSItemRow } from '@/components/erp/pos-item-row';
import { POSSummary } from '@/components/erp/pos-summary';
import { POSConfirmModal } from '@/components/erp/pos-confirm-modal';
import { invoiceService } from '@/services/invoiceService';
import { toast } from 'sonner';
import { FileText, Save, History, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function POSPage() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [items, setItems] = useState<PendingInvoiceItem[]>([]);
  
  // Tax and Discount state
  const [taxRate, setTaxRate] = useState(0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived calculations
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.line_total, 0), [items]);
  
  const discountVal = useMemo(() => {
    if (discountType === 'percentage') {
      return (subtotal * discountAmount) / 100;
    }
    return discountAmount;
  }, [subtotal, discountType, discountAmount]);

  const taxAmount = useMemo(() => {
    const afterDiscount = Math.max(0, subtotal - discountVal);
    return (afterDiscount * taxRate) / 100;
  }, [subtotal, discountVal, taxRate]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountVal) + taxAmount;
  }, [subtotal, discountVal, taxAmount]);

  // Handlers
  const handleAddProduct = (product: any) => {
    // Check if item already exists
    const existingIndex = items.findIndex(item => item.product_id === product.id);
    if (existingIndex >= 0) {
      handleUpdateQuantity(existingIndex, items[existingIndex].quantity + 1);
      return;
    }

    const newItem: PendingInvoiceItem = {
      product_id: product.id,
      product_name: product.name,
      product_model: product.model,
      unit_price: Number(product.price) || 0,
      quantity: 1,
      unit: 'pcs',
      warranty_months: product.warranty_months || 12,
      line_total: Number(product.price) || 0,
    };

    setItems([...items, newItem]);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].line_total = newItems[index].unit_price * quantity;
    setItems(newItems);
  };

  const handleUpdatePrice = (index: number, price: number) => {
    const newItems = [...items];
    newItems[index].unit_price = price;
    newItems[index].line_total = price * newItems[index].quantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleConfirmOrder = async (details: any) => {
    if (!selectedClient) {
      toast.error('Please select a client first');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        client_id: selectedClient.id,
        client_name: selectedClient.company_name || selectedClient.contact_person,
        items,
        tax_rate: taxRate,
        discount_amount: discountAmount,
        discount_type: discountType,
        subtotal,
        tax_amount: taxAmount,
        grand_total: grandTotal,
        ...details
      };

      const result = await invoiceService.createInvoice(payload);
      
      toast.success(result.offline ? 'Order saved offline!' : 'Invoice created successfully!');
      setIsConfirmModalOpen(false);
      
      // Reset POS
      setSelectedClient(null);
      setItems([]);
      setDiscountAmount(0);
      setTaxRate(0);

      // Redirect or show print dialog (could route to /dashboard/invoices/preview/...)
    } catch (error) {
      console.error('Failed to process order:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Area - POS Input (70%) */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl shadow-lg">
          <ClientPicker 
            selectedClient={selectedClient} 
            onSelectClient={setSelectedClient} 
          />
        </div>

        <div className="z-10">
          <POSProductSearch onAddProduct={handleAddProduct} />
        </div>

        <div className="flex-1 bg-[#111827] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-lg">
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
            <span>Invoice Items ({items.length})</span>
            <Button variant="ghost" size="sm" onClick={() => setItems([])} className="text-red-400 hover:text-red-300 h-8 text-xs">
              Clear All
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 opacity-50">
                <Package className="h-16 w-16" />
                <p>Scan barcode or search to add products</p>
              </div>
            ) : (
              items.map((item, index) => (
                <POSItemRow 
                  key={index} 
                  item={item} 
                  index={index} 
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdatePrice={handleUpdatePrice}
                  onRemove={handleRemoveItem}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Area - Summary (30%) */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        <POSSummary 
          subtotal={subtotal}
          taxRate={taxRate}
          taxAmount={taxAmount}
          discountType={discountType}
          discountAmount={discountAmount}
          grandTotal={grandTotal}
          onUpdateTax={setTaxRate}
          onUpdateDiscount={(type, amt) => { setDiscountType(type); setDiscountAmount(amt); }}
        />

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button 
            variant="outline" 
            className="h-16 border-white/10 hover:bg-white/5 text-gray-300"
            onClick={() => router.push('/dashboard/invoices')}
          >
            <History className="mr-2 h-5 w-5" /> Recent Invoices
          </Button>
          <Button 
            variant="outline" 
            className="h-16 border-amber-500/30 hover:bg-amber-500/10 text-amber-500"
            onClick={() => {
              // Usually saves as draft
              if(!selectedClient) toast.error('Select a client first');
              else toast.info('Draft saving to be implemented');
            }}
          >
            <Save className="mr-2 h-5 w-5" /> Save Draft
          </Button>
          <Button 
            className="h-20 col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 text-lg font-bold font-orbitron"
            disabled={items.length === 0 || !selectedClient}
            onClick={() => setIsConfirmModalOpen(true)}
          >
            <FileText className="mr-2 h-6 w-6" /> Complete Order
          </Button>
        </div>
      </div>

      <POSConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmOrder}
        grandTotal={grandTotal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
