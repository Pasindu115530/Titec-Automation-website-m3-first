import React, { useState } from 'react';
import { Edit2, Trash2, Package, FileText, Settings, History, PlusSquare, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Product } from '@/types';
import Loader from '@/components/loader';
import { getImageUrl } from '@/utils/image-utils';
import { productService } from '@/services/productService';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/lib/rbac';
import { InventoryItem } from '@/services/inventoryService';

interface ProductHubTableProps {
    products: Product[];
    onRefresh: () => void;
    isLoading?: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onViewHistory: (item: InventoryItem) => void;
}

const mapToInventoryItem = (product: Product): InventoryItem => ({
    id: product.id,
    product_code: product.sku || product.model_number || '-',
    name: product.name,
    description: product.description || '',
    price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
    stock_quantity: product.stock || 0,
    min_stock_level: 5 // Default for now
} as unknown as InventoryItem);

export default function ProductHubTable({ 
    products, 
    onRefresh, 
    isLoading,
    onEdit,
    onDelete,
    onViewHistory
}: ProductHubTableProps) {
    const { hasPermission } = useAuth();
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const canEdit = hasPermission('products.edit');
    const canDelete = hasPermission('products.delete');

    const handleToggle = async (product: Product, field: 'on_store' | 'show_price', currentValue: boolean) => {
        try {
            setTogglingId(`${product.id}-${field}`);
            await productService.toggleVisibility(product.id, field, !currentValue);
            toast.success(`${field === 'on_store' ? 'Web visibility' : 'Price visibility'} updated`);
            onRefresh();
        } catch (error: any) {
            console.error('Toggle failed', error);
            toast.error(error.message || 'Failed to update visibility');
        } finally {
            setTogglingId(null);
        }
    };

    const getThumbnail = (product: Product) => {
        if (product.images && product.images.length > 0) {
            return product.images[0];
        }
        return product.image || null;
    };

    return (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Product</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Category / Brand</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Price (LKR)</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
                            {(canEdit || canDelete) && (
                                <th className="px-6 py-3 font-medium text-gray-500">Web Visibility</th>
                            )}
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="h-64 bg-gray-50/50">
                                    <Loader variant="inline" size={80} />
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No products found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const thumbnail = getThumbnail(product);
                                const isTogglingStore = togglingId === `${product.id}-on_store`;
                                const isTogglingPrice = togglingId === `${product.id}-show_price`;
                                const invItem = mapToInventoryItem(product);
                                
                                return (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border flex items-center justify-center">
                                                    {thumbnail ? (
                                                        <img
                                                            src={getImageUrl(thumbnail, '')}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                                                        {product.sku || product.model_number || 'No SKU'}
                                                    </div>
                                                    {product.datasheet_path && (
                                                        <a
                                                            href={getImageUrl(product.datasheet_path, '')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100"
                                                        >
                                                            <FileText className="w-3 h-3" /> Datasheet
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 capitalize">{product.category}</div>
                                            <div className="text-xs text-gray-500 capitalize">{product.brand || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {typeof product.price === 'string' ? parseFloat(product.price).toLocaleString('en-US', {minimumFractionDigits: 2}) : (product.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${(product.stock || 0) > 5 ? 'bg-green-50 text-green-700 border-green-200' : 
                                              (product.stock || 0) > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                              'bg-red-50 text-red-700 border-red-200'}`}>
                                                <Package className="w-3 h-3 mr-1.5" />
                                                {product.stock || 0} {product.unit || 'nos'}
                                            </span>
                                        </td>
                                        {(canEdit || canDelete) && (
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={!!product.on_store}
                                                            disabled={isTogglingStore || !canEdit}
                                                            onChange={() => handleToggle(product, 'on_store', !!product.on_store)}
                                                        />
                                                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 relative opacity-disabled"></div>
                                                        <span className="text-xs font-medium text-gray-700">On Web</span>
                                                        {isTogglingStore && <Loader size={12} className="ml-1" />}
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={!!product.show_price}
                                                            disabled={isTogglingPrice || !canEdit}
                                                            onChange={() => handleToggle(product, 'show_price', !!product.show_price)}
                                                        />
                                                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600 relative opacity-disabled"></div>
                                                        <span className="text-xs font-medium text-gray-700">Price</span>
                                                        {isTogglingPrice && <Loader size={12} className="ml-1" />}
                                                    </label>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    title="History"
                                                    className="h-8 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                    onClick={() => onViewHistory(invItem)}
                                                >
                                                    <History className="h-4 w-4" />
                                                </Button>

                                                {canEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit details"
                                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 ml-2"
                                                        onClick={() => onEdit(product)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => onDelete(product)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
