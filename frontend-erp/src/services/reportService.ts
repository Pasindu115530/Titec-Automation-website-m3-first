import { api } from '@/lib/api';

export const reportService = {
    async getSalesSummary(params?: { start_date?: string, end_date?: string, interval?: string }): Promise<any> {
        const response = await api.get('/api/reports/sales', { params });
        return response.data;
    },

    async getInventoryValuation(): Promise<any> {
        const response = await api.get('/api/reports/inventory');
        return response.data;
    },

    async getWarrantyExpiry(params?: { period?: string }): Promise<any> {
        const response = await api.get('/api/reports/warranty', { params });
        return response.data;
    },

    async getTopProducts(params?: { start_date?: string, end_date?: string }): Promise<any> {
        const response = await api.get('/api/reports/top-products', { params });
        return response.data;
    },

    async getClientRevenue(params?: { start_date?: string, end_date?: string }): Promise<any> {
        const response = await api.get('/api/reports/client-revenue', { params });
        return response.data;
    }
};
