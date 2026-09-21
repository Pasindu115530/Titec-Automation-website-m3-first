'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChangePasswordPage() {
    const { user, setUserExternal } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            toast.error('New passwords do not match');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Updating password...');

        try {
            await api.post('/api/change-password', formData);
            
            // Update local user state
            if (user) {
                setUserExternal({ ...user, requiresPasswordReset: false });
            }
            
            toast.success('Password updated successfully', { id: toastId });
            router.push('/dashboard');
        } catch (error: any) {
            const msg = error.response?.data?.message || error.response?.data?.errors?.current_password?.[0] || 'Failed to update password';
            toast.error(msg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-12rem)]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <ShieldCheck className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Change Password Required</h2>
                <p className="text-gray-500 text-center mb-8 text-sm">
                    For security reasons, you must change your password before accessing the ERP system.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="current_password"
                                required
                                value={formData.current_password}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                placeholder="Enter current temporary password"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                placeholder="Min. 8 characters"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password_confirmation"
                                required
                                minLength={8}
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                placeholder="Re-enter new password"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Password & Continue'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
