'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { isERPUser, ROLES } from '@/lib/rbac';

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
    requiresPasswordReset?: boolean;
};

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isCustomer: boolean;
    /** Check if user has a specific Spatie role */
    hasRole: (role: string) => boolean;
    /** Check if user has any of the given Spatie roles */
    hasAnyRole: (roles: string[]) => boolean;
    /** Check if user has a specific Spatie permission (dot-notation) */
    hasPermission: (permission: string) => boolean;
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
            console.log(`[AuthSystem] Login process started | Email: ${email} | Expected Role: ${role}`);
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            console.log(`[AuthSystem] Sending POST request to ${backendUrl}/api/login...`);
            
            let response: Response;
            try {
                response = await fetch(`${backendUrl}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
            } catch (fetchErr: any) {
                console.error(`[AuthSystem] Network error connecting to ${backendUrl}/api/login:`, fetchErr);
                throw new Error(`Unable to connect to authentication server at ${backendUrl}. Please ensure the backend server is running.`);
            }

            console.log(`[AuthSystem] Server response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                let errorData: any = {};
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { message: `HTTP Error ${response.status}` };
                }
                console.error('[AuthSystem] Login request failed with payload:', errorData);
                const message = errorData.errors?.email?.[0] || errorData.message || 'Login failed';
                throw new Error(message);
            }

            const data = await response.json();
            console.log('[AuthSystem] Login successful, user payload received:', data.user);

            // Map Spatie roles to local role: any ERP role → 'admin', otherwise 'customer'
            const userRoles = data.user.roles || [];
            const hasERPAccess = isERPUser({ roles: userRoles });
            const actualRole: UserRole = hasERPAccess ? 'admin' : 'customer';

            // Verify the role matches what's expected
            if (actualRole !== role) {
                console.warn(`[AuthSystem] Role mismatch: User has '${actualRole}' (roles: ${userRoles.join(', ')}), requested '${role}'`);
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
                roles: userRoles,
                permissions: data.user.permissions || [],
                requiresPasswordReset: data.user.requires_password_reset || false,
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.access_token);
            console.log('[AuthSystem] Auth state updated & session stored.');

            // Redirect based on role and password reset requirement
            if (data.user.requires_password_reset) {
                console.log('[AuthSystem] User requires password reset. Redirecting to change password page.');
                router.push('/dashboard/change-password');
                return;
            }

            console.log(`[AuthSystem] Redirecting to ${role === 'admin' ? '/dashboard' : '/store'}...`);
            if (role === 'admin') {
                router.push('/dashboard');
            } else {
                router.push('/store');
            }
        } catch (error) {
            console.error('[AuthSystem] Exception caught during login:', error);
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

    // ── RBAC Helpers ────────────────────────────────

    const hasRole = useCallback((role: string): boolean => {
        if (!user?.roles) return false;
        if (user.roles.includes(ROLES.SUPER_ADMIN)) return true;
        return user.roles.includes(role);
    }, [user?.roles]);

    const hasAnyRole = useCallback((roles: string[]): boolean => {
        if (!user?.roles) return false;
        if (user.roles.includes(ROLES.SUPER_ADMIN)) return true;
        return roles.some(role => user.roles!.includes(role));
    }, [user?.roles]);

    const hasPermission = useCallback((permission: string): boolean => {
        if (!user) return false;
        if (user.roles?.includes(ROLES.SUPER_ADMIN)) return true;
        return user.permissions?.includes(permission) ?? false;
    }, [user]);

    const isAdmin = user?.role === 'admin';
    const isCustomer = user?.role === 'customer';

    const contextValue = useMemo(() => ({
        user,
        isLoading,
        login,
        logout,
        isAdmin,
        isCustomer,
        hasRole,
        hasAnyRole,
        hasPermission,
        setUserExternal,
    }), [user, isLoading, isAdmin, isCustomer, hasRole, hasAnyRole, hasPermission]);

    return (
        <AuthContext.Provider value={contextValue}>
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

