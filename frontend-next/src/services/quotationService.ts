import { api } from '@/lib/api';
import { Quotation } from '../types/quotation';

export const quotationService = {
    async getQuotations(): Promise<Quotation[]> {
        try {
            const response = await api.get<Quotation[]>('/api/quotations');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch quotations:', error);
            return [];
        }
    },

    async getQuotationById(id: string | number): Promise<Quotation> {
        // Keeping this one throwing as individual page should likely 404/error if not found
        const response = await api.get<Quotation>(`/api/quotations/${id}`);
        return response.data;
    },

    async updateQuotation(id: string | number, data: Partial<Quotation>): Promise<Quotation> {
        const response = await api.put<Quotation>(`/api/quotations/${id}`, data);
        return response.data;
    },

    // New methods for Requests
    async getQuotationRequests(page: number = 1, status?: string): Promise<any> {
        try {
            const response = await api.get<any>('/api/quotation-requests', {
                params: {
                    page,
                    status
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch quotation requests:', error);
            return { data: [], current_page: 1, last_page: 1, total: 0 };
        }
    },

    async createQuotationRequest(data: { name: string, email: string, phone: string, message: string, items: { product_id: number, quantity: number }[] }): Promise<any> {
        const response = await api.post<any>('/api/quotation-requests', data);
        return response.data;
    },

    async replyToRequest(id: number, data: { items?: any[], message: string, mode?: 'create' | 'upload', file?: File, vat?: number }): Promise<any> {
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

    async sendDirectQuote(data: { name: string, email: string, phone: string, items?: any[], message: string, mode?: 'create' | 'upload', file?: File, vat?: number }): Promise<any> {
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
    },

    async downloadQuotationPDF(id: number | string): Promise<void> {
        try {
            const response = await api.get(`/api/quotation-requests/${id}/download`, {
                responseType: 'blob', // Important for handling binary data
            });

            // Create a temporary URL for the Blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Try to extract filename from content-disposition
            const contentDisposition = response.headers['content-disposition'];
            let filename = `quotation_${id}.pdf`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
                if (fileNameMatch && fileNameMatch.length === 2)
                    filename = fileNameMatch[1];
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            throw error; // Re-throw to handle in UI
        }
    }
};
