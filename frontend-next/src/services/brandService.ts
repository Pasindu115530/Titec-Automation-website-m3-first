import { api } from '@/lib/api';
import { Brand } from '@/types';

export const brandService = {
    // Get all brands
    getBrands: async (): Promise<Brand[]> => {
        const response = await api.get('/api/brands');
        return response.data;
    },

    // Create a new brand
    createBrand: async (data: FormData): Promise<Brand> => {
        const response = await api.post('/api/brands', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update a brand
    updateBrand: async (id: number, data: FormData): Promise<Brand> => {
        // Method spoofing for Laravel PUT with files
        data.append('_method', 'PUT');
        const response = await api.post(`/api/brands/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete a brand
    deleteBrand: async (id: number): Promise<void> => {
        await api.delete(`/api/brands/${id}`);
    }
};
