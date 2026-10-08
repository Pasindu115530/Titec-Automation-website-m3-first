import { api } from '@/lib/api';

export interface ServiceLog {
    id: number;
    uuid: string;
    client_id: number;
    invoice_item_id: number | null;
    product_id: number | null;
    technician_id: number;
    title: string;
    description: string;
    diagnosis: string | null;
    resolution: string | null;
    service_type: 'warranty' | 'repair' | 'maintenance' | 'installation';
    service_date: string;
    next_service_date: string | null;
    service_charge: number;
    status: 'pending' | 'in_progress' | 'completed';
    created_at: string;
    updated_at: string;
    client?: {
        id: number;
        company_name: string;
        contact_name: string;
    };
    technician?: {
        id: number;
        name: string;
    };
    product?: {
        id: number;
        name: string;
    };
}

export const serviceLogService = {
    async getServiceLogs(params?: { search?: string, status?: string, type?: string, page?: number }): Promise<any> {
        const response = await api.get('/api/service-logs', { params });
        return response.data;
    },

    async getServiceLogById(id: number | string): Promise<ServiceLog> {
        const response = await api.get(`/api/service-logs/${id}`);
        return response.data;
    },

    async createServiceLog(data: any): Promise<ServiceLog> {
        const response = await api.post('/api/service-logs', data);
        return response.data;
    },

    async updateServiceLog(id: number | string, data: any): Promise<ServiceLog> {
        const response = await api.put(`/api/service-logs/${id}`, data);
        return response.data;
    },

    async checkWarranty(serialNumber: string): Promise<any> {
        const response = await api.get('/api/warranty/check', { params: { serial_number: serialNumber } });
        return response.data;
    },

    async getExpiringWarranties(days = 30): Promise<any> {
        const response = await api.get('/api/warranty/expiring', { params: { days } });
        return response.data;
    }
};
