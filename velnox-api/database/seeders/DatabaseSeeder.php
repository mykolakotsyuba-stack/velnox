<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================================
        // 1. CATEGORIES
        // =========================================================
        $categories = [
            ['slug' => 'bearings', 'sort_order' => 1],
            ['slug' => 'hubs',     'sort_order' => 2],
            ['slug' => 'agro',     'sort_order' => 3],
            ['slug' => 'kit',      'sort_order' => 4],
            ['slug' => 'custom',   'sort_order' => 5],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(['slug' => $cat['slug']], $cat);
        }

        $catId = fn(string $slug) => DB::table('categories')->where('slug', $slug)->value('id');

        // =========================================================
        // 2. SPEC DEFINITIONS
        // =========================================================
        $specs = [
            ['key' => 'd_mm',       'svg_label' => 'd',  'sort_order' => 1],
            ['key' => 'd_inch',     'svg_label' => null,  'sort_order' => 2],
            ['key' => 'A1_mm',      'svg_label' => 'A1', 'sort_order' => 3],
            ['key' => 'A2_mm',      'svg_label' => 'A2', 'sort_order' => 4],
            ['key' => 'J_mm',       'svg_label' => 'J',  'sort_order' => 5],
            ['key' => 'L_mm',       'svg_label' => 'L',  'sort_order' => 6],
            ['key' => 'N_mm',       'svg_label' => 'N',  'sort_order' => 7],
            ['key' => 'A_mm',       'svg_label' => 'A',  'sort_order' => 8],
            ['key' => 'mass_kg',    'svg_label' => null,  'sort_order' => 9],
            ['key' => 'cdyn_kn',    'svg_label' => null,  'sort_order' => 10],
            ['key' => 'co_kn',      'svg_label' => null,  'sort_order' => 11],
            ['key' => 'pu_kn',      'svg_label' => null,  'sort_order' => 12],
            ['key' => 'B_mm',       'svg_label' => 'B',   'sort_order' => 13],
            ['key' => 'D_mm',       'svg_label' => 'D',   'sort_order' => 14],
            ['key' => 'H_T',        'svg_label' => null,  'sort_order' => 15],
            ['key' => 'L1_mm',      'svg_label' => 'L1',  'sort_order' => 16],
            ['key' => 'L2_mm',      'svg_label' => 'L2',  'sort_order' => 17],
            ['key' => 'hub_J_mm',        'svg_label' => 'J',    'sort_order' => 20],
            ['key' => 'hub_D_mm',        'svg_label' => 'D',    'sort_order' => 21],
            ['key' => 'hub_D1_mm',       'svg_label' => 'D1',   'sort_order' => 22],
            ['key' => 'hub_d_mm',        'svg_label' => 'd',    'sort_order' => 23],
            ['key' => 'hub_C_mm',        'svg_label' => 'C',    'sort_order' => 24],
            ['key' => 'hub_hole_thread', 'svg_label' => null,   'sort_order' => 25],
            ['key' => 'hub_G',           'svg_label' => 'G',    'sort_order' => 26],
            ['key' => 'hub_L_mm',        'svg_label' => 'L',    'sort_order' => 27],
            ['key' => 'hub_L1_mm',       'svg_label' => 'L1',   'sort_order' => 28],
            ['key' => 'hub_F_mm',        'svg_label' => 'F',    'sort_order' => 29],
            ['key' => 'hub_M_thread',    'svg_label' => null,   'sort_order' => 30],
            ['key' => 'hub_E_mm',        'svg_label' => 'E',    'sort_order' => 31],
            ['key' => 'hub_B_mm',        'svg_label' => 'B',    'sort_order' => 32],
        ];

        foreach ($specs as $spec) {
            DB::table('spec_definitions')->updateOrInsert(['key' => $spec['key']], $spec);
        }

        $specId = fn(string $key) => DB::table('spec_definitions')->where('key', $key)->value('id');

        // =========================================================
        // 3. TRANSLATIONS — categories
        // =========================================================
        $catTranslations = [
            ['slug' => 'bearings', 'uk' => 'Підшипникові вузли',      'en' => 'Bearing Units',           'pl' => 'Węzły łożyskowe'],
            ['slug' => 'hubs',     'uk' => 'Підшипникові ступиці',    'en' => 'Bearing Hubs',            'pl' => 'Piasty łożyskowe'],
            ['slug' => 'agro',     'uk' => 'Агро-підшипники',         'en' => 'Special Agro Bearings',   'pl' => 'Łożyska agro'],
            ['slug' => 'kit',      'uk' => 'Збірні KIT-рішення',      'en' => 'Assembly KIT Solutions',  'pl' => 'Zestawy montażowe KIT'],
            ['slug' => 'custom',   'uk' => 'Кастомні OEM-рішення',    'en' => 'Custom OEM Solutions',    'pl' => 'Rozwiązania OEM na zamówienie'],
        ];

        foreach ($catTranslations as $t) {
            $id = $catId($t['slug']);
            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'category', 'entity_id' => $id, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $t[$locale]]
                );
            }
        }

        // =========================================================
        // 4. TRANSLATIONS — spec_definitions (label + unit)
        // =========================================================
        $specTranslations = [
            'd_mm'    => ['uk' => ['label' => 'd (мм) — Внутрішній діаметр',      'unit' => 'мм'],  'en' => ['label' => 'd (mm) — Bore diameter',           'unit' => 'mm'],  'pl' => ['label' => 'd (mm) — Średnica wewnętrzna',     'unit' => 'mm']],
            'd_inch'  => ['uk' => ['label' => 'd — Внутрішній діаметр (дюйми)',   'unit' => 'дюйм'],'en' => ['label' => 'd — Bore diameter (inches)',        'unit' => 'in'],  'pl' => ['label' => 'd — Średnica wewnętrzna (cale)',   'unit' => 'cal']],
            'A1_mm'   => ['uk' => ['label' => 'A1 (мм)',                           'unit' => 'мм'],  'en' => ['label' => 'A1 (mm)',                           'unit' => 'mm'],  'pl' => ['label' => 'A1 (mm)',                          'unit' => 'mm']],
            'A2_mm'   => ['uk' => ['label' => 'A2 (мм)',                           'unit' => 'мм'],  'en' => ['label' => 'A2 (mm)',                           'unit' => 'mm'],  'pl' => ['label' => 'A2 (mm)',                          'unit' => 'mm']],
            'J_mm'    => ['uk' => ['label' => 'J (мм) — Міжосьова відстань',      'unit' => 'мм'],  'en' => ['label' => 'J (mm) — Bolt hole centre',         'unit' => 'mm'],  'pl' => ['label' => 'J (mm) — Rozstaw otworów',         'unit' => 'mm']],
            'L_mm'    => ['uk' => ['label' => 'L (мм) — Довжина вузла',           'unit' => 'мм'],  'en' => ['label' => 'L (mm) — Overall length',           'unit' => 'mm'],  'pl' => ['label' => 'L (mm) — Długość całkowita',       'unit' => 'mm']],
            'N_mm'    => ['uk' => ['label' => 'N (мм)',                            'unit' => 'мм'],  'en' => ['label' => 'N (mm)',                            'unit' => 'mm'],  'pl' => ['label' => 'N (mm)',                           'unit' => 'mm']],
            'A_mm'    => ['uk' => ['label' => 'A (мм)',                            'unit' => 'мм'],  'en' => ['label' => 'A (mm)',                            'unit' => 'mm'],  'pl' => ['label' => 'A (mm)',                           'unit' => 'mm']],
            'mass_kg' => ['uk' => ['label' => 'Маса',                             'unit' => 'кг'],  'en' => ['label' => 'Mass',                              'unit' => 'kg'],  'pl' => ['label' => 'Masa',                             'unit' => 'kg']],
            'cdyn_kn' => ['uk' => ['label' => 'C — динамічне навантаження',       'unit' => 'кН'],  'en' => ['label' => 'C — Dynamic load rating',           'unit' => 'kN'],  'pl' => ['label' => 'C — Nośność dynamiczna',           'unit' => 'kN']],
            'co_kn'   => ['uk' => ['label' => 'C₀ — статичне навантаження',       'unit' => 'кН'],  'en' => ['label' => 'C₀ — Static load rating',           'unit' => 'kN'],  'pl' => ['label' => 'C₀ — Nośność statyczna',           'unit' => 'kN']],
            'pu_kn'   => ['uk' => ['label' => 'Pu — гранична втомна навантага',   'unit' => 'кН'],  'en' => ['label' => 'Pu — Fatigue load limit',           'unit' => 'kN'],  'pl' => ['label' => 'Pu — Graniczne obciążenie zmęczeniowe', 'unit' => 'kN']],
            'B_mm'    => ['uk' => ['label' => 'B (мм) — ширина внутр. кільця',   'unit' => 'мм'],  'en' => ['label' => 'B (mm) — inner ring width',         'unit' => 'mm'],  'pl' => ['label' => 'B (mm) — szerokość pierścienia',   'unit' => 'mm']],
            'D_mm'    => ['uk' => ['label' => 'D (мм) — зовн. діаметр корпусу',  'unit' => 'мм'],  'en' => ['label' => 'D (mm) — housing outside diameter', 'unit' => 'mm'],  'pl' => ['label' => 'D (mm) — zewn. śr. obudowy',      'unit' => 'mm']],
            'H_T'     => ['uk' => ['label' => 'H/T — отвір / різьба',            'unit' => ''],    'en' => ['label' => 'H/T — hole / thread',               'unit' => ''],    'pl' => ['label' => 'H/T — otwór / gwint',             'unit' => '']],
            'L1_mm'   => ['uk' => ['label' => 'L1 (мм) — довжина секції 1',      'unit' => 'мм'],  'en' => ['label' => 'L1 (mm) — section 1 length',        'unit' => 'mm'],  'pl' => ['label' => 'L1 (mm) — długość sekcji 1',       'unit' => 'mm']],
            'L2_mm'   => ['uk' => ['label' => 'L2 (мм) — довжина секції 2',      'unit' => 'мм'],  'en' => ['label' => 'L2 (mm) — section 2 length',        'unit' => 'mm'],  'pl' => ['label' => 'L2 (mm) — długość sekcji 2',       'unit' => 'mm']],
        ];

        foreach ($specTranslations as $key => $locales) {
            $id = $specId($key);
            foreach ($locales as $locale => $fields) {
                foreach ($fields as $field => $value) {
                    DB::table('translations')->updateOrInsert(
                        ['entity_type' => 'spec_definitions', 'entity_id' => $id, 'locale' => $locale, 'field' => $field],
                        ['value' => $value]
                    );
                }
            }
        }

        // Hub spec translations
        $hubSpecTrans = [
            'hub_J_mm'        => ['uk' => 'Діаметр ділильного кола J (мм)',     'en' => 'Pitch circle diameter J (mm)',  'pl' => 'Średnica koła podziałowego J (mm)'],
            'hub_D_mm'        => ['uk' => 'Зовнішній діаметр D (мм)',           'en' => 'Outside diameter D (mm)',       'pl' => 'Średnica zewnętrzna D (mm)'],
            'hub_D1_mm'       => ['uk' => 'Зовнішній діаметр D1 (мм)',          'en' => 'Outside diameter D1 (mm)',      'pl' => 'Średnica zewnętrzna D1 (mm)'],
            'hub_d_mm'        => ['uk' => 'Діаметр отвору d (мм)',              'en' => 'Bore diameter d (mm)',          'pl' => 'Średnica otworu d (mm)'],
            'hub_C_mm'        => ['uk' => 'Відстань C (мм)',                    'en' => 'Distance C (mm)',               'pl' => 'Odległość C (mm)'],
            'hub_hole_thread' => ['uk' => 'Отвір / Різьба H/T',                 'en' => 'Hole / Thread H/T',             'pl' => 'Otwór / Gwint H/T'],
            'hub_G'           => ['uk' => 'Різьба G',                          'en' => 'Thread G',                      'pl' => 'Gwint G'],
            'hub_L_mm'        => ['uk' => 'Загальна довжина L (мм)',            'en' => 'Total length L (mm)',           'pl' => 'Długość całkowita L (mm)'],
            'hub_L1_mm'       => ['uk' => 'Глибина розточки L1 (мм)',          'en' => 'Bore depth L1 (mm)',            'pl' => 'Głębokość wytoczenia L1 (mm)'],
            'hub_F_mm'        => ['uk' => 'Довжина різьбової частини F (мм)',   'en' => 'Thread length F (mm)',          'pl' => 'Długość gwintowa F (mm)'],
            'hub_M_thread'    => ['uk' => 'Різьба M',                          'en' => 'Thread M',                      'pl' => 'Gwint M'],
            'hub_E_mm'        => ['uk' => 'Відстань E (мм)',                    'en' => 'Distance E (mm)',               'pl' => 'Odległość E (mm)'],
            'hub_B_mm'        => ['uk' => 'Ширина B (мм)',                      'en' => 'Width B (mm)',                  'pl' => 'Szerokość B (mm)'],
        ];
        foreach ($hubSpecTrans as $key => $labels) {
            $sid = $specId($key);
            if (!$sid) continue;
            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'spec_definitions', 'entity_id' => $sid, 'locale' => $locale, 'field' => 'label'],
                    ['value' => $labels[$locale]]
                );
            }
        }

        // =========================================================
        // 5. PRODUCT TABLE: bearings-t1
        // =========================================================
        $bearingsCatId = $catId('bearings');

        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'bearings-t1'],
            [
                'slug'            => 'bearings-t1',
                'category_id'     => $bearingsCatId,
                'spec_columns'    => json_encode(['d_mm', 'd_inch', 'A1_mm', 'A2_mm', 'J_mm', 'L_mm', 'N_mm', 'A_mm', 'mass_kg', 'cdyn_kn', 'co_kn', 'pu_kn']),
                'highlight_config' => '{"d_mm":[{"label":"d","x":1319,"y":1416}],"d_inch":[{"label":"d","x":1319,"y":1416}],"J_mm":[{"label":"J","x":555,"y":1788}],"A2_mm":[{"label":"A2","x":1063,"y":1786}],"A1_mm":[{"label":"A1","x":1124,"y":1830}],"L_mm":[{"label":"L","x":556,"y":1837}],"N_mm":[{"label":"N","x":270,"y":988}],"A_mm":[{"label":"A","x":492,"y":974},{"label":"A","x":491,"y":1890},{"label":"A","x":1153,"y":1868}]}',
                'schema_viewbox'  => '0 800 2400 1160',
                'sort_order'      => 1,
            ]
        );

        $tableId = fn(string $slug) => DB::table('product_tables')->where('slug', $slug)->value('id');
        $t1 = $tableId('bearings-t1');

        // Table-level translations
        foreach (['uk' => 'Підшипниковий вузол BUQ — Таблиця 1', 'en' => 'Bearing Unit BUQ — Table 1', 'pl' => 'Węzeł łożyskowy BUQ — Tabela 1'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t1, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // Table-level assets
        $tableAssets = [
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/main.jpeg',    'sort_order' => 1],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/drawing-1.png','sort_order' => 2],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/drawing-2.png','sort_order' => 3],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/drawing-3.png','sort_order' => 4],
            ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t1/schema.png',  'sort_order' => 1],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t1/schema.svg',  'sort_order' => 1],
        ];

        foreach ($tableAssets as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t1, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 5b. PRODUCT TABLES: bearings-t2 through bearings-t5
        //     (table records, translations, and assets only — no products)
        // =========================================================
        $extraTables = [
            [
                'slug'       => 'bearings-t2',
                'sort_order' => 2,
                'names'      => ['uk' => 'BUQ-308-2T3H-DS — Таблиця 2', 'en' => 'BUQ-308-2T3H-DS — Table 2', 'pl' => 'BUQ-308-2T3H-DS — Tabela 2'],
                'assets'     => [
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/main.jpeg',     'sort_order' => 1],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/drawing-1.png', 'sort_order' => 2],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/drawing-2.png', 'sort_order' => 3],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/drawing-3.png', 'sort_order' => 4],
                    ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t2/schema.png',    'sort_order' => 1],
                    ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t2/schema.svg',    'sort_order' => 1],
                ],
            ],
            [
                'slug'       => 'bearings-t3',
                'sort_order' => 3,
                'names'      => ['uk' => 'BUQ-309-2T3H — Таблиця 3', 'en' => 'BUQ-309-2T3H — Table 3', 'pl' => 'BUQ-309-2T3H — Tabela 3'],
                'assets'     => [
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/main.jpeg',     'sort_order' => 1],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/drawing-1.png', 'sort_order' => 2],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/drawing-2.png', 'sort_order' => 3],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/drawing-3.png', 'sort_order' => 4],
                    ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t3/schema.png',    'sort_order' => 1],
                    ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t3/schema.svg',    'sort_order' => 1],
                ],
            ],
            [
                'slug'       => 'bearings-t4',
                'sort_order' => 4,
                'names'      => ['uk' => 'BUCR-SG-309-S2 — Таблиця 4', 'en' => 'BUCR-SG-309-S2 — Table 4', 'pl' => 'BUCR-SG-309-S2 — Tabela 4'],
                'assets'     => [
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t4/main.jpeg',     'sort_order' => 1],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t4/drawing-1.png', 'sort_order' => 2],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t4/drawing-2.png', 'sort_order' => 3],
                    // no drawing-3 for bearings-t4
                    ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t4/schema.png',    'sort_order' => 1],
                    ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t4/schema.svg',    'sort_order' => 1],
                ],
            ],
            [
                'slug'       => 'bearings-t5',
                'sort_order' => 5,
                'names'      => ['uk' => 'BUP-207-X3L — Таблиця 5', 'en' => 'BUP-207-X3L — Table 5', 'pl' => 'BUP-207-X3L — Tabela 5'],
                'assets'     => [
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/main.jpeg',     'sort_order' => 1],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/drawing-1.png', 'sort_order' => 2],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/drawing-2.png', 'sort_order' => 3],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/drawing-3.png', 'sort_order' => 4],
                    ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t5/schema.png',    'sort_order' => 1],
                    ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t5/schema.svg',    'sort_order' => 1],
                ],
            ],
        ];

        $t2SpecCols = ['d_mm','A1_mm','A2_mm','J_mm','L_mm','H_T','A_mm','mass_kg','cdyn_kn','co_kn','pu_kn'];
        $t3SpecCols = ['d_mm','J_mm','L_mm','B_mm','mass_kg','cdyn_kn','co_kn','pu_kn'];
        $t4SpecCols = ['d_mm','D_mm','L1_mm','L2_mm','J_mm','A_mm','mass_kg'];
        $t5SpecCols = ['d_mm','D_mm','J_mm','A_mm','B_mm','mass_kg','cdyn_kn','co_kn'];
        $extraSpecCols = ['bearings-t2' => $t2SpecCols, 'bearings-t3' => $t3SpecCols, 'bearings-t4' => $t4SpecCols, 'bearings-t5' => $t5SpecCols];

        foreach ($extraTables as $tbl) {
            DB::table('product_tables')->updateOrInsert(
                ['slug' => $tbl['slug']],
                [
                    'slug'             => $tbl['slug'],
                    'category_id'      => $bearingsCatId,
                    'spec_columns'     => json_encode($extraSpecCols[$tbl['slug']] ?? []),
                    'highlight_config' => json_encode(new \stdClass()),
                    'schema_viewbox'   => null,
                    'sort_order'       => $tbl['sort_order'],
                ]
            );

            $tId = $tableId($tbl['slug']);

            foreach ($tbl['names'] as $locale => $name) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $tId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $name]
                );
            }

            foreach ($tbl['assets'] as $asset) {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $tId, 'type' => $asset['type'], 'path' => $asset['path']],
                    ['sort_order' => $asset['sort_order']]
                );
            }
        }

        // ── HUBS product tables ──
        $hubTables = [
            [
                'slug'   => 'hubs-t1',
                'names'  => ['uk' => 'HORSCH Disc Harrow Hubs 28071300 VX', 'en' => 'HORSCH Disc Harrow Hubs 28071300 VX', 'pl' => 'HORSCH Disc Harrow Hubs 28071300 VX'],
                'sort_order' => 1,
                'assets' => [
                    ['type' => 'gallery',    'path' => '/velnox/images/products/hubs-t1/main.jpeg',    'sort_order' => 1],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/hubs-t1/drawing-1.png','sort_order' => 2],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/hubs-t1/drawing-2.png','sort_order' => 3],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/hubs-t1/drawing-3.png','sort_order' => 4],
                    ['type' => 'schema_png', 'path' => '/velnox/images/products/hubs-t1/schema.png',  'sort_order' => 1],
                    ['type' => 'schema_svg', 'path' => '/velnox/images/products/hubs-t1/schema.svg',  'sort_order' => 1],
                ],
                'highlight_config' => json_encode(new \stdClass()),
                'schema_viewbox'   => null,
                'category_slug'    => 'hubs',
            ],
            [
                'slug'   => 'hubs-t2',
                'names'  => ['uk' => 'Cutting Nodes BAA-0004 VX', 'en' => 'Cutting Nodes BAA-0004 VX', 'pl' => 'Cutting Nodes BAA-0004 VX'],
                'sort_order' => 2,
                'assets' => [
                    ['type' => 'model_3d', 'path' => '/velnox/models/BAA-0004.glb', 'sort_order' => 1],
                ],
                'highlight_config' => json_encode(new \stdClass()),
                'schema_viewbox'   => null,
                'category_slug'    => 'hubs',
            ],
            [
                'slug'   => 'hubs-t3',
                'names'  => ['uk' => 'Seeder Hubs PL-140 VX', 'en' => 'Seeder Hubs PL-140 VX', 'pl' => 'Seeder Hubs PL-140 VX'],
                'sort_order' => 3,
                'assets' => [
                    ['type' => 'model_3d', 'path' => '/velnox/models/PL-140.glb', 'sort_order' => 1],
                ],
                'highlight_config' => json_encode(new \stdClass()),
                'schema_viewbox'   => null,
                'category_slug'    => 'hubs',
            ],
        ];

        $hubsCategory = DB::table('categories')->where('slug', 'hubs')->value('id');
        foreach ($hubTables as $tbl) {
            DB::table('product_tables')->updateOrInsert(
                ['slug' => $tbl['slug']],
                [
                    'slug'             => $tbl['slug'],
                    'category_id'      => $hubsCategory,
                    'highlight_config' => $tbl['highlight_config'],
                    'schema_viewbox'   => $tbl['schema_viewbox'],
                    'sort_order'       => $tbl['sort_order'],
                ]
            );
            $tId = DB::table('product_tables')->where('slug', $tbl['slug'])->value('id');
            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $tId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $tbl['names'][$locale]]
                );
            }
            foreach ($tbl['assets'] as $asset) {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $tId, 'type' => $asset['type'], 'path' => $asset['path']],
                    ['sort_order' => $asset['sort_order']]
                );
            }
        }
        $hubT1 = DB::table('product_tables')->where('slug', 'hubs-t1')->value('id');
        $hubT2 = DB::table('product_tables')->where('slug', 'hubs-t2')->value('id');
        $hubT3 = DB::table('product_tables')->where('slug', 'hubs-t3')->value('id');

        // =========================================================
        // 6. PRODUCTS — bearings-t1 (8 products, authoritative data)
        // =========================================================
        $products = [
            [
                'slug'    => 'buq-207-104-2x3h',
                'article' => 'BUQ 207-104-2X3H',
                'specs'   => [
                    'd_mm'    => '31.75',
                    'd_inch'  => '1 1/4',
                    'A1_mm'   => '34',
                    'A2_mm'   => '13',
                    'J_mm'    => '92',
                    'L_mm'    => '118',
                    'N_mm'    => '14',
                    'A_mm'    => '44.4',
                    'mass_kg' => '1.6',
                    'cdyn_kn' => '25.5',
                    'co_kn'   => '15.3',
                    'pu_kn'   => '0.643',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ1.1/4TF (YEL 207-104 2F + FY507M)'],
                    ['brand' => 'SNR', 'value' => 'EXF207-20/UCF207-20'],
                ],
                'name_uk' => 'BUQ 207-104-2X3H',
                'name_en' => 'BUQ 207-104-2X3H',
                'name_pl' => 'BUQ 207-104-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 207-20 / SKF FYJ 1.1/4 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 31.75 мм (1 1/4"), монтажна база J = 83 мм, Cdyn = 19.5 кН, Co = 11.3 кН, маса 1.1 кг. Система герметизації — комбінована: трикромкове контактне ущільнення доповнене двокромковим з обох сторін, що блокує проникнення пилу, вологи та абразиву у зону кочення. Виступає прямою геометричною заміною вузлів SKF FYJ 1.1/4 TF (YEL 207-104 2F + FY507M) і SNR EXF207-20 / UCF207-20; застосовується у ґрунтообробній та посівній техніці з дюймовими посадковими розмірами валів.',
                'meta_title_uk' => 'VELNOX BUQ 207-104-2X3H — фланцевий вузол 1 1/4", SKF FYJ 1.1/4 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 207-104-2X3H, d=31.75 мм (1 1/4"), Cdyn 19.5 кН. Пряма заміна SKF FYJ 1.1/4 TF, SNR UCF207-20. Комбіноване ущільнення.',
            ],
            [
                'slug'    => 'buq-207-106-2x3h',
                'article' => 'BUQ 207-106-2X3H',
                'specs'   => [
                    'd_mm'    => '34.925',
                    'd_inch'  => '1 3/8',
                    'A1_mm'   => '34',
                    'A2_mm'   => '13',
                    'J_mm'    => '92',
                    'L_mm'    => '118',
                    'N_mm'    => '14',
                    'A_mm'    => '44.4',
                    'mass_kg' => '1.6',
                    'cdyn_kn' => '25.5',
                    'co_kn'   => '15.3',
                    'pu_kn'   => '0.643',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ1.3/8TF'],
                    ['brand' => 'SNR', 'value' => 'EXF207-22/UCF207-22'],
                ],
                'name_uk' => 'BUQ 207-106-2X3H',
                'name_en' => 'BUQ 207-106-2X3H',
                'name_pl' => 'BUQ 207-106-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 207-22 / SKF FYJ 1.3/8 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 34.925 мм (1 3/8"), міжцентрова відстань кріплень J = 92 мм, довжина корпусу L = 118 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.6 кг. Комбінована система захисту VELNOX: трикромкове контактне ущільнення + двокромкове з обох сторін — для роботи в умовах підвищеного запилення та вологості. Повний геометричний аналог SKF FYJ 1.3/8 TF (YEL 207-106 2F + FY507M) і SNR EXF207-22 / UCF207-22; застосовується у ґрунтообробних агрегатах та прикочувальних котках з дюймовою посадкою.',
                'meta_title_uk' => 'VELNOX BUQ 207-106-2X3H — фланцевий вузол 1 3/8", SKF FYJ 1.3/8 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 207-106-2X3H, d=34.925 мм (1 3/8"), Cdyn 25.5 кН, Co 15.3 кН. Пряма заміна SKF FYJ 1.3/8 TF, SNR UCF207-22. Комбінована система захисту.',
            ],
            [
                'slug'    => 'buq-207-2x3h',
                'article' => 'BUQ 207-2X3H',
                'specs'   => [
                    'd_mm'    => '35',
                    'A1_mm'   => '34',
                    'A2_mm'   => '13',
                    'J_mm'    => '92',
                    'L_mm'    => '118',
                    'N_mm'    => '14',
                    'A_mm'    => '44.4',
                    'mass_kg' => '1.6',
                    'cdyn_kn' => '25.5',
                    'co_kn'   => '15.3',
                    'pu_kn'   => '0.643',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ40TF (YEL 207 2F + FY507M)'],
                    ['brand' => 'SNR', 'value' => 'EXF207/UCF207'],
                ],
                'name_uk' => 'BUQ 207-2X3H',
                'name_en' => 'BUQ 207-2X3H',
                'name_pl' => 'BUQ 207-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори метричного виконання (аналог UCF 207 / SKF FYJ 40 TF) з внутрішнім діаметром d = 35 мм. Монтажна база J = 92 мм, загальна ширина A = 44.4 мм, довжина L = 118 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.45 кг. Захист підшипника забезпечує комбінована система ущільнень VELNOX: трикромкове контактне + двокромкове з обох сторін для агресивних польових умов. Пряма заміна SKF FYJ 40 TF (YEL 207 2F + FY507M) і SNR EXF207 / UCF207 у вузлах дискових борін, культиваторів та прикочувальних котків.',
                'meta_title_uk' => 'VELNOX BUQ 207-2X3H — фланцевий вузол d35, аналог SKF FYJ 40 TF',
                'meta_desc_uk' => 'Квадратний фланцевий вузол VELNOX BUQ 207-2X3H, d=35 мм, Cdyn 25.5 кН. 100% аналог SKF FYJ 40 TF, SNR UCF207. Трикромкове + двокромкове ущільнення.',
            ],
            [
                'slug'    => 'buq-208-108-2x3h',
                'article' => 'BUQ 208-108-2X3H',
                'specs'   => [
                    'd_mm'    => '38.1',
                    'd_inch'  => '1 1/2',
                    'A1_mm'   => '36',
                    'A2_mm'   => '14',
                    'J_mm'    => '102',
                    'L_mm'    => '130',
                    'N_mm'    => '16',
                    'A_mm'    => '51.2',
                    'mass_kg' => '1.95',
                    'cdyn_kn' => '30.7',
                    'co_kn'   => '19',
                    'pu_kn'   => '0.798',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ 1.1/2 TF'],
                    ['brand' => 'SNR', 'value' => 'EXF208-24/UCF 208-24'],
                ],
                'name_uk' => 'BUQ 208-108-2X3H',
                'name_en' => 'BUQ 208-108-2X3H',
                'name_pl' => 'BUQ 208-108-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 208-24 / SKF FYJ 1.1/2 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 38.1 мм (1 1/2"), монтажна база J = 102 мм, довжина корпусу L = 130 мм, Cdyn = 30.7 кН, Co = 19.0 кН, маса 1.95 кг. Комбіноване ущільнення VELNOX — трикромкове контактне + двокромкове з обох сторін підшипника — забезпечує стабільну роботу у вузлах з прямим контактом ґрунту. Пряма заміна SKF FYJ 1.1/2 TF (YEL 208-108 2F + FY508M) і SNR EXF208-24 / UCF 208-24 у сільгосптехніці з дюймовим валом.',
                'meta_title_uk' => 'VELNOX BUQ 208-108-2X3H — вузол 1 1/2", SKF FYJ 1.1/2 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 208-108-2X3H, d=38.1 мм (1 1/2"), Cdyn 30.7 кН, Co 19 кН. Пряма заміна SKF FYJ 1.1/2 TF, SNR UCF 208-24. Комбіноване ущільнення.',
            ],
            [
                'slug'    => 'buq-208-2x3h',
                'article' => 'BUQ 208-2X3H',
                'specs'   => [
                    'd_mm'    => '40',
                    'A1_mm'   => '36',
                    'A2_mm'   => '14',
                    'J_mm'    => '102',
                    'L_mm'    => '130',
                    'N_mm'    => '16',
                    'A_mm'    => '51.2',
                    'mass_kg' => '1.95',
                    'cdyn_kn' => '30.7',
                    'co_kn'   => '19',
                    'pu_kn'   => '0.798',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ40TF (YEL 208 2F + FY508M)'],
                    ['brand' => 'SNR', 'value' => 'EXF208/UCF208'],
                ],
                'name_uk' => 'BUQ 208-2X3H',
                'name_en' => 'BUQ 208-2X3H',
                'name_pl' => 'BUQ 208-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори метричного ряду (аналог UCF 208 / SKF FYJ 40 TF) з внутрішнім діаметром d = 40 мм. Монтажна база J = 102 мм, габаритна довжина L = 130 мм, Cdyn = 30.7 кН, Co = 19.0 кН, маса 1.95 кг. Комбінована система герметизації: трикромкове контактне ущільнення та додаткове двокромкове з кожної з сторін підшипника для блокування пилу, вологи та абразиву. Повний геометричний аналог SKF FYJ 40 TF (YEL 208 2F + FY508M) і SNR EXF208 / UCF208; застосовується у боронах, культиваторах та прикочувальних котках європейської сільгосптехніки.',
                'meta_title_uk' => 'VELNOX BUQ 208-2X3H — фланцевий вузол d40, UCF208 SKF FYJ 40 TF',
                'meta_desc_uk' => 'Квадратний фланцевий вузол VELNOX BUQ 208-2X3H, d=40 мм, Cdyn 30.7 кН, Co 19 кН. Пряма заміна SKF FYJ 40 TF, SNR UCF208. Комбіноване ущільнення.',
            ],
            [
                'slug'    => 'buq-209-2t3h',
                'article' => 'BUQ-209-2T3H',
                'specs'   => [
                    'd_mm'    => '45',
                    'A1_mm'   => '38',
                    'A2_mm'   => '16',
                    'J_mm'    => '105',
                    'L_mm'    => '137',
                    'N_mm'    => '16',
                    'A_mm'    => '52.2',
                    'mass_kg' => '2.41',
                    'cdyn_kn' => '33.2',
                    'co_kn'   => '21.9',
                    'pu_kn'   => '0.92',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ 45 TF'],
                    ['brand' => 'SNR', 'value' => 'EXF 209/UCF 209'],
                ],
                'name_uk' => 'BUQ-209-2T3H',
                'name_en' => 'BUQ-209-2T3H',
                'name_pl' => 'BUQ-209-2T3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 209 / SKF FYJ 45 TF) з внутрішнім діаметром d = 45 мм. Монтажна база J = 105 мм, габаритна довжина L = 137 мм, Cdyn = 33.2 кН, Co = 21.9 кН, маса 2.41 кг. Захист забезпечує комбінована система ущільнень VELNOX: трикромкове контактне у поєднанні з двокромковим з кожної з сторін підшипника — рішення для вузлів, що працюють у ґрунті та при ударних навантаженнях. Пряма заміна SKF FYJ 45 TF (YEL 209 2F + FY509M) і SNR EXF 209 / UCF 209 у культиваторах, боронах і прикочувальних котках.',
                'meta_title_uk' => 'VELNOX BUQ-209-2T3H — фланцевий вузол d45, аналог SKF FYJ 45 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ-209-2T3H, d=45 мм, Cdyn 33.2 кН, Co 21.9 кН. Пряма заміна SKF FYJ 45 TF, SNR UCF 209. Комбінована система ущільнень.',
            ],
            [
                'slug'    => 'buq-210-2x3h',
                'article' => 'BUQ 210-2X3H',
                'specs'   => [
                    'd_mm'    => '50',
                    'A1_mm'   => '40',
                    'A2_mm'   => '16',
                    'J_mm'    => '111',
                    'L_mm'    => '143',
                    'N_mm'    => '16',
                    'A_mm'    => '54.6',
                    'mass_kg' => '2.78',
                    'cdyn_kn' => '35.1',
                    'co_kn'   => '23.2',
                    'pu_kn'   => '0.974',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ 50 TF'],
                    ['brand' => 'SNR', 'value' => 'EXF210/UCF 210'],
                ],
                'name_uk' => 'BUQ 210-2X3H',
                'name_en' => 'BUQ 210-2X3H',
                'name_pl' => 'BUQ 210-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 210 / SKF FYJ 50 TF) з внутрішнім діаметром d = 50 мм. Монтажна база J = 111 мм, довжина корпусу L = 143 мм, Cdyn = 35.1 кН, Co = 23.2 кН, маса 2.78 кг. Комбінована система захисту (трикромкове контактне + двокромкове ущільнення) дозволяє експлуатувати вузол у польових умовах з підвищеним запиленням та присутністю вологи. Пряма заміна SKF FYJ 50 TF (YEL 210 2F + FY510M) і SNR EXF210 / UCF 210; застосовується у важких ґрунтообробних агрегатах, прикочувальних котках та конвеєрних вузлах.',
                'meta_title_uk' => 'VELNOX BUQ 210-2X3H — фланцевий вузол d50, SKF FYJ 50 TF UCF210',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 210-2X3H, d=50 мм, Cdyn 35.1 кН, Co 23.2 кН. Пряма заміна SKF FYJ 50 TF, SNR UCF 210. Комбінована система захисту.',
            ],
            [
                'slug'    => 'buq-214-2t3h',
                'article' => 'BUQ-214-2T3H',
                'specs'   => [
                    'd_mm'    => '70',
                    'A1_mm'   => '50.3',
                    'A2_mm'   => '21.3',
                    'J_mm'    => '152',
                    'L_mm'    => '193',
                    'N_mm'    => '19',
                    'A_mm'    => '70.7',
                    'mass_kg' => '6.2',
                    'cdyn_kn' => '62.4',
                    'co_kn'   => '44',
                    'pu_kn'   => '1.848',
                ],
                'cross_refs' => [
                    ['brand' => 'SNR', 'value' => 'EXF 214/UCF 214'],
                ],
                'name_uk' => 'BUQ-214-2T3H',
                'name_en' => 'BUQ-214-2T3H',
                'name_pl' => 'BUQ-214-2T3H',
                'desc_uk' => 'Посилений квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 214) з внутрішнім діаметром d = 70 мм — для важких радіальних навантажень. Монтажна база J = 152 мм, довжина корпусу L = 193 мм, Cdyn = 62.4 кН, Co = 44.0 кН, Pu = 1.848 кН, маса 2.6 кг. Комбінована система ущільнень VELNOX: трикромкове контактне + двокромкове для роботи в абразивному та вологому середовищі. Пряма заміна SNR EXF 214 / UCF 214; застосовується у важких дискових боронах, глибокорозпушувачах та промислових транспортерах з високими радіальними навантаженнями.',
                'meta_title_uk' => 'VELNOX BUQ-214-2T3H — посилений фланцевий вузол d70, UCF 214',
                'meta_desc_uk' => 'Посилений фланцевий вузол VELNOX BUQ-214-2T3H, d=70 мм, Cdyn 62.4 кН, Co 44 кН. Пряма заміна SNR UCF 214. Для важких борін та розпушувачів.',
            ],
        ];

        foreach ($products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                [
                    'slug'             => $p['slug'],
                    'article'          => $p['article'],
                    'product_table_id' => $t1,
                ]
            );

            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            // product_specs
            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            // product_cross_refs
            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                ]);
            }

            // translations
            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            if (isset($p['desc_uk'])) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => 'uk', 'field' => 'desc'],
                    ['value' => $p['desc_uk']]
                );
            }
            if (isset($p['meta_title_uk'])) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => 'uk', 'field' => 'meta_title'],
                    ['value' => $p['meta_title_uk']]
                );
            }
            if (isset($p['meta_desc_uk'])) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => 'uk', 'field' => 'meta_description'],
                    ['value' => $p['meta_desc_uk']]
                );
            }
        }

        // =========================================================
        // 7. PRODUCTS — bearings-t2 through bearings-t5
        // =========================================================
        $t2 = $tableId('bearings-t2');
        $t3 = $tableId('bearings-t3');
        $t4 = $tableId('bearings-t4');
        $t5 = $tableId('bearings-t5');

        $extraProducts = [
            // ── bearings-t2: BUQ-308-2T3H-DS ──
            [
                'slug'     => 'buq-308-2t3h-ds',
                'article'  => 'BUQ-308-2T3H-DS',
                'table_id' => $t2,
                'specs'    => [
                    'd_mm'    => '40',
                    'A1_mm'   => '56',
                    'A2_mm'   => '21',
                    'J_mm'    => '101.5',
                    'L_mm'    => '130',
                    'H_T'     => 'M12',
                    'A_mm'    => '51.2',
                    'mass_kg' => '2.5',
                    'cdyn_kn' => '62.3',
                    'co_kn'   => '45.2',
                    'pu_kn'   => '1.898',
                ],
                'cross_refs' => [
                    ['brand' => 'SNR',  'value' => 'CE066 / UCF308 A01X1'],
                    ['brand' => 'FKL',  'value' => 'LSQFR308 TBT.H.T.'],
                    ['brand' => 'PEER', 'value' => 'W308-40MM-FDT-MF-AP-SP1'],
                    ['brand' => 'AMAZONE', 'value' => '957305 / CE066 / CE078'],
                ],
                'name_uk' => 'BUQ-308-2T3H-DS',
                'name_en' => 'BUQ-308-2T3H-DS',
                'name_pl' => 'BUQ-308-2T3H-DS',
                'desc_uk' => 'Посилений квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори для прикочувальних котків (аналог UCF 308 / UC 308 X1) з внутрішнім діаметром d = 40 мм. Кріпильна база J = 101.5 мм, довжина корпусу L = 130 мм, різьблення H/T = M12, Cdyn = 62.3 кН, Co = 45.2 кН, Pu = 1.898 кН, маса 2.5 кг. Посилена комбінована система ущільнень (індекс -DS) забезпечує герметичний захист зони кочення від ґрунтового пилу, вологи та абразиву в умовах постійного контакту з ґрунтом. Пряма заміна SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 та SNR UCF308 A01X1; застосовується у прикочувальних котках AMAZONE (арт. 957305, CE066, CE078) та інших європейських ґрунтообробних агрегатів.',
                'meta_title_uk' => 'VELNOX BUQ-308-2T3H-DS — вузол котка d40, AMAZONE CE066',
                'meta_desc_uk'  => 'Підшипниковий вузол VELNOX BUQ-308-2T3H-DS (d=40 мм, Cdyn 62.3 кН) для котків. Пряма заміна AMAZONE CE066, 957305, SNR UC 308 X1.',
            ],
            // ── bearings-t3: BUQ-309-2T3H ──
            [
                'slug'     => 'buq-309-2t3h',
                'article'  => 'BUQ 309-2T3H',
                'table_id' => $t3,
                'specs'    => [
                    'd_mm'    => '45',
                    'J_mm'    => '105',
                    'L_mm'    => '137',
                    'B_mm'    => '51.1',
                    'mass_kg' => '2.5',
                    'cdyn_kn' => '80.8',
                    'co_kn'   => '59.6',
                    'pu_kn'   => '2.503',
                ],
                'cross_refs' => [
                    ['brand' => 'FKL',    'value' => 'LSQFR 309 2TB.H.T.'],
                    ['brand' => 'CJI',    'value' => '309 GGG+19000509'],
                    ['brand' => 'Farmet', 'value' => '4000412 / M14581 / 15626ND / 18888ND'],
                    ['brand' => 'Farmet', 'value' => 'M10257 / M13082ND / M15626 / M17627'],
                    ['brand' => 'Farmet', 'value' => 'M24607 / R17015300'],
                ],
                'name_uk' => 'BUQ 309-2T3H',
                'name_en' => 'BUQ 309-2T3H',
                'name_pl' => 'BUQ 309-2T3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори серії 309 для прикочувальних котків з внутрішнім діаметром d = 45 мм. Кріпильна база J = 105 мм, довжина корпусу L = 137 мм, ширина внутрішнього кільця B = 51.1 мм, Cdyn = 80.8 кН, Co = 59.6 кН, Pu = 2.503 кН. Посилена герметизація — трикромкове ущільнення в парі з двокромковим з кожної сторони — забезпечує ресурс у вузлах з ударними навантаженнями та абразивним середовищем. Пряма заміна FKL LSQFR 309 2TB.H.T та вузла CJI 309 GGG+19000509; використовується у прикочувальних котках Farmet (арт. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                'meta_title_uk' => 'VELNOX BUQ 309-2T3H — вузол котка d45, Farmet M14581 LEFG 209 TDT',
                'meta_desc_uk'  => 'Фланцевий вузол VELNOX BUQ 309-2T3H, d=45 мм, Cdyn 80.8 кН. Пряма заміна Farmet M14581, 4000412, FKL LEFG 209 TDT. Для котків.',
            ],
            // ── bearings-t4: BUCR-SG-309-S2 ──
            [
                'slug'     => 'bucr-sg-309-s2',
                'article'  => 'BUCR-SG-309-S2',
                'table_id' => $t4,
                'specs'    => [
                    'd_mm'    => '45',
                    'D_mm'    => '74',
                    'L1_mm'   => '152',
                    'L2_mm'   => '150',
                    'J_mm'    => '120',
                    'A_mm'    => '66.9',
                    'mass_kg' => '5.6',
                ],
                'cross_refs' => [
                    ['brand' => 'Gaspardo', 'value' => '17014180 / M23400435 / M23400436'],
                    ['brand' => 'Gaspardo', 'value' => 'M43400413 / M43400468 / M43400468R'],
                    ['brand' => 'Gaspardo', 'value' => 'R17015300'],
                    ['brand' => 'FKL',      'value' => 'ZGKU 309 2S'],
                    ['brand' => 'RBF',      'value' => 'PN00102'],
                ],
                'name_uk' => 'BUCR-SG-309-S2',
                'name_en' => 'BUCR-SG-309-S2',
                'name_pl' => 'BUCR-SG-309-S2',
                'desc_uk' => 'Тандемний (здвоєний) підшипниковий вузол типу Gaspardo з двома симетричними корпусними секціями (L1 = 152 мм, L2 = 150 мм) та посадковим діаметром d = 45 мм, діаметром корпусу D = 74 мм, масою 5.6 кг. Монтажні бази J1 = J2 = 120 мм, кріплення 4×M12×1.25 з кожного боку, висота A = 66.9 мм; конструкція розрахована на асиметричне навантаження секційних вузлів посівних і ґрунтообробних комплексів. Посилена багатокромкова система ущільнень захищає підшипник від ґрунтової вологи, насіннєвого пилу та абразиву під час постійної польової роботи. Пряма заміна OEM-вузлів Gaspardo (арт. 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300), FKL ZGKU 309 2S та RBF PN00102; застосовується у висівних секціях та прикочувальних котках техніки Gaspardo/Maschio.',
                'meta_title_uk' => 'VELNOX BUCR-SG-309-S2 — тандемний вузол Gaspardo M43400468',
                'meta_desc_uk'  => 'Тандемний вузол VELNOX BUCR-SG-309-S2 для Gaspardo, d=45 мм, 4×M12, маса 5.6 кг. Заміна Gaspardo M43400468, 17014180, FKL ZGKU 309 2S.',
            ],
            // ── bearings-t5: BUP-207-X3L ──
            [
                'slug'     => 'bup-207-x3l',
                'article'  => 'BUP 207-X3L',
                'table_id' => $t5,
                'specs'    => [
                    'd_mm'    => '35',
                    'D_mm'    => '125',
                    'J_mm'    => '100',
                    'A_mm'    => '40',
                    'B_mm'    => '28.3',
                    'mass_kg' => '1.7',
                    'cdyn_kn' => '25.5',
                    'co_kn'   => '15.3',
                ],
                'cross_refs' => [
                    ['brand' => 'Lemken',   'value' => '31910034 / 3199372'],
                    ['brand' => 'Opall Agri', 'value' => '3421370'],
                    ['brand' => 'INA/FAG',  'value' => 'F232812-0200'],
                    ['brand' => 'PEER',     'value' => '207XTR-R-DFC-A534'],
                    ['brand' => 'SNR',      'value' => 'UC 207 X1'],
                ],
                'name_uk' => 'BUP 207-X3L',
                'name_en' => 'BUP 207-X3L',
                'name_pl' => 'BUP 207-X3L',
                'desc_uk' => 'Підшипниковий вузол у круглому фланцевому корпусі типу RCJ 35 / UC 207 X1 для ґрунтообробної техніки Lemken з внутрішнім діаметром d = 35 мм та зовнішнім діаметром корпусу D = 125 мм. Монтажна база J = 100 мм під різьблення M12, загальна ширина A = 40 мм, ширина внутрішнього кільця B = 28.3 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.7 кг. Система захисту — багатокромкове ущільнення серії X3L (трикромкове контактне з базової сторони + посилене фронтальне), розраховане на ударні навантаження ґрунтообробного диска. Повний геометричний аналог Lemken 31910034 / 3199372, Opall Agri 3421370, INA/FAG F232812-0200, PEER 207XTR-R-DFC-A534 та SNR UC 207 X1; застосовується у дискових боронах Lemken серій Rubin, Heliodor, Kristall.',
                'meta_title_uk' => 'VELNOX BUP 207-X3L — вузол Lemken d35, 31910034, UC 207 X1',
                'meta_desc_uk'  => 'Підшипниковий вузол VELNOX BUP 207-X3L для Lemken, d=35 мм, D=125 мм, Cdyn 25.5 кН. Заміна Lemken 31910034, 3199372, SNR UC 207 X1.',
            ],
        ];

        foreach ($extraProducts as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $p['table_id']]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert(['product_id' => $productId, 'brand' => $ref['brand'], 'value' => $ref['value']]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['desc_uk' => 'desc', 'meta_title_uk' => 'meta_title', 'meta_desc_uk' => 'meta_description'] as $key => $field) {
                if (isset($p[$key])) {
                    DB::table('translations')->updateOrInsert(
                        ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => 'uk', 'field' => $field],
                        ['value' => $p[$key]]
                    );
                }
            }
        }

        // ── HUBS PRODUCTS ──
        $hubProducts = [
            [
                'slug'    => '28071300-vx',
                'article' => '28071300 VX',
                'table_id' => $hubT1,
                'specs'   => [
                    'hub_J_mm'        => '106',
                    'hub_D_mm'        => '127.3',
                    'hub_D1_mm'       => '64.2',
                    'hub_d_mm'        => '55.7',
                    'hub_C_mm'        => '38',
                    'hub_hole_thread' => 'M12',
                    'hub_G'           => '2xM20',
                    'hub_L_mm'        => '106.5',
                    'hub_L1_mm'       => '2',
                    'hub_F_mm'        => '25',
                    'mass_kg'         => '3.81',
                    'cdyn_kn'         => '48.8',
                    'co_kn'           => '35.3',
                    'pu_kn'           => '1.483',
                ],
                'cross_refs' => [
                    ['brand' => 'HORSCH', 'value' => '28071300'],
                    ['brand' => 'HORSCH', 'value' => '28077800'],
                    ['brand' => 'HORSCH', 'value' => '28077900'],
                    ['brand' => 'HORSCH', 'value' => '28085600'],
                    ['brand' => 'HORSCH', 'value' => 'PN60041'],
                ],
                'name_uk' => 'Маточина дискової борони 28071300 VX',
                'name_en' => 'Disc Harrow Hub 28071300 VX',
                'name_pl' => 'Piasta brony talerzowej 28071300 VX',
                'desc_uk' => 'Маточина дискової борони VELNOX 28071300 VX — аналог HORSCH. Призначена для дискових борон Horsch Tiger LT та подібних серій. Виготовлена з ​​якісної сталі з прецизійним підшипниковим вузлом для тривалого ресурсу в агресивних ґрунтових умовах.',
                'desc_en' => 'VELNOX 28071300 VX disc harrow hub — HORSCH equivalent. Designed for Horsch Tiger LT and similar series disc harrows. Made from quality steel with precision bearing assembly for long service life in demanding soil conditions.',
                'desc_pl' => 'Piasta brony talerzowej VELNOX 28071300 VX — odpowiednik HORSCH. Przeznaczona do bron talerzowych Horsch Tiger LT i podobnych serii. Wykonana z wysokiej jakości stali z precyzyjnym węzłem łożyskowym dla długiej żywotności w wymagających warunkach glebowych.',
            ],
            [
                'slug'    => 'baa-0004-vx',
                'article' => 'BAA-0004 VX',
                'table_id' => $hubT2,
                'specs'   => [
                    'hub_J_mm'        => '98',
                    'hub_D_mm'        => '117',
                    'hub_hole_thread' => '6xM12x1.25',
                    'hub_d_mm'        => '27.95',
                    'hub_C_mm'        => '25.4',
                    'hub_M_thread'    => 'M22x1.5',
                    'hub_L_mm'        => '102',
                    'hub_L1_mm'       => '60',
                    'hub_E_mm'        => '17',
                    'hub_F_mm'        => '25',
                    'mass_kg'         => '2.16',
                    'cdyn_kn'         => '42.9',
                    'co_kn'           => '36.3',
                    'pu_kn'           => '1.53',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF',  'value' => '8395.TDA.5.05.015'],
                    ['brand' => 'NSK',  'value' => 'AGHU2898X4E-DSCS'],
                    ['brand' => 'FBJ',  'value' => 'AHU28117A-01'],
                    ['brand' => 'INA',  'value' => 'BAA0004'],
                    ['brand' => 'PEER', 'value' => 'F-673270.04.TILL'],
                    ['brand' => 'FKL',  'value' => 'HUB-30MM'],
                ],
                'name_uk' => 'Ріжучий вузол BAA-0004 VX',
                'name_en' => 'Cutting Node BAA-0004 VX',
                'name_pl' => 'Węzeł tnący BAA-0004 VX',
                'desc_uk' => 'Ріжучий вузол VELNOX BAA-0004 VX — застосовується у дискових плугах та сектор-культиваторах провідних виробників: Bednar, Köckerling, Gaspardo, Holmer та ін. Точна геометрія та якісний підшипниковий вузол забезпечують надійну роботу в умовах підвищеного навантаження.',
                'desc_en' => 'VELNOX BAA-0004 VX cutting node — used in disc ploughs and cultivators from leading manufacturers: Bednar, Köckerling, Gaspardo, Holmer etc. Precise geometry and quality bearing assembly ensure reliable operation under high-load conditions.',
                'desc_pl' => 'Węzeł tnący VELNOX BAA-0004 VX — stosowany w pługach talerzowych i kultywatorach czołowych producentów: Bednar, Köckerling, Gaspardo, Holmer i in. Precyzyjna geometria i wysokiej jakości węzeł łożyskowy zapewniają niezawodną pracę w warunkach dużych obciążeń.',
            ],
            [
                'slug'    => 'pl-140-vx',
                'article' => 'PL-140 VX',
                'table_id' => $hubT3,
                'specs'   => [
                    'hub_J_mm'        => '104',
                    'hub_D_mm'        => '140',
                    'hub_D1_mm'       => '62',
                    'hub_d_mm'        => '30',
                    'hub_hole_thread' => 'M12',
                    'hub_L_mm'        => '35',
                    'hub_B_mm'        => '23.8',
                    'mass_kg'         => '1.5',
                    'cdyn_kn'         => '31',
                    'co_kn'           => '22.2',
                    'pu_kn'           => '0.932',
                ],
                'cross_refs' => [
                    ['brand' => 'Vaderstad', 'value' => '405814'],
                    ['brand' => 'Vaderstad', 'value' => '418531'],
                    ['brand' => 'Vaderstad', 'value' => '420013'],
                    ['brand' => 'Vaderstad', 'value' => '420832'],
                    ['brand' => 'FKL',       'value' => 'PL-140'],
                    ['brand' => 'FBJ',       'value' => 'SAH017'],
                ],
                'name_uk' => 'Маточина сівалки PL-140 VX',
                'name_en' => 'Seeder Hub PL-140 VX',
                'name_pl' => 'Piasta siewnika PL-140 VX',
                'desc_uk' => 'Маточина сівалки VELNOX PL-140 VX — аналог FKL/FBJ PL-140 / SAH017. Призначена для швидкісних сівалок Väderstad Rapid та подібних серій. Забезпечує точне та плавне ущільнення ґрунту при посіві.',
                'desc_en' => 'VELNOX PL-140 VX seeder hub — FKL/FBJ PL-140 / SAH017 equivalent. Designed for Väderstad Rapid and similar high-speed seeders. Ensures precise and smooth soil packing during seeding.',
                'desc_pl' => 'Piasta siewnika VELNOX PL-140 VX — odpowiednik FKL/FBJ PL-140 / SAH017. Przeznaczona do siewników szybkobieżnych Väderstad Rapid i podobnych serii. Zapewnia precyzyjne i płynne zagęszczenie gleby podczas siewu.',
            ],
        ];

        foreach ($hubProducts as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $p['table_id']]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert(['product_id' => $productId, 'brand' => $ref['brand'], 'value' => $ref['value']]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
                if (isset($p["desc_{$locale}"])) {
                    DB::table('translations')->updateOrInsert(
                        ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'desc'],
                        ['value' => $p["desc_{$locale}"]]
                    );
                }
            }
        }
    }
}
