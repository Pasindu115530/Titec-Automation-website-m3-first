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
import { FileText, Save, History, Printer, Package, Receipt } from 'lucide-react';
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
      
      if (!result.offline && result.id) {
        // Confirm the invoice to deduct stock
        await invoiceService.confirmInvoice(result.id);
        
        // If not credit, record the payment
        if (details.payment_method !== 'credit' && details.amount_paid > 0) {
          await invoiceService.recordPayment(result.id, details.amount_paid, details.payment_method);
        }
      }
      
      toast.success(result.offline ? 'Order saved offline!' : 'Order completed successfully!');
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
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8.5rem)]">
      {/* Left Area - POS Input (70%) */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Client Picker */}
        <div className="z-20">
          <ClientPicker 
            selectedClient={selectedClient} 
            onSelectClient={setSelectedClient} 
          />
        </div>

        {/* Product Search */}
        <div className="z-10">
          <POSProductSearch onAddProduct={handleAddProduct} />
        </div>

        {/* Invoice Items Card */}
        <div className="flex-1 bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden flex flex-col shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] min-h-[360px]">
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center text-sm font-bold text-neutral-900 tracking-tight">
            <div className="flex items-center gap-2.5 ">
              <div className="h-8 w-8 rounded-xl bg-[#C7F3ED] text-neutral-900 flex items-center justify-center shadow-xs">
                <Receipt className="h-4 w-4" />
              </div>
              <span className="font-bold text-base text-neutral-900">Invoice Items</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C7F3ED] text-neutral-900 shadow-2xs">
                {items.length}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setItems([])} 
              disabled={items.length === 0}
              className="text-neutral-400 hover:text-red-600 hover:bg-red-50 h-8 px-3 rounded-xl text-xs font-semibold transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              Clear All
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {items.length === 0 ? (
              <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-neutral-400 gap-3 py-10">
                <div className="w-16 h-16 rounded-2xl bg-[#E6F9F7] border border-neutral-200/70 flex items-center justify-center text-neutral-400 shadow-inner">
                  <Package className="h-8 w-8 stroke-[1.75]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-neutral-700 text-sm sm:text-base">No items in invoice yet</p>
                  <p className="text-xs text-neutral-400 mt-0.5 font-medium">Scan barcode or search products above to start adding</p>
                </div>
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
      <div className="w-full lg:w-[410px] flex flex-col gap-4">
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
            className="h-14 bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 rounded-2xl shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            onClick={() => router.push('/dashboard/invoices')}
          >
            <History className="mr-2 h-4 w-4 text-neutral-700" /> Recent Invoices
          </Button>
          <Button 
            variant="outline" 
            className="h-14 bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-white/80 rounded-2xl shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            onClick={() => {
              if(!selectedClient) toast.error('Select a client first');
              else toast.info('Draft saving to be implemented');
            }}
          >
            <Save className="mr-2 h-4 w-4 text-amber-600" /> Save Draft
          </Button>
          <Button 
            className="h-16 col-span-2 bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold text-lg rounded-2xl shadow-[0_12px_28px_rgba(215,252,69,0.45),0_2px_6px_rgba(0,0,0,0.06)] border border-[#E9FF7A] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:bg-neutral-200/90 disabled:text-neutral-400 disabled:border-neutral-200/60 disabled:shadow-none disabled:pointer-events-none"
            disabled={items.length === 0 || !selectedClient}
            onClick={() => setIsConfirmModalOpen(true)}
          >
            <FileText className="mr-2 h-5 w-5 text-current" /> Complete Order
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
