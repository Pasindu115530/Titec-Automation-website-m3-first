<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotationsTableSeeder extends Seeder
{
    public function run()
    {
        // Quote for Request #2
        DB::table('quotations')->updateOrInsert(
            ['quotation_request_id' => 2],
            [
                'admin_id' => 1, // Created by TiTec Admin
                'grand_total' => 150000.00, // LKR 150,000
                'pdf_path' => 'quotes/quote_ref_001.pdf', // Path to a dummy PDF
                'valid_until' => now()->addDays(14), // Valid for 2 weeks
                'remarks' => 'Price includes VAT and local delivery.',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ]
        );
    }
}