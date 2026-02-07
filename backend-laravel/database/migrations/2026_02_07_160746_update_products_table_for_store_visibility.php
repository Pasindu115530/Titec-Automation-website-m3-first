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
        Schema::table('products', function (Blueprint $table) {
            // Add on_store column
            $table->boolean('on_store')->default(true)->after('stock_status');
            
            // Drop soft delete column
            $table->dropColumn('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Remove on_store column
            $table->dropColumn('on_store');
            
            // Re-add soft delete column
            $table->softDeletes();
        });
    }
};
