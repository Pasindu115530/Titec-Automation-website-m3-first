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
        try {
            const response = await api.get<DashboardStats>('/api/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            // Return empty/safe structure
            return {
                stats: { total: 0, pending: 0, quoted: 0, reviewed: 0 },
                recent_requests: []
            };
        }
    },
};
