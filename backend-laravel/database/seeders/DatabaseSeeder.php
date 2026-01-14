<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'role' => 'admin',
                'password' => bcrypt('password'), // Ensure you strictly set a password if creating
            ]
        );

        // Create additional users required for seeders
        User::firstOrCreate(
            ['id' => 2],
            [
                'name' => 'John Engineering Ltd',
                'email' => 'john@engineering.com',
                'role' => 'user',
                'password' => bcrypt('password'),
            ]
        );

        User::firstOrCreate(
            ['id' => 3],
            [
                'name' => 'AutoMakers Sri Lanka',
                'email' => 'info@automakers.lk',
                'role' => 'user',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            ProductsTableSeeder::class,
            QuotationRequestsTableSeeder::class,
            QuotationsTableSeeder::class,
            QuotationRequestItemsTableSeeder::class,
        ]);
    }
}
