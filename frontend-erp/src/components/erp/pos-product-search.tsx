import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import { productService } from '@/services/productService';

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
        setResults(response.data || []);
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
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
        <Input
          placeholder="Scan barcode or search products by name, model, SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 py-6 bg-[#000619] border-blue-900/50 text-lg text-white shadow-inner focus-visible:ring-blue-500 w-full"
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          autoFocus
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product)}
              className="p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <Package className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">{product.name}</div>
                  <div className="text-sm text-gray-400 flex gap-2">
                    {product.model && <span>Model: {product.model}</span>}
                    {product.stock_quantity !== undefined && (
                      <span className={product.stock_quantity > 0 ? "text-green-400" : "text-red-400"}>
                        • Stock: {product.stock_quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-400 text-lg">Rs. {Number(product.price).toLocaleString()}</div>
                {product.brand && <div className="text-xs text-gray-500">{product.brand.name}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl z-50 p-6 text-center text-gray-400">
          No products found matching "{query}"
        </div>
      )}
    </div>
  );
}
