<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$sql = file_get_contents('/media/thulana/Projects/Projects/Clients/Titec-Automation-website-m3-first/.AI/titecaut_titec_automation_new_data_only.sql');

try {
    DB::unprepared($sql);
    echo "Import successful.\n";
} catch (\Exception $e) {
    echo "Import failed: " . $e->getMessage() . "\n";
}
