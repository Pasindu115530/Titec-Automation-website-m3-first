'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, X, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AddProjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        client: '',
        description: '',
        completion_date: '',
        status: 'In Progress',
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setThumbnailPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('client', formData.client);
            submitData.append('description', formData.description);
            submitData.append('completion_date', formData.completion_date);
            submitData.append('status', formData.status);
            if (thumbnail) {
                submitData.append('thumbnail', thumbnail);
            }

            const response = await api.post('/api/projects', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess('Project added successfully!');
            setTimeout(() => {
                router.push('/admin/projects');
            }, 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Failed to add project';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Add Project</h1>
                    <p className="text-gray-500 mt-1">Showcase a new project in your portfolio.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                        {isLoading ? 'Saving...' : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Project
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                    {error}
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
                >
                    {success}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                            <CardDescription>Basic information about the automation project.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project Title *</label>
                                    <Input 
                                        name="title"
                                        placeholder="e.g. Factory Automation System" 
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Client / Customer</label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input 
                                            name="client"
                                            className="pl-9" 
                                            placeholder="Select or type client name"
                                            value={formData.client}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Describe the project goals, challenges, and solutions..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Specifications</CardTitle>
                            <CardDescription>Technical details and scope.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Completion Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input 
                                            name="completion_date"
                                            type="date" 
                                            className="pl-9"
                                            value={formData.completion_date}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select 
                                        name="status"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Media */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div 
                                className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 hover:border-indigo-500 transition-all cursor-pointer group"
                                onClick={() => document.getElementById('thumbnail-input')?.click()}
                            >
                                {thumbnailPreview ? (
                                    <img 
                                        src={thumbnailPreview} 
                                        alt="Preview" 
                                        className="h-full w-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <>
                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <Upload className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Click to upload</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                                    </>
                                )}
                            </div>
                            <input 
                                id="thumbnail-input"
                                type="file" 
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="hidden"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
