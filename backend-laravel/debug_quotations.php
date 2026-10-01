<?php
// debug_quotations.php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\QuotationRequest;

try {
    echo "Querying QuotationRequest...\n";
    $requests = QuotationRequest::with(['user', 'products'])->latest()->get();
    echo "Found " . $requests->count() . " requests.\n";
    // Simulate API response serialization
    echo "Encoding to JSON...\n";
    $json = json_encode($requests);
    if ($json === false) {
        throw new \Exception("JSON Encode Error: " . json_last_error_msg());
    }
    echo "JSON Output Length: " . strlen($json) . "\n";
    echo "First 100 chars: " . substr($json, 0, 100) . "\n";
} catch (\Exception $e) {
    file_put_contents('debug_error.log', $e->getMessage() . "\n" . $e->getTraceAsString());
    echo "ERROR LOGGED TO debug_error.log\n";
}
