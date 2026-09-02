'use client';

import React, { useState } from 'react';
import { Save, User, Bell, Shield, Mail, Globe, Database, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        // Profile Settings
        companyName: 'Titec Automation',
        email: 'admin@titec.com',
        phone: '+94 77 123 4567',
        address: 'Colombo, Sri Lanka',
        
        // Email Settings
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        
        // Notification Settings
        emailNotifications: true,
        orderNotifications: true,
        promotionalEmails: false,
        
        // General Settings
        siteName: 'Titec Automation',
        siteUrl: 'https://titec.com',
        currency: 'USD',
        timezone: 'Asia/Colombo',
        language: 'en',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setSuccess('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Settings saved successfully!');
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your application preferences and configuration.</p>
                </div>
                <Button className="gap-2" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">{success}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <CardTitle>Profile Settings</CardTitle>
                        </div>
                        <CardDescription>Update your company profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company Name</label>
                                <Input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+94 77 123 4567"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-600" />
                            <CardTitle>General Settings</CardTitle>
                        </div>
                        <CardDescription>Configure basic site settings and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site Name</label>
                                <Input
                                    name="siteName"
                                    value={formData.siteName}
                                    onChange={handleInputChange}
                                    placeholder="Your site name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site URL</label>
                                <Input
                                    type="url"
                                    name="siteUrl"
                                    value={formData.siteUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Currency</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="LKR">LKR - Sri Lankan Rupee</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Timezone</label>
                                <select
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Asia/Colombo">Asia/Colombo</option>
                                    <option value="America/New_York">America/New_York</option>
                                    <option value="Europe/London">Europe/London</option>
                                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Configuration */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-600" />
                            <CardTitle>Email Configuration</CardTitle>
                        </div>
                        <CardDescription>Configure SMTP settings for email notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP Host</label>
                                <Input
                                    name="smtpHost"
                                    value={formData.smtpHost}
                                    onChange={handleInputChange}
                                    placeholder="smtp.gmail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP Port</label>
                                <Input
                                    name="smtpPort"
                                    value={formData.smtpPort}
                                    onChange={handleInputChange}
                                    placeholder="587"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP Username</label>
                                <Input
                                    name="smtpUser"
                                    value={formData.smtpUser}
                                    onChange={handleInputChange}
                                    placeholder="your-email@gmail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">SMTP Password</label>
                                <Input
                                    type="password"
                                    name="smtpPassword"
                                    value={formData.smtpPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <CardTitle>Notification Preferences</CardTitle>
                        </div>
                        <CardDescription>Manage how you receive notifications and alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={formData.emailNotifications}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="text-sm font-medium">Email Notifications</div>
                                    <div className="text-xs text-gray-500">Receive email alerts for important events</div>
                                </div>
                            </label>
                            
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="orderNotifications"
                                    checked={formData.orderNotifications}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="text-sm font-medium">Order Notifications</div>
                                    <div className="text-xs text-gray-500">Get notified about new orders and updates</div>
                                </div>
                            </label>
                            
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="promotionalEmails"
                                    checked={formData.promotionalEmails}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div>
                                    <div className="text-sm font-medium">Promotional Emails</div>
                                    <div className="text-xs text-gray-500">Receive promotional content and newsletters</div>
                                </div>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-gray-600" />
                            <CardTitle>Security Settings</CardTitle>
                        </div>
                        <CardDescription>Manage security and authentication preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Password</label>
                                <Input
                                    type="password"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto">
                            Change Password
                        </Button>
                    </CardContent>
                </Card>

                {/* Database Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-gray-600" />
                            <CardTitle>Database & Backup</CardTitle>
                        </div>
                        <CardDescription>Manage database connections and backup settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="text-sm font-medium">Database Status</div>
                                <div className="text-xs text-gray-500 mt-1">Connected to MongoDB</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-600">Active</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline">Backup Database</Button>
                            <Button variant="outline">Test Connection</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-gray-600" />
                            <CardTitle>Appearance</CardTitle>
                        </div>
                        <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Theme</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="en">English</option>
                                <option value="si">Sinhala</option>
                                <option value="ta">Tamil</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
