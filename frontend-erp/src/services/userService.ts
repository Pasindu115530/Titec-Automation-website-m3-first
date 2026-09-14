import { api } from '@/lib/api';

export interface Role {
    id: number;
    name: string;
}

export interface Employee {
    id: number;
    user_id: number;
    employee_id: string;
    first_name?: string;
    last_name?: string;
    personal_email?: string;
    department?: string;
    designation?: string;
    phone?: string;
    nic?: string;
    date_of_birth?: string;
    date_joined?: string;
    address?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    employment_status: 'active' | 'inactive' | 'terminated';
    email_provisioning_status?: 'pending_email' | 'provisioned' | 'active';
    notes?: string;
    avatar_path?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles?: Role[];
    employee?: Employee;
    force_password_reset?: boolean;
}

export const userService = {
    async getUsers(): Promise<User[]> {
        const response = await api.get('/api/users');
        return response.data;
    },

    async createUser(userData: { name: string; first_name: string; last_name: string; email: string; personal_email: string; roles: number[]; department?: string; designation?: string; }): Promise<User> {
        const response = await api.post('/api/users', userData);
        return response.data;
    },

    async updateUser(id: number, userData: { name: string; first_name?: string; last_name?: string; email: string; personal_email?: string; roles: number[]; department?: string; designation?: string; }): Promise<User> {
        const response = await api.put(`/api/users/${id}`, userData);
        return response.data;
    },

    async deleteUser(id: number | string): Promise<any> {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    },

    async getRoles(): Promise<any> {
        const response = await api.get('/api/roles');
        return response.data;
    },

    async resendWelcome(id: number | string): Promise<any> {
        const response = await api.post(`/api/users/${id}/resend-welcome`);
        return response.data;
    }
};

export const employeeService = {
    async getEmployees(params?: any): Promise<Employee[]> {
        const response = await api.get('/api/employees', { params });
        return response.data;
    },

    async getEmployee(id: number | string): Promise<Employee> {
        const response = await api.get(`/api/employees/${id}`);
        return response.data;
    },

    async updateEmployee(id: number | string, data: any): Promise<Employee> {
        const response = await api.put(`/api/employees/${id}`, data);
        return response.data;
    }
};
