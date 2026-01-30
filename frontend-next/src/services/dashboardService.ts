import { api } from '@/lib/api';

export interface DashboardStats {
    stats: {
        total: number;
        pending: number;
        quoted: number;
        reviewed: number;
    };
    recent_requests: {
        id: number;
        customer: string;
        email: string;
        date: string;
        status: string;
        amount: string;
    }[];
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await api.get<DashboardStats>('/api/dashboard/stats');
        return response.data;
    },
};
