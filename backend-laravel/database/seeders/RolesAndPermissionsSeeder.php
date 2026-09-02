<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ═══════════════════════════════════════════════
        // PERMISSIONS — Granular access control
        // ═══════════════════════════════════════════════

        // Content Management (existing admin panel features)
        $contentPermissions = [
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'projects.view',
            'projects.create',
            'projects.edit',
            'projects.delete',
            'brands.view',
            'brands.create',
            'brands.edit',
            'brands.delete',
            'services.view',
            'services.create',
            'services.edit',
            'services.delete',
            'quotations.view',
            'quotations.reply',
            'quotations.create',
            'dashboard.view',
        ];

        // ERP Permissions (Phase 2 — create now, assign later)
        $erpPermissions = [
            // Clients
            'clients.view',
            'clients.create',
            'clients.edit',
            'clients.delete',
            // Invoices / POS
            'invoices.view',
            'invoices.create',
            'invoices.edit',
            'invoices.void',
            // Inventory
            'inventory.view',
            'inventory.adjust',
            'inventory.receive',
            // Installations
            'installations.view',
            'installations.create',
            'installations.edit',
            'installations.update_status',
            // Service History
            'service_logs.view',
            'service_logs.create',
            'service_logs.edit',
            // Reports
            'reports.sales',
            'reports.inventory',
            'reports.warranty',
            // System
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            'settings.manage',
        ];

        $allPermissions = array_merge($contentPermissions, $erpPermissions);

        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'sanctum']);
        }

        // ═══════════════════════════════════════════════
        // ROLES — Role definitions with permission sets
        // ═══════════════════════════════════════════════

        // Super Admin — unrestricted access to everything
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'sanctum']);
        $superAdmin->syncPermissions($allPermissions);

        // Content Editor — manage website content (products, projects, brands, services)
        $contentEditor = Role::firstOrCreate(['name' => 'Content Editor', 'guard_name' => 'sanctum']);
        $contentEditor->syncPermissions([
            'products.view', 'products.create', 'products.edit', 'products.delete',
            'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
            'brands.view', 'brands.create', 'brands.edit', 'brands.delete',
            'services.view', 'services.create', 'services.edit', 'services.delete',
            'dashboard.view',
        ]);

        // Sales — POS, invoicing, client management, quotations
        $sales = Role::firstOrCreate(['name' => 'Sales', 'guard_name' => 'sanctum']);
        $sales->syncPermissions([
            'products.view',
            'brands.view',
            'quotations.view', 'quotations.reply', 'quotations.create',
            'clients.view', 'clients.create', 'clients.edit',
            'invoices.view', 'invoices.create', 'invoices.edit',
            'inventory.view',
            'dashboard.view',
            'reports.sales',
        ]);

        // Technician — installations, service history, field work
        $technician = Role::firstOrCreate(['name' => 'Technician', 'guard_name' => 'sanctum']);
        $technician->syncPermissions([
            'products.view',
            'clients.view',
            'installations.view', 'installations.update_status',
            'service_logs.view', 'service_logs.create', 'service_logs.edit',
        ]);

        // Manager — full ERP access, no user/system management
        $manager = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'sanctum']);
        $manager->syncPermissions(array_diff($allPermissions, [
            'users.create', 'users.edit', 'users.delete',
            'settings.manage',
        ]));

        // Accountant — read-only financial access
        $accountant = Role::firstOrCreate(['name' => 'Accountant', 'guard_name' => 'sanctum']);
        $accountant->syncPermissions([
            'invoices.view',
            'clients.view',
            'reports.sales',
            'reports.inventory',
            'reports.warranty',
            'dashboard.view',
        ]);

        // Store Keeper — inventory management
        $storeKeeper = Role::firstOrCreate(['name' => 'Store Keeper', 'guard_name' => 'sanctum']);
        $storeKeeper->syncPermissions([
            'products.view',
            'brands.view',
            'inventory.view', 'inventory.adjust', 'inventory.receive',
            'reports.inventory',
        ]);
    }
}
