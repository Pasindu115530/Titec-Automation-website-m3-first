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
      <DialogContent className="sm:max-w-[700px] bg-[#111827] text-white border-white/10">
        <DialogHeader>
          <div className="flex justify-between items-center pr-6">
            <DialogTitle className="font-orbitron tracking-wider text-2xl text-blue-400">
              {invoice.invoice_number}
            </DialogTitle>
            <Badge variant="outline" className={`uppercase tracking-wider ${
              invoice.status === 'paid' ? 'text-green-400 border-green-400' :
              invoice.status === 'partial' ? 'text-blue-400 border-blue-400' :
              'text-amber-400 border-amber-400'
            }`}>
              {invoice.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-2 space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#1f2937] rounded-lg border border-white/5">
              <h4 className="text-gray-400 text-sm mb-2">Billed To</h4>
              <div className="font-bold text-lg">{invoice.client?.company_name || invoice.client?.contact_person}</div>
              {invoice.client?.company_name && <div className="text-sm text-gray-300">{invoice.client.contact_person}</div>}
              <div className="text-sm text-gray-400">{invoice.client?.address}</div>
              <div className="text-sm text-gray-400">{invoice.client?.phone}</div>
            </div>
            <div className="p-4 bg-[#1f2937] rounded-lg border border-white/5">
              <h4 className="text-gray-400 text-sm mb-2">Invoice Details</h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Date</span>
                <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Due Date</span>
                <span>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Upon Receipt'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Terms</span>
                <span>{invoice.terms || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-3 border-b border-white/10 pb-2">Line Items</h4>
            <div className="space-y-2">
              {invoice.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-2 hover:bg-white/5 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-xs text-gray-400">Qty: {item.quantity} x Rs. {Number(item.unit_price).toLocaleString()}</div>
                  </div>
                  <div className="font-semibold">Rs. {Number(item.line_total).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-white/10 pt-4 w-64 ml-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span>Rs. {Number(invoice.subtotal).toLocaleString()}</span>
            </div>
            {Number(invoice.discount_amount) > 0 && (
              <div className="flex justify-between text-sm text-red-400">
                <span>Discount</span>
                <span>- Rs. {Number(invoice.discount_amount).toLocaleString()}</span>
              </div>
            )}
            {Number(invoice.tax_amount) > 0 && (
              <div className="flex justify-between text-sm text-blue-300">
                <span>Tax</span>
                <span>+ Rs. {Number(invoice.tax_amount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/5">
              <span>Grand Total</span>
              <span>Rs. {Number(invoice.grand_total).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-green-400">
              <span>Amount Paid</span>
              <span>Rs. {Number(invoice.paid_amount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-amber-400 pt-2">
              <span>Balance Due</span>
              <span>Rs. {balance.toLocaleString()}</span>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="text-sm text-gray-400 p-3 bg-white/5 rounded italic">
              <strong>Notes:</strong> {invoice.notes}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-white/10 pt-4 mt-2">
          <Button type="button" variant="outline" onClick={handlePrint} disabled={isPrinting} className="border-white/10 hover:bg-white/5 mr-auto">
            <Printer className="mr-2 h-4 w-4" /> {isPrinting ? 'Generating...' : 'Print PDF'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
            Close
          </Button>
          {balance > 0 && invoice.status !== 'voided' && (
            <Button type="button" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onPayment(invoice)}>
              <CreditCard className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
