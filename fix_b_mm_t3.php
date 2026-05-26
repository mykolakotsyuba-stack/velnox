<?php
// Use Laravel bootstrap
require __DIR__ . '/bootstrap/app.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$row = DB::table('product_tables')->where('slug', 'bearings-t3')->first();
if (!$row) { echo "ERROR: not found\n"; exit(1); }

echo "Current B_mm: " . (json_decode($row->highlight_config, true)['B_mm'] ?? 'none') . "\n";
$cfg = json_decode($row->highlight_config, true);
$cfg['B_mm'] = [['label' => 'B', 'x' => 913, 'y' => 2362]];
DB::table('product_tables')->where('slug', 'bearings-t3')->update(['highlight_config' => json_encode($cfg)]);
echo "B_mm updated to x=913, y=2362\n";
echo "DONE\n";
