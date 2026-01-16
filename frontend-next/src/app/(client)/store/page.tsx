"use client"

import Loader from "@/components/loader";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { productService } from "@/services/productService";
import { Product } from "@/types";
import { Forum } from "next/font/google";

export default function Store() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const { addItem } = useCart();
    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToQuotation = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            category: product.category,
            description: product.description, // using description from type
        });
    };

    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        // Handle storage paths if seeded with 'products/' vs public path
        // Seeder saved as 'products/filename.jpg' or '/products/filename.jpg'
        // If it starts with /, append to backendUrl. If not, maybe append /
        const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${backendUrl}${path}`;
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map(p => (
                        <div key={p.id} className="border rounded-lg p-4 bg-white hover:shadow-lg transition-shadow">
                            <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-4 flex items-center justify-center relative overflow-hidden">
                                {p.image ? (
                                    <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ShoppingBag className="w-16 h-16 text-gray-400" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="font-semibold text-lg">{p.name}</div>
                                <div className="text-xs text-gray-500 uppercase">{p.category}</div>
                                <div className="text-gray-600 text-sm mb-3 line-clamp-2">{p.description}</div>
                                <div className="flex items-center justify-between pt-2">
                                    {/* Price is hidden for customers, shown for admins */}
                                    {isAdmin ? (
                                        <div className="text-lg font-bold text-gray-700">${p.price}</div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">Price on request</div>
                                    )}
                                    <Button
                                        onClick={() => handleAddToQuotation(p)}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Quotation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}
