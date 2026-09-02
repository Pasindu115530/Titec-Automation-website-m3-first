import { api } from '@/lib/api';

export interface InventoryItem {
    id: number;
    name: string;
    description: string | null;
    slug: string;
    product_code: string | null;
    price: number;
    stock_quantity: number;
    min_stock_level: number | null;
    category_id: number | null;
    brand_id: number | null;
    images: string[] | null;
    created_at: string;
    updated_at: string;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface InventoryMovement {
    id: number;
    product_id: number;
    type: 'receive' | 'adjust' | 'sale' | 'return';
    quantity: number;
    previous_stock: number;
    new_stock: number;
    reference_type: string | null;
    reference_id: number | null;
    notes: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
    };
}

export const inventoryService = {
    async getInventory(params?: { search?: string, status?: string, page?: number }): Promise<any> {
        try {
            const response = await api.get('/api/inventory', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            throw error;
        }
    },

    async getMovements(productId: number, page: number = 1): Promise<any> {
        try {
            const response = await api.get(`/api/inventory/${productId}/movements`, { params: { page } });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch movements:', error);
            throw error;
        }
    },

    async adjustStock(productId: number, quantity: number, notes?: string): Promise<any> {
        try {
            const response = await api.post(`/api/inventory/${productId}/adjust`, { quantity, notes });
            return response.data;
        } catch (error) {
            console.error('Failed to adjust stock:', error);
            throw error;
        }
    },

    async receiveStock(productId: number, quantity: number, notes?: string): Promise<any> {
        try {
            const response = await api.post(`/api/inventory/${productId}/receive`, { quantity, notes });
            return response.data;
        } catch (error) {
            console.error('Failed to receive stock:', error);
            throw error;
        }
    }
};
