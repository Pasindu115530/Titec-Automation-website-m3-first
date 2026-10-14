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
    <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white/90 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10 rounded-2xl mb-2.5 shadow-xs hover:shadow-md hover:border-neutral-300 dark:hover:border-white/20 transition-all">
      <div className="flex-1 min-w-0">
        <div className="font-bold text-neutral-900 dark:text-white truncate text-sm sm:text-base">{item.product_name}</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2 mt-0.5">
          {item.product_model && <span>Model: {item.product_model}</span>}
          <span className="text-neutral-300 dark:text-neutral-600">•</span>
          <span>Warranty: {item.warranty_months}m</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="text-neutral-400 dark:text-neutral-500 text-xs font-semibold">Rs.</span>
        <Input
          type="number"
          step="0.01"
          value={item.unit_price}
          onChange={(e) => onUpdatePrice(index, parseFloat(e.target.value) || 0)}
          className="w-24 sm:w-28 bg-neutral-50 dark:bg-white/[0.06] border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white font-semibold text-right h-9 rounded-xl focus:bg-white dark:focus:bg-white/10 font-mono"
          min="0"
        />
      </div>

      <div className="flex items-center bg-neutral-100/90 dark:bg-white/[0.06] border border-neutral-200/80 dark:border-white/10 rounded-xl p-0.5 shadow-2xs">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value) || 1)}
          className="w-10 sm:w-12 bg-transparent border-0 text-center font-bold text-neutral-900 dark:text-white text-sm h-8 p-0 focus-visible:ring-0"
          min="1"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="w-28 sm:w-32 text-right font-extrabold text-neutral-900 dark:text-white text-base sm:text-lg tracking-tight font-mono">
        Rs. {Number(item.line_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(index)}
        className="text-neutral-400 hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 rounded-xl h-9 w-9 transition-colors cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
