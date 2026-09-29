import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface POSConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: {
    payment_method: string;
    amount_paid: number;
    notes: string;
    terms: string;
    due_date?: string;
  }) => void;
  grandTotal: number;
  isSubmitting: boolean;
}

export function POSConfirmModal({ isOpen, onClose, onConfirm, grandTotal, isSubmitting }: POSConfirmModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(grandTotal);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setAmountPaid(grandTotal);
      setPaymentMethod('cash');
      setNotes('');
      setTerms('');
      setDueDate('');
    }
  }, [isOpen, grandTotal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      payment_method: paymentMethod,
      amount_paid: amountPaid,
      notes,
      terms,
      due_date: dueDate || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-white text-neutral-900 border border-neutral-200/90 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">Complete Order</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 bg-neutral-50 text-neutral-900 rounded-2xl text-center mb-4 border border-neutral-200/80 shadow-2xs">
              <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Grand Total</div>
              <div className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-0.5">Rs. {grandTotal.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus:ring-2 focus:ring-amber-200 focus:ring-offset-0 focus:outline-none transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-neutral-900 border-neutral-200 rounded-xl shadow-xl">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card / POS</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="credit">Credit (Unpaid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod !== 'credit' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">Amount Paid</Label>
                  <Input 
                    type="number" 
                    value={amountPaid} 
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                    min="0"
                  />
                </div>
              )}
            </div>

            {paymentMethod === 'credit' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Due Date</Label>
                <Input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Internal Notes</Label>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for internal reference"
                className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl resize-none h-18 focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Invoice Terms & Conditions</Label>
              <Textarea 
                value={terms} 
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Printed on the invoice (e.g. Warranty details)"
                className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl resize-none h-18 focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-rose-200 border border-rose-300 text-red-600 hover:bg-rose-300 rounded-xl font-medium shadow-2xs">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-[#D7FC45] hover:bg-[#C9F335] text-neutral-950 font-bold rounded-xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] px-5 transition-all"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
