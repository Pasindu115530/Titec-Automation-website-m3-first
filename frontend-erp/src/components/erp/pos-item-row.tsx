import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { PendingInvoiceItem } from '@/lib/offline-db';

interface POSItemRowProps {
  item: PendingInvoiceItem;
  index: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdatePrice: (index: number, price: number) => void;
  onRemove: (index: number) => void;
}

export function POSItemRow({ item, index, onUpdateQuantity, onUpdatePrice, onRemove }: POSItemRowProps) {
  return (
    <div className="flex items-center gap-4 p-3 bg-[#1f2937] border border-white/5 rounded-lg mb-2 transition-colors hover:bg-white/5">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">{item.product_name}</div>
        <div className="text-xs text-gray-400 flex gap-2">
          {item.product_model && <span>Model: {item.product_model}</span>}
          <span>Warranty: {item.warranty_months}m</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Rs.</span>
        <Input
          type="number"
          value={item.unit_price}
          onChange={(e) => onUpdatePrice(index, parseFloat(e.target.value) || 0)}
          className="w-24 bg-[#111827] border-white/10 text-right h-9"
          min="0"
        />
      </div>

      <div className="flex items-center gap-1 bg-[#111827] border border-white/10 rounded-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-gray-400 hover:text-white"
          onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value) || 1)}
          className="w-14 bg-transparent border-0 text-center h-9 p-0 focus-visible:ring-0"
          min="1"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-gray-400 hover:text-white"
          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-28 text-right font-bold text-white">
        Rs. {item.line_total.toLocaleString()}
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(index)}
        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-9 w-9"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
