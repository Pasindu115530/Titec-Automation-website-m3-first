import React, { useState, useEffect, useRef } from 'react';
import { Check, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { cn } from '@/lib/utils';


import { createPortal } from 'react-dom';

interface ProductAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (product: Product) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
}

export function ProductAutocomplete({ value, onChange, onSelect, placeholder, className, inputClassName }: ProductAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState(value);

    // Portal positioning state
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (value !== searchTerm) {
            setSearchTerm(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // For portal, we need to check if click is inside portal content too, 
            // but portal content logic usually inside portal. 
            // Here we check if click is NOT on input.
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // Check if click target is inside the dropdown (which is in portal)
                // We can assign a class or ID to dropdown
                const dropdown = document.getElementById('product-autocomplete-dropdown');
                if (dropdown && dropdown.contains(event.target as Node)) {
                    return;
                }
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        // Update coords on scroll/resize
        window.addEventListener('scroll', updateCoords, true);
        window.addEventListener('resize', updateCoords);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
        };
    }, []);

    const updateCoords = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    // Update coords when opening
    useEffect(() => {
        if (open) updateCoords();
    }, [open]);

    useEffect(() => {
        const searchProducts = async () => {
            if (!searchTerm || searchTerm.length < 2) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                const results = await productService.getProducts(searchTerm);
                setProducts(results || []);
                setOpen(true);
            } catch (error) {
                console.error("Failed to search products", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchProducts, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelect = (product: Product) => {
        onSelect(product);
        setOpen(false);
        setSearchTerm(product.name);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        onChange(newValue);
        if (newValue.length === 0) setOpen(false);
    };

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            <div className="relative">
                <Input
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={cn(
                        "h-9 rounded-xl border-neutral-200 dark:border-white/10 bg-white dark:bg-white/[0.04] pr-8 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-white/[0.08] focus:border-sky-400 dark:focus:border-sky-500 focus-visible:border-sky-400 dark:focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-400/20 focus-visible:ring-offset-0 focus:outline-none transition-colors",
                        inputClassName
                    )}
                    onFocus={() => {
                        updateCoords();
                        if (products.length > 0) setOpen(true);
                    }}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                    ) : (
                        <Search className="h-3.5 w-3.5" />
                    )}
                </div>
            </div>

            {open && products.length > 0 && typeof document !== 'undefined' && createPortal(
                <div
                    id="product-autocomplete-dropdown"
                    style={{
                        position: 'fixed', // Fixed to view
                        top: containerRef.current?.getBoundingClientRect().bottom ?? 0,
                        left: containerRef.current?.getBoundingClientRect().left ?? 0,
                        width: containerRef.current?.getBoundingClientRect().width ?? 0,
                        zIndex: 9999
                    }}
                    className="mt-1 bg-white dark:bg-[#0F172A] border border-neutral-200 dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto modal-scroll"
                >
                    {products.map((product) => (
                        <button
                            key={product.id}
                            className="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-white/[0.06] transition-colors flex items-center justify-between group cursor-pointer border-b last:border-b-0 border-neutral-100 dark:border-white/5"
                            onClick={() => handleSelect(product)}
                        >
                            <div>
                                <div className="font-medium text-sm text-neutral-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">{product.name}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {product.sku && <span className="mr-2">SKU: {product.sku}</span>}
                                    <span className="font-medium text-amber-600 dark:text-amber-400">Rs. {typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}
