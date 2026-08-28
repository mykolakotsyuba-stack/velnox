<?php
// kit-t1: Спеціальні підшипники з D-подібним отвором
// Product: 203KRR2-R3 VX

use Illuminate\Support\Facades\DB;

$kitCatId = DB::table('categories')->where('slug', 'kit')->value('id');
echo "kit category_id: $kitCatId\n";

// 1. product_table
DB::table('product_tables')->updateOrInsert(
    ['slug' => 'kit-t1'],
    [
        'category_id'      => $kitCatId,
        'spec_columns'     => json_encode(['d_mm','D_mm','B_mm','C_mm','mass_kg','cdyn_kn','co_kn','pu_kn']),
        'highlight_config' => json_encode(new stdClass()),
        'sort_order'       => 1,
    ]
);
$t1id = DB::table('product_tables')->where('slug', 'kit-t1')->value('id');
echo "product_table id: $t1id\n";

// 2. Translations
$names = [
    'uk' => 'Спеціальні підшипники з D-подібним отвором',
    'en' => 'Special Bearings with D-Bore',
    'pl' => 'Specjalne łożyska z otworem D',
];
foreach ($names as $locale => $name) {
    DB::table('translations')->updateOrInsert(
        ['entity_type' => 'product_table', 'entity_id' => $t1id, 'locale' => $locale, 'field' => 'name'],
        ['value' => $name]
    );
}
echo "Translations done\n";

// 3. Product
DB::table('products')->updateOrInsert(
    ['slug' => '203krr2-r3-vx'],
    [
        'article'          => '203KRR2-R3 VX',
        'product_table_id' => $t1id,
    ]
);
$prodId = DB::table('products')->where('slug', '203krr2-r3-vx')->value('id');
echo "product_id: $prodId\n";

// 4. Specs
$specs = [
    'd_mm'    => '16.26',
    'D_mm'    => '40',
    'B_mm'    => '18.29',
    'C_mm'    => '12',
    'mass_kg' => '0.07',
    'cdyn_kn' => '9.5',
    'co_kn'   => '4.75',
    'pu_kn'   => '0.2',
];
foreach ($specs as $key => $value) {
    $sid = DB::table('spec_definitions')->where('key', $key)->value('id');
    if ($sid) {
        DB::table('product_specs')->updateOrInsert(
            ['product_id' => $prodId, 'spec_id' => $sid],
            ['value' => $value]
        );
        echo "  spec $key=$value (spec_id=$sid)\n";
    } else {
        echo "  WARNING: spec_definition not found for key=$key\n";
    }
}

// 5. Cross-refs — clear first
DB::table('product_cross_refs')->where('product_id', $prodId)->delete();

// bearing refs
$bearingRefs = [
    ['203 KRR AH02',           'FKL'],
    ['203 KRR AH02',           'INA'],
    ['203 KRR2',               'RBF'],
    ['203 KRR2',               'CT-AGRI'],
    ['203 KRR2FD (PER.203RRY2)', 'PEER'],
    ['203 KRR2-R3',            'CT-AGRI'],
    ['203 RR2',                'TIMKEN'],
    ['BB203 RR2',              'TIMKEN'],
    ['BB203RR2FD',             'PEER'],
];
foreach ($bearingRefs as [$val, $brand]) {
    DB::table('product_cross_refs')->insert([
        'product_id' => $prodId,
        'value'      => $val,
        'brand'      => $brand,
        'type'       => 'bearing',
    ]);
}
echo "Bearing cross-refs: " . count($bearingRefs) . "\n";

// application refs (OEM)
$oemRefs = [
    ['144819C91', 'CASE'],
    ['149261C91', 'CASE'],
    ['23091',     'Will rich'],
    ['3643380M1', 'AGCO'],
    ['520117',    'Gehl'],
    ['666624R91', 'CASE'],
    ['822-095C',  'Great Plains'],
    ['AN100425',  'JOHN DEERE'],
    ['B96.00410', 'Grimme'],
    ['JD9214',    'JOHN DEERE'],
];
foreach ($oemRefs as [$val, $brand]) {
    DB::table('product_cross_refs')->insert([
        'product_id' => $prodId,
        'value'      => $val,
        'brand'      => $brand,
        'type'       => 'application',
    ]);
}
echo "OEM cross-refs: " . count($oemRefs) . "\n";
echo "kit-t1 DONE\n";
