<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'name' => 'Siemens SIMATIC S7-1200 CPU 1214C',
                'model_number' => '6ES7214-1AG40-0XB0',
                'slug' => 'siemens-s7-1200-cpu-1214c',
                'description' => 'Compact CPU, DC/DC/DC, onboard I/O: 14 DI 24 V DC; 10 DO 24 V DC; 2 AI 0-10 V DC.',
                'images' => json_encode(['products/s7-1200-front.jpg', 'products/s7-1200-side.jpg']),
                'datasheet_path' => 'datasheets/s7-1200-manual.pdf',
                'stock_status' => 'in_stock',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mitsubishi Electric Inverter FR-D700',
                'model_number' => 'FR-D720S-2.2K',
                'slug' => 'mitsubishi-inverter-fr-d700',
                'description' => 'Simple and powerful compact inverter. 2.2kW, Single Phase 200V.',
                'images' => json_encode(['products/fr-d700.jpg']),
                'datasheet_path' => 'datasheets/fr-d700-spec.pdf',
                'stock_status' => 'call_for_price',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Omron MY2N-GS Relay',
                'model_number' => 'MY2N-GS-DC24',
                'slug' => 'omron-my2n-gs-relay',
                'description' => 'General purpose relay, DPDT, 5A, 24VDC coil with LED indicator.',
                'images' => json_encode(['products/omron-relay.jpg']),
                'datasheet_path' => null,
                'stock_status' => 'in_stock',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['slug' => $product['slug']],
                $product
            );
        }
    }
}