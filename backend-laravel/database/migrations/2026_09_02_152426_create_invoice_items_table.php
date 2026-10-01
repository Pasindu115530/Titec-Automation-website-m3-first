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
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            
            // Item Details (denormalized for historical accuracy)
            $table->string('product_name');                      // Snapshot at time of sale
            $table->string('product_model')->nullable();         // Model number snapshot
            $table->string('product_sku')->nullable();           // SKU snapshot
            $table->string('serial_number')->nullable();         // Unique per physical unit
            
            // Pricing
            $table->decimal('unit_price', 12, 2);
            $table->integer('quantity')->default(1);
            $table->string('unit')->default('pcs');               // pcs, meters, sets, etc.
            $table->decimal('line_total', 12, 2);                // unit_price × quantity
            
            // Warranty
            $table->integer('warranty_months')->default(0);      // Default from product, overridable
            $table->date('warranty_start_date')->nullable();     // Usually = invoice confirmed date
            $table->date('warranty_end_date')->nullable();       // Auto-calculated or manual override
            
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('serial_number');
            $table->index('warranty_end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
