import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

interface POSSummaryProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType: 'fixed' | 'percentage';
  discountAmount: number;
  grandTotal: number;
  onUpdateTax: (rate: number) => void;
  onUpdateDiscount: (type: 'fixed' | 'percentage', amount: number) => void;
}

export function POSSummary({
  subtotal,
  taxRate,
  taxAmount,
  discountType,
  discountAmount,
  grandTotal,
  onUpdateTax,
  onUpdateDiscount,
}: POSSummaryProps) {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-4">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="h-8 w-8 rounded-xl bg-sky-200/90 text-neutral-800 flex items-center justify-center shadow-2xs">
          <Calculator className="h-4 w-4 text-neutral-700" />
        </div>
        <h3 className="font-bold text-lg text-neutral-900 tracking-tight">Order Summary</h3>
      </div>

      <div className="flex justify-between items-center text-neutral-600 text-sm font-medium py-1">
        <span>Subtotal</span>
        <span className="font-bold text-neutral-900 text-base">Rs. {subtotal.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center text-neutral-600 text-sm font-medium">
        <span className="col-span-4">Discount</span>
        <div className="col-span-4">
          <Select 
            value={discountType} 
            onValueChange={(val: 'fixed' | 'percentage') => onUpdateDiscount(val, discountAmount)}
          >
            <SelectTrigger className="bg-white border-neutral-200 text-neutral-800 rounded-xl h-9 text-xs shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white text-neutral-900 border-neutral-200 rounded-xl shadow-xl">
              <SelectItem value="fixed">Fixed (Rs)</SelectItem>
              <SelectItem value="percentage">Percent (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-4">
          <Input
            type="number"
            value={discountAmount}
            onChange={(e) => onUpdateDiscount(discountType, parseFloat(e.target.value) || 0)}
            className="bg-white border-neutral-200 text-neutral-900 font-semibold rounded-xl h-9 text-right text-xs shadow-2xs focus:bg-white"
            min="0"
          />
        </div>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between items-center text-xs font-semibold text-rose-600 bg-rose-50/80 border border-rose-100 rounded-xl px-3 py-2">
          <span>Discount Deducted</span>
          <span>
            - Rs. {discountType === 'percentage' 
              ? ((subtotal * discountAmount) / 100).toLocaleString() 
              : discountAmount.toLocaleString()}
          </span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-2 items-center text-neutral-600 text-sm font-medium">
        <span className="col-span-4">Tax</span>
        <div className="col-span-8 flex items-center justify-end gap-2">
          <Input
            type="number"
            value={taxRate}
            onChange={(e) => onUpdateTax(parseFloat(e.target.value) || 0)}
            className="bg-white border-neutral-200 text-neutral-900 font-semibold rounded-xl h-9 text-right w-20 text-xs shadow-2xs focus:bg-white"
            min="0"
            step="0.1"
          />
          <span className="text-neutral-400 text-xs font-bold">%</span>
        </div>
      </div>

      {taxRate > 0 && (
        <div className="flex justify-between items-center text-xs font-semibold text-blue-600 bg-blue-50/80 border border-blue-100 rounded-xl px-3 py-2">
          <span>Tax Applied</span>
          <span>+ Rs. {taxAmount.toLocaleString()}</span>
        </div>
      )}

      <div className="pt-2">
        <div className="bg-sky-200/90 text-neutral-900 rounded-2xl p-5 shadow-xs flex justify-between items-end border border-white/80">
          <div>
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">Grand Total</span>
            <span className="text-xs text-neutral-500 mt-0.5 block font-medium">Net payable amount</span>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
              Rs. {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
