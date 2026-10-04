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
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">Brand Management</h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">Manage partner brands and logos.</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer text-sm"
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add New Brand</span>
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/40 backdrop-blur-md p-2.5 sm:p-3 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-2 pl-3">
                        <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                            <LayoutGrid className="w-3.5 h-3.5 mr-1.5 text-[#E0781E]" />
                            Brands List
                        </span>
                    </div>
                    <div className="relative w-full sm:w-72 flex items-center">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search brands..."
                            className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
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
