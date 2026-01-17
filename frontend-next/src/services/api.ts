import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
        const headers: HeadersInit = {
            'Accept': 'application/json',
            ...options?.headers,
        };

        if (!(options?.body instanceof FormData)) {
            (headers as any)['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Fetch error for ${endpoint}:`, error);
        throw error;
    }
}

