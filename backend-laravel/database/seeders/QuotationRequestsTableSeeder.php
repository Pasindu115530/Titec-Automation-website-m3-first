<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotationRequestsTableSeeder extends Seeder
{
    public function run()
    {
        // Check if records exist to avoid duplicates if not using updateOrInsert with unique keys that are reliable (id 1/2 is good)
        // Request 1: Pending review
        DB::table('quotation_requests')->updateOrInsert(
            ['id' => 1],
            [
                'user_id' => 1, // Assumes user 1 exists, usually created by DatabaseSeeder
                'customer_notes' => 'Urgent requirement for factory upgrade. Need best price for bulk.',
                'status' => 'pending',
                'created_at' => now()->subHours(4),
                'updated_at' => now()->subHours(4),
            ]
        );

        // Request 2: Already Quoted
        DB::table('quotation_requests')->updateOrInsert(
            ['id' => 2],
            [
                'user_id' => 1, // Reuse user 1 or null if guest logic permits
                'customer_notes' => 'Please include shipping cost to Colombo.',
                'status' => 'quoted',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDay(),
            ]
        );
    }
}