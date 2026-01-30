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
}

export function ProductAutocomplete({ value, onChange, onSelect, placeholder, className }: ProductAutocompleteProps) {
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
        <div className={cn("relative", className)} ref={containerRef}>
            <div className="relative">
                <Input
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="pr-8"
                    onFocus={() => {
                        updateCoords();
                        if (products.length > 0) setOpen(true);
                    }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
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
                    className="mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                    {products.map((product) => (
                        <button
                            key={product.id}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between group"
                            onClick={() => handleSelect(product)}
                        >
                            <div>
                                <div className="font-medium text-sm text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">
                                    {product.sku && <span className="mr-2">SKU: {product.sku}</span>}
                                    <span className="font-medium text-gray-700">LKR {typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</span>
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
