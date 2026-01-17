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

    async createQuotationRequest(data: { name: string, email: string, phone: string, message: string, items: { product_id: number, quantity: number }[] }): Promise<any> {
        return fetchFromApi<any>('/api/quotation-requests', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async replyToRequest(id: number, data: { items?: any[], message: string, mode?: 'create' | 'upload', file?: File }): Promise<any> {
        let body;
        let headers = {};

        if (data.mode === 'upload' && data.file) {
            const formData = new FormData();
            formData.append('message', data.message);
            formData.append('mode', 'upload');
            formData.append('file', data.file);
            body = formData;
            // Content-Type header should not be set manually for FormData, browser sets it with boundary
        } else {
            body = JSON.stringify(data);
            headers = { 'Content-Type': 'application/json' };
        }

        return fetchFromApi<any>(`/api/quotation-requests/${id}/reply`, {
            method: 'POST',
            body: body,
            headers: Object.keys(headers).length ? headers : undefined
        });
    },

    async sendDirectQuote(data: { name: string, email: string, phone: string, items: any[], message: string }): Promise<any> {
        return fetchFromApi<any>('/api/quotation-requests/direct', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};
