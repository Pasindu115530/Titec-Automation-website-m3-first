"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag, FileText, ChevronLeft, ChevronRight,
    MessageCircle, Share2, Plus, Minus, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getImageUrl } from '@/utils/image-utils';
import { createSlug } from '@/utils/slug-utils';
import { toast } from 'sonner';
import Link from 'next/link';
import Footer from '@/components/footer';
import SimilarProducts from './similar-products';

interface ProductDetailPageProps {
    product: Product;
    similarProducts: Product[];
    relatedProducts: Product[];
}

export default function ProductDetailPage({
    product,
    similarProducts,
    relatedProducts
}: ProductDetailPageProps) {
    const { addItem } = useCart();
    const { isAdmin } = useAuth();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Reset state when product changes
    useEffect(() => {
        setSelectedImageIndex(0);
        setQuantity(1);
    }, [product.id]);

    // Build image list
    const allImages: string[] = [];
    if (product.images && product.images.length > 0) {
        allImages.push(...product.images);
    } else if (product.image) {
        allImages.push(product.image);
    }

    const currentImage = allImages[selectedImageIndex]
        ? getImageUrl(allImages[selectedImageIndex], '')
        : null;

    const nextImage = () => {
        if (allImages.length > 1) {
            setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
        }
    };

    const prevImage = () => {
        if (allImages.length > 1) {
            setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/store/${createSlug(product.name, product.id)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} at Titec Automation`,
                    url: url,
                });
                return;
            } catch {
                // Share cancelled or failed
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleAddToQuote = () => {
        const image = allImages.length > 0 ? getImageUrl(allImages[0], '') : '';

        // Add item with the selected quantity
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                category: product.category,
                description: product.description,
                image,
            }, i === quantity - 1); // Open cart only on last add
        }
        toast.success(`Added ${quantity} × ${product.name} to quotation`);
    };

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* ── Breadcrumb ── */}
                <nav aria-label="Breadcrumb" className="mb-8">
                    <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                        <li className="flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        </li>
                        <li className="text-gray-300">/</li>
                        <li>
                            <Link href="/store" className="hover:text-blue-600 transition-colors">Store</Link>
                        </li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-400 capitalize">{product.category}</li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</li>
                    </ol>
                </nav>

                {/* ── Product Hero ── */}
                <div className="product-detail-grid grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">

                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-gray-100">
                            {currentImage ? (
                                <motion.img
                                    key={currentImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={currentImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 mix-blend-multiply"
                                />
                            ) : (
                                <div className="text-gray-300">
                                    <ShoppingBag className="w-24 h-24" />
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-black transition-all"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-black transition-all"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto py-1 px-1">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-16 h-16 border-2 rounded-lg overflow-hidden shrink-0 transition-all ${selectedImageIndex === idx
                                            ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img, '')}
                                            alt={`${product.name} - Image ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info Panel */}
                    <div className="flex flex-col">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                {product.category}
                            </span>
                            {product.brand && (
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {product.brand}
                                </span>
                            )}
                            {(product.stock || 0) > 0 ? (
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    In Stock
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                            {product.name}
                        </h1>

                        {/* Model Number */}
                        {product.model_number && (
                            <p className="text-sm text-gray-500 mb-5 font-mono bg-gray-50 px-3 py-1.5 rounded-md inline-block w-fit">
                                Model: {product.model_number}
                            </p>
                        )}

                        {/* Price (admin only) */}
                        {isAdmin && (
                            <div className="text-3xl font-bold text-gray-900 mb-5">
                                LKR {typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-sm text-gray-600 mb-6 leading-relaxed max-w-none">
                            <p>{product.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                            {product.sku && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">SKU</span>
                                    <span className="font-medium text-gray-900">{product.sku}</span>
                                </div>
                            )}
                            {product.unit && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Unit</span>
                                    <span className="font-medium text-gray-900">{product.unit}</span>
                                </div>
                            )}
                        </div>

                        {/* ── Quantity Selector ── */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
                            <div className="quantity-selector flex items-center gap-1 w-fit">
                                <button
                                    onClick={decrementQty}
                                    className="h-10 w-10 rounded-l-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition-colors border border-gray-200"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="h-10 w-14 flex items-center justify-center text-base font-semibold text-gray-800 border-y border-gray-200 bg-white select-none">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQty}
                                    className="h-10 w-10 rounded-r-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-colors border border-gray-200"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* ── Action Buttons ── */}
                        <div className="space-y-3 mt-auto">
                            <Button
                                onClick={handleAddToQuote}
                                className="w-full h-14 text-lg gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Add to Quotation
                            </Button>

                            <div className="flex gap-3">
                                {product.datasheet_path && (
                                    <a
                                        href={getImageUrl(product.datasheet_path, '')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Datasheet
                                    </a>
                                )}
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl h-auto py-3"
                                    onClick={() => window.location.href = '/contact'}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Contact Us
                                </Button>
                                <button
                                    onClick={handleShare}
                                    className="p-3 rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-500 hover:text-gray-700"
                                    title="Share this product"
                                    aria-label="Share this product"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Similar Products (same category, different brand) ── */}
                <SimilarProducts
                    title="Similar Products from Other Brands"
                    products={similarProducts}
                />

                {/* ── Related Products (same brand) ── */}
                <SimilarProducts
                    title="More from This Brand"
                    products={relatedProducts}
                />

            </main>
            <Footer />
        </div>
    );
}
