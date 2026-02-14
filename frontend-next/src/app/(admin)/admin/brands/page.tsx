'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { brandService } from '@/services/brandService';
import { toast } from 'sonner';
import { Brand } from '@/types';
import BrandsTable from '@/components/admin/brands-table';
import AddBrandModal from '@/components/admin/add-brand-modal';

export default function AdminBrandsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const fetchBrands = async () => {
        setIsLoading(true);
        try {
            const data = await brandService.getBrands();
            setBrands(data);
        } catch (error) {
            console.error('Failed to fetch brands', error);
            toast.error('Failed to load brands');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBrand(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">Brand Management</h1>
                    <p className="text-gray-500 mt-1">Manage partner brands and logos.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4" />
                    <span>Add New Brand</span>
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-indigo-600" />
                        Brands List
                    </h3>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search brands..."
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <BrandsTable
                    brands={filteredBrands}
                    onRefresh={fetchBrands}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                />
            </div>

            <AddBrandModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchBrands}
                brandToEdit={editingBrand}
            />
        </div>
    );
}
