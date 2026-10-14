'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ConnectionStatus } from '@/components/layout/connection-status';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    Menu,
    X,
    Search,
    HelpCircle,
    Bell,
    Moon,
    Sun,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getFilteredNavigation, isERPUser, type NavGroup } from '@/lib/rbac';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';
import TitecErpLogo from '@/components/titec-erp-logo';

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

// ─── Collapsible Group Component ────────────────────

function SidebarGroup({
    group,
    isExpanded,
    onToggle,
    pathname,
}: {
    group: NavGroup;
    isExpanded: boolean;
    onToggle: () => void;
    pathname: string;
}) {
    // Check if any item in this group is active
    const hasActiveItem = group.items.some(item => {
        const currentPath = (pathname || '').replace(/\/$/, '');
        const targetPath = item.href.replace(/\/$/, '');
        return currentPath === targetPath || (targetPath !== '/dashboard' && currentPath.startsWith(targetPath));
    });

    return (
        <div className="space-y-1">
            {/* Group Header */}
            <button
                onClick={onToggle}
                className={cn(
                    "flex items-center justify-between w-full px-5 py-2 text-[10.5px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 rounded-lg",
                    hasActiveItem
                        ? "text-neutral-800 dark:text-neutral-200"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                )}
            >
                <span>{group.label}</span>
                <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
            </button>

            {/* Group Items */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                            transitionEnd: { overflow: 'visible' },
                        }}
                        exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="-mx-2.5 px-2.5 py-1 -my-1 overflow-hidden"
                    >
                        <div className="space-y-1.5 pb-1">
                            {group.items.map((item) => {
                                const currentPath = (pathname || '').replace(/\/$/, '');
                                const targetPath = item.href.replace(/\/$/, '');
                                const isActive = currentPath === targetPath || (targetPath !== '/dashboard' && currentPath.startsWith(targetPath));
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn("block outline-none transition-all", isActive ? "relative z-10" : "relative z-0 hover:z-5")}
                                    >
                                        <span
                                            className={cn(
                                                "flex items-center gap-3 pl-7 pr-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer",
                                                isActive
                                                    ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-[0_4px_18px_rgba(37,99,235,0.35),0_1px_3px_rgba(0,0,0,0.06)] border border-white/25 scale-[1.02]"
                                                    : "bg-white/55 dark:bg-white/[0.06] backdrop-blur-md text-neutral-800 dark:text-neutral-200 border border-white/70 dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:bg-white/80 dark:hover:bg-white/[0.12] hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] hover:text-neutral-950 dark:hover:text-white hover:scale-[1.01]"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "h-4 w-4 shrink-0",
                                                    isActive ? "text-white" : "text-neutral-600 dark:text-neutral-400"
                                                )}
                                            />
                                            <span className="truncate">{item.name}</span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Storage helpers for expanded state ─────────────

const EXPANDED_GROUPS_KEY = 'erp_sidebar_expanded_groups';

function saveExpandedGroups(state: Record<string, boolean>) {
    try {
        localStorage.setItem(EXPANDED_GROUPS_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
}

// ═══════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = mounted && (resolvedTheme === 'dark' || theme === 'dark');
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAdmin, isLoading } = useAuth();

    // Get RBAC-filtered navigation groups
    const navGroups = getFilteredNavigation(user);

    // Expanded/collapsed state per group — uniform default avoids SSR hydration mismatch
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(navGroups.map(g => [g.label, true]))
    );

    // Restore saved group state from localStorage only after mount on the client
    useEffect(() => {
        try {
            const saved = localStorage.getItem(EXPANDED_GROUPS_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setExpandedGroups(prev => ({ ...prev, ...parsed }));
            }
        } catch { /* ignore */ }
    }, []);

    // Re-initialize expanded state when navGroups change (e.g. user role change)
    useEffect(() => {
        setExpandedGroups(prev => {
            const updated = { ...prev };
            for (const group of navGroups) {
                if (!(group.label in updated)) {
                    updated[group.label] = true;
                }
            }
            return updated;
        });
    }, [navGroups.length]);

    // Auth guard — redirect if not an ERP user
    useEffect(() => {
        if (!isLoading && !isAdmin && pathname !== '/dashboard/login') {
            router.push('/dashboard/login');
        }
    }, [isAdmin, isLoading, pathname, router]);

    // Password reset guard — force users to change password before accessing any other page
    useEffect(() => {
        if (
            !isLoading &&
            isAdmin &&
            user?.requiresPasswordReset &&
            pathname !== '/dashboard/change-password'
        ) {
            router.replace('/dashboard/change-password');
        }
    }, [isLoading, isAdmin, user?.requiresPasswordReset, pathname, router]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev => {
            const next = { ...prev, [label]: !prev[label] };
            saveExpandedGroups(next);
            return next;
        });
    };

    const userDisplayName = user?.firstName
        ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
        : 'User';

    // Get primary role display name
    const userRoleDisplay = user?.roles?.[0] || 'User';

    // Do not render dashboard shell on the login page
    if (pathname?.startsWith('/dashboard/login')) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#D0D4DA] dark:bg-[#080B11] text-neutral-900 dark:text-neutral-100 flex flex-col antialiased relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Depth Layer (Down Level) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 right-1/4 w-[650px] h-[650px] bg-blue-400/15 dark:bg-blue-600/25 rounded-full blur-[140px]" />
                <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-purple-400/15 dark:bg-purple-600/25 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-400/15 dark:bg-cyan-500/25 rounded-full blur-[140px]" />
                <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-amber-300/15 dark:bg-amber-500/15 rounded-full blur-[120px]" />
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
                    <div className="h-20 flex items-center justify-between px-6 shrink-0 min-w-[17.5rem]">
                        {/* TiTec ERP Animated Logo Header */}
                        <Link href="/dashboard" className="flex items-center group transition-transform duration-200 active:scale-98">
                            <TitecErpLogo logoHeight={52} speed={4} badgeVariant="text" />
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="lg:hidden rounded-2xl hover:bg-neutral-300/60 dark:hover:bg-neutral-800/80"
                        >
                            <X className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
                        </Button>
                    </div>

                    {/* Navigation — Dashboard + Grouped Sections */}
                    <nav className="flex-1 px-4 pt-4 pb-2 space-y-1 overflow-y-auto min-w-[17.5rem] scrollbar-none">
                        {/* Dashboard — Always visible, ungrouped */}
                        {(() => {
                            const currentPath = (pathname || '').replace(/\/$/, '');
                            const isActive = currentPath === '/dashboard';
                            return (
                                <Link
                                    href="/dashboard"
                                    className={cn("block mb-3 outline-none transition-all", isActive ? "relative z-10" : "relative z-0 hover:z-5")}
                                >
                                    <span
                                        className={cn(
                                            "flex items-center gap-3.5 px-6 py-3.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
                                            isActive
                                                ? "bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-[0_4px_18px_rgba(37,99,235,0.35),0_1px_3px_rgba(0,0,0,0.06)] border border-white/25 scale-[1.02]"
                                                : "bg-white/55 dark:bg-white/[0.06] backdrop-blur-md text-neutral-800 dark:text-neutral-200 border border-white/70 dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:bg-white/80 dark:hover:bg-white/[0.12] hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] hover:text-neutral-950 dark:hover:text-white hover:scale-[1.01]"
                                        )}
                                    >
                                        <DashboardGridIcon
                                            className={cn(
                                                "h-5 w-5 shrink-0",
                                                isActive ? "text-white" : "text-neutral-600 dark:text-neutral-400"
                                            )}
                                        />
                                        <span className="truncate">Dashboard</span>
                                    </span>
                                </Link>
                            );
                        })()}

                        {/* Collapsible Groups */}
                        <div className="space-y-3">
                            {navGroups.map((group) => (
                                <SidebarGroup
                                    key={group.label}
                                    group={group}
                                    isExpanded={expandedGroups[group.label] ?? true}
                                    onToggle={() => toggleGroup(group.label)}
                                    pathname={pathname || ''}
                                />
                            ))}
                        </div>

                        {/* Help / Support Link */}
                        <div className="pt-3">
                            <Link href="/dashboard" className="block">
                                <span className="flex items-center gap-3.5 px-6 py-3.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer bg-white/55 dark:bg-white/[0.06] backdrop-blur-md text-neutral-800 dark:text-neutral-200 border border-white/70 dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:bg-white/80 dark:hover:bg-white/[0.12] hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] hover:text-neutral-950 dark:hover:text-white">
                                    <HelpCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400 shrink-0" />
                                    <span>Help & Docs</span>
                                </span>
                            </Link>
                        </div>
                    </nav>

                    {/* Sign Out Action */}
                    <div className="p-4 min-w-[17.5rem]">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-6 py-3 w-full rounded-full text-sm font-medium text-red-600 dark:text-red-400 bg-red-100/60 dark:bg-red-950/30 backdrop-blur-md border border-red-200/60 dark:border-red-900/40 hover:bg-red-100/90 dark:hover:bg-red-900/50 shadow-[0_4px_14px_rgba(239,68,68,0.06)] transition-all cursor-pointer"
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
                                className={cn("rounded-full hover:bg-neutral-300/70 dark:hover:bg-neutral-800/80", isSidebarOpen && "lg:hidden")}
                                aria-label="Toggle navigation"
                            >
                                <Menu className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
                            </Button>

                            {/* Welcome Greeting Title */}
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                                    Welcome, {user?.firstName || 'Hashan'}
                                </h1>
                                <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 font-normal">
                                    Here`s what happening in your store.
                                </p>
                            </div>
                        </div>

                        {/* Right Pill Actions: Search, Theme Toggle, Notifications, Profile (Upper Level) */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/70 dark:bg-neutral-900/80 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)] border border-white/80 dark:border-neutral-800/80">
                                {/* Search Button */}
                                <button
                                    type="button"
                                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                                    title="Search"
                                    onClick={() => router.push('/dashboard/pos')}
                                >
                                    <Search className="w-4 h-4" />
                                </button>

                                {/* Dark/Light mode icon */}
                                <button
                                    type="button"
                                    onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                                    title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                                >
                                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-400 animate-in fade-in" /> : <Moon className="w-4 h-4 text-neutral-700 dark:text-neutral-300 animate-in fade-in" />}
                                </button>

                                {/* Notification Bell with Red Count Badge */}
                                <Link
                                    href="/dashboard/quotations"
                                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white relative transition-colors cursor-pointer"
                                    title="Notifications"
                                >
                                    <Bell className="w-4 h-4" />
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 font-bold flex items-center justify-center shadow-xs">
                                        2
                                    </span>
                                </Link>

                                <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-0.5" />

                                {/* Connection Status Indicator */}
                                <div className="hidden sm:block">
                                    <ConnectionStatus />
                                </div>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 pl-1 pr-1.5 py-0.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors outline-hidden cursor-pointer">
                                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-950 dark:from-neutral-700 dark:to-neutral-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                                {user?.firstName?.[0] || 'A'}
                                            </div>
                                            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" sideOffset={12} className="w-64 rounded-2xl p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
                                        <div className="flex items-center gap-3 p-2.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl mb-1.5 border border-neutral-100 dark:border-neutral-700/60">
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-950 dark:from-neutral-700 dark:to-neutral-900 text-white flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
                                                {user?.firstName?.[0] || 'T'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate leading-tight">{userDisplayName}</p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize truncate mt-0.5">{userRoleDisplay}</p>
                                            </div>
                                        </div>
                                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                            <Link href="/dashboard/settings" className="flex items-center gap-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 w-full">
                                                <Settings className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                                <span>Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1 bg-neutral-100 dark:bg-neutral-800" />
                                        <DropdownMenuItem
                                            onClick={logout}
                                            className="rounded-xl px-3 py-2 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus:text-red-600 focus:bg-red-50 transition-colors flex items-center gap-2.5 text-sm font-medium w-full"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                                            <span>Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content Container */}
                    <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 pt-6 pb-8 scrollbar-none">
                        {children}
                    </main>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
