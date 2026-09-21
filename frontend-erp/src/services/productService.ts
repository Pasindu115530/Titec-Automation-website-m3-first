import { api } from '@/lib/api';
import { Product } from '../types';

export const productService = {
    async getProducts(search?: string, admin: boolean = false): Promise<Product[]> {
        try {
            const params: any = {};
            if (search) params.search = search;
            if (admin) params.admin = 'true'; // Include all products for admin

            const response = await api.get<{ data: Product[] }>('/api/products', { params });
            return response.data?.data ?? [];
        } catch (error) {
            // Only log errors in development, not during build
            if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
                console.error('Failed to fetch products:', error);
            }
            return [];
        }
    },

    async getProductById(id: string): Promise<Product> {
        const response = await api.get<{ data: Product }>(`/api/products/${id}`);
        return response.data.data;
    },

    async toggleVisibility(id: string | number, field: 'on_store' | 'show_price', value: boolean): Promise<Product> {
        const response = await api.patch<{ data: Product }>(`/api/products/${id}/visibility`, {
            [field]: value,
        });
        return response.data.data;
    }
};
