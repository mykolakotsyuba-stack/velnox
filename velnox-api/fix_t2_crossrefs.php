<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$productId = DB::table('products')->where('slug', 'buq-308-2t3h-ds')->value('id');
if (!$productId) { echo "ERROR: product not found\n"; exit(1); }

DB::table('product_cross_refs')->where('product_id', $productId)->delete();

$refs = [
    ['brand' => 'SNR',     'value' => 'CE066',                                        'type' => 'bearing'],
    ['brand' => 'FKL',     'value' => 'LSQFR308 TBT.H.T.Zn',                        'type' => 'bearing'],
    ['brand' => 'SNR',     'value' => 'UC 308 X1',                                    'type' => 'bearing'],
    ['brand' => 'SNR',     'value' => 'UCF308 A01X1',                                 'type' => 'bearing'],
    ['brand' => 'PEER',    'value' => 'W308-40MM-FDT-MF-AP-SP1 (PER.W308RRBP52-F-A)','type' => 'bearing'],
    ['brand' => 'PEER',    'value' => 'W308-40MM-FDT-MF-AP-SP1 W308RRBP52-F-B (BX-PER.W308RRBP52-F)', 'type' => 'bearing'],
    ['brand' => 'SNR',     'value' => 'XUCF308B01B169',                               'type' => 'bearing'],
    ['brand' => 'AMAZONE', 'value' => '957305 AMAZONE',                                'type' => 'application'],
    ['brand' => 'AMAZONE', 'value' => 'CE066 AMAZONE',                                 'type' => 'application'],
    ['brand' => 'AMAZONE', 'value' => 'CE078 AMAZONE',                                 'type' => 'application'],
    ['brand' => 'FKL',     'value' => 'LSQFR308 TBS.H.T.Zn FKL',                    'type' => 'application'],
    ['brand' => 'RBF',     'value' => 'PN00042 RBF Housing',                           'type' => 'application'],
    ['brand' => 'Z&S',     'value' => 'SL308MR3L Z&S',                                'type' => 'application'],
    ['brand' => 'UCFE',    'value' => 'UCFE308 A01X1= UC308X1+FE308A01',              'type' => 'application'],
    ['brand' => 'UCFE',    'value' => 'UCFE308 A01X1',                                'type' => 'application'],
];

foreach ($refs as $ref) {
    DB::table('product_cross_refs')->insert(['product_id' => $productId, 'brand' => $ref['brand'], 'value' => $ref['value'], 'type' => $ref['type']]);
}
echo "Updated " . count($refs) . " cross_refs for product_id=$productId\n";
