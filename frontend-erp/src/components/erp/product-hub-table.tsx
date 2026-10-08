import React, { useState } from 'react';
import { Edit2, Trash2, Package, FileText, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Product } from '@/types';
import Loader from '@/components/loader';
import { getImageUrl } from '@/utils/image-utils';
import { productService } from '@/services/productService';
import { useAuth } from '@/context/AuthContext';
import { InventoryItem } from '@/services/inventoryService';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

    // Client-side pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;
    const totalPages = Math.ceil(products.length / pageSize);
    
    // Reset to page 1 when products change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [products]);

    const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
        <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-neutral-200/70 hover:bg-transparent bg-white/40">
                            <TableHead className="py-3 px-6">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                    Product
                                </span>
                            </TableHead>
                            <TableHead className="py-3 px-6">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                    Category / Brand
                                </span>
                            </TableHead>
                            <TableHead className="py-3 px-6">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                    Price (LKR)
                                </span>
                            </TableHead>
                            <TableHead className="py-3 px-6">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                    Stock
                                </span>
                            </TableHead>
                            {(canEdit || canDelete) && (
                                <TableHead className="py-3 px-6">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                        Web Visibility
                                    </span>
                                </TableHead>
                            )}
                            <TableHead className="py-3 px-6 text-right">
                                <div className="flex justify-end">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/80 text-neutral-600 border border-white/80 shadow-2xs">
                                        Actions
                                    </span>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={(canEdit || canDelete) ? 6 : 5} className="h-64 bg-white/30 backdrop-blur-sm">
                                    <Loader variant="inline" size={80} />
                                </TableCell>
                            </TableRow>
                        ) : paginatedProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={(canEdit || canDelete) ? 6 : 5} className="px-6 py-16 text-center text-neutral-500 font-medium">
                                    No products found matching your criteria on this page.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProducts.map((product) => {
                                const thumbnail = getThumbnail(product);
                                const isTogglingStore = togglingId === `${product.id}-on_store`;
                                const isTogglingPrice = togglingId === `${product.id}-show_price`;
                                const invItem = mapToInventoryItem(product);
                                
                                return (
                                    <TableRow key={product.id} className="border-b border-neutral-200/50 hover:bg-white/60 transition-colors">
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-white/80 overflow-hidden shrink-0 border border-neutral-200/80 shadow-2xs flex items-center justify-center">
                                                    {thumbnail ? (
                                                        <img
                                                            src={getImageUrl(thumbnail, '')}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-5 w-5 text-neutral-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-neutral-900 text-sm tracking-tight">{product.name}</div>
                                                    <div className="text-xs text-neutral-500 font-mono font-medium mt-0.5">
                                                        {product.sku || product.model_number || 'No SKU'}
                                                    </div>
                                                    {product.datasheet_path && (
                                                        <a
                                                            href={getImageUrl(product.datasheet_path, '')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 mt-1 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100 transition-colors"
                                                        >
                                                            <FileText className="w-3 h-3" /> Datasheet
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="text-neutral-900 font-bold text-sm tracking-tight capitalize">{product.category}</div>
                                            <div className="text-xs text-neutral-500 font-medium capitalize mt-0.5">{product.brand || '-'}</div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 font-mono font-bold text-sm text-neutral-900">
                                            {typeof product.price === 'string' ? parseFloat(product.price).toLocaleString('en-US', {minimumFractionDigits: 2}) : (product.price || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-2xs
                                            ${(product.stock || 0) > 5 ? 'bg-[#E6F9F7] text-[#0D9488] border-teal-200/60' : 
                                              (product.stock || 0) > 0 ? 'bg-amber-50 text-amber-800 border-amber-200/80' : 
                                              'bg-rose-50 text-rose-700 border-rose-200/60'}`}>
                                                <Package className="w-3.5 h-3.5 mr-1.5" />
                                                {product.stock || 0} <span className="ml-1 opacity-70 font-medium lowercase">{product.unit || 'nos'}</span>
                                            </span>
                                        </TableCell>
                                        {(canEdit || canDelete) && (
                                            <TableCell className="py-4 px-6">
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={!!product.on_store}
                                                            disabled={isTogglingStore || !canEdit}
                                                            onChange={() => handleToggle(product, 'on_store', !!product.on_store)}
                                                        />
                                                        <div className="w-8 h-4.5 bg-neutral-200/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[14px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#7C3AED] relative opacity-disabled shadow-inner group-hover:after:scale-95"></div>
                                                        <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">On Web</span>
                                                        {isTogglingStore && <Loader size={12} className="ml-1" />}
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={!!product.show_price}
                                                            disabled={isTogglingPrice || !canEdit}
                                                            onChange={() => handleToggle(product, 'show_price', !!product.show_price)}
                                                        />
                                                        <div className="w-8 h-4.5 bg-neutral-200/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[14px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0D9488] relative opacity-disabled shadow-inner group-hover:after:scale-95"></div>
                                                        <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Price</span>
                                                        {isTogglingPrice && <Loader size={12} className="ml-1" />}
                                                    </label>
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    title="History"
                                                    className="h-8 w-8 p-0 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-white/80 border border-transparent hover:border-neutral-200/80 shadow-none hover:shadow-2xs transition-all"
                                                    onClick={() => onViewHistory(invItem)}
                                                >
                                                    <History className="h-4 w-4" />
                                                </Button>

                                                {canEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit details"
                                                        className="h-8 w-8 p-0 rounded-xl text-sky-600 hover:text-sky-700 hover:bg-sky-50 border border-transparent hover:border-sky-200/60 shadow-none hover:shadow-2xs transition-all ml-1"
                                                        onClick={() => onEdit(product)}
                                                    >
                                                        <Edit2 className="h-4 w-4 stroke-[2.5]" />
                                                    </Button>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete"
                                                        className="h-8 w-8 p-0 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200/60 shadow-none hover:shadow-2xs transition-all"
                                                        onClick={() => onDelete(product)}
                                                    >
                                                        <Trash2 className="h-4 w-4 stroke-[2.5]" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            {totalPages > 1 && (
                <div className="p-4 border-t border-white/60 bg-white/30 backdrop-blur-md">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                    <div className="text-center text-[11px] font-bold uppercase tracking-wider text-neutral-500 mt-2.5">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, products.length)} of {products.length} products
                    </div>
                </div>
            )}
        </div>
    );
}
