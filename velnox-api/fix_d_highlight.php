<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;

$tableId = DB::table('product_tables')->where('slug', 'hubs-t1')->value('id');
$cfg = json_decode(DB::table('product_tables')->where('id', $tableId)->value('highlight_config'), true);

$cfg['hub_d_mm'] = [['label' => 'd', 'x' => 899, 'y' => 801]];

DB::table('product_tables')->where('id', $tableId)->update([
    'highlight_config' => json_encode($cfg),
]);
echo "Updated hub_d_mm: x=899, y=801\n";
