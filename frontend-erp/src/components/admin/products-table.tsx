
import React, { useState } from 'react';
import { Edit2, Trash2, Package, FileText, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import EditProductModal from './edit-product-modal';
import DeleteConfirmationModal from './delete-confirmation-modal';
import { toast } from 'sonner';
import { Product } from '@/types';
import Loader from '@/components/loader';
import { getImageUrl } from '@/utils/image-utils';

interface ProductsTableProps {
    products: Product[];
    onRefresh: () => void;
    isLoading?: boolean;
}

export default function ProductsTable({ products, onRefresh, isLoading }: ProductsTableProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            setDeletingId(productToDelete.id);
            await api.delete(`/api/products/${productToDelete.id}`);
            toast.success('Product permanently deleted');
            onRefresh();
            setDeleteModalOpen(false);
        } catch (error: any) {
            console.error('Failed to delete product', error);
            const msg = error.response?.data?.message || 'Failed to delete product.';
            toast.error(msg);
        } finally {
            setDeletingId(null);
            setProductToDelete(null);
        }
    };

    const getThumbnail = (product: Product) => {
        if (product.images && product.images.length > 0) {
            return product.images[0];
        }
        return product.image || null;
    };

    return (
        <>
            <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
                <div className="p-4 sm:px-6 border-b border-neutral-200/70 bg-white/40">
                    <h3 className="font-bold text-neutral-800 text-sm">Existing Products</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="border-b border-neutral-200/70 bg-white/30">
                            <tr className="hover:bg-transparent">
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                        Product
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                        Category
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                        Brand
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F6FFD3] text-[#4D6300] border border-[#E9FF7A]/80 shadow-2xs">
                                        Price
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs">
                                        Unit
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#15803D] border border-green-200/80 shadow-2xs">
                                        Stock
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs">
                                        Spec
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-right">
                                    <div className="flex justify-end">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs">
                                            Actions
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100/80">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="py-20 text-center">
                                        <Loader variant="inline" size={80} text="Loading products..." />
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-neutral-500 font-medium">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const thumbnail = getThumbnail(product);
                                    return (
                                        <tr key={product.id} className="hover:bg-white/50 transition-colors border-b border-neutral-100/70">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 rounded-xl bg-white border border-white/80 shadow-2xs overflow-hidden shrink-0 flex items-center justify-center">
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
                                                        <div className="font-bold text-neutral-900 text-sm">{product.name}</div>
                                                        {product.sku && <div className="text-xs text-neutral-500 font-medium">SKU: {product.sku}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700 font-medium capitalize">
                                                {product.category}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700 font-medium capitalize">
                                                {product.brand || '-'}
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-neutral-900 text-sm font-mono">
                                                Rs.{typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-700 font-medium">
                                                {product.unit || 'nos'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs 
                                                ${(product.stock || 0) > 0 ? 'bg-[#DCFCE7] text-[#15803D] border border-green-200/80' : 'bg-[#FEE2E2] text-[#B91C1C] border border-red-200/80'}`}>
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.datasheet_path && (
                                                    <a
                                                        href={getImageUrl(product.datasheet_path, '')}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/80 hover:bg-white border border-neutral-200/80 text-neutral-800 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] w-fit"
                                                    >
                                                        <FileText className="w-3.5 h-3.5 text-neutral-600" />
                                                        Download
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                        onClick={() => setEditingProduct(product)}
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                        onClick={() => openDeleteModal(product)}
                                                        disabled={deletingId === product.id}
                                                    >
                                                        {deletingId === product.id ? (
                                                            <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        )}
                                                    </Button>
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

            <EditProductModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
                onSuccess={onRefresh}
            />

            {/* Shared Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={productToDelete?.name || ''}
                itemIdentifier={productToDelete?.sku ? `SKU: ${productToDelete.sku}` : undefined}
                itemType="Product"
                isDeleting={!!deletingId}
            />
        </>
    );
}
