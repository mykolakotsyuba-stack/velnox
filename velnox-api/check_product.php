<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;

$p = DB::table('products')->where('slug', 'buq-308-2t3h-ds')->first();
echo "product_table_id: " . ($p->product_table_id ?? 'NULL') . "\n";

$assets = DB::table('product_assets')
    ->where('entity_type', 'product_table')
    ->where('entity_id', $p->product_table_id)
    ->orderBy('sort_order')->get();
echo "Assets count: " . count($assets) . "\n";
foreach ($assets as $a) {
    echo "  type={$a->type} sort={$a->sort_order} path={$a->path}\n";
}
