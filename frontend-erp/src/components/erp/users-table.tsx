import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Shield, ShieldAlert, Check, X, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userService, User, Role } from '@/services/userService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Loader from '@/components/loader';

export default function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
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
            setUsers((usersRes as any).data || usersRes);
            setRoles((rolesRes as any).data || rolesRes);
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
                companyEmailPrefix: user.email.split('@')[0],
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

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const toastId = toast.loading('Deleting user...');
        try {
            await userService.deleteUser(id);
            toast.success('User deleted successfully', { id: toastId });
            loadData();
        } catch (error) {
            toast.error('Failed to delete user', { id: toastId });
        }
    };

    const handleResendWelcome = async (id: number) => {
        if (!confirm('Are you sure you want to reset their password and send the welcome email?')) return;
        const toastId = toast.loading('Sending welcome email...');
        try {
            await userService.resendWelcome(id);
            toast.success('Welcome email sent successfully', { id: toastId });
            loadData(); // Reload to update provisioning status
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to send email';
            toast.error(msg, { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-500">Manage access and roles for your team members.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Roles</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles && user.roles.length > 0 ? (
                                                user.roles.map(role => (
                                                    <span key={role.id} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                        {role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No roles</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.employee ? (
                                            <div className="flex flex-col gap-1">
                                                <span className={cn(
                                                    "inline-flex px-2 py-0.5 rounded text-xs font-medium w-fit",
                                                    user.employee.employment_status === 'active' ? "bg-green-100 text-green-800" :
                                                    user.employee.employment_status === 'terminated' ? "bg-red-100 text-red-800" :
                                                    "bg-gray-100 text-gray-800"
                                                )}>
                                                    {user.employee.employment_status}
                                                </span>
                                                {user.employee.email_provisioning_status && user.employee.email_provisioning_status !== 'active' && (
                                                    <span className={cn(
                                                        "inline-flex px-2 py-0.5 rounded text-xs font-medium w-fit",
                                                        user.employee.email_provisioning_status === 'pending_email' ? "bg-yellow-100 text-yellow-800 border border-yellow-300" :
                                                        user.employee.email_provisioning_status === 'provisioned' ? "bg-blue-100 text-blue-800 border border-blue-300 animate-pulse" :
                                                        ""
                                                    )}>
                                                        {user.employee.email_provisioning_status === 'pending_email' ? '⏳ Awaiting Email Setup' : '📧 Email Ready — Send Welcome'}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.employee?.email_provisioning_status === 'provisioned' ? (
                                            <button 
                                                onClick={() => handleResendWelcome(user.id)}
                                                className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg mr-4 transition-colors shadow-sm"
                                                title="Email is ready! Send welcome credentials to employee"
                                            >
                                                ✉️ Send Welcome Email
                                            </button>
                                        ) : user.employee?.email_provisioning_status === 'pending_email' ? (
                                            <span className="text-xs text-yellow-600 italic mr-4">Waiting for email...</span>
                                        ) : (
                                            <button 
                                                onClick={() => handleResendWelcome(user.id)}
                                                className="text-sm font-medium text-green-600 hover:text-green-800 mr-4"
                                                title="Resend welcome email with new password"
                                            >
                                                Resend Email
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleOpenModal(user)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingUser ? 'Edit User' : 'New User'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.personalEmail}
                                    onChange={(e) => setFormData(prev => ({ ...prev, personalEmail: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Used to send login credentials"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        required
                                        value={formData.companyEmailPrefix}
                                        onChange={(e) => {
                                            setIsEmailPrefixManuallyEdited(true);
                                            setFormData(prev => ({ ...prev, companyEmailPrefix: e.target.value }));
                                        }}
                                        className="flex-1 min-w-0 block w-full px-4 py-2 rounded-none rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        @titecautomation.lk
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={formData.designation}
                                        onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Roles</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {roles.map(role => (
                                        <label key={role.id} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.roles.includes(role.id)}
                                                onChange={() => handleRoleChange(role.id)}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-800">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
