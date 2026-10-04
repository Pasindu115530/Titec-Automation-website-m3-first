/**
 * Centralized RBAC Configuration for TiTEC ERP
 * 
 * All role names, permission keys, and sidebar navigation groups are defined here.
 * Permission keys use dot-notation to match Spatie backend format exactly.
 */

import {
    LayoutDashboard,
    ShoppingBag,
    FileText,
    Users,
    Package,
    Wrench,
    ClipboardList,
    ShieldCheck,
    BarChart3,
    FolderPlus,
    LayoutGrid,
    Settings,
    type LucideIcon,
} from 'lucide-react';

// ═══════════════════════════════════════════════
// ROLE CONSTANTS
// ═══════════════════════════════════════════════

export const ROLES = {
    SUPER_ADMIN: 'Super Admin',
    WEB_ADMIN: 'Web Admin',
    SALES: 'Sales',
    ACCOUNTANT: 'Accountant',
    HR_ADMIN: 'HR Admin',
    TECHNICIAN: 'Technician',
    CLIENT: 'Client',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/** All roles that grant ERP dashboard access */
export const ERP_ROLES: RoleName[] = [
    ROLES.SUPER_ADMIN,
    ROLES.WEB_ADMIN,
    ROLES.SALES,
    ROLES.ACCOUNTANT,
    ROLES.HR_ADMIN,
    ROLES.TECHNICIAN,
];

// ═══════════════════════════════════════════════
// PERMISSION KEYS (dot-notation — matches Spatie)
// ═══════════════════════════════════════════════

export const PERMISSIONS = {
    // Dashboard
    DASHBOARD_VIEW: 'dashboard.view',
    // CMS
    PRODUCTS_VIEW: 'products.view',
    PROJECTS_VIEW: 'projects.view',
    BRANDS_VIEW: 'brands.view',
    SERVICES_VIEW: 'services.view',
    // Quotations
    QUOTATIONS_VIEW: 'quotations.view',
    // Clients
    CLIENTS_VIEW: 'clients.view',
    // Invoices / POS
    INVOICES_VIEW: 'invoices.view',
    INVOICES_CREATE: 'invoices.create',
    // Inventory
    INVENTORY_VIEW: 'inventory.view',
    // Installations
    INSTALLATIONS_VIEW: 'installations.view',
    // Service Logs
    SERVICE_LOGS_VIEW: 'service_logs.view',
    // Reports
    REPORTS_SALES: 'reports.sales',
    REPORTS_INVENTORY: 'reports.inventory',
    REPORTS_WARRANTY: 'reports.warranty',
    // Users / Employees
    USERS_VIEW: 'users.view',
    EMPLOYEES_VIEW: 'employees.view',
    // Settings
    SETTINGS_MANAGE: 'settings.manage',
} as const;

// ═══════════════════════════════════════════════
// NAVIGATION TYPES
// ═══════════════════════════════════════════════

// Custom SVG icon type for DashboardGridIcon
type IconComponent = any;

export interface NavItem {
    name: string;
    icon: IconComponent;
    href: string;
    /** At least one of these permissions is required (OR logic) */
    requiredPermissions?: string[];
    /** At least one of these roles is required (OR logic) */
    requiredRoles?: string[];
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

// ═══════════════════════════════════════════════
// SIDEBAR NAVIGATION GROUPS
// ═══════════════════════════════════════════════

export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'Sales & Billing',
        items: [
            {
                name: 'POS / Billing',
                icon: ShoppingBag,
                href: '/dashboard/pos',
                requiredPermissions: [PERMISSIONS.INVOICES_CREATE],
            },
            {
                name: 'Invoices',
                icon: FileText,
                href: '/dashboard/invoices',
                requiredPermissions: [PERMISSIONS.INVOICES_VIEW],
            },
            {
                name: 'Quotations',
                icon: FileText,
                href: '/dashboard/quotations',
                requiredPermissions: [PERMISSIONS.QUOTATIONS_VIEW],
            },
        ],
    },
    {
        label: 'Operations',
        items: [
            {
                name: 'Clients',
                icon: Users,
                href: '/dashboard/clients',
                requiredPermissions: [PERMISSIONS.CLIENTS_VIEW],
            },
            {
                name: 'Installations',
                icon: Wrench,
                href: '/dashboard/installations',
                requiredPermissions: [PERMISSIONS.INSTALLATIONS_VIEW],
            },
            {
                name: 'Service Logs',
                icon: ClipboardList,
                href: '/dashboard/service-logs',
                requiredPermissions: [PERMISSIONS.SERVICE_LOGS_VIEW],
            },
            {
                name: 'Warranty Check',
                icon: ShieldCheck,
                href: '/dashboard/warranty',
                requiredPermissions: [PERMISSIONS.SERVICE_LOGS_VIEW],
            },
        ],
    },
    {
        label: 'Inventory',
        items: [
            {
                name: 'Products & Stock',
                icon: Package,
                href: '/dashboard/inventory',
                requiredPermissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.PRODUCTS_VIEW],
            },
        ],
    },
    {
        label: 'Website CMS',
        items: [
            {
                name: 'Projects',
                icon: FolderPlus,
                href: '/dashboard/projects',
                requiredPermissions: [PERMISSIONS.PROJECTS_VIEW],
            },
            {
                name: 'Brands',
                icon: LayoutGrid,
                href: '/dashboard/brands',
                requiredPermissions: [PERMISSIONS.BRANDS_VIEW],
            },
            {
                name: 'Services',
                icon: Wrench,
                href: '/dashboard/services',
                requiredPermissions: [PERMISSIONS.SERVICES_VIEW],
            },
        ],
    },
    {
        label: 'Administration',
        items: [
            {
                name: 'Employees',
                icon: Users,
                href: '/dashboard/employees',
                requiredPermissions: [PERMISSIONS.USERS_VIEW],
            },
            {
                name: 'Reports',
                icon: BarChart3,
                href: '/dashboard/reports',
                requiredPermissions: [PERMISSIONS.REPORTS_SALES, PERMISSIONS.REPORTS_INVENTORY, PERMISSIONS.REPORTS_WARRANTY],
            },
            {
                name: 'Settings',
                icon: Settings,
                href: '/dashboard/settings',
                requiredRoles: [ROLES.SUPER_ADMIN, ROLES.HR_ADMIN],
            },
        ],
    },
];

