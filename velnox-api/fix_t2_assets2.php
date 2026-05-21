<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$tableId   = DB::table('product_tables')->where('slug', 'bearings-t2')->value('id');
$productId = DB::table('products')->where('slug', 'buq-308-2t3h-ds')->value('id');
$base      = '/velnox/images/products/bearings-t2';
$slug      = 'buq-308-2t3h-ds';

// 1. Видалити неправильно додані product-рівневі gallery
DB::table('product_assets')->where('entity_type', 'product')->where('entity_id', $productId)->where('type', 'gallery')->delete();
echo "Deleted wrong product-level gallery\n";

// 2. Додати gallery на рівні product_table (як в t1)
DB::table('product_assets')->where('entity_type', 'product_table')->where('entity_id', $tableId)->where('type', 'gallery')->delete();
$gallery = [
    ['sort_order' => 1, 'path' => "$base/velnox-{$slug}.webp"],
    ['sort_order' => 2, 'path' => "$base/velnox-{$slug}-drawing-1.webp"],
    ['sort_order' => 3, 'path' => "$base/velnox-{$slug}-drawing-2.webp"],
    ['sort_order' => 4, 'path' => "$base/velnox-{$slug}-drawing-3.webp"],
];
foreach ($gallery as $a) {
    DB::table('product_assets')->insert(['entity_type' => 'product_table', 'entity_id' => $tableId, 'type' => 'gallery', 'path' => $a['path'], 'sort_order' => $a['sort_order']]);
}
echo "Added " . count($gallery) . " gallery items at product_table level\n";

// 3. Додати schema_svg (був відсутній)
DB::table('product_assets')->updateOrInsert(
    ['entity_type' => 'product_table', 'entity_id' => $tableId, 'type' => 'schema_svg'],
    ['path' => "$base/schema.svg", 'sort_order' => 0]
);
echo "Added schema_svg\n";

echo "Done.\n";
