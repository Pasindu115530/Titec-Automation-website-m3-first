<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Models\User;

return new class extends Migration
{
    public function up(): void
    {
        // Ensure roles exist (idempotent)
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);

        // Migrate existing admin users to Super Admin role
        $adminUsers = User::where('role', 'admin')->get();
        foreach ($adminUsers as $user) {
            $user->assignRole($superAdmin);
        }
    }

    public function down(): void
    {
        // Revert: remove Spatie roles from users
        $adminUsers = User::role('Super Admin')->get();
        foreach ($adminUsers as $user) {
            $user->removeRole('Super Admin');
        }
    }
};
