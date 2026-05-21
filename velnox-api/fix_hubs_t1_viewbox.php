<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$tableId = DB::table('product_tables')->where('slug', 'hubs-t1')->value('id');

// Tight viewBox: content Y 317-1163, X 137-2155, + 30px margin
// Result: 100 288 2100 906
DB::table('product_tables')->where('id', $tableId)->update([
    'schema_viewbox' => '80 280 2150 980',
]);

echo "Updated schema_viewbox for hubs-t1 (id=$tableId): 100 288 2100 906\n";
echo "Aspect ratio: " . round(2150/980, 3) . " (landscape, 2.194:1)\n";
