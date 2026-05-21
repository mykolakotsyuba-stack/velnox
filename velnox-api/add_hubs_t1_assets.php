<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$tableId   = DB::table('product_tables')->where('slug', 'hubs-t1')->value('id');
$productId = DB::table('products')->where('slug', 'like', '%28071300%')->value('id');
$productSlug = DB::table('products')->where('id', $productId)->value('slug');

echo "table_id=$tableId, product_id=$productId, product_slug=$productSlug\n";

if (!$tableId) { echo "ERROR: product_table hubs-t1 not found\n"; exit(1); }
if (!$productId) { echo "ERROR: product 28071300-vx not found\n"; exit(1); }

$base       = '/velnox/images/products/hubs-t1';
$articleSlug = '28071300-vx';

// 1. schema_png — над таблицею на категорійній сторінці
DB::table('product_assets')->updateOrInsert(
    ['entity_type' => 'product_table', 'entity_id' => $tableId, 'type' => 'schema_png'],
    ['path' => "$base/velnox-{$articleSlug}-schema.webp", 'sort_order' => 0]
);
echo "Added schema_png\n";

// 2. schema_svg — для інтерактивного вьювера на картці товару
DB::table('product_assets')->updateOrInsert(
    ['entity_type' => 'product_table', 'entity_id' => $tableId, 'type' => 'schema_svg'],
    ['path' => "$base/schema.svg", 'sort_order' => 0]
);
echo "Added schema_svg\n";

// 3. gallery — головне фото + три креслення (product_table рівень)
DB::table('product_assets')
    ->where('entity_type', 'product_table')
    ->where('entity_id', $tableId)
    ->where('type', 'gallery')
    ->delete();

$gallery = [
    ['sort_order' => 1, 'path' => "$base/velnox-{$articleSlug}.webp"],
    ['sort_order' => 2, 'path' => "$base/velnox-{$articleSlug}-drawing-1.webp"],
    ['sort_order' => 3, 'path' => "$base/velnox-{$articleSlug}-drawing-2.webp"],
    ['sort_order' => 4, 'path' => "$base/velnox-{$articleSlug}-drawing-3.webp"],
];
foreach ($gallery as $a) {
    DB::table('product_assets')->insert([
        'entity_type' => 'product_table',
        'entity_id'   => $tableId,
        'type'        => 'gallery',
        'path'        => $a['path'],
        'sort_order'  => $a['sort_order'],
    ]);
}
echo "Added " . count($gallery) . " gallery items\n";

// 4. schema_viewbox + highlight_config в product_tables
$viewbox = '0 0 2480 3507.43';

$highlightConfig = [
    'hub_J_mm'        => [['label' => 'J',   'x' => 355,  'y' => 856]],
    'hub_D_mm'        => [['label' => 'D',   'x' => 1536, 'y' => 816]],
    'hub_D1_mm'       => [['label' => 'D1',  'x' => 840,  'y' => 801]],
    'hub_d_mm'        => [['label' => 'd',   'x' => 864,  'y' => 801]],
    'hub_C_mm'        => [['label' => 'C',   'x' => 512,  'y' => 798]],
    'hub_hole_thread' => [['label' => 'H/T', 'x' => 465,  'y' => 383]],
    'hub_G'           => [['label' => 'G',   'x' => 931,  'y' => 693]],
    'hub_L_mm'        => [['label' => 'L',   'x' => 1232, 'y' => 1126]],
    'hub_L1_mm'       => [['label' => 'L1',  'x' => 935,  'y' => 992]],
    'hub_F_mm'        => [['label' => 'F',   'x' => 1058, 'y' => 1059]],
];

DB::table('product_tables')->where('id', $tableId)->update([
    'schema_viewbox'   => $viewbox,
    'highlight_config' => json_encode($highlightConfig),
]);
echo "Updated schema_viewbox + highlight_config\n";

echo "\nDone. Verify at /uk/products/hubs (schema above table) and /uk/products/hubs/28071300-vx (SVG viewer)\n";
