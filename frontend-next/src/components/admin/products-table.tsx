
import React, { useState } from 'react';
import { Edit2, Trash2, Package, FileText, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import EditProductModal from './edit-product-modal';
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
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const openDeleteConfirm = (product: Product) => {
        setProductToDelete(product);
        setDeleteConfirmOpen(true);
        setDeleteConfirmText('');
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setProductToDelete(null);
        setDeleteConfirmText('');
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            setDeletingId(productToDelete.id);
            await api.delete(`/api/products/${productToDelete.id}`);
            toast.success('Product permanently deleted');
            closeDeleteConfirm();
            onRefresh();
        } catch (error: any) {
            console.error('Failed to delete product', error);
            const msg = error.response?.data?.message || 'Failed to delete product.';
            toast.error(msg);
        } finally {
            setDeletingId(null);
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
            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Existing Products</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Product</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Brand</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Unit</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Spec</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="h-64 bg-gray-50/50">
                                        <Loader variant="inline" size={80} />
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const thumbnail = getThumbnail(product);
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
                                                        {product.sku && <div className="text-xs text-gray-500">SKU: {product.sku}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 capitalize">
                                                {product.category}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 capitalize">
                                                {product.brand || '-'}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                LKR {typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {product.unit || 'nos'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${(product.stock || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.datasheet_path && (
                                                    <a
                                                        href={getImageUrl(product.datasheet_path, '')}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-xs text-blue-600 hover:underline border border-blue-200 rounded px-2 py-1 bg-blue-50 w-fit"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Download
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => setEditingProduct(product)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => openDeleteConfirm(product)}
                                                        disabled={deletingId === product.id}
                                                    >
                                                        {deletingId === product.id ? (
                                                            <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
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

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold text-red-600">⚠️ Permanent Deletion</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-700">
                                You are about to <strong>permanently delete</strong>:
                            </p>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                                <p className="font-medium">{productToDelete?.name}</p>
                                <p className="text-xs text-gray-500">SKU: {productToDelete?.sku || 'N/A'}</p>
                            </div>
                            <p className="text-sm text-red-600 font-medium">
                                This action cannot be undone. The product will be removed from the database.
                            </p>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Type <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">DELETE</span> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                                    placeholder="Type DELETE here"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-2 rounded-b-xl">
                            <Button variant="outline" onClick={closeDeleteConfirm}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={deleteConfirmText !== 'DELETE' || !!deletingId}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
                            >
                                {deletingId ? 'Deleting...' : 'Permanently Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
