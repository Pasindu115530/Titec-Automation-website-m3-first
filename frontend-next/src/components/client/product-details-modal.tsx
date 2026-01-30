import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, FileText, ChevronLeft, ChevronRight, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getImageUrl } from '@/utils/image-utils';
import { toast } from 'sonner';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToQuote: (product: Product) => void;
}

export default function ProductDetailsModal({ isOpen, onClose, product, onAddToQuote }: ProductDetailsModalProps) {
    const { isAdmin } = useAuth();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Reset image index when product changes
    useEffect(() => {
        if (isOpen) {
            setSelectedImageIndex(0);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleShare = async () => {
        const url = `${window.location.origin}/store/${product.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Check out ${product.name} at Titec Automation`,
                    url: url,
                });
                return;
            } catch (err) {
                console.log('Share failed or cancelled');
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    // Combine main image and gallery images
    const allImages = [];
    if (product.images && product.images.length > 0) {
        allImages.push(...product.images);
    } else if (product.image) {
        allImages.push(product.image);
    }

    const currentImage = allImages[selectedImageIndex] ? getImageUrl(allImages[selectedImageIndex], '') : null;

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

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
                >
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg text-gray-500 hover:text-gray-800 transition-all"
                            title="Share"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg text-gray-500 hover:text-gray-800 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-full">
                        <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center">
                            {currentImage ? (
                                <motion.img
                                    key={currentImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={currentImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain rounded-lg mix-blend-multiply"
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
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-black transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 hover:text-black transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="mt-6 flex gap-2 overflow-x-auto max-w-full px-2 py-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-14 h-14 border-2 rounded-md overflow-hidden flex-shrink-0 transition-all ${selectedImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={getImageUrl(img, '')} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                        <div className="mb-auto">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                                    {product.category}
                                </span>
                                {product.brand && (
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                                        {product.brand}
                                    </span>
                                )}
                                {(product.stock || 0) > 0 ? (
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                            {product.model_number && (
                                <p className="text-sm text-gray-500 mb-4 font-mono">Model: {product.model_number}</p>
                            )}

                            {isAdmin && (
                                <div className="text-2xl font-bold text-gray-900 mb-4">
                                    LKR {typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                                </div>
                            )}

                            <div className="prose prose-sm text-gray-600 mb-6 max-h-[200px] overflow-y-auto pr-2">
                                <p>{product.description}</p>
                            </div>

                            {/* Additional Details */}
                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                {product.sku && (
                                    <div>
                                        <span className="text-gray-500 block">SKU</span>
                                        <span className="font-medium">{product.sku}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t mt-4">
                            <Button
                                onClick={() => onAddToQuote(product)}
                                className="w-full h-12 text-lg gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
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
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Datasheet
                                    </a>
                                )}
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2 border-gray-300 hover:bg-gray-50 text-gray-700"
                                    onClick={() => window.location.href = '/contact'}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Contact Us
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
