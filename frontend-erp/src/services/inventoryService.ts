import { api } from '@/lib/api';

export interface InventoryItem {
    id: string | number;
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
    product_id: string | number;
    type: 'receive' | 'adjust' | 'sale' | 'return' | 'damaged' | 'sold' | 'void' | 'received' | 'adjustment';
    movement_type?: 'receive' | 'adjust' | 'sale' | 'return' | 'damaged' | 'sold' | 'void' | 'received' | 'adjustment';
    quantity: number;
    stock_before: number;
    stock_after: number;
    reference_type: string | null;
    reference_id: number | null;
    notes: string | null;
    user_id: number;
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

    async getMovements(productId: string | number, page: number = 1): Promise<any> {
        try {
            const response = await api.get(`/api/inventory/${productId}/movements`, { params: { page } });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch movements:', error);
            throw error;
        }
    },

    async createMovement(productId: string | number, movementType: string, quantity: number, notes?: string): Promise<any> {
        try {
            const response = await api.post('/api/inventory/movement', {
                product_id: productId,
                movement_type: movementType,
                quantity,
                notes
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create stock movement:', error);
            throw error;
        }
    },

    async createBulkMovements(items: { product_id: string | number, quantity: number }[], movementType: string, notes?: string): Promise<any> {
        try {
            const response = await api.post('/api/inventory/movements/bulk', {
                items,
                movement_type: movementType,
                notes
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create bulk stock movements:', error);
            throw error;
        }
    },

    async adjustStock(productId: string | number, quantity: number, notes?: string): Promise<any> {
        try {
            const response = await api.post(`/api/inventory/${productId}/adjust`, { quantity, notes });
            return response.data;
        } catch (error) {
            console.error('Failed to adjust stock:', error);
            throw error;
        }
    },

    async receiveStock(productId: string | number, quantity: number, notes?: string): Promise<any> {
        try {
            const response = await api.post(`/api/inventory/${productId}/receive`, { quantity, notes });
            return response.data;
        } catch (error) {
            console.error('Failed to receive stock:', error);
            throw error;
        }
    }
};
