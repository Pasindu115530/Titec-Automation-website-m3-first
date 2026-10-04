import { api } from '@/lib/api';

export interface ActivityLog {
    id: number;
    log_name: string;
    description: string;
    event: string;
    subject_type: string;
    subject_id: number;
    subject?: any;
    causer: { id: number; name: string } | null;
    properties: {
        old?: Record<string, any>;
        attributes?: Record<string, any>;
        [key: string]: any;
    };
    created_at: string;
}

export const activityLogService = {
    async getActivityLogs(params?: {
        log_name?: string;
        causer_id?: number;
        event?: string;
        from?: string;
        to?: string;
        search?: string;
        page?: number;
    }) {
        const response = await api.get('/api/activity-logs', { params });
        return response.data;
    },
};
