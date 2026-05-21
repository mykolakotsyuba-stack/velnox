<?php
/**
 * One-time script: fix bearings-t2 spec values for BUQ-308-2T3H-DS
 * Run: php fix_bearings_t2_specs.php
 * Delete after use.
 */

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$product = DB::table('products')->where('slug', 'buq-308-2t3h-ds')->first();
if (!$product) {
    echo "ERROR: product buq-308-2t3h-ds not found\n";
    exit(1);
}

$updates = [
    'A1_mm' => '40.6',
    'A2_mm' => '19',
    'A_mm'  => '51.4',
];

foreach ($updates as $key => $value) {
    $specDef = DB::table('spec_definitions')->where('key', $key)->first();
    if (!$specDef) {
        echo "WARNING: spec_definition not found for key=$key\n";
        continue;
    }
    $rows = DB::table('product_specs')
        ->where('product_id', $product->id)
        ->where('spec_id', $specDef->id)
        ->update(['value' => $value]);
    echo "Updated $key (spec_id={$specDef->id}) → $value ($rows rows)\n";
}

echo "Done.\n";
