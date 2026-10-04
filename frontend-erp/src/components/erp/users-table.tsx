'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    RefreshCw,
    Users,
    Mail,
    Send,
    Edit2,
    Trash2,
    X,
    Shield,
    Briefcase,
    Building2,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userService, User, Role } from '@/services/userService';
import { toast } from 'sonner';
import Loader from '@/components/loader';
import DeleteConfirmationModal from '@/components/admin/delete-confirmation-modal';

export default function UsersTable() {
    const [mounted, setMounted] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Delete state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyEmailPrefix: '',
        personalEmail: '',
        department: '',
        designation: '',
        roles: [] as number[],
    });
    const [isEmailPrefixManuallyEdited, setIsEmailPrefixManuallyEdited] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    useEffect(() => {
        if (!editingUser && !isEmailPrefixManuallyEdited && (formData.firstName || formData.lastName)) {
            const prefix = `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '');
            setFormData(prev => ({ ...prev, companyEmailPrefix: prefix }));
        }
    }, [formData.firstName, formData.lastName, editingUser, isEmailPrefixManuallyEdited]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, rolesRes] = await Promise.all([
                userService.getUsers(),
                userService.getRoles()
            ]);
            setUsers((usersRes as any).data || usersRes || []);
            setRoles((rolesRes as any).data || rolesRes || []);
        } catch (error) {
            toast.error('Failed to load users and roles.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        setIsEmailPrefixManuallyEdited(false);
        if (user) {
            setEditingUser(user);
            const splitName = user.name.split(' ');
            setFormData({
                firstName: user.employee?.first_name || splitName[0] || '',
                lastName: user.employee?.last_name || splitName.slice(1).join(' ') || '',
                companyEmailPrefix: user.email ? user.email.split('@')[0] : '',
                personalEmail: user.employee?.personal_email || '',
                department: user.employee?.department || '',
                designation: user.employee?.designation || '',
                roles: user.roles?.map(r => r.id) || [],
            });
        } else {
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                companyEmailPrefix: '',
                personalEmail: '',
                department: '',
                designation: '',
                roles: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleRoleChange = (roleId: number) => {
        setFormData(prev => {
            const currentRoles = [...prev.roles];
            if (currentRoles.includes(roleId)) {
                return { ...prev, roles: currentRoles.filter(id => id !== roleId) };
            } else {
                return { ...prev, roles: [...currentRoles, roleId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fullCompanyEmail = `${formData.companyEmailPrefix}@titecautomation.lk`;

        const payload = {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: fullCompanyEmail,
            personal_email: formData.personalEmail,
            department: formData.department,
            designation: formData.designation,
            roles: formData.roles,
        };

        setIsSubmitting(true);
        const toastId = toast.loading(editingUser ? 'Updating user...' : 'Creating user...');

        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, payload);
                toast.success('User updated successfully', { id: toastId });
            } else {
                await userService.createUser(payload);
                toast.success('User created successfully. Welcome email sent.', { id: toastId });
            }
            setIsModalOpen(false);
            loadData();
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Operation failed';
            toast.error(msg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteModal = (user: User) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        const toastId = toast.loading('Deleting user...');
        try {
            await userService.deleteUser(userToDelete.id);
            toast.success('User deleted successfully', { id: toastId });
            setDeleteModalOpen(false);
            loadData();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to delete user';
            toast.error(msg, { id: toastId });
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    const handleResendWelcome = async (id: number) => {
        const toastId = toast.loading('Sending welcome email...');
        try {
            await userService.resendWelcome(id);
            toast.success('Welcome email sent successfully', { id: toastId });
            loadData();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to send email';
            toast.error(msg, { id: toastId });
        }
    };

    // Client-side filtering
    const filteredUsers = users.filter((u) => {
        const term = search.toLowerCase().trim();
        const matchesSearch =
            !term ||
            u.name?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term) ||
            u.employee?.department?.toLowerCase().includes(term) ||
            u.employee?.designation?.toLowerCase().includes(term) ||
            u.roles?.some(r => r.name.toLowerCase().includes(term));

        if (!matchesSearch) return false;

        if (statusFilter === 'active') {
            return u.employee?.employment_status === 'active';
        }
        if (statusFilter === 'pending') {
            return (
                u.employee?.email_provisioning_status === 'pending_email' ||
                u.employee?.email_provisioning_status === 'provisioned'
            );
        }
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Top Header - Matching Quotation Page */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                        Employees & Team
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">
                        Manage system users, employee profiles, and access roles
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        onClick={() => loadData()}
                        variant="outline"
                        className="h-11 px-5 rounded-2xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-white/80 shadow-xs font-semibold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 text-neutral-700 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer text-sm"
                    >
                        <Plus className="mr-1 h-4 w-4 stroke-[2.5]" />
                        Add New Employee
                    </Button>
                </div>
            </div>

            {/* Filter Tabs & Search Bar - Matching Quotation Page */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/40 backdrop-blur-md p-2.5 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="relative flex-1 w-full flex items-center">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                        placeholder="Search employees by name, email, department, or role..."
                        className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shrink-0 w-full md:w-auto">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            statusFilter === 'all'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        All Employees
                    </button>
                    <button
                        onClick={() => setStatusFilter('active')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            statusFilter === 'active'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            statusFilter === 'pending'
                                ? 'bg-sky-300 text-neutral-950 shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200'
                                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                        }`}
                    >
                        Pending Setup
                    </button>
                </div>
            </div>

            {/* Table Content */}
            {loading ? (
                <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl p-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
                    <Loader variant="inline" size={80} text="Loading employees..." />
                </div>
            ) : (
                <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
                    <div className="p-4 sm:px-6 border-b border-neutral-200/70 bg-white/40 flex justify-between items-center">
                        <h3 className="font-bold text-neutral-800 text-sm">Team Directory</h3>
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider bg-white/60 px-3 py-1 rounded-xl border border-white/80">
                            {filteredUsers.length} Members
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="border-b border-neutral-200/70 bg-white/30">
                                <tr className="hover:bg-transparent">
                                    <th className="px-6 py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                            Employee
                                        </span>
                                    </th>
                                    <th className="px-6 py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                            Email
                                        </span>
                                    </th>
                                    <th className="px-6 py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                            Roles
                                        </span>
                                    </th>
                                    <th className="px-6 py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#6D28D9] border border-white/80 shadow-2xs">
                                            Department
                                        </span>
                                    </th>
                                    <th className="px-6 py-3">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F6FFD3] text-[#4D6300] border border-[#E9FF7A]/80 shadow-2xs">
                                            Status
                                        </span>
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        <div className="flex justify-end">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs">
                                                Actions
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100/80">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-neutral-500 font-medium text-sm">
                                            No employees found matching the filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/50 transition-colors">
                                            {/* Employee Name & Avatar */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-[#E2D6FE] text-[#7C3AED] border border-white/80 font-bold text-sm shadow-2xs flex items-center justify-center shrink-0">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-neutral-900 text-sm">{user.name}</div>
                                                        {user.employee?.designation && (
                                                            <div className="text-xs text-neutral-500 font-medium">{user.employee.designation}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Emails */}
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-mono font-medium text-neutral-800">{user.email}</div>
                                                {user.employee?.personal_email && (
                                                    <div className="text-[11px] text-neutral-400 mt-0.5">{user.employee.personal_email}</div>
                                                )}
                                            </td>

                                            {/* Roles */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        user.roles.map((role) => (
                                                            <span
                                                                key={role.id}
                                                                className="inline-flex px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/90 text-neutral-800 border border-neutral-200/80 shadow-2xs"
                                                            >
                                                                {role.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-neutral-400 italic">No roles</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Department */}
                                            <td className="px-6 py-4 text-neutral-700 font-medium text-xs">
                                                {user.employee?.department || '-'}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                {user.employee ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs border w-fit ${
                                                                user.employee.employment_status === 'active'
                                                                    ? 'bg-[#DCFCE7] text-[#15803D] border-green-200/80'
                                                                    : user.employee.employment_status === 'terminated'
                                                                    ? 'bg-[#FEE2E2] text-[#B91C1C] border-rose-200/80'
                                                                    : 'bg-neutral-100 text-neutral-700 border-neutral-200/80'
                                                            }`}
                                                        >
                                                            {user.employee.employment_status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                            {user.employee.employment_status}
                                                        </span>

                                                        {user.employee.email_provisioning_status && user.employee.email_provisioning_status !== 'active' && (
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold shadow-2xs border w-fit ${
                                                                    user.employee.email_provisioning_status === 'pending_email'
                                                                        ? 'bg-[#FEF3C7] text-[#D97706] border-amber-200/80'
                                                                        : 'bg-[#E0F2FE] text-[#0284C7] border-sky-200/80 animate-pulse'
                                                                }`}
                                                            >
                                                                {user.employee.email_provisioning_status === 'pending_email' ? (
                                                                    <>
                                                                        <Clock className="w-3 h-3 mr-1 text-amber-600" />
                                                                        Awaiting Email Setup
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Mail className="w-3 h-3 mr-1 text-sky-600" />
                                                                        Email Ready
                                                                    </>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-neutral-400">-</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.employee?.email_provisioning_status === 'provisioned' ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleResendWelcome(user.id)}
                                                            className="h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xs gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                                                            title="Send welcome credentials to employee"
                                                        >
                                                            <Send className="w-3 h-3" />
                                                            Send Welcome
                                                        </Button>
                                                    ) : user.employee?.email_provisioning_status === 'pending_email' ? (
                                                        <span className="text-[11px] text-amber-600 font-semibold italic mr-1">
                                                            Pending Email...
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleResendWelcome(user.id)}
                                                            className="h-8 px-2.5 rounded-xl bg-white/80 hover:bg-[#F1EBFF] text-[#7C3AED] hover:text-[#6D28D9] border border-neutral-200/70 text-xs font-bold shadow-2xs transition-all cursor-pointer hover:scale-[1.02]"
                                                            title="Resend welcome email with temporary password"
                                                        >
                                                            Resend
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(user)}
                                                        className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(user)}
                                                        className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal with Portal & Glassmorphism */}
            {mounted && isModalOpen && createPortal(
                <AnimatePresence>
                    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            {/* Sticky Header */}
                            <div className="flex items-center justify-between p-6 border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-[32px]">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-[#F1EBFF] text-[#7C3AED] flex items-center justify-center border border-white/80 shadow-2xs shrink-0">
                                        <Users className="h-5 w-5 text-[#7C3AED]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                                            {editingUser ? 'Edit Employee' : 'Add New Employee'}
                                        </h2>
                                        <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                                            {editingUser ? 'Update employee profile and roles' : 'Create new employee profile and credentials'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                                First Name *
                                            </label>
                                            <Input
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                placeholder="e.g. John"
                                                className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                                Last Name *
                                            </label>
                                            <Input
                                                type="text"
                                                required
                                                value={formData.lastName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                                placeholder="e.g. Silva"
                                                className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                            />
                                        </div>
                                    </div>

                                    {/* Personal Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                            Personal Email *
                                        </label>
                                        <Input
                                            type="email"
                                            required
                                            value={formData.personalEmail}
                                            onChange={(e) => setFormData(prev => ({ ...prev, personalEmail: e.target.value }))}
                                            placeholder="Used to receive login credentials"
                                            className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-neutral-200/80"
                                        />
                                    </div>

                                    {/* Company Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                            Company Email Prefix *
                                        </label>
                                        <div className="flex rounded-2xl shadow-2xs border border-neutral-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-neutral-200/80">
                                            <input
                                                type="text"
                                                required
                                                value={formData.companyEmailPrefix}
                                                onChange={(e) => {
                                                    setIsEmailPrefixManuallyEdited(true);
                                                    setFormData(prev => ({ ...prev, companyEmailPrefix: e.target.value }));
                                                }}
                                                className="flex-1 px-4 h-11 text-neutral-900 text-sm font-medium outline-none bg-transparent"
                                                placeholder="johnsilva"
                                            />
                                            <span className="inline-flex items-center px-4 bg-neutral-100/90 text-neutral-600 text-xs font-mono font-bold border-l border-neutral-200">
                                                @titecautomation.lk
                                            </span>
                                        </div>
                                    </div>

                                    {/* Department & Designation */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                                Department
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                                placeholder="e.g. Engineering"
                                                className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                                                Job Title
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.designation}
                                                onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                                                placeholder="e.g. Automation Engineer"
                                                className="h-11 rounded-2xl bg-white border border-neutral-200 text-neutral-900 text-sm shadow-2xs font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Roles */}
                                    <div className="space-y-2 pt-1">
                                        <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                                            Assign System Roles
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 bg-white/70 p-3 rounded-2xl border border-neutral-200/80 shadow-2xs max-h-36 overflow-y-auto">
                                            {roles.map(role => {
                                                const isChecked = formData.roles.includes(role.id);
                                                return (
                                                    <label
                                                        key={role.id}
                                                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none ${
                                                            isChecked
                                                                ? 'bg-[#F1EBFF] text-[#7C3AED] border-[#d8c7fd] shadow-2xs'
                                                                : 'bg-white text-neutral-700 border-neutral-200/70 hover:bg-neutral-50'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleRoleChange(role.id)}
                                                            className="w-4 h-4 rounded text-[#7C3AED] accent-[#7C3AED] border-neutral-300 focus:ring-[#7C3AED] cursor-pointer"
                                                        />
                                                        <span>{role.name}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Sticky Footer */}
                                <div className="p-5 border-t border-neutral-100 bg-neutral-50/80 flex justify-end gap-3 rounded-b-[32px] sticky bottom-0 z-10 backdrop-blur-md">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        className="h-11 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 font-semibold shadow-xs cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-11 px-6 rounded-2xl bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold border border-sky-200 shadow-[0_8px_20px_rgba(125,211,252,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                                    >
                                        {isSubmitting ? 'Saving...' : editingUser ? 'Update Employee' : 'Create Employee'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </AnimatePresence>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={userToDelete?.name || ''}
                itemIdentifier={userToDelete?.email}
                itemType="Employee"
                isDeleting={isDeleting}
            />
        </div>
    );
}
