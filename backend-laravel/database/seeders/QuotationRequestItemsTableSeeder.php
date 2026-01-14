<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotationRequestItemsTableSeeder extends Seeder
{
    public function run()
    {
        // Items for Request #1 (John Engineering)
        $itemsRequest1 = [
            [
                'quotation_request_id' => 1,
                'product_id' => 1, // Siemens PLC
                'quantity' => 5,
            ],
            [
                'quotation_request_id' => 1,
                'product_id' => 3, // Omron Relay
                'quantity' => 50,
            ]
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

        // Items for Request #2 (AutoMakers)
        $itemsRequest2 = [
            [
                'quotation_request_id' => 2,
                'product_id' => 2, // Mitsubishi Inverter
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