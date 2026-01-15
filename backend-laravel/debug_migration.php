<?php
// debug_migration.php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

try {
    echo "Checking connection...\n";
    DB::connection()->getPdo();
    echo "Connection OK.\n";
    
    echo "Columns before:\n";
    print_r(Schema::getColumnListing('products'));
    
    echo "Attempting to add 'price' column...\n";
    Schema::table('products', function (Blueprint $table) {
        if (!Schema::hasColumn('products', 'price')) {
             $table->decimal('price', 10, 2)->nullable()->after('description');
             echo "Added 'price'.\n";
        } else {
             echo "'price' already exists.\n";
        }
        
        if (!Schema::hasColumn('products', 'stock')) {
             $table->integer('stock')->default(0)->after('price');
             echo "Added 'stock'.\n";
        }

        if (!Schema::hasColumn('products', 'category')) {
             $table->string('category')->nullable()->after('stock');
             echo "Added 'category'.\n";
        }
        
        if (!Schema::hasColumn('products', 'sku')) {
             $table->string('sku')->nullable()->after('category');
             echo "Added 'sku'.\n";
        }
    });
    
    echo "Migration script finished.\n";
    
    echo "Columns after:\n";
    print_r(Schema::getColumnListing('products'));
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
