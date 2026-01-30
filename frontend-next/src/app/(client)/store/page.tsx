"use client"

import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, FileText } from "lucide-react";
import { productService } from "@/services/productService";
import { Product } from "@/types";

import ProductDetailsModal from "@/components/client/product-details-modal";
import { ProductCard } from "@/components/client/product-card";

export default function Store() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const { addItem } = useCart();
    const { isAdmin } = useAuth();

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
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

        fetchProducts();
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

    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        return `${backendUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    const getDisplayImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            return getImageUrl(product.images[0]);
        }
        if (product.image) {
            return getImageUrl(product.image);
        }
        return '';
    };

    if (loading && products.length === 0) {
        return <Loader />;
    }

    return (
        <>
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
                                            onSelect={() => setSelectedProduct(p)}
                                            onAddToQuote={() => handleAddToQuotation(p)}
                                            getImageUrl={getDisplayImage}
                                            getDatasheetUrl={getImageUrl}
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
                                                    onSelect={() => setSelectedProduct(p)}
                                                    onAddToQuote={() => handleAddToQuotation(p)}
                                                    getImageUrl={getDisplayImage}
                                                    getDatasheetUrl={getImageUrl}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
            <ProductDetailsModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
                onAddToQuote={(p) => {
                    handleAddToQuotation(p);
                    setSelectedProduct(null); // Optional: close modal on add? maybe keep open. Let's keep open or toast.
                    // The handleAddToQuotation likely triggers a toast or drawer open.
                }}
            />
            <Footer />
        </>
    )
}

function Package(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22v-10" />
        </svg>
    )
}
