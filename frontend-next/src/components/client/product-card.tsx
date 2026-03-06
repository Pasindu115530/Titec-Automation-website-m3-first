import { ShoppingBag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import Link from "next/link";
import { getImageUrl } from "@/utils/image-utils";
import { createSlug } from "@/utils/slug-utils";

interface ProductCardProps {
    product: Product;
    onAddToQuote: () => void;
}

export function ProductCard({ product, onAddToQuote }: ProductCardProps) {
    // ...
    const imageUrl = product.images && product.images.length > 0
        ? getImageUrl(product.images[0], '')
        : (product.image ? getImageUrl(product.image, '') : '');

    return (
        <Link
            href={`/store/${createSlug(product.name, product.id)}`} // Use slug
            className="border rounded-xl bg-white hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group cursor-pointer"
        >
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="w-16 h-16 text-gray-300" />
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col grow">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                        <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">{product.category}</div>
                        {product.brand && (
                            <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">{product.brand}</div>
                        )}
                    </div>
                    {/* Show price if show_price is true (defaulting to true if undefined) */}
                    {product.show_price !== false && (
                        <div className="font-bold text-gray-900">LKR {typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price}</div>
                    )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1" title={product.name}>{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">{product.description}</p>

                <div className="space-y-3 mt-auto">
                    {/* Prevent Link navigation when clicking internal buttons */}
                    {product.datasheet_path && (
                        <object>
                            <a
                                href={getImageUrl(product.datasheet_path, '')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FileText className="w-4 h-4" />
                                Download Datasheet
                            </a>
                        </object>
                    )}

                    <object>
                        <Button
                            onClick={(e) => {
                                e.preventDefault(); // Stop Link navigation
                                e.stopPropagation();
                                onAddToQuote();
                            }}
                            className="w-full gap-2 btn-gradient-primary"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Quotation
                        </Button>
                    </object>
                </div>
            </div>
        </Link>
    );
}
