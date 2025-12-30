'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, X, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddProjectPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        alert('Project added successfully! (Mock)');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Add Project</h1>
                    <p className="text-gray-500 mt-1">Showcase a new project in your portfolio.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.history.back()}>
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
                                    <label className="text-sm font-medium">Project Title</label>
                                    <Input placeholder="e.g. Factory Automation System" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Client / Customer</label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input className="pl-9" placeholder="Select or type client name" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Describe the project goals, challenges, and solutions..."
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
                                        <Input type="date" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                            <div className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 hover:border-indigo-500 transition-all cursor-pointer group">
                                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Upload className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Click to upload</span>
                                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                    Automation <X className="h-3 w-3 cursor-pointer hover:text-indigo-900" />
                                </span>
                                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                    Robotics <X className="h-3 w-3 cursor-pointer hover:text-indigo-900" />
                                </span>
                            </div>
                            <Input placeholder="Add a tag and press Enter" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
