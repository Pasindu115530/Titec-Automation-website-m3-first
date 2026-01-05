'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If already logged in as admin, redirect to admin dashboard
        if (isAdmin) {
            router.push('/admin');
        }
    }, [isAdmin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password, 'admin');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl border-purple-200">
                    <CardHeader className="space-y-1 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                        <div className="flex items-center justify-center mb-3">
                            <div className="p-3 bg-purple-600 rounded-full">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">Admin Access</CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Restricted area - Authorized personnel only
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-800">
                                This is a restricted login portal for system administrators only. Unauthorized access attempts are logged.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@titec.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Authenticating...' : 'Sign in as Admin'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            <p>Admin accounts are managed by system administrators.</p>
                            <p className="mt-1">No registration is available through this portal.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                        ← Back to main site
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
