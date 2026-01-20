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
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${backendUrl}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();

            // Verify the role matches what's expected
            if (data.user.role !== role) {
                throw new Error(`Invalid credentials for ${role} login`);
            }

            const userData: User = {
                id: data.user._id || data.user.id,
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                role: data.user.role,
                token: data.token,
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect based on role
            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/store');
            }
        } catch (error) {
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

        const normalized: User = { id, email, firstName, lastName, role, token };
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
