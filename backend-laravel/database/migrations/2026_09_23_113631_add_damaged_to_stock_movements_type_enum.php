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
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE stock_movements MODIFY COLUMN type ENUM('sale', 'void', 'adjustment', 'received', 'return', 'damaged') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE stock_movements MODIFY COLUMN type ENUM('sale', 'void', 'adjustment', 'received', 'return') NOT NULL");
    }
};
