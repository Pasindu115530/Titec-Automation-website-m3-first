'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderPlus,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Package,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have utils
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAdmin } = useAuth();

    useEffect(() => {
        // Redirect to admin login if not authenticated, except when already on login page
        if (!isAdmin && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAdmin, pathname, router]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { name: 'Quotation Requests', icon: FileText, href: '/admin/quotations' },
        { name: 'Projects Management', icon: FolderPlus, href: '/admin/projects' },
        { name: 'Products Management', icon: Package, href: '/admin/products' },
        { name: 'Customers Management', icon: Users, href: '/admin/customers' },
        { name: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '16rem' : '0rem',
                    x: isSidebarOpen ? 0 : -100
                }}
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-30 bg-white border-r border-gray-200 overflow-hidden flex flex-col transition-all duration-300",
                    !isSidebarOpen && "lg:w-0 lg:border-none"
                )}
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between min-w-[16rem]">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                            T
                        </div>
                        <span className="font-bold text-xl text-gray-800">Admin</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-1 min-w-[16rem]">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <span
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-gray-400")} />
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 min-w-[16rem]">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between lg:justify-end">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("lg:hidden mr-auto", isSidebarOpen && "hidden")}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{user?.firstName} {user?.lastName}</span>
                        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
