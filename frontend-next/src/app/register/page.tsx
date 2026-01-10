/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/footer';
import { api } from '@/lib/api'; // Import your API instance

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (data: { name: string; email: string; password: string; password_confirmation: string; }) => {
        try {
            // Get CSRF cookie first
            await api.get('/sanctum/csrf-cookie');
            
            // Then submit registration
            const response = await api.post('/api/register', data);
            return response.data;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as Record<string, any>;
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const name = `${formData.firstName} ${formData.lastName}`.trim();
            const payload = {
                name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                role: 'customer', // Set role as customer
            };

            const data = await handleRegister(payload);

            // Success - redirect to login
            alert('Registration successful! Please login with your credentials.');
            router.push('/login');
        } catch (err: unknown) {
            // Laravel often returns validation errors under `errors` key
            if (err && typeof err === 'object' && 'errors' in err) {
                // Flatten the first validation error message
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const errors = (err as Record<string, unknown>).errors as Record<string, any[]>;
                const firstKey = Object.keys(errors)[0];
                setError(errors[firstKey][0]);
            } else if (err && typeof err === 'object' && 'message' in err) {
                setError((err as Record<string, any>).message);
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                            <CardDescription className="text-center">
                                Register as a customer to request quotations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
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
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
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
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating account...' : 'Create Account'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-gray-600">Already have an account? </span>
                                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            <Footer />
        </>
    );
}
