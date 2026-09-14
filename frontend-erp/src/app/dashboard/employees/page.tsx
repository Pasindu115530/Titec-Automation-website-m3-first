'use client';

import React from 'react';
import UsersTable from '@/components/erp/users-table';

export default function EmployeesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    Employees
                </h1>
                <p className="text-gray-500 mt-1">Manage system users, employee profiles, and roles.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <UsersTable />
            </div>
        </div>
    );
}
