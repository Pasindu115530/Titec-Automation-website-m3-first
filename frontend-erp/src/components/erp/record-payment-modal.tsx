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
      onPaymentRecorded(response.invoice);
      onClose();
    } catch (error) {
      console.error('Failed to record payment', error);
      toast.error('Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-[#111827] text-white border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-[#1f2937] p-3 rounded text-center border border-white/5">
              <div className="text-sm text-gray-400">Balance Due</div>
              <div className="text-2xl font-bold text-amber-400">Rs. {balance.toLocaleString()}</div>
            </div>

            <div className="space-y-2">
              <Label>Payment Amount (Rs.)</Label>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="bg-[#1f2937] border-white/10"
                min="1"
                max={balance}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="bg-[#1f2937] border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1f2937] text-white border-white/10">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card / POS</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
