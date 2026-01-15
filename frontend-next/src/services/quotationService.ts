import { fetchFromApi } from './api';
import { Quotation } from '../types/quotation';

export const quotationService = {
    async getQuotations(): Promise<Quotation[]> {
        return fetchFromApi<Quotation[]>('/api/quotations');
    },

    async getQuotationById(id: number): Promise<Quotation> {
        return fetchFromApi<Quotation>(`/api/quotations/${id}`);
    },

    async updateQuotation(id: number, data: Partial<Quotation>): Promise<Quotation> {
        return fetchFromApi<Quotation>(`/api/quotations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // New methods for Requests
    async getQuotationRequests(): Promise<any[]> {
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : '';

        return fetchFromApi<any[]>('/api/quotation-requests', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    async createQuotationRequest(data: { message: string, items: { product_id: number, quantity: number }[] }): Promise<any> {
        return fetchFromApi<any>('/api/quotation-requests', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};
