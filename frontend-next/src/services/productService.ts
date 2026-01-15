import { fetchFromApi } from './api';
import { Product } from '../types';

export const productService = {
    async getProducts(): Promise<Product[]> {
        const response = await fetchFromApi<{ data: Product[] }>('/api/products');
        return response.data;
    },

    async getProductById(id: string): Promise<Product> {
        const response = await fetchFromApi<{ data: Product }>(`/api/products/${id}`);
        return response.data;
    }
};
