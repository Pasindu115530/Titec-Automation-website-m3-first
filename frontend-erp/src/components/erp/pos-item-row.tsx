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
    <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white/90 border border-neutral-200/80 rounded-2xl mb-2.5 shadow-xs hover:shadow-md hover:border-neutral-300 transition-all">
      <div className="flex-1 min-w-0">
        <div className="font-bold text-neutral-900 truncate text-sm sm:text-base">{item.product_name}</div>
        <div className="text-xs text-neutral-500 font-medium flex items-center gap-2 mt-0.5">
          {item.product_model && <span>Model: {item.product_model}</span>}
          <span className="text-neutral-300">•</span>
          <span>Warranty: {item.warranty_months}m</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="text-neutral-400 text-xs font-semibold">Rs.</span>
        <Input
          type="number"
          value={item.unit_price}
          onChange={(e) => onUpdatePrice(index, parseFloat(e.target.value) || 0)}
          className="w-24 sm:w-28 bg-neutral-50 border-neutral-200 text-neutral-900 font-semibold text-right h-9 rounded-xl focus:bg-white"
          min="0"
        />
      </div>

      <div className="flex items-center bg-neutral-100/90 border border-neutral-200/80 rounded-xl p-0.5 shadow-2xs">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-neutral-500 hover:text-neutral-950 hover:bg-white rounded-lg transition-colors"
          onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value) || 1)}
          className="w-10 sm:w-12 bg-transparent border-0 text-center font-bold text-neutral-900 text-sm h-8 p-0 focus-visible:ring-0"
          min="1"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-neutral-500 hover:text-neutral-950 hover:bg-white rounded-lg transition-colors"
          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="w-28 sm:w-32 text-right font-extrabold text-neutral-900 text-base sm:text-lg tracking-tight">
        Rs. {item.line_total.toLocaleString()}
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(index)}
        className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 w-9 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
