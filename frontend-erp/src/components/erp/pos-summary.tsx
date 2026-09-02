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
    <div className="bg-[#1f2937] border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-white mb-4">
        <Calculator className="h-5 w-5 text-blue-400" />
        <h3 className="font-bold text-lg font-orbitron tracking-wider">Order Summary</h3>
      </div>

      <div className="flex justify-between items-center text-gray-300">
        <span>Subtotal</span>
        <span className="font-semibold text-white text-lg">Rs. {subtotal.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 items-center">
        <span className="text-gray-300">Discount</span>
        <Select 
          value={discountType} 
          onValueChange={(val: 'fixed' | 'percentage') => onUpdateDiscount(val, discountAmount)}
        >
          <SelectTrigger className="bg-[#111827] border-white/10 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1f2937] border-white/10 text-white">
            <SelectItem value="fixed">Fixed (Rs)</SelectItem>
            <SelectItem value="percentage">Percent (%)</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={discountAmount}
          onChange={(e) => onUpdateDiscount(discountType, parseFloat(e.target.value) || 0)}
          className="bg-[#111827] border-white/10 h-9 text-right"
          min="0"
        />
      </div>

      <div className="flex justify-between items-center text-red-400/80">
        <span>Discount Amount</span>
        <span>
          - Rs. {discountType === 'percentage' 
            ? ((subtotal * discountAmount) / 100).toLocaleString() 
            : discountAmount.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 items-center">
        <span className="text-gray-300">Tax</span>
        <div className="col-span-2 flex items-center gap-2">
          <Input
            type="number"
            value={taxRate}
            onChange={(e) => onUpdateTax(parseFloat(e.target.value) || 0)}
            className="bg-[#111827] border-white/10 h-9 text-right w-20"
            min="0"
            step="0.1"
          />
          <span className="text-gray-400">%</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-blue-300/80">
        <span>Tax Amount</span>
        <span>+ Rs. {taxAmount.toLocaleString()}</span>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex justify-between items-end">
          <span className="text-gray-300 text-lg">Grand Total</span>
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400 font-orbitron">
            Rs. {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