// ═══════════════════════════════════════════════
// ACCESS CHECK UTILITIES
// ═══════════════════════════════════════════════

interface UserForRBAC {
    roles?: string[];
    permissions?: string[];
}

/**
 * Check if a user can access a specific nav item.
 * Super Admin always has access.
 */
export function canAccessItem(user: UserForRBAC | null, item: NavItem): boolean {
    if (!user) return false;
    if (user.roles?.includes(ROLES.SUPER_ADMIN)) return true;

    // Check required roles (OR — any match grants access)
    if (item.requiredRoles && item.requiredRoles.length > 0) {
        const hasRole = item.requiredRoles.some(role => user.roles?.includes(role));
        if (!hasRole) return false;
    }

    // Check required permissions (OR — any match grants access)
    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
        const hasPermission = item.requiredPermissions.some(
            permission => user.permissions?.includes(permission)
        );
        if (!hasPermission) return false;
    }

    return true;
}

/**
 * Filter navigation groups for a user, removing empty groups and inaccessible items.
 */
export function getFilteredNavigation(user: UserForRBAC | null): NavGroup[] {
    if (!user) return [];

    return NAV_GROUPS
        .map(group => ({
            ...group,
            items: group.items.filter(item => canAccessItem(user, item)),
        }))
        .filter(group => group.items.length > 0);
}

/**
 * Check if a user has any of the given ERP roles (for dashboard access guard).
 */
export function isERPUser(user: UserForRBAC | null): boolean {
    if (!user || !user.roles) return false;
    return ERP_ROLES.some(role => user.roles!.includes(role));
}
