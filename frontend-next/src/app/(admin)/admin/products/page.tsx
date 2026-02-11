'use client';

import React, { useState, useEffect } from 'react';
import { Package, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ProductsTable from '@/components/admin/products-table';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import AddProductModal from '@/components/admin/add-product-modal';

export default function AdminProductsPage() {
  const router = useRouter();
  const [tableLoading, setTableLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      // Use service with search and admin flag
      const data = await productService.getProducts(debouncedSearch, true);
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load products');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    setTableLoading(true);
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProducts}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Product Catalog
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ProductsTable products={products} onRefresh={fetchProducts} isLoading={tableLoading} />
      </div>
    </div>
  );
}

