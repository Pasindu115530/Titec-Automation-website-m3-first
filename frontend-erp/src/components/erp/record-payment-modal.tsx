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
      <DialogContent className="sm:max-w-[440px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-6 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">Record Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-[#E2D6FE] text-black rounded-2xl p-4 border border-white/80 shadow-xs text-center">
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Balance Due</div>
              <div className="text-3xl font-extrabold text-black tracking-tight mt-0.5">Rs. {balance.toLocaleString()}</div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Payment Amount (Rs.)</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                min="1"
                max={balance}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus:ring-2 focus:ring-amber-200 focus:ring-offset-0 focus:outline-none transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-neutral-900 border-neutral-200 rounded-xl shadow-xl">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card / POS</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-rose-200 border border-rose-300 text-red-600 hover:bg-rose-300 rounded-xl font-medium shadow-2xs">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 px-5 transition-all"
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
