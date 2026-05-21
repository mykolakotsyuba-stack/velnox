<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$tableId  = DB::table('product_tables')->where('slug', 'bearings-t2')->value('id');
$productId = DB::table('products')->where('slug', 'buq-308-2t3h-ds')->value('id');
echo "table_id=$tableId, product_id=$productId\n";

$slug = 'buq-308-2t3h-ds';
$base = "/velnox/images/products/bearings-t2";

// schema_png — над таблицею на категорійній сторінці
DB::table('product_assets')->updateOrInsert(
    ['entity_type' => 'product_table', 'entity_id' => $tableId, 'type' => 'schema_png'],
    ['path' => "$base/velnox-{$slug}-schema.webp", 'sort_order' => 0]
);

// gallery — головне фото + креслення
$gallery = [
    ['sort_order' => 0, 'path' => "$base/velnox-{$slug}.webp"],
    ['sort_order' => 1, 'path' => "$base/velnox-{$slug}-drawing-1.webp"],
    ['sort_order' => 2, 'path' => "$base/velnox-{$slug}-drawing-2.webp"],
    ['sort_order' => 3, 'path' => "$base/velnox-{$slug}-drawing-3.webp"],
];
DB::table('product_assets')->where('entity_type', 'product')->where('entity_id', $productId)->where('type', 'gallery')->delete();
foreach ($gallery as $a) {
    DB::table('product_assets')->insert(['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'gallery', 'path' => $a['path'], 'sort_order' => $a['sort_order']]);
}

echo "Done: schema_png + " . count($gallery) . " gallery items\n";
