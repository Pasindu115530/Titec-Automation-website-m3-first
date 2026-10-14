import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onPayment: (invoice: any) => void;
  onInvoiceUpdated?: (invoice: any) => void;
}

export function InvoiceDetailModal({ isOpen, onClose, invoice, onPayment, onInvoiceUpdated }: InvoiceDetailModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!invoice) return null;

  const handlePrint = async () => {
    if (!invoice?.id) return;
    setIsPrinting(true);
    const toastId = toast.loading('Generating invoice PDF...');
    try {
      const blob = await invoiceService.downloadInvoicePdf(invoice.id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      
      // Try opening in new tab for preview and printing
      const printWindow = window.open(url, '_blank');
      
      // If popup blocker blocked the new tab, trigger direct download
      if (!printWindow || printWindow.closed || typeof printWindow.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${invoice.invoice_number || invoice.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast.success('Invoice PDF ready!', { id: toastId });
    } catch (error: any) {
      console.error('Print failed', error);
      const msg = error.response?.data?.message || 'Failed to generate invoice PDF.';
      toast.error(msg, { id: toastId });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleConfirmDraft = async () => {
    if (!invoice?.id) return;
    setIsConfirming(true);
    try {
      const res = await invoiceService.confirmInvoice(invoice.id);
      toast.success('Invoice confirmed and stock deducted!');
      if (onInvoiceUpdated) {
        onInvoiceUpdated(res.data || { ...invoice, status: 'confirmed' });
      }
    } catch (error: any) {
      console.error('Failed to confirm draft invoice', error);
      toast.error(error.response?.data?.message || 'Failed to confirm invoice');
    } finally {
      setIsConfirming(false);
    }
  };

  const balance = Number(invoice.grand_total) - Number(invoice.paid_amount || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-6 border border-white/80 dark:border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] text-neutral-900 dark:text-white">
        <DialogHeader>
          <div className="flex justify-between items-center pr-6">
            <DialogTitle className="font-bold tracking-tight text-2xl text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Invoice</span>
              <span className="font-mono text-sm px-2.5 py-1 rounded-xl bg-[#E2D6FE] dark:bg-purple-950/60 text-neutral-900 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40 shadow-2xs">
                {invoice.invoice_number}
              </span>
            </DialogTitle>
            <Badge variant="outline" className={`uppercase tracking-wider font-bold text-xs px-2.5 py-1 rounded-xl shadow-2xs ${
              invoice.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/40' :
              invoice.status === 'partial' || invoice.status === 'partially_paid' ? 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-400 border-sky-300 dark:border-sky-800/40' :
              invoice.status === 'confirmed' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-400 border-purple-300 dark:border-purple-800/40' :
              invoice.status === 'draft' ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800/40' :
              'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
            }`}>
              {invoice.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-2 space-y-5">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-white/[0.04] rounded-2xl border border-neutral-200/70 dark:border-white/10 shadow-2xs">
              <h4 className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider mb-2">Billed To</h4>
              <div className="font-bold text-base text-neutral-900 dark:text-white">{invoice.client?.company_name || invoice.client?.contact_person}</div>
              {invoice.client?.company_name && <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">{invoice.client.contact_person}</div>}
              {invoice.client?.address && <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{invoice.client.address}</div>}
              {invoice.client?.phone && <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">{invoice.client.phone}</div>}
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-white/[0.04] rounded-2xl border border-neutral-200/70 dark:border-white/10 shadow-2xs">
              <h4 className="text-neutral-500 dark:text-neutral-400 font-semibold text-xs uppercase tracking-wider mb-2">Invoice Details</h4>
              <div className="flex justify-between text-xs font-medium py-0.5">
                <span className="text-neutral-500 dark:text-neutral-400">Date</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{new Date(invoice.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs font-medium py-0.5">
                <span className="text-neutral-500 dark:text-neutral-400">Due Date</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Upon Receipt'}</span>
              </div>
              <div className="flex justify-between text-xs font-medium py-0.5">
                <span className="text-neutral-500 dark:text-neutral-400">Terms</span>
                <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{invoice.terms || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2 pb-2 border-b border-neutral-100 dark:border-white/10 flex items-center gap-2">
              <span>Line Items</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300">
                {invoice.items?.length || 0}
              </span>
            </h4>
            <div className="space-y-1.5">
              {invoice.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-white/[0.04] hover:bg-neutral-100/70 dark:hover:bg-white/[0.06] rounded-2xl border border-neutral-200/60 dark:border-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">{item.product_name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Qty: {item.quantity} × Rs. {Number(item.unit_price).toLocaleString()}</div>
                    {item.warranty_months > 0 && (
                      <div className="text-xs text-[#0284C7] dark:text-sky-400 font-semibold mt-0.5">
                        Warranty: {item.warranty_months} Months
                        {item.warranty_start_date && item.warranty_end_date && ` (${new Date(item.warranty_start_date).toLocaleDateString()} - ${new Date(item.warranty_end_date).toLocaleDateString()})`}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">Rs. {Number(item.line_total).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-4 bg-neutral-50 dark:bg-white/[0.04] rounded-2xl border border-neutral-200/70 dark:border-white/10 ml-auto w-full sm:w-72 space-y-2 shadow-2xs">
            <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span className="text-neutral-900 dark:text-white font-semibold">Rs. {Number(invoice.subtotal).toLocaleString()}</span>
            </div>
            {Number(invoice.discount_amount) > 0 && (
              <div className="flex justify-between text-xs font-medium text-rose-600 dark:text-rose-400">
                <span>Discount</span>
                <span className="font-semibold">- Rs. {Number(invoice.discount_amount).toLocaleString()}</span>
              </div>
            )}
            {Number(invoice.tax_amount) > 0 && (
              <div className="flex justify-between text-xs font-medium text-sky-600 dark:text-sky-400">
                <span>Tax</span>
                <span className="font-semibold">+ Rs. {Number(invoice.tax_amount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-base pt-2 border-t border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white">
              <span>Grand Total</span>
              <span>Rs. {Number(invoice.grand_total).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>Amount Paid</span>
              <span>Rs. {Number(invoice.paid_amount || 0).toLocaleString()}</span>
            </div>
            <div className={cn(
              "p-3 rounded-xl flex justify-between items-center font-bold text-sm border shadow-xs transition-colors",
              balance > 0 
                ? "bg-purple-100/90 dark:bg-gradient-to-r dark:from-purple-950/70 dark:to-indigo-950/70 border-purple-200/90 dark:border-purple-500/40 text-purple-950 dark:text-purple-100" 
                : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
            )}>
              <span className={cn(
                "text-xs uppercase tracking-wider font-bold",
                balance > 0 ? "text-purple-800 dark:text-purple-300" : "text-emerald-800 dark:text-emerald-400"
              )}>
                Balance Due
              </span>
              <span className={cn(
                "text-base font-extrabold font-mono",
                balance > 0 ? "text-purple-950 dark:text-white" : "text-emerald-900 dark:text-emerald-300"
              )}>
                Rs. {balance.toLocaleString()}
              </span>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="text-xs text-neutral-600 dark:text-neutral-400 p-3 bg-neutral-50 dark:bg-white/[0.04] rounded-xl border border-neutral-200/60 dark:border-white/10 italic">
              <strong className="text-neutral-800 dark:text-neutral-200 not-italic">Notes:</strong> {invoice.notes}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-neutral-100 dark:border-white/10 pt-4 mt-2 gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handlePrint} disabled={isPrinting} className="border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.06] rounded-xl font-medium shadow-2xs mr-auto">
            <Printer className="mr-2 h-4 w-4" /> {isPrinting ? 'Generating...' : 'Print PDF'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-200 dark:border-rose-800/40 rounded-xl font-medium shadow-2xs cursor-pointer">
            Close
          </Button>
          {invoice.status === 'draft' && (
            <Button
              type="button"
              disabled={isConfirming}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-2xs cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white"
              onClick={handleConfirmDraft}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Confirm Order
                </>
              )}
            </Button>
          )}
          {balance > 0 && (invoice.status === 'confirmed' || invoice.status === 'partially_paid' || invoice.status === 'draft') && (
            <Button type="button" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-2xs cursor-pointer dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white" onClick={() => onPayment(invoice)}>
              <CreditCard className="mr-2 h-4 w-4" /> Record Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
