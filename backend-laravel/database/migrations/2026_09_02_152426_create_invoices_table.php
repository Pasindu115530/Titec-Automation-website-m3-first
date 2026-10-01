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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();                      // Offline idempotency key
            $table->string('invoice_number')->unique();          // Auto-generated: INV-2026-0001
            
            // Relations
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();  // Sales person
            
            // Financial
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);       // Tax percentage (e.g., 18.00 for 18%)
            $table->decimal('tax_amount', 12, 2)->default(0);    // Calculated tax
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->enum('discount_type', ['fixed', 'percentage'])->default('fixed');
            $table->decimal('grand_total', 12, 2)->default(0);
            
            // Status
            $table->enum('status', [
                'draft',         // Created but not finalized
                'confirmed',     // Confirmed — stock deducted
                'paid',          // Payment received
                'partially_paid',
                'void',          // Cancelled / voided — stock restored
            ])->default('draft');
            
            // Payment
            $table->enum('payment_method', [
                'cash', 'card', 'bank_transfer', 'cheque', 'credit'
            ])->nullable();
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->date('payment_date')->nullable();
            
            // PDF
            $table->string('pdf_path')->nullable();
            
            // Metadata
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();                   // Invoice terms & conditions
            $table->date('due_date')->nullable();
            
            // Offline sync
            $table->enum('sync_status', ['synced', 'pending'])->default('synced');
            $table->timestamp('synced_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('invoice_number');
            $table->index('status');
            $table->index('created_at');
            $table->index(['client_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
