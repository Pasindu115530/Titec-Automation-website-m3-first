'use client';
import React, { useState, useEffect } from 'react';
import { ConnectionStatus } from '@/components/layout/connection-status';
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
    FileText,
    LayoutGrid,
    Wrench,
    Search,
    ShoppingBag,
    ClipboardList,
    ShieldCheck,
    BarChart3,
    HelpCircle,
    Bell,
    Moon,
    Sun,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 8-point geometric star icon matching the Starline design
function StarlineLogoIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn("w-6 h-6 text-neutral-900", className)}
        >
            <path d="M12 0L14.59 7.41L22 4.59L19.18 12L24 14.59L16.59 17.41L19.41 24L12 19.18L7.41 24L4.59 16.59L0 19.41L4.82 12L0 9.41L7.41 6.59L4.59 0L12 4.82L12 0Z" />
        </svg>
    );
}

// 4-dot rounded square icon matching the exact user uploaded image
function DashboardGridIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
        </svg>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAdmin, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAdmin && pathname !== '/dashboard/login') {
            router.push('/dashboard/login');
        }
    }, [isAdmin, isLoading, pathname, router]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const allMenuItems = [
        { name: 'Dashboard', icon: DashboardGridIcon, href: '/dashboard' },
        { name: 'POS', icon: ShoppingBag, href: '/dashboard/pos', requiredPermissions: ['view_pos'] },
        { name: 'Invoices', icon: FileText, href: '/dashboard/invoices', requiredPermissions: ['view_invoices'] },
        { name: 'Quotations', icon: FileText, href: '/dashboard/quotations', requiredPermissions: ['view_quotation_requests'] },
        { name: 'Clients', icon: Users, href: '/dashboard/clients', requiredPermissions: ['view_clients'] },
        { name: 'Inventory', icon: Package, href: '/dashboard/inventory', requiredPermissions: ['view_inventory'] },
        { name: 'Installations', icon: Wrench, href: '/dashboard/installations', requiredPermissions: ['view_installations'] },
        { name: 'Service Logs', icon: ClipboardList, href: '/dashboard/service-logs', requiredPermissions: ['view_service_logs'] },
        { name: 'Warranty', icon: ShieldCheck, href: '/dashboard/warranty', requiredPermissions: ['view_warranty'] },
        { name: 'Reports', icon: BarChart3, href: '/dashboard/reports', requiredPermissions: ['view_reports'] },

        // CMS
        { name: 'Products', icon: Package, href: '/dashboard/products', requiredPermissions: ['view_products'] },
        { name: 'Projects', icon: FolderPlus, href: '/dashboard/projects', requiredPermissions: ['view_projects'] },
        { name: 'Brands', icon: LayoutGrid, href: '/dashboard/brands', requiredPermissions: ['view_brands'] },
        { name: 'Services', icon: Wrench, href: '/dashboard/services', requiredPermissions: ['view_services'] },

        { name: 'Settings', icon: Settings, href: '/dashboard/settings', requiredRoles: ['Super Admin'] },
    ];

    const menuItems = allMenuItems.filter(item => {
        if (user?.roles?.includes('Super Admin')) return true;

        if (item.requiredRoles && item.requiredRoles.length > 0) {
            const hasRole = item.requiredRoles.some(role => user?.roles?.includes(role));
            if (!hasRole) return false;
        }

        if (item.requiredPermissions && item.requiredPermissions.length > 0) {
            const hasPermission = item.requiredPermissions.some(permission => user?.permissions?.includes(permission));
            if (!hasPermission) return false;
        }

        return true;
    });

    const userDisplayName = user?.firstName
        ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
        : 'User';

    return (
        <div className="min-h-screen bg-[#D0D4DA] text-neutral-900 flex flex-col antialiased relative overflow-hidden">
            {/* Ambient Background Depth Layer (Down Level) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 right-1/4 w-[650px] h-[650px] bg-blue-400/15 rounded-full blur-[140px]" />
                <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-purple-400/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-400/15 rounded-full blur-[140px]" />
                <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-amber-300/15 rounded-full blur-[120px]" />
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-1 min-h-screen relative z-10">
                {/* Starline Light Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? '17.5rem' : '0rem',
                    }}
                    className={cn(
                        "fixed lg:static inset-y-0 left-0 z-40 bg-transparent flex flex-col transition-all duration-300 select-none overflow-hidden",
                        !isSidebarOpen && "lg:w-0"
                    )}
                >
                    <div className="p-6 pb-4 flex items-center justify-between min-w-[17.5rem]">
                        {/* Starline Logo Header */}
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="p-1 transition-transform group-hover:rotate-45 duration-300">
                                <StarlineLogoIcon className="w-7 h-7 text-neutral-900" />
                            </div>
                            <span className="font-semibold text-xl tracking-tight text-neutral-900">
                                Titec ERP
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="lg:hidden rounded-2xl hover:bg-neutral-300/60"
                        >
                            <X className="h-5 w-5 text-neutral-800" />
                        </Button>
                    </div>

                    {/* Navigation Pills List (Upper Level - Elevated Translucent Tabs) */}
                    <nav className="flex-1 px-4 py-2 space-y-2.5 overflow-y-auto min-w-[17.5rem] scrollbar-none">
                        {menuItems.map((item) => {
                            const currentPath = (pathname || '').replace(/\/$/, '');
                            const targetPath = item.href.replace(/\/$/, '');
                            const isActive = currentPath === targetPath || (targetPath !== '/dashboard' && currentPath.startsWith(targetPath));
                            return (
                                <Link key={item.name} href={item.href} className="block">
                                    <span
                                        className={cn(
                                            "flex items-center gap-3.5 px-6 py-3.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                                            isActive
                                                ? "bg-[#D7FC45] text-neutral-950 font-bold shadow-[0_8px_24px_rgba(215,252,69,0.45),0_2px_6px_rgba(0,0,0,0.06)] border border-[#E9FF7A] scale-[1.02]"
                                                : "bg-white/55 backdrop-blur-md text-neutral-800 border border-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] hover:text-neutral-950 hover:scale-[1.01]"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5 shrink-0",
                                                isActive ? "text-neutral-950" : "text-neutral-600"
                                            )}
                                        />
                                        <span className="truncate">{item.name}</span>
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Help / Support Link */}
                        <div className="pt-2">
                            <Link href="/dashboard" className="block">
                                <span className="flex items-center gap-3.5 px-6 py-3.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer bg-white/55 backdrop-blur-md text-neutral-800 border border-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] hover:text-neutral-950">
                                    <HelpCircle className="h-5 w-5 text-neutral-600 shrink-0" />
                                    <span>Help & Docs</span>
                                </span>
                            </Link>
                        </div>
                    </nav>

                    {/* Sign Out Action */}
                    <div className="p-4 min-w-[17.5rem]">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-6 py-3 w-full rounded-full text-sm font-medium text-red-600 bg-red-100/60 backdrop-blur-md border border-red-200/60 hover:bg-red-100/90 shadow-[0_4px_14px_rgba(239,68,68,0.06)] transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Header */}
                    <header className="h-20 flex items-center justify-between px-6 lg:px-8 shrink-0 bg-transparent">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSidebar}
                                className={cn("rounded-full hover:bg-neutral-300/70", isSidebarOpen && "lg:hidden")}
                                aria-label="Toggle navigation"
                            >
                                <Menu className="h-5 w-5 text-neutral-800" />
                            </Button>

                            {/* Welcome Greeting Title */}
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                                    Welcome, {user?.firstName || 'Josiah'}
                                    <span className="text-xl inline-block animate-bounce">🎉</span>
                                </h1>
                                <p className="text-xs md:text-sm text-neutral-600 mt-0.5 font-normal">
                                    Here`s what happening in your store.
                                </p>
                            </div>
                        </div>

                        {/* Right Pill Actions: Search, Theme Toggle, Notifications, Profile (Upper Level) */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/70 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] border border-white/80">
                                {/* Search Button */}
                                <button
                                    type="button"
                                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
                                    title="Search"
                                    onClick={() => router.push('/dashboard/pos')}
                                >
                                    <Search className="w-4 h-4" />
                                </button>

                                {/* Dark/Light mode icon */}
                                <button
                                    type="button"
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
                                    title="Toggle theme"
                                >
                                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                                </button>

                                {/* Notification Bell with Red Count Badge */}
                                <Link
                                    href="/dashboard/quotations"
                                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 relative transition-colors"
                                    title="Notifications"
                                >
                                    <Bell className="w-4 h-4" />
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 font-bold flex items-center justify-center shadow-xs">
                                        2
                                    </span>
                                </Link>

                                <div className="h-4 w-px bg-neutral-200 mx-0.5" />

                                {/* Connection Status Indicator */}
                                <div className="hidden sm:block">
                                    <ConnectionStatus />
                                </div>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 pl-1 pr-1.5 py-0.5 rounded-full hover:bg-neutral-100 transition-colors outline-hidden">
                                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-950 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                                {user?.firstName?.[0] || 'A'}
                                            </div>
                                            <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 shadow-lg border border-neutral-100">
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-semibold leading-none text-neutral-900">{userDisplayName}</p>
                                                <p className="text-xs leading-none text-neutral-500 truncate">{user?.email || 'admin@titec.lk'}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                                            <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm text-neutral-700">
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={logout}
                                            className="rounded-xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content Container */}
                    <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pb-8 scrollbar-none">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
