'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, AlertTriangle, AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TitecErpLogo from '@/components/titec-erp-logo';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, isAdmin } = useAuth();
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        console.log('Main login form submitted for:', email);
        try {
            await login(email, password, 'admin');
            console.log('AuthContext login successful.');
        } catch (err: any) {
            console.error('AuthContext login failed:', err);
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F0F2F5] overflow-hidden select-none selection:bg-[#D7FC45] selection:text-neutral-900">
            {/* Ambient Dashboard Background Glow Blobs */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D7FC45]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-300/10 rounded-full blur-[130px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md relative z-10 flex flex-col items-center"
            >
                {/* Official TiTec Animated Brand Header (without ERP badge) */}
                <div className="mb-6 flex flex-col items-center">
                    <TitecErpLogo logoHeight={48} speed={4} showBadge={false} />
                </div>

                {/* Glassmorphic Login Card */}
                <div className="w-full bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">
                    {/* Card Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100/90 border border-neutral-200/60 text-[11px] font-bold text-neutral-700 tracking-wide uppercase mb-3">
                            <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
                            <span>Portal Access</span>
                        </div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">ERP Login</h1>
                        <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                            Enter your credentials to access the system
                        </p>
                    </div>

                    {/* Warning Notice Box */}
                    <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
                            This is a restricted portal for authorized personnel. Unauthorized access attempts are monitored and logged.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                Email Address
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
                            disabled={isLoading || submitting}
                            className="w-full h-12 bg-[#D7FC45] hover:bg-[#cbf033] text-neutral-950 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
                        >
                            {isLoading || submitting ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Sign in</span>
                                    <ArrowRight className="w-4 h-4 text-neutral-950 transition-transform group-hover:translate-x-1" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-xs text-neutral-400">
                        <p>Accounts are managed by TiTEC Automation system administrators.</p>
                        <p className="mt-0.5">No registration is available through this portal.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
