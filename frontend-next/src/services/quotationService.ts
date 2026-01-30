import { api } from '@/lib/api';
import { Quotation } from '../types/quotation';

export const quotationService = {
    async getQuotations(): Promise<Quotation[]> {
        const response = await api.get<Quotation[]>('/api/quotations');
        return response.data;
    },

    async getQuotationById(id: number): Promise<Quotation> {
        const response = await api.get<Quotation>(`/api/quotations/${id}`);
        return response.data;
    },

    async updateQuotation(id: number, data: Partial<Quotation>): Promise<Quotation> {
        const response = await api.put<Quotation>(`/api/quotations/${id}`, data);
        return response.data;
    },

    // New methods for Requests
    async getQuotationRequests(page: number = 1, status?: string): Promise<any> {
        const response = await api.get<any>('/api/quotation-requests', {
            params: {
                page,
                status
            }
        });
        return response.data;
    },

    async createQuotationRequest(data: { name: string, email: string, phone: string, message: string, items: { product_id: number, quantity: number }[] }): Promise<any> {
        const response = await api.post<any>('/api/quotation-requests', data);
        return response.data;
    },

    async replyToRequest(id: number, data: { items?: any[], message: string, mode?: 'create' | 'upload', file?: File }): Promise<any> {
        console.log('Service replyToRequest Data:', data);

        let config = {};
        let body: any = data;

        if (data.mode === 'upload' && data.file) {
            const formData = new FormData();
            formData.append('message', data.message);
            formData.append('mode', 'upload');
            formData.append('file', data.file);
            body = formData;
            config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
        }

        const response = await api.post<any>(`/api/quotation-requests/${id}/reply`, body, config);
        return response.data;
    },

    async sendDirectQuote(data: { name: string, email: string, phone: string, items?: any[], message: string, mode?: 'create' | 'upload', file?: File }): Promise<any> {
        let config = {};
        let body: any = data;

        if (data.mode === 'upload' && data.file) {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('phone', data.phone || '');
            formData.append('message', data.message);
            formData.append('mode', 'upload');
            formData.append('file', data.file);
            body = formData;
            config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
        }

        const response = await api.post<any>('/api/quotation-requests/direct', body, config);
        return response.data;
    }
};
