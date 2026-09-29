import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import { productService } from '@/services/productService';
import { cn } from '@/lib/utils';

interface POSProductSearchProps {
  onAddProduct: (product: any) => void;
}

export function POSProductSearch({ onAddProduct }: POSProductSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await productService.getProducts(query);
        setResults(response || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (product: any) => {
    onAddProduct(product);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center bg-white/40 backdrop-blur-md rounded-[32px] p-1 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]  focus-within:border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-900/5 focus-within:shadow-sm transition-all">
        <div className="pl-3.5 pr-1.5 text-neutral-400 shrink-0 ">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Scan barcode or search products by name, model, SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm sm:text-base font-medium text-neutral-900 placeholder:text-neutral-400 h-11 px-2"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {isSearching && (
          <div className="pr-4 shrink-0">
            <div className="animate-spin h-5 w-5 border-2 border-neutral-900 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 max-h-80 overflow-y-auto p-2">
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              className="p-3.5 hover:bg-neutral-100/80 rounded-xl cursor-pointer border-b border-neutral-100 last:border-0 flex justify-between items-center transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 bg-neutral-100 border border-neutral-200/70 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <Package className="h-6 w-6 text-neutral-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-neutral-900 text-base">{product.name}</div>
                  <div className="text-xs text-neutral-500 font-medium flex items-center gap-2 mt-0.5">
                    {product.model && <span>Model: {product.model}</span>}
                    {product.stock_quantity !== undefined && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-semibold text-[11px]",
                        product.stock_quantity > 0 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                          : "bg-red-50 text-red-600 border border-red-200/60"
                      )}>
                        Stock: {product.stock_quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-neutral-900 text-lg">Rs. {Number(product.price).toLocaleString()}</div>
                {product.brand && <div className="text-xs text-neutral-400 font-medium">{product.brand.name}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 p-6 text-center text-neutral-500 text-sm">
          No products found matching &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
