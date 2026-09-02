'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('erp_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved erp_user', e);
        localStorage.removeItem('erp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      
      const { access_token, user: userData } = response.data;

      const userToStore: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roles: userData.roles || [],
        permissions: userData.permissions || [],
        token: access_token,
      };

      setUser(userToStore);
      localStorage.setItem('erp_user', JSON.stringify(userToStore));
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('erp_user');
      router.push('/');
    }
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    if (user.roles.includes('Super Admin')) return true;
    return user.roles.includes(role);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.roles.includes('Super Admin')) return true;
    return user.permissions.includes(permission);
  };

  const hasAnyRole = (roles: string[]) => {
    if (!user) return false;
    if (user.roles.includes('Super Admin')) return true;
    return roles.some((r) => user.roles.includes(r));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      hasRole,
      hasPermission,
      hasAnyRole
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
