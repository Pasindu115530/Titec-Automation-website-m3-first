'use client';

import React from 'react';
import { Save, UserPlus, Mail, Phone, MapPin, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddCustomerPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Add Customer</h1>
                    <p className="text-gray-500 mt-1">Register a new client or company.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                    <Button className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add Customer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>Primary details about the business or client.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company Name</label>
                                <div className="relative">
                                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input className="pl-9" placeholder="e.g. Apex Industries" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Industry</label>
                                <Input placeholder="e.g. Manufacturing" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input className="pl-9" type="email" placeholder="contact@company.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input className="pl-9" type="tel" placeholder="+94 77 123 4567" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input className="pl-9" placeholder="Street Address" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="City" />
                            <Input placeholder="Postal Code" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
