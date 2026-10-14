import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { invoiceService } from '@/services/invoiceService';
import { toast } from 'sonner';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onPaymentRecorded: (invoice: any) => void;
}

export function RecordPaymentModal({ isOpen, onClose, invoice, onPaymentRecorded }: RecordPaymentModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balance = invoice ? Number(invoice.grand_total) - Number(invoice.paid_amount || 0) : 0;

  useEffect(() => {
    if (isOpen && invoice) {
      setAmount(balance);
      setMethod('cash');
    }
  }, [isOpen, invoice, balance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    if (amount <= 0 || amount > balance) {
      toast.error('Invalid payment amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await invoiceService.recordPayment(invoice.id, amount, method);
      toast.success('Payment recorded successfully');
      onPaymentRecorded(response.invoice || response);
      onClose();
    } catch (error: any) {
      console.error('Failed to record payment', error);
      const msg = error.response?.data?.message || 'Failed to record payment';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-6 border border-white/80 dark:border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] text-neutral-900 dark:text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">Record Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-purple-100/90 dark:bg-gradient-to-r dark:from-purple-950/70 dark:to-indigo-950/70 text-purple-950 dark:text-white rounded-2xl p-4 border border-purple-200/90 dark:border-purple-500/40 shadow-xs text-center">
              <div className="text-xs font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wider">Balance Due</div>
              <div className="text-3xl font-extrabold text-purple-950 dark:text-white tracking-tight mt-0.5 font-mono">
                Rs. {Number(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Payment Amount (Rs.)</Label>
              <Input 
                type="number" 
                step="0.01"
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="bg-neutral-50 dark:bg-white/[0.04] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-white/[0.08] focus:border-sky-400 dark:focus:border-sky-500 focus-visible:border-sky-400 dark:focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-400/20 focus-visible:ring-offset-0 focus:outline-none transition-colors font-mono"
                min="0.01"
                max={balance}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="bg-neutral-50 dark:bg-white/[0.04] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-white/[0.08] focus:border-sky-400 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 focus:ring-offset-0 focus:outline-none transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] text-neutral-900 dark:text-white border-neutral-200 dark:border-white/10 rounded-xl shadow-xl">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card / POS</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-200 dark:border-rose-800/40 rounded-xl font-medium shadow-2xs cursor-pointer">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(14,165,233,0.35)] dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white px-5 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
