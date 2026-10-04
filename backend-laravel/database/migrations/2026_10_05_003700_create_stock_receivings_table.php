<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Parent batch table — one row per restocking session
        Schema::create('stock_receivings', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();          // SR-2026-0001
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->enum('type', ['received', 'adjustment', 'damaged', 'return'])->default('received');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('created_at');
        });

        // Child items — each product in the batch
        Schema::create('stock_receiving_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_receiving_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity');              // How many units received
            $table->integer('stock_before');          // Stock level before this item
            $table->integer('stock_after');           // Stock level after this item
            $table->timestamps();
        });

        // Add a nullable FK on stock_movements to link to parent batch
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->foreignId('stock_receiving_id')->nullable()->after('reference_id')
                  ->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('stock_receiving_id');
        });
        Schema::dropIfExists('stock_receiving_items');
        Schema::dropIfExists('stock_receivings');
    }
};
