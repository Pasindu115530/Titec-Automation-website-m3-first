"use client";

import { Product } from "@/types";
import { ProductCard } from "@/components/client/product-card";
import { useCart } from "@/context/CartContext";
import { getImageUrl } from "@/utils/image-utils";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface SimilarProductsProps {
    title: string;
    products: Product[];
}

export default function SimilarProducts({ title, products }: SimilarProductsProps) {
    const { addItem } = useCart();
    const scrollRef = useRef<HTMLDivElement>(null);

    if (products.length === 0) return null;

    const handleAddToQuotation = (product: Product) => {
        const image = product.images && product.images.length > 0
            ? getImageUrl(product.images[0], '')
            : (product.image ? getImageUrl(product.image, '') : '');

        addItem({
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            image,
        }, false);
        toast.success("Item added to the quotation");
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                {/* Desktop arrow buttons */}
                {products.length > 3 && (
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 hover:text-gray-700"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500 hover:text-gray-700"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {/* Mobile swipe hint */}
                {products.length > 1 && (
                    <span className="md:hidden text-xs text-gray-400 flex items-center gap-1">
                        Swipe <ChevronRight className="w-3 h-3" />
                    </span>
                )}
            </div>
            <div
                ref={scrollRef}
                className="similar-products-scroll flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            >
                {products.map(p => (
                    <div key={p.id} className="min-w-[min(280px,85vw)] max-w-[300px] snap-start shrink-0">
                        <ProductCard
                            product={p}
                            onAddToQuote={() => handleAddToQuotation(p)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
