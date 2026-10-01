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
        Schema::create('installations', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();        // INST-2026-0001
            
            // Relations
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            
            // Details
            $table->string('title');                              // e.g., "VFD Installation at Colombo Factory"
            $table->text('description')->nullable();
            $table->text('location');                             // Installation site address
            $table->string('location_coordinates')->nullable();   // GPS lat,lng for future map view
            
            // Status Tracking
            $table->enum('status', [
                'scheduled',     // Installation date set
                'in_progress',   // Technicians on site
                'completed',     // Installation finished
                'on_hold',       // Paused/waiting for parts
                'cancelled',
            ])->default('scheduled');
            
            $table->date('scheduled_date')->nullable();
            $table->date('started_date')->nullable();
            $table->date('completed_date')->nullable();
            
            // Priority
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('status');
            $table->index('scheduled_date');
            $table->index(['client_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installations');
    }
};
