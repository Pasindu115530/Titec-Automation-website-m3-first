import { fetchFromApi } from './api';

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
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : '';

        return fetchFromApi<DashboardStats>('/api/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
};
