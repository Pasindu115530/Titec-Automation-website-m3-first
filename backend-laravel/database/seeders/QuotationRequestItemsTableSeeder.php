<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotationRequestItemsTableSeeder extends Seeder
{
    public function run()
    {
        // Items for Request #1
        $itemsRequest1 = [
            [
                'quotation_request_id' => 1,
                'product_id' => \App\Models\Product::first()->id ?? 1, // Dynamic ID or fallback
                'quantity' => 5,
            ],
        ];

        foreach ($itemsRequest1 as $item) {
            DB::table('quotation_request_items')->updateOrInsert(
                [
                    'quotation_request_id' => $item['quotation_request_id'],
                    'product_id' => $item['product_id']
                ],
                $item
            );
        }

        // Items for Request #2
        $itemsRequest2 = [
            [
                'quotation_request_id' => 2,
                'product_id' => \App\Models\Product::count() > 1 ? \App\Models\Product::all()->skip(1)->first()->id : 1,
                'quantity' => 2,
            ]
        ];

        foreach ($itemsRequest2 as $item) {
            DB::table('quotation_request_items')->updateOrInsert(
                [
                    'quotation_request_id' => $item['quotation_request_id'],
                    'product_id' => $item['product_id']
                ],
                $item
            );
        }
    }
}