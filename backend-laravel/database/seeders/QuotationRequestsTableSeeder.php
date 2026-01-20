<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotationRequestsTableSeeder extends Seeder
{
    public function run()
    {
        // Check if records exist to avoid duplicates if not using updateOrInsert with unique keys that are reliable (id 1/2 is good)
        // Request 1: Pending review (Linked User)
        DB::table('quotation_requests')->updateOrInsert(
            ['id' => 1],
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '1234567890',
                'customer_notes' => 'Urgent requirement for factory upgrade. Need best price for bulk.',
                'status' => 'pending',
                'created_at' => now()->subHours(4),
                'updated_at' => now()->subHours(4),
            ]
        );

        // Request 2: Already Quoted (Linked User)
        DB::table('quotation_requests')->updateOrInsert(
            ['id' => 2],
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '1234567890',
                'customer_notes' => 'Please include shipping cost to Colombo.',
                'status' => 'quoted',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDay(),
            ]
        );

        // Request 3: Guest Request (No User ID)
        DB::table('quotation_requests')->updateOrInsert(
            ['id' => 3],
            [
                'name' => 'Guest User',
                'email' => 'guest@example.com',
                'phone' => '0987654321',
                'customer_notes' => 'Looking for automation sensors.',
                'status' => 'pending',
                'created_at' => now()->subHour(),
                'updated_at' => now()->subHour(),
            ]
        );
    }
}