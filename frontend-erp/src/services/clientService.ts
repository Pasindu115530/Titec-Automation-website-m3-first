import { api } from '@/lib/api';

export interface Client {
    id: number;
    user_id?: number;
    company_name?: string;
    contact_person: string;
    email?: string;
    phone: string;
    secondary_phone?: string;
    nic?: string;
    address?: string;
    city?: string;
    district?: string;
    client_type: 'individual' | 'business';
    tax_id?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export const clientService = {
    async getClients(search = '', page = 1) {
        const response = await api.get(`/clients?search=${encodeURIComponent(search)}&page=${page}`);
        return response.data;
    },

    async getClient(id: number) {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    async getClientHistory(id: number) {
        const response = await api.get(`/clients/${id}/history`);
        return response.data;
    },

    async createClient(data: Partial<Client>) {
        const response = await api.post('/clients', data);
        return response.data;
    },

    async updateClient(id: number, data: Partial<Client>) {
        const response = await api.put(`/clients/${id}`, data);
        return response.data;
    },

    async deleteClient(id: number) {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    }
};
