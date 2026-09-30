import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, CreditCard } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onPayment: (invoice: any) => void;
}

export function InvoiceDetailModal({ isOpen, onClose, invoice, onPayment }: InvoiceDetailModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  if (!invoice) return null;

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      // In a real implementation, you might fetch a PDF URL from the backend
      // window.open(invoice.pdf_url, '_blank');
      console.log('Printing invoice...', invoice.id);
    } catch (error) {
      console.error('Print failed', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const balance = Number(invoice.grand_total) - Number(invoice.paid_amount || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-6 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
        <DialogHeader>
          <div className="flex justify-between items-center pr-6">
            <DialogTitle className="font-bold tracking-tight text-2xl text-neutral-900 flex items-center gap-2">
              <span>Invoice</span>
              <span className="font-mono text-sm px-2.5 py-1 rounded-xl bg-[#E2D6FE] text-neutral-900 border border-purple-200/80 shadow-2xs">
                {invoice.invoice_number}
              </span>
            </DialogTitle>
            <Badge variant="outline" className={`uppercase tracking-wider font-bold text-xs px-2.5 py-1 rounded-xl shadow-2xs ${
              invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              invoice.status === 'partial' ? 'bg-sky-100 text-sky-800 border-sky-300' :
              'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {invoice.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-2 space-y-5">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 shadow-2xs">
              <h4 className="text-neutral-500 font-semibold text-xs uppercase tracking-wider mb-2">Billed To</h4>
              <div className="font-bold text-base text-neutral-900">{invoice.client?.company_name || invoice.client?.contact_person}</div>
              {invoice.client?.company_name && <div className="text-xs text-neutral-600 font-medium mt-0.5">{invoice.client.contact_person}</div>}
              {invoice.client?.address && <div className="text-xs text-neutral-500 mt-1">{invoice.client.address}</div>}
              {invoice.client?.phone && <div className="text-xs text-neutral-500 font-mono mt-0.5">{invoice.client.phone}</div>}
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 shadow-2xs">
              <h4 className="text-neutral-500 font-semibold text-xs uppercase tracking-wider mb-2">Invoice Details</h4>
              <div className="flex justify-between text-xs font-medium py-0.5">
                <span className="text-neutral-500">Date</span>
                <span className="text-neutral-800 font-semibold">{new Date(invoice.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs font-medium py-0.5">
                <span className="text-neutral-500">Due Date</span>
                <span className="text-neutral-800 font-semibold">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Upon Receipt'}</span>
              </div>
              <div className="flex justify-between text-xs font-medium py-0.5">
                <span className="text-neutral-500">Terms</span>
                <span className="text-neutral-800 font-semibold">{invoice.terms || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 mb-2 pb-2 border-b border-neutral-100 flex items-center gap-2">
              <span>Line Items</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
                {invoice.items?.length || 0}
              </span>
            </h4>
            <div className="space-y-1.5">
              {invoice.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-neutral-50 hover:bg-neutral-100/70 rounded-2xl border border-neutral-200/60 transition-colors">
                  <div className="flex-1">
                    <div className="font-bold text-sm text-neutral-900">{item.product_name}</div>
                    <div className="text-xs text-neutral-500 font-medium">Qty: {item.quantity} × Rs. {Number(item.unit_price).toLocaleString()}</div>
                  </div>
                  <div className="font-bold text-sm text-neutral-900">Rs. {Number(item.line_total).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/70 ml-auto w-full sm:w-72 space-y-2 shadow-2xs">
            <div className="flex justify-between text-xs font-medium text-neutral-600">
              <span>Subtotal</span>
              <span className="text-neutral-900 font-semibold">Rs. {Number(invoice.subtotal).toLocaleString()}</span>
            </div>
            {Number(invoice.discount_amount) > 0 && (
              <div className="flex justify-between text-xs font-medium text-rose-600">
                <span>Discount</span>
                <span className="font-semibold">- Rs. {Number(invoice.discount_amount).toLocaleString()}</span>
              </div>
            )}
            {Number(invoice.tax_amount) > 0 && (
              <div className="flex justify-between text-xs font-medium text-sky-600">
                <span>Tax</span>
                <span className="font-semibold">+ Rs. {Number(invoice.tax_amount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-base pt-2 border-t border-neutral-200 text-neutral-900">
              <span>Grand Total</span>
              <span>Rs. {Number(invoice.grand_total).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-emerald-700">
              <span>Amount Paid</span>
              <span>Rs. {Number(invoice.paid_amount || 0).toLocaleString()}</span>
            </div>
            <div className="p-3 bg-[#E2D6FE] text-black rounded-xl flex justify-between items-center font-bold text-sm border border-white/80">
              <span className="text-neutral-700 text-xs uppercase tracking-wider">Balance Due</span>
              <span className="text-base font-extrabold text-black">Rs. {balance.toLocaleString()}</span>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="text-xs text-neutral-600 p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 italic">
              <strong className="text-neutral-800 not-italic">Notes:</strong> {invoice.notes}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-neutral-100 pt-4 mt-2 gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handlePrint} disabled={isPrinting} className="border-neutral-200 text-neutral-700 hover:bg-neutral-100 rounded-xl font-medium shadow-2xs mr-auto">
            <Printer className="mr-2 h-4 w-4" /> {isPrinting ? 'Generating...' : 'Print PDF'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="bg-rose-200 border border-rose-300 text-red-600 hover:bg-rose-300 rounded-xl font-medium shadow-2xs">
            Close
          </Button>
          {balance > 0 && invoice.status !== 'voided' && (
            <Button type="button" className="bg-emerald-200 border border-emerald-300 text-emerald-800 hover:bg-emerald-300 font-bold rounded-xl shadow-2xs" onClick={() => onPayment(invoice)}>
              <CreditCard className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
