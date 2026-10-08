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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();   // Who made the change
            
            $table->enum('type', [
                'sale',              // Stock reduced via invoice confirmation
                'void',              // Stock restored via invoice void
                'adjustment',        // Manual stock adjustment
                'received',          // New stock received
                'return',            // Customer return
            ]);
            
            $table->integer('quantity');                           // Positive = increase, Negative = decrease
            $table->integer('stock_before');                      // Stock level before this movement
            $table->integer('stock_after');                       // Stock level after this movement
            
            // Reference
            $table->string('reference_type')->nullable();         // 'invoice', 'adjustment', etc.
            $table->unsignedBigInteger('reference_id')->nullable(); // Invoice ID, etc.
            
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['product_id', 'created_at']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
