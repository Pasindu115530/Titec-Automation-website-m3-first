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
        Schema::create('service_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();                      // Offline idempotency key
            
            // Relations
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_item_id')->nullable()->constrained()->nullOnDelete();  // Specific equipment
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('technician_id')->constrained('users')->restrictOnDelete();
            
            // Service Details
            $table->string('title');                              // e.g., "Annual VFD Maintenance"
            $table->text('description');                          // Work performed
            $table->text('diagnosis')->nullable();                // Problem found
            $table->text('resolution')->nullable();               // How it was fixed
            
            // Classification
            $table->enum('service_type', [
                'maintenance',       // Routine maintenance
                'repair',            // Breakdown repair
                'inspection',        // Periodic inspection
                'warranty_claim',    // Under warranty
                'installation_followup',
            ]);
            
            // Warranty Check (auto-calculated)
            $table->boolean('is_under_warranty')->default(false); // Auto-set based on warranty_end_date
            $table->boolean('is_chargeable')->default(true);      // false if under warranty
            $table->decimal('service_charge', 12, 2)->default(0);
            
            // Timing
            $table->date('service_date');
            $table->date('next_service_date')->nullable();        // Reminder for next visit
            
            // Status
            $table->enum('status', ['pending', 'completed', 'requires_followup'])->default('pending');
            
            // Attachments
            $table->json('photos')->nullable();                   // Before/after photos
            
            // Offline sync
            $table->enum('sync_status', ['synced', 'pending'])->default('synced');
            
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('service_date');
            $table->index(['client_id', 'service_date']);
            $table->index('next_service_date');
            $table->index('is_under_warranty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_logs');
    }
};
