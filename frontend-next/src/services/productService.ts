import { fetchFromApi } from './api';
import { Product } from '../types';

export const productService = {
    async getProducts(): Promise<Product[]> {
        return fetchFromApi<Product[]>('/api/products');
    },

    async getProductById(id: string): Promise<Product> {
        return fetchFromApi<Product>(`/api/products/${id}`);
    }
};
