<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$t2 = DB::table('product_tables')->where('slug', 'bearings-t2')->value('id');
$productId = DB::table('products')->where('slug', 'buq-308-2t3h-ds')->value('id');
echo "table_id=$t2, product_id=$productId\n";

$d1 = DB::table('product_assets')->where('entity_type', 'product_table')->where('entity_id', $t2)->delete();
$d2 = DB::table('product_assets')->where('entity_type', 'product')->where('entity_id', $productId)->delete();
echo "Deleted table-level: $d1, product-level: $d2\n";
echo "Done.\n";
