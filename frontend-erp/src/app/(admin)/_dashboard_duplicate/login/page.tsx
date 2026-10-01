'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, AlertTriangle, AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import TitecErpLogo from '@/components/titec-erp-logo';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isAdmin, setUserExternal } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If already logged in as admin, redirect to admin dashboard
        if (isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, router]);

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            console.log('Starting login process for:', data.email);
            // Get CSRF cookie first
            console.log('Fetching CSRF cookie from /sanctum/csrf-cookie...');
            await api.get('/sanctum/csrf-cookie');
            console.log('CSRF cookie obtained successfully.');
            
            // Then submit login
            console.log('Submitting login credentials to /api/login...');
            const response = await api.post('/api/login', data);
            console.log('Login API request successful. Response data:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Login request failed in handleLogin:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const axiosError = error as Record<string, any>;
                if (axiosError.response) {
                    console.error('Server responded with status:', axiosError.response.status);
                    console.error('Server responded with data:', axiosError.response.data);
                }
                if (axiosError.response && axiosError.response.data) {
                    throw axiosError.response.data;
                }
            }
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        console.log('Login form submitted.');

        try {
            const payload = {
                email,
                password,
            };

            const data = await handleLogin(payload);
            console.log('Processing successful login data...', data);

            // Store token (supports both 'token' and 'access_token' keys)
            const token = (data as Record<string, unknown>).token as string | undefined ?? (data as Record<string, unknown>).access_token as string | undefined;
            if (token) {
                console.log('Token found, saving to localStorage...');
                localStorage.setItem('token', token);
                try {
                    // Optionally set default Authorization header for subsequent requests
                    // Lazy import to avoid SSR issues
                    const { api } = await import('@/lib/api');
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    console.log('Authorization header set for subsequent requests.');
                } catch {
                    console.warn('Failed to set Authorization header via import.');
                    // no-op if import fails; requests will still read token via interceptor
                }
            } else {
                console.warn('No token or access_token found in response data!');
            }

            // Store user data
            if (data.user) {
                console.log('User object found, saving to localStorage and updating AuthContext...');
                localStorage.setItem('user', JSON.stringify(data.user));
                // Immediately update AuthContext so header reflects login without refresh
                try {
                    setUserExternal({
                        id: (data.user as Record<string, unknown>).id as string | number,
                        email: (data.user as Record<string, unknown>).email as string,
                        name: (data.user as Record<string, unknown>).name as string,
                        role: (data.user as Record<string, unknown>).role as any,
                        token,
                    });
                    console.log('AuthContext updated successfully.');
                } catch (e) {
                    console.error('Failed to update AuthContext:', e);
                    // no-op
                }
            } else {
                console.warn('No user object found in response data!');
            }

            // Success - redirect to admin dashboard
            console.log('Login process complete. Redirecting to /dashboard...');
            router.push('/dashboard');
        } catch (err: unknown) {
            console.error('Error caught in handleSubmit:', err);
            // Laravel often returns validation errors under `errors` key
            if (err && typeof err === 'object' && 'errors' in err) {
                const errors = (err as Record<string, unknown>).errors as Record<string, any[]>;
                const firstKey = Object.keys(errors)[0];
                const validationError = errors[firstKey][0];
                console.error('Extracted validation error:', validationError);
                setError(validationError);
            } else if (err && typeof err === 'object' && 'message' in err) {
                console.error('Extracted API error message:', (err as Record<string, any>).message);
                setError((err as Record<string, any>).message);
            } else if (typeof err === 'string') {
                console.error('Extracted string error:', err);
                setError(err);
            } else {
                console.error('Unknown error format:', err);
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            console.log('Login attempt finished. Setting isLoading to false.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F0F2F5] overflow-hidden select-none selection:bg-sky-300 selection:text-neutral-900">
            {/* Ambient Dashboard Background Glow Blobs */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-300/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-300/10 rounded-full blur-[130px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md relative z-10 flex flex-col items-center"
            >
                {/* Official TiTec Animated Brand Header */}
                <div className="mb-6 flex flex-col items-center">
                    <TitecErpLogo logoHeight={48} speed={4} showBadge={false} />
                </div>

                {/* Glassmorphic Login Card */}
                <div className="w-full bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">

                    {/* Card Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100/90 border border-neutral-200/60 text-[11px] font-bold text-neutral-700 tracking-wide uppercase mb-3">
                            <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
                            <span>System Administrator</span>
                        </div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Admin Access</h1>
                        <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                            Restricted area • Authorized personnel only
                        </p>
                    </div>

                    {/* Warning Notice Box */}
                    <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
                            This is a restricted login portal for system administrators only. Unauthorized access attempts are monitored and logged.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Admin Email Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                Admin Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@titec.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 bg-neutral-50/80 hover:bg-neutral-50 focus:bg-white border-neutral-200/80 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 rounded-2xl text-neutral-900 placeholder:text-neutral-400 text-sm font-medium transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-11 bg-neutral-50/80 hover:bg-neutral-50 focus:bg-white border-neutral-200/80 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 rounded-2xl text-neutral-900 placeholder:text-neutral-400 text-sm font-medium transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="p-3 text-xs sm:text-sm text-red-700 bg-red-50/90 border border-red-200/80 rounded-2xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                                    <span>Authenticating...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Sign in as Admin</span>
                                    <ArrowRight className="w-4 h-4 text-neutral-950 transition-transform group-hover:translate-x-1" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-neutral-400">
                        <p>Admin accounts are managed by system administrators.</p>
                        <p className="mt-0.5">No registration is available through this portal.</p>
                    </div>
                </div>

                {/* Back to main site link */}
                <div className="mt-5 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to main site</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
