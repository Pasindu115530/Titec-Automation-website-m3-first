import { api } from '@/lib/api';

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles?: Role[];
}

export const userService = {
    async getUsers(): Promise<any> {
        const response = await api.get('/api/users');
        return response.data;
    },

    async createUser(data: any): Promise<User> {
        const response = await api.post('/api/users', data);
        return response.data;
    },

    async updateUser(id: number | string, data: any): Promise<User> {
        const response = await api.put(`/api/users/${id}`, data);
        return response.data;
    },

    async deleteUser(id: number | string): Promise<any> {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    },

    async getRoles(): Promise<any> {
        const response = await api.get('/api/roles');
        return response.data;
    }
};
