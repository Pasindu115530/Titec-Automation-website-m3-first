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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();  // Optional link to users table
            
            // Business Information
            $table->string('company_name')->nullable();
            $table->string('contact_person');                    // Primary contact name
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('secondary_phone')->nullable();
            $table->string('nic')->nullable();                   // National Identity Card (Sri Lanka)
            
            // Address
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('district')->nullable();              // Sri Lanka district
            
            // Classification
            $table->enum('client_type', ['individual', 'business'])->default('individual');
            $table->string('tax_id')->nullable();                // Business Registration / TIN number
            
            // Notes
            $table->text('notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('phone');
            $table->index('email');
            $table->index('company_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
