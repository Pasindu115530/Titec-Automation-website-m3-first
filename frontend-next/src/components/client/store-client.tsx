"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/client/product-card";
import { productService } from "@/services/productService";
import { getImageUrl } from "@/utils/image-utils";

interface StoreClientProps {
    initialProducts: Product[];
}

export default function StoreClient({ initialProducts }: StoreClientProps) {
    // We start with initialProducts. 
    // If the user searches, we might need to fetch manually or filter locally if data is small?
    // The original code fetched based on debounced search. 
    // We can keep that behavior: initial fetch is SSR, subsequent searches are CSR.

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const { addItem } = useCart();
    const { isAdmin } = useAuth();

    // Maintain filtering logic
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        // Skip first effect run if we have initial products and no search query?
        // Actually, if debouncedSearch changes, we fetch. 
        // If it's empty string initially, do we re-fetch?
        // Let's avoid re-fetching if query is empty and we have initial products.

        if (debouncedSearch === '' && initialProducts.length > 0 && products.length === initialProducts.length) {
            // This is a naive check. A better way is to check if we just mounted.
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProducts(debouncedSearch);
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have a search query OR if we want to refresh?
        // For accurate search, we must fetch.
        if (debouncedSearch !== '' || (products.length === 0 && initialProducts.length === 0)) {
            fetchProducts();
        } else if (debouncedSearch === '' && products !== initialProducts) {
            // If we cleared search, revert to initial? Or re-fetch?
            // The backend might return different data if we just call getProducts('');
            // But usually it returns all. 
            // Let's just fetch to be safe if we are navigating back to empty search from non-empty.
            fetchProducts();
        }

    }, [debouncedSearch]);


    const handleAddToQuotation = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            image: getDisplayImage(product),
        }, false);
    };

    const getDisplayImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            return getImageUrl(product.images[0], '');
        }
        if (product.image) {
            return getImageUrl(product.image, '');
        }
        return '';
    };

    return (
        <div className="min-h-screen">
            <main className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {products.length === 0 && !loading ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-600">No products found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    loading ? <Loader /> : (
                        <>
                            {debouncedSearch ? (
                                // Search Results (Flat Grid)
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-700">Search Results</h2>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {products.map(p => (
                                            <ProductCard
                                                key={p.id}
                                                product={p}
                                                isAdmin={isAdmin}
                                                onAddToQuote={() => handleAddToQuotation(p)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Category Sections
                                <div className="space-y-12">
                                    {Object.entries(
                                        products.reduce((acc, product) => {
                                            const cat = product.category || 'Uncategorized';
                                            if (!acc[cat]) acc[cat] = [];
                                            acc[cat].push(product);
                                            return acc;
                                        }, {} as Record<string, Product[]>)
                                    ).map(([category, categoryProducts]) => (
                                        <div key={category} className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-2xl font-bold text-gray-800 capitalize">{category}</h2>
                                                <div className="h-px bg-gray-200 flex-grow"></div>
                                            </div>
                                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {categoryProducts.map(p => (
                                                    <ProductCard
                                                        key={p.id}
                                                        product={p}
                                                        isAdmin={isAdmin}
                                                        onAddToQuote={() => handleAddToQuotation(p)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )
                )}
            </main>
            <Footer />
        </div>
    );
}
