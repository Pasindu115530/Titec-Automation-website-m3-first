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
      <DialogContent className="sm:max-w-[500px] bg-[#111827] text-white border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-orbitron tracking-wider text-xl">Complete Order</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="p-4 bg-[#1f2937] border border-blue-500/30 rounded-lg text-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="text-gray-400 text-sm">Grand Total</div>
              <div className="text-3xl font-bold text-white">Rs. {grandTotal.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-[#1f2937] border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f2937] text-white border-white/10">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card / POS</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="credit">Credit (Unpaid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod !== 'credit' && (
                <div className="space-y-2">
                  <Label>Amount Paid</Label>
                  <Input 
                    type="number" 
                    value={amountPaid} 
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    className="bg-[#1f2937] border-white/10"
                    min="0"
                  />
                </div>
              )}
            </div>

            {paymentMethod === 'credit' && (
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-[#1f2937] border-white/10"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for internal reference"
                className="bg-[#1f2937] border-white/10 resize-none h-20"
              />
            </div>

            <div className="space-y-2">
              <Label>Invoice Terms & Conditions</Label>
              <Textarea 
                value={terms} 
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Printed on the invoice (e.g. Warranty details)"
                className="bg-[#1f2937] border-white/10 resize-none h-20"
              />
            </div>

          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
