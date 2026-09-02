'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'customer' | 'admin';

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    token: string;
    roles?: string[];
    permissions?: string[];
};

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isCustomer: boolean;
    // Allows external flows (e.g., Laravel login page) to update auth state immediately
    setUserExternal: (payload: Omit<Partial<User>, 'id'> & { id?: string | number; email?: string; name?: string; role?: UserRole; token?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse saved user', e);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string, role: UserRole) => {
        try {
            console.log(`AuthContext login started for email: ${email}, role: ${role}`);
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://127.0.0.1:8000';
            console.log(`Sending POST request to ${backendUrl}/api/login...`);
            const response = await fetch(`${backendUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log(`Response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const error = await response.json();
                console.error('Login request failed with error payload:', error);
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful, response data received:', data);

            // Map Spatie roles to old local roles
            const isSuperAdmin = data.user.roles?.includes('Super Admin');
            const actualRole = isSuperAdmin ? 'admin' : 'customer';

            // Verify the role matches what's expected
            if (actualRole !== role) {
                throw new Error(`Invalid credentials for ${role} login`);
            }

            const nameParts = (data.user.name || '').split(' ');

            const userData: User = {
                id: data.user._id || data.user.id,
                email: data.user.email,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                role: actualRole,
                token: data.access_token, // ERP format uses access_token
                roles: data.user.roles || [],
                permissions: data.user.permissions || [],
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect based on role
            console.log(`Redirecting to role dashboard: ${role}...`);
            if (role === 'admin') {
                router.push('/dashboard');
            } else {
                router.push('/store');
            }
        } catch (error) {
            console.error('Exception caught in AuthContext login:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('quotationCart'); // Clear cart on logout
        router.push('/');
    };

    const setUserExternal: AuthContextType['setUserExternal'] = (payload) => {
        const id = payload.id !== undefined ? String(payload.id) : user?.id ?? '';
        const email = payload.email ?? user?.email ?? '';
        const name = (payload as { name?: string }).name;
        const firstName = payload.firstName ?? (name ? name.split(' ')[0] : user?.firstName ?? '');
        const lastName = payload.lastName ?? (name ? name.split(' ').slice(1).join(' ') : user?.lastName ?? '');
        const role = payload.role ?? (user?.role ?? 'customer');
        const token = payload.token ?? (typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '');
        const roles = payload.roles ?? user?.roles ?? [];
        const permissions = payload.permissions ?? user?.permissions ?? [];

        const normalized: User = { id, email, firstName, lastName, role, token, roles, permissions };
        setUser(normalized);
        try {
            localStorage.setItem('user', JSON.stringify(normalized));
        } catch {
            // ignore storage errors
        }
    };

    const isAdmin = user?.role === 'admin';
    const isCustomer = user?.role === 'customer';

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAdmin,
            isCustomer,
            setUserExternal,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
