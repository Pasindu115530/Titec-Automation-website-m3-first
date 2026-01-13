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
    }
};
