import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [defaultProducts, setDefaultProducts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch initial/popular 4 products
  const fetchDefaultProducts = useCallback(async () => {
    try {
      const response = await productService.getProducts('', true);
      const list = response || [];
      const top4 = list.slice(0, 4);
      setDefaultProducts(top4);
      return top4;
    } catch (error) {
      console.error('Failed to fetch default products:', error);
      return [];
    }
  }, []);

  // Pre-fetch default products on mount for instant dropdown on click
  useEffect(() => {
    fetchDefaultProducts();
  }, [fetchDefaultProducts]);

  // Search when typing
  useEffect(() => {
    if (!query.trim()) {
      if (defaultProducts.length > 0) {
        setResults(defaultProducts);
      }
      return;
    }

    const searchProducts = async () => {
      setIsSearching(true);
      try {
        const response = await productService.getProducts(query.trim(), true);
        const list = response || [];
        setResults(list.slice(0, 4));
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchProducts, 250);
    return () => clearTimeout(debounce);
  }, [query, defaultProducts]);

  // Handle click / focus to immediately show 4 records
  const handleFocus = async () => {
    setIsOpen(true);
    if (!query.trim()) {
      if (defaultProducts.length > 0) {
        setResults(defaultProducts);
      } else {
        const list = await fetchDefaultProducts();
        setResults(list);
      }
    }
  };

  const handleSelect = (product: any) => {
    onAddProduct(product);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center bg-white/40 dark:bg-white/[0.04] backdrop-blur-md rounded-[32px] p-1 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] focus-within:border-neutral-400 dark:focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-neutral-900/5 dark:focus-within:ring-sky-500/20 focus-within:shadow-sm transition-all">
        <div className="pl-3.5 pr-1.5 text-neutral-400 dark:text-neutral-500 shrink-0">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Scan barcode or search products by name, model, SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 h-11 px-2"
          onFocus={handleFocus}
          onClick={handleFocus}
        />
        {isSearching && (
          <div className="pr-4 shrink-0">
            <div className="animate-spin h-4 w-4 border-2 border-neutral-900 dark:border-sky-400 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/10 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.45)] z-50 overflow-hidden p-1.5 modal-scroll max-h-72">
          {!query.trim() && (
            <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
              <span>Popular Products</span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">({results.length} records)</span>
            </div>
          )}
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              className="px-3.5 py-2 hover:bg-neutral-100/80 dark:hover:bg-white/[0.06] rounded-xl cursor-pointer border-b border-neutral-100 dark:border-white/5 last:border-0 flex justify-between items-center transition-colors group gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 bg-neutral-100 dark:bg-white/[0.05] border border-neutral-200/70 dark:border-white/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <Package className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2 mt-0.5">
                    {product.model && <span className="truncate max-w-[120px]">{product.model}</span>}
                    {product.stock_quantity !== undefined && (
                      <span className={cn(
                        "px-1.5 py-0.2 rounded-full font-semibold text-[10px]",
                        product.stock_quantity > 0 
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30" 
                          : "bg-red-50 dark:bg-rose-950/40 text-red-600 dark:text-rose-400 border border-red-200/60 dark:border-rose-500/30"
                      )}>
                        Stock: {product.stock_quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-neutral-900 dark:text-white text-sm">
                  Rs. {Number(product.price).toLocaleString()}
                </div>
                {product.brand && (
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                    {product.brand.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/10 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.45)] z-50 p-4 text-center text-neutral-500 dark:text-neutral-400 text-xs">
          No products found matching &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
