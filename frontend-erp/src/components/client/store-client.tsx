"use client";

import { useState, useEffect, useMemo } from "react";
import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Package, Tag } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/client/product-card";
import { productService } from "@/services/productService";
import { getImageUrl } from "@/utils/image-utils";

interface StoreClientProps {
    initialProducts: Product[];
}

export default function StoreClient({ initialProducts }: StoreClientProps) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const { addItem } = useCart();

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Brand filter state
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedSearch === '' && initialProducts.length > 0 && products.length === initialProducts.length) {
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

        if (debouncedSearch !== '' || (products.length === 0 && initialProducts.length === 0)) {
            fetchProducts();
        } else if (debouncedSearch === '' && products !== initialProducts) {
            fetchProducts();
        }

    }, [debouncedSearch]);

    // Extract unique brands from products (sorted alphabetically)
    const uniqueBrands = useMemo(() => {
        const brands = products
            .map(p => p.brand)
            .filter((b): b is string => !!b && b.trim() !== '');
        return [...new Set(brands)].sort((a, b) => a.localeCompare(b));
    }, [products]);

    // Filter products by selected brand
    const filteredProducts = useMemo(() => {
        if (!selectedBrand) return products;
        return products.filter(p => p.brand === selectedBrand);
    }, [products, selectedBrand]);

    // Reset brand filter when search changes
    useEffect(() => {
        setSelectedBrand(null);
    }, [debouncedSearch]);

    const handleAddToQuotation = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            image: getDisplayImage(product),
        }, false);
        toast.success("Item added to the quotation");
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
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-2 md:gap-4">
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

                {/* Brand Filter Bar */}
                {uniqueBrands.length > 0 && (
                    <div className="mb-6 md:mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Filter by Brand</span>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto md:max-h-none md:overflow-visible pr-1">
                            <button
                                onClick={() => setSelectedBrand(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedBrand === null
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                All
                            </button>
                            {uniqueBrands.map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => setSelectedBrand(brand === selectedBrand ? null : brand)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedBrand === brand
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {filteredProducts.length === 0 && !loading ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-600">No products found</h3>
                        <p className="text-gray-500 mt-2">
                            {selectedBrand
                                ? `No products found for brand "${selectedBrand}". Try selecting a different brand.`
                                : 'Try adjusting your search terms.'}
                        </p>
                    </div>
                ) : (
                    loading ? <Loader /> : (
                        <>
                            {debouncedSearch ? (
                                // Search Results (Flat Grid)
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-700">
                                        Search Results
                                        {selectedBrand && <span className="text-indigo-600"> — {selectedBrand}</span>}
                                    </h2>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {filteredProducts.map(p => (
                                            <ProductCard
                                                key={p.id}
                                                product={p}
                                                onAddToQuote={() => handleAddToQuotation(p)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Category Sections
                                <div className="space-y-12">
                                    {Object.entries(
                                        filteredProducts.reduce((acc, product) => {
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
