<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->enum('email_provisioning_status', ['pending_email', 'provisioned', 'active'])->default('active')->after('employment_status');
            $table->string('provisioning_token')->nullable()->unique()->after('email_provisioning_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['email_provisioning_status', 'provisioning_token']);
        });
    }
};
