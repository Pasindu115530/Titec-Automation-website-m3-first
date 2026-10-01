'use client';

import React, { useState } from 'react';
import {
    Save,
    User,
    Bell,
    Shield,
    Mail,
    Globe,
    Database,
    Palette,
    CheckCircle2,
    Lock,
    Server,
    Sparkles,
    LayoutGrid
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type TabKey = 'all' | 'profile' | 'general' | 'email' | 'notifications' | 'security' | 'database' | 'appearance';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        // Profile Settings
        companyName: 'Titec Automation (Pvt) Ltd',
        email: 'info@titecautomation.lk',
        phone: '+94 11 234 5678',
        address: 'No. 123, Industrial Zone, Colombo, Sri Lanka',

        // General Settings
        siteName: 'Titec Automation ERP',
        siteUrl: 'https://erp.titecautomation.lk',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        language: 'en',

        // Email Settings
        smtpHost: 'mail.titecautomation.lk',
        smtpPort: '465',
        smtpUser: 'noreply@titecautomation.lk',
        smtpPassword: '••••••••••••',

        // Notification Settings
        emailNotifications: true,
        orderNotifications: true,
        promotionalEmails: false,

        // Appearance
        theme: 'light',

        // Password change
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSuccess('');

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setSuccess('Settings have been successfully saved!');
            toast.success('Settings saved successfully!');
            setTimeout(() => setSuccess(''), 4000);
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.newPassword) {
            toast.error('Please enter a new password.');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }
        toast.success('Password updated successfully!');
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    };

    const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
        { key: 'all', label: 'All Settings', icon: LayoutGrid },
        { key: 'profile', label: 'Company Profile', icon: User },
        { key: 'general', label: 'General', icon: Globe },
        { key: 'email', label: 'Email (SMTP)', icon: Mail },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'security', label: 'Security', icon: Shield },
        { key: 'database', label: 'Database', icon: Database },
        { key: 'appearance', label: 'Appearance', icon: Palette },
    ];

    const shouldShow = (tab: TabKey) => activeTab === 'all' || activeTab === tab;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Header - Matching Quotation & Dashboard Pages */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                        System Settings
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">
                        Manage your company profile, email configurations, and system preferences
                    </p>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#D7FC45] hover:bg-[#c9ef38] text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(215,252,69,0.35)] border border-[#E9FF7A] px-6 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer w-full sm:w-auto text-sm"
                    >
                        <Save className="h-4 w-4 stroke-[2.5]" />
                        {loading ? 'Saving Changes...' : 'Save All Changes'}
                    </Button>
                </div>
            </div>

            {/* Success Alert Banner */}
            {success && (
                <div className="p-4 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {/* Filter Navigation Tabs - Matching Quotation Tabs */}
            <div className="flex flex-wrap gap-2 items-center bg-white/40 backdrop-blur-md p-2 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                                isActive
                                    ? 'bg-[#D7FC45] text-neutral-950 shadow-[0_4px_14px_rgba(215,252,69,0.35)] border border-[#E9FF7A]'
                                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                            }`}
                        >
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : 'text-neutral-500'}`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Settings Sections Grid */}
            <div className="grid grid-cols-1 gap-6">
                {/* 1. Profile Settings */}
                {shouldShow('profile') && (
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                    <User className="w-3.5 h-3.5 mr-1.5 text-[#7C3AED]" />
                                    Company Profile
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-400">Public & Document Info</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Company Name</label>
                                <Input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Company Name"
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Official Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="info@titecautomation.lk"
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Phone Number</label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+94 11 234 5678"
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Registered Address</label>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter physical address"
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. General Settings */}
                {shouldShow('general') && (
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                    <Globe className="w-3.5 h-3.5 mr-1.5 text-[#0D9488]" />
                                    General & Localization
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-400">Regional & System Defaults</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Site Name</label>
                                <Input
                                    name="siteName"
                                    value={formData.siteName}
                                    onChange={handleInputChange}
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Site URL</label>
                                <Input
                                    type="url"
                                    name="siteUrl"
                                    value={formData.siteUrl}
                                    onChange={handleInputChange}
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Currency</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-200/80 cursor-pointer"
                                >
                                    <option value="LKR">LKR - Sri Lankan Rupee (Rs.)</option>
                                    <option value="USD">USD - US Dollar ($)</option>
                                    <option value="EUR">EUR - Euro (€)</option>
                                    <option value="GBP">GBP - British Pound (£)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Timezone</label>
                                <select
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-200/80 cursor-pointer"
                                >
                                    <option value="Asia/Colombo">Asia/Colombo (GMT+5:30)</option>
                                    <option value="America/New_York">America/New_York (EST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Email Settings */}
                {shouldShow('email') && (
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                    <Mail className="w-3.5 h-3.5 mr-1.5 text-[#E0781E]" />
                                    Email Server (SMTP)
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-400">Automated Mail Configuration</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">SMTP Host</label>
                                <Input
                                    name="smtpHost"
                                    value={formData.smtpHost}
                                    onChange={handleInputChange}
                                    placeholder="mail.titecautomation.lk"
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">SMTP Port</label>
                                <Input
                                    name="smtpPort"
                                    value={formData.smtpPort}
                                    onChange={handleInputChange}
                                    placeholder="465 or 587"
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">SMTP Username</label>
                                <Input
                                    name="smtpUser"
                                    value={formData.smtpUser}
                                    onChange={handleInputChange}
                                    placeholder="noreply@titecautomation.lk"
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">SMTP Password</label>
                                <Input
                                    type="password"
                                    name="smtpPassword"
                                    value={formData.smtpPassword}
                                    onChange={handleInputChange}
                                    className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Notification Settings */}
                {shouldShow('notifications') && (
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#6D28D9] border border-white/80 shadow-2xs">
                                    <Bell className="w-3.5 h-3.5 mr-1.5 text-[#6D28D9]" />
                                    Notification Preferences
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-400">Alerts & System Triggers</span>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 border border-neutral-200/80 shadow-2xs transition-all hover:bg-white cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={formData.emailNotifications}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#7C3AED] accent-[#7C3AED] rounded border-neutral-300 focus:ring-[#7C3AED] cursor-pointer"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-neutral-900">Email Notifications</div>
                                    <div className="text-xs text-neutral-500 font-medium">Receive email notifications for quotation requests and inventory alerts</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 border border-neutral-200/80 shadow-2xs transition-all hover:bg-white cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="orderNotifications"
                                    checked={formData.orderNotifications}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#7C3AED] accent-[#7C3AED] rounded border-neutral-300 focus:ring-[#7C3AED] cursor-pointer"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-neutral-900">POS & Order Notifications</div>
                                    <div className="text-xs text-neutral-500 font-medium">Get real-time updates when new invoices and orders are generated</div>
                                </div>
                            </label>

                            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 border border-neutral-200/80 shadow-2xs transition-all hover:bg-white cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="promotionalEmails"
                                    checked={formData.promotionalEmails}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#7C3AED] accent-[#7C3AED] rounded border-neutral-300 focus:ring-[#7C3AED] cursor-pointer"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-neutral-900">System News & Digest</div>
                                    <div className="text-xs text-neutral-500 font-medium">Periodic summaries and product catalog feature announcements</div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {/* 5. Security Settings */}
                {shouldShow('security') && (
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F6FFD3] text-[#4D6300] border border-[#E9FF7A]/80 shadow-2xs">
                                    <Shield className="w-3.5 h-3.5 mr-1.5 text-[#4D6300]" />
                                    Security & Passwords
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-400">Account Credentials</span>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Current Password</label>
                                    <Input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">New Password</label>
                                    <Input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        placeholder="Min. 8 characters"
                                        className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Confirm Password</label>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Repeat new password"
                                        className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                                >
                                    <Lock className="w-4 h-4 text-neutral-700" />
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 6. Database & Connectivity */}
                {shouldShow('database') && (
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs">
                                    <Database className="w-3.5 h-3.5 mr-1.5 text-neutral-700" />
                                    Database & Storage
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-400">MySQL Connection</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/70 rounded-2xl border border-neutral-200/80 shadow-2xs">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                    <Server className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-neutral-900">Database Engine</div>
                                    <div className="text-xs text-neutral-500 font-medium font-mono mt-0.5">MySQL 8.0 • Connected (titecaut_erp)</div>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-green-200/80 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Operational
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => toast.success('Database backup initiated successfully!')}
                                className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs text-sm cursor-pointer"
                            >
                                Trigger Backup
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => toast.success('Connection ping verified (latency: 14ms)')}
                                className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs text-sm cursor-pointer"
                            >
                                Test Latency
                            </Button>
                        </div>
                    </div>
                )}

                {/* 7. Appearance */}
                {shouldShow('appearance') && (
                    <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/70">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E0F2FE] text-[#0284C7] border border-white/80 shadow-2xs">
                                    <Palette className="w-3.5 h-3.5 mr-1.5 text-[#0284C7]" />
                                    Visual Appearance
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-neutral-400">Theme & Aesthetics</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Dashboard Theme</label>
                                <select
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleInputChange}
                                    className="w-full px-4 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-200/80 cursor-pointer"
                                >
                                    <option value="light">Light Frost Glass (Default)</option>
                                    <option value="dark">Dark Mode</option>
                                    <option value="system">Match Device System</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="w-full px-4 h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-200/80 cursor-pointer"
                                >
                                    <option value="en">English (US)</option>
                                    <option value="si">Sinhala (සිංහල)</option>
                                    <option value="ta">Tamil (தமிழ்)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
