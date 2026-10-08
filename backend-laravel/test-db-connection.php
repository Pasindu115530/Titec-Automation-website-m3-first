<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\DB;

try {
    // Test database connection
    DB::connection()->getPdo();
    
    echo "✓ Database Connection Successful!\n\n";
    echo "Connected to:\n";
    echo "  Host: " . config('database.connections.mysql.host') . "\n";
    echo "  Database: " . config('database.connections.mysql.database') . "\n";
    echo "  User: " . config('database.connections.mysql.username') . "\n";

    // Test simple query
    $version = DB::select('SELECT VERSION() as version');
    echo "\nMySQL Version: " . $version[0]->version . "\n";

} catch (Exception $e) {
    echo "✗ Database Connection Failed!\n\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    echo "Please check:\n";
    echo "  1. DB_HOST is correct\n";
    echo "  2. DB_PORT is correct\n";
    echo "  3. DB_DATABASE exists\n";
    echo "  4. DB_USERNAME and DB_PASSWORD are correct\n";
    echo "  5. MySQL service is running\n";
    exit(1);
}
?>
