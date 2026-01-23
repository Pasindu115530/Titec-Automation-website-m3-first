import { ShoppingBag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
    isAdmin: boolean;
    onSelect: () => void;
    onAddToQuote: () => void;
    getImageUrl: (product: Product) => string;
    getDatasheetUrl: (path: string) => string;
}

export function ProductCard({ product, isAdmin, onSelect, onAddToQuote, getImageUrl, getDatasheetUrl }: ProductCardProps) {
    const imageUrl = getImageUrl(product);
    return (
        <div
            className="border rounded-xl bg-white hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group cursor-pointer"
            onClick={onSelect}
        >
            <div className="h-48 bg-gray-100 relative overflow-hidden">
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
                    <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">{product.category}</div>
                    {isAdmin && (
                        <div className="font-bold text-gray-900">LKR {typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price}</div>
                    )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1" title={product.name}>{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">{product.description}</p>

                <div className="space-y-3 mt-auto">
                    {product.datasheet_path && (
                        <a
                            href={getDatasheetUrl(product.datasheet_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FileText className="w-4 h-4" />
                            Download Datasheet
                        </a>
                    )}

                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToQuote();
                        }}
                        className="w-full gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Quotation
                    </Button>
                </div>
            </div>
        </div>
    );
}
