<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;

$product = DB::table('products')->where('slug', 'like', '%28071300%')->first();
echo "=== PRODUCT ===\n";
echo "id={$product->id}  slug={$product->slug}  article={$product->article}\n";
echo "category_id={$product->category_id}  is_active={$product->is_active}\n\n";

echo "=== PRODUCT_SPECS ===\n";
$specs = DB::table('product_specs')->where('product_id', $product->id)->get();
foreach ($specs as $s) {
    echo "  key={$s->spec_key}  value={$s->spec_value}\n";
}

echo "=== TRANSLATIONS ===\n";
$trans = DB::table('product_translations')->where('product_id', $product->id)->get();
foreach ($trans as $t) {
    echo "--- {$t->locale} ---\n";
    echo "title: {$t->title}\n";
    echo "short: {$t->short_description}\n";
    echo "desc:  {$t->description}\n\n";
}

echo "=== CROSS_REFS ===\n";
$refs = DB::table('product_cross_refs')->where('product_id', $product->id)->get();
foreach ($refs as $r) {
    echo "  value={$r->value}  brand={$r->brand}\n";
}

$tableId = DB::table('product_tables')->where('slug', 'hubs-t1')->value('id');
echo "\n=== PRODUCT_ASSETS (table_id={$tableId}) ===\n";
$assets = DB::table('product_assets')->where('entity_type', 'product_table')->where('entity_id', $tableId)->orderBy('type')->orderBy('sort_order')->get();
foreach ($assets as $a) {
    echo "  type={$a->type}  path={$a->path}  sort={$a->sort_order}\n";
}

echo "\n=== PRODUCT_TABLE ===\n";
$pt = DB::table('product_tables')->where('id', $tableId)->first();
echo "schema_viewbox: {$pt->schema_viewbox}\n";
echo "highlight_config: {$pt->highlight_config}\n";
