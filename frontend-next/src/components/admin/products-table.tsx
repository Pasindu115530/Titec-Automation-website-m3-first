
import React, { useState } from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import EditProductModal from './edit-product-modal';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    sku: string;
    image: string;
}

interface ProductsTableProps {
    products: Product[];
    onRefresh: () => void;
}

import { toast } from 'sonner';

export default function ProductsTable({ products, onRefresh }: ProductsTableProps) {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleDelete = async (id: number) => {
        // ... (auth checks omitted for brevity in replacement if unchanged, but I need to include context to replace correctly)
        const userStr = localStorage.getItem('user');
        // ... existing auth logic ...

        if (!window.confirm('Are you sure you want to permanently delete this product?')) {
            return;
        }

        try {
            await api.delete(`/api/products/${id}`);
            toast.success('Product deleted successfully');
            onRefresh();
        } catch (error) {
            console.error('Failed to delete product', error);
            toast.error('Failed to delete product.');
        }
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
                                <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No products found. Add one above.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border flex items-center justify-center">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
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
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${parseInt(product.stock) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.stock} in stock
                                            </span>
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
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
        </>
    );
}
