import { fetchFromApi } from './api';
import { Product } from '../types';

export const productService = {
    async getProducts(search?: string): Promise<Product[]> {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        const response = await fetchFromApi<{ data: Product[] }>(`/api/products${query}`);
        return response.data;
    },

    async getProductById(id: string): Promise<Product> {
        const response = await fetchFromApi<{ data: Product }>(`/api/products/${id}`);
        return response.data;
    }
};
