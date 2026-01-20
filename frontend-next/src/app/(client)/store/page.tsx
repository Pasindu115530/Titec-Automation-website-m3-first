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

export default function Store() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const { addItem } = useCart();
    const { isAdmin } = useAuth();

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
            description: product.description, // using description from type
        });
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
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map(p => {
                            const imageUrl = getDisplayImage(p);
                            return (
                                <div key={p.id} className="border rounded-xl bg-white hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <ShoppingBag className="w-16 h-16 text-gray-300" />
                                            </div>
                                        )}

                                        {/* Overlay Actions could go here */}
                                    </div>

                                    <div className="p-5 flex flex-col grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">{p.category}</div>
                                            {isAdmin && (
                                                <div className="font-bold text-gray-900">${typeof p.price === 'string' ? parseFloat(p.price).toFixed(2) : p.price}</div>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1" title={p.name}>{p.name}</h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">{p.description}</p>

                                        <div className="space-y-3 mt-auto">
                                            {p.datasheet_path && (
                                                <a
                                                    href={getImageUrl(p.datasheet_path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Download Datasheet
                                                </a>
                                            )}

                                            <Button
                                                onClick={() => handleAddToQuotation(p)}
                                                className="w-full gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                Add to Quotation
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
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
