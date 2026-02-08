// Removed unused 'import axios' to keep bundle small
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://127.0.0.1:8000';

// Added 'fallbackValue' parameter to handle Objects vs Arrays safely
export async function fetchFromApi<T>(endpoint: string, options?: RequestInit, fallbackValue?: T): Promise<T> {
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

        return await response.json();
    } catch (error) {
        console.warn(`⚠️ Build Warning: Could not fetch ${endpoint}. Using fallback data.`);

        // If you provided a specific fallback (like {} for an object), return it.
        if (fallbackValue !== undefined) {
            return fallbackValue;
        }

        // Default to empty array [] (Safe for lists, risky for single objects)
        return [] as unknown as T;
    }
}