<?php

namespace Database\Seeders;

use App\Models\Quotation;
use Illuminate\Database\Seeder;

class QuotationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Quotation::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '1234567890',
            'items' => [
                ['name' => 'Home Automation System', 'quantity' => 1, 'notes' => 'Full package'],
                ['name' => 'Smart Light Bulbs', 'quantity' => 10, 'notes' => 'Warm white'],
            ],
            'status' => 'pending',
        ]);

        Quotation::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '0987654321',
            'items' => [
                ['name' => 'Security Camera Setup', 'quantity' => 4, 'notes' => 'Outdoor'],
                ['name' => 'Installation Service', 'quantity' => 1, 'notes' => 'Standard'],
            ],
            'status' => 'sent',
            'total_amount' => 1250.00,
        ]);
        
        Quotation::create([
             'name' => 'Bob Johnson',
             'email' => 'bob@example.com',
             'phone' => '5555555555',
             'items' => [
                 ['name' => 'Projector Mount', 'quantity' => 1, 'notes' => 'Ceiling'],
             ],
             'status' => 'rejected',
        ]);
    }
}
