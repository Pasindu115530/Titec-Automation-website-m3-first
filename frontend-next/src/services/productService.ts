import { api } from '@/lib/api';
import { Product } from '../types';

export const productService = {
    async getProducts(search?: string): Promise<Product[]> {
        const params: any = {};
        if (search) params.search = search;

        const response = await api.get<{ data: Product[] }>('/api/products', { params });
        return response.data.data;
    },

    async getProductById(id: string): Promise<Product> {
        const response = await api.get<{ data: Product }>(`/api/products/${id}`);
        return response.data.data;
    }
};
