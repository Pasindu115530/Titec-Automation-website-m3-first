'use client';

import React, { useState, useEffect } from 'react';
import { Save, Package, Tag, DollarSign, Package2, Image as ImageIcon, Grid3x3, Upload, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProductsTable from '@/components/admin/products-table';
import { productService } from '@/services/productService';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Form State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [datasheetFile, setDatasheetFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    sku: '',
    on_store: true,
  });

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
      console.log(data);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDatasheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDatasheetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.price || !formData.category || !formData.stock) {
        setError('Please fill in all required fields');
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('stock', formData.stock);
      data.append('sku', formData.sku);
      data.append('on_store', formData.on_store ? '1' : '0');

      // Append images
      imageFiles.forEach((file) => {
        data.append('images[]', file);
      });

      // Append datasheet
      if (datasheetFile) {
        data.append('datasheet', datasheetFile);
      }

      await api.post('/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product created successfully');
      router.refresh();

      // Reset Form
      setFormData({
        name: '', description: '', price: '', category: '', brand: '', stock: '', sku: '', on_store: true
      });
      setImageFiles([]);
      setImagePreviews([]);
      setDatasheetFile(null);

      fetchProducts(); // Refresh table
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'An error occurred';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">Product Management</h1>
          <p className="text-gray-500 mt-1">Create and manage your product catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Product Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package2 className="w-5 h-5 text-indigo-600" />
              Add New Product
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input className="pl-8" type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock <span className="text-red-500">*</span></label>
                  <Input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Qty" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Select or Type..."
                    list="categories"
                    className="pl-9"
                    required
                  />
                  <datalist id="categories">
                    <option value="PLC" />
                    <option value="VFD" />
                    <option value="Relay" />
                    <option value="HMI" />
                    <option value="Circuit Breaker" />
                  </datalist>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Omron, Siemens, etc."
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">SKU / Model</label>
                <Input name="sku" value={formData.sku} onChange={handleInputChange} placeholder="Optional" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Images</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500">Upload Images (Max 5MB)</span>
                  </div>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square border rounded-md overflow-hidden group">
                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="sr-only">Remove</span>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Datasheet Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Datasheet (PDF)</label>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="application/pdf" onChange={handleDatasheetChange} className="text-xs" />
                  {datasheetFile && <FileText className="w-5 h-5 text-green-600" />}
                </div>
              </div>

              {/* On Store Toggle */}
              <div className="space-y-2 py-3 px-4 bg-gray-50 rounded-lg border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="on_store"
                    checked={formData.on_store}
                    onChange={(e) => setFormData(prev => ({ ...prev, on_store: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Display in Store</span>
                    <p className="text-xs text-gray-500">Show this product to customers on the storefront</p>
                  </div>
                </label>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? 'Saving...' : 'Create Product'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Product List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-gray-800">Product Catalog</h3>
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
    </div>
  );
}
