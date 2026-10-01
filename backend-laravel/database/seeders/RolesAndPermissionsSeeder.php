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

        // Content Management (website CMS features)
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

        // ERP Permissions
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
            // System / HR
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            'employees.view',
            'employees.edit',
            'settings.manage',
        ];

        $allPermissions = array_merge($contentPermissions, $erpPermissions);

        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'sanctum']);
        }

        // ═══════════════════════════════════════════════
        // ROLES — 6 active roles + 1 future (Client)
        // ═══════════════════════════════════════════════

        // ── Super Admin ─────────────────────────────
        // Unrestricted access to everything (R, W, D)
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'sanctum']);
        $superAdmin->syncPermissions($allPermissions);

        // ── Web Admin ───────────────────────────────
        // Manages website content (Products, Projects, Brands, Services) + Quotations (R, W)
        $webAdmin = Role::firstOrCreate(['name' => 'Web Admin', 'guard_name' => 'sanctum']);
        $webAdmin->syncPermissions([
            'products.view', 'products.create', 'products.edit',
            'projects.view', 'projects.create', 'projects.edit',
            'brands.view', 'brands.create', 'brands.edit',
            'services.view', 'services.create', 'services.edit',
            'quotations.view', 'quotations.reply', 'quotations.create',
            'dashboard.view',
        ]);

        // ── Sales ───────────────────────────────────
        // POS, invoicing, client management, quotations (R, W)
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

        // ── Accountant ──────────────────────────────
        // Financial oversight — read-only + payment recording (R, limited W)
        $accountant = Role::firstOrCreate(['name' => 'Accountant', 'guard_name' => 'sanctum']);
        $accountant->syncPermissions([
            'invoices.view',
            'invoices.edit',        // Needed for recording payments
            'clients.view',
            'reports.sales',
            'reports.inventory',
            'reports.warranty',
            'dashboard.view',
        ]);

        // ── HR Admin ────────────────────────────────
        // Employee & user management (R, W, D on users/employees)
        $hrAdmin = Role::firstOrCreate(['name' => 'HR Admin', 'guard_name' => 'sanctum']);
        $hrAdmin->syncPermissions([
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'employees.view', 'employees.edit',
            'settings.manage',
            'dashboard.view',
        ]);

        // ── Technician ──────────────────────────────
        // Field work: installations, service logs, warranty, stock receiving (R, W own scope)
        // Includes former Store Keeper inventory permissions
        $technician = Role::firstOrCreate(['name' => 'Technician', 'guard_name' => 'sanctum']);
        $technician->syncPermissions([
            'products.view',
            'clients.view',
            'installations.view', 'installations.update_status',
            'service_logs.view', 'service_logs.create', 'service_logs.edit',
            'inventory.view', 'inventory.receive',
            'dashboard.view',
        ]);

        // ── Client (Future) ─────────────────────────
        // Seeded for future client portal — no ERP permissions currently
        Role::firstOrCreate(['name' => 'Client', 'guard_name' => 'sanctum']);
    }
}
