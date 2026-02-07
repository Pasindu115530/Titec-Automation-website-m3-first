<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'HMI Touch Panel 7-inch',
                'model_number' => 'HMI-7000',
                'sku' => 'HMI-7000',
                'description' => 'Professional 7-inch Human Machine Interface touch panel for industrial automation applications. Features high-resolution display, multi-touch support, and robust design for harsh environments.',
                'price' => 45000.00,
                'stock' => 15,
                'category' => 'HMI',
                'brand' => 'Siemens',
                'on_store' => true,
                'stock_status' => 'in_stock',
                'images' => [],
                'datasheet_path' => null,
            ],
            [
                'name' => 'Industrial Circuit Breaker 3-Phase',
                'model_number' => 'CB-3P-100A',
                'sku' => 'CB-3P-100A',
                'description' => 'Heavy-duty 3-phase industrial circuit breaker rated at 100A. Provides reliable protection for industrial electrical systems with fast-acting trip mechanism and easy reset functionality.',
                'price' => 12500.00,
                'stock' => 30,
                'category' => 'Circuit Breaker',
                'brand' => 'ABB',
                'on_store' => true,
                'stock_status' => 'in_stock',
                'images' => [],
                'datasheet_path' => null,
            ],
            [
                'name' => 'Variable Frequency Drive 5.5kW',
                'model_number' => 'VFD-5500',
                'sku' => 'VFD-5500',
                'description' => 'Precision variable frequency drive for motor speed control up to 5.5kW. Features advanced motor control algorithms, energy-saving operation, and comprehensive protection functions.',
                'price' => 65000.00,
                'stock' => 8,
                'category' => 'VFD',
                'brand' => 'Schneider Electric',
                'on_store' => true,
                'stock_status' => 'in_stock',
                'images' => [],
                'datasheet_path' => null,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
