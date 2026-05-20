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
            'd_mm'    => ['uk' => ['label' => 'Діаметр отвору d (мм)',                            'unit' => 'мм'],  'en' => ['label' => 'Bore diameter d (mm)',                          'unit' => 'mm'],  'pl' => ['label' => 'Średnica otworu d (mm)',                        'unit' => 'mm']],
            'd_inch'  => ['uk' => ['label' => 'Діаметр отвору d (дюйм)',                          'unit' => 'дюйм'],'en' => ['label' => 'Bore diameter d (inch)',                        'unit' => 'in'],  'pl' => ['label' => 'Średnica otworu d (cal)',                       'unit' => 'cal']],
            'A1_mm'   => ['uk' => ['label' => 'Загальна ширина корпусу A1 (мм)',                   'unit' => 'мм'],  'en' => ['label' => 'Overall housing width A1 (mm)',                 'unit' => 'mm'],  'pl' => ['label' => 'Całkowita szerokość obudowy A1 (mm)',           'unit' => 'mm']],
            'A2_mm'   => ['uk' => ['label' => 'Товщина фланця корпусу A2 (мм)',                   'unit' => 'мм'],  'en' => ['label' => 'Housing flange thickness A2 (mm)',               'unit' => 'mm'],  'pl' => ['label' => 'Grubość kołnierza obudowy A2 (mm)',             'unit' => 'mm']],
            'J_mm'    => ['uk' => ['label' => 'Відстань між отворами J (мм)',                     'unit' => 'мм'],  'en' => ['label' => 'Bolt hole spacing J (mm)',                       'unit' => 'mm'],  'pl' => ['label' => 'Rozstaw otworów J (mm)',                        'unit' => 'mm']],
            'L_mm'    => ['uk' => ['label' => 'Загальна довжина L (мм)',                          'unit' => 'мм'],  'en' => ['label' => 'Overall length L (mm)',                          'unit' => 'mm'],  'pl' => ['label' => 'Długość całkowita L (mm)',                      'unit' => 'mm']],
            'N_mm'    => ['uk' => ['label' => 'Діаметр отвору N (мм)',                            'unit' => 'мм'],  'en' => ['label' => 'Bolt hole diameter N (mm)',                      'unit' => 'mm'],  'pl' => ['label' => 'Średnica otworu N (mm)',                        'unit' => 'mm']],
            'A_mm'    => ['uk' => ['label' => 'Загальна ширина A (мм)',                           'unit' => 'мм'],  'en' => ['label' => 'Overall width A (mm)',                           'unit' => 'mm'],  'pl' => ['label' => 'Szerokość całkowita A (mm)',                    'unit' => 'mm']],
            'mass_kg' => ['uk' => ['label' => 'Маса',                                             'unit' => 'кг'],  'en' => ['label' => 'Mass',                                          'unit' => 'kg'],  'pl' => ['label' => 'Masa',                                         'unit' => 'kg']],
            'cdyn_kn' => ['uk' => ['label' => 'Динамічна вантажо-підйомність Cdyn (кН)',          'unit' => 'кН'],  'en' => ['label' => 'Dynamic load rating Cdyn (kN)',                 'unit' => 'kN'],  'pl' => ['label' => 'Nośność dynamiczna Cdyn (kN)',                  'unit' => 'kN']],
            'co_kn'   => ['uk' => ['label' => 'Статична вантажо-підйомність Co (кН)',             'unit' => 'кН'],  'en' => ['label' => 'Static load rating Co (kN)',                    'unit' => 'kN'],  'pl' => ['label' => 'Nośność statyczna Co (kN)',                     'unit' => 'kN']],
            'pu_kn'   => ['uk' => ['label' => 'Гранична навантаженість втомної міцності Pu (кН)', 'unit' => 'кН'],  'en' => ['label' => 'Fatigue load limit Pu (kN)',                    'unit' => 'kN'],  'pl' => ['label' => 'Graniczne obciążenie zmęczeniowe Pu (kN)',      'unit' => 'kN']],
            'B_mm'    => ['uk' => ['label' => 'Ширина внутрішнього кільця B (мм)',                'unit' => 'мм'],  'en' => ['label' => 'Inner ring width B (mm)',                        'unit' => 'mm'],  'pl' => ['label' => 'Szerokość pierścienia wewnętrznego B (mm)',     'unit' => 'mm']],
            'D_mm'    => ['uk' => ['label' => 'D (мм) — зовн. діаметр корпусу',                  'unit' => 'мм'],  'en' => ['label' => 'D (mm) — housing outside diameter',             'unit' => 'mm'],  'pl' => ['label' => 'D (mm) — zewn. śr. obudowy',                   'unit' => 'mm']],
            'H_T'     => ['uk' => ['label' => 'Отвір / Різьба H/T',                              'unit' => ''],    'en' => ['label' => 'Hole / Thread H/T',                             'unit' => ''],    'pl' => ['label' => 'Otwór / Gwint H/T',                            'unit' => '']],
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
        // 5b. PRODUCT TABLE: bearings-t2
        //     (table record, translations, and assets only — no products)
        // =========================================================
        $extraTables = [
            [
                'slug'             => 'bearings-t2',
                'sort_order'       => 2,
                'schema_viewbox'   => '147 720 2059 773',
                'highlight_config' => [
                    'H_T'   => [['label' => 'H/T', 'x' => 251,  'y' => 734 ]],
                    'd_mm'  => [['label' => 'd',   'x' => 1050, 'y' => 1069]],
                    'A2_mm' => [['label' => 'A2',  'x' => 853,  'y' => 1366]],
                    'A1_mm' => [['label' => 'A1',  'x' => 903,  'y' => 1413]],
                    'A_mm'  => [['label' => 'A',   'x' => 892,  'y' => 1457], ['label' => 'A', 'x' => 383, 'y' => 1448]],
                    'J_mm'  => [['label' => 'J',   'x' => 450,  'y' => 1366]],
                    'L_mm'  => [['label' => 'L',   'x' => 450,  'y' => 1409]],
                ],
                'names'  => ['uk' => 'BUQ-308-2T3H-DS — Таблиця 2', 'en' => 'BUQ-308-2T3H-DS — Table 2', 'pl' => 'BUQ-308-2T3H-DS — Tabela 2'],
                'assets' => [
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds.webp',          'sort_order' => 1],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-1.webp', 'sort_order' => 2],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-2.webp', 'sort_order' => 3],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-3.webp', 'sort_order' => 4],
                    ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-schema.webp',   'sort_order' => 0],
                    ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t2/schema.svg',                            'sort_order' => 0],
                ],
            ],
        ];

        $t2SpecCols = ['d_mm','A1_mm','A2_mm','J_mm','L_mm','H_T','A_mm','mass_kg','cdyn_kn','co_kn','pu_kn'];
        $extraSpecCols = ['bearings-t2' => $t2SpecCols];

        foreach ($extraTables as $tbl) {
            DB::table('product_tables')->updateOrInsert(
                ['slug' => $tbl['slug']],
                [
                    'slug'             => $tbl['slug'],
                    'category_id'      => $bearingsCatId,
                    'spec_columns'     => json_encode($extraSpecCols[$tbl['slug']] ?? []),
                    'highlight_config' => json_encode($tbl['highlight_config'] ?? new \stdClass()),
                    'schema_viewbox'   => $tbl['schema_viewbox'] ?? null,
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
                    'type'       => $ref['type'] ?? 'bearing',
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
        // 7. PRODUCTS — bearings-t2
        // =========================================================
        $t2 = $tableId('bearings-t2');

        $extraProducts = [
            // ── bearings-t2: BUQ-308-2T3H-DS ──
            [
                'slug'     => 'buq-308-2t3h-ds',
                'article'  => 'BUQ-308-2T3H-DS',
                'table_id' => $t2,
                'specs'    => [
                    'd_mm'    => '40',
                    'A1_mm'   => '40.6',
                    'A2_mm'   => '19',
                    'J_mm'    => '101.5',
                    'L_mm'    => '130',
                    'H_T'     => 'M12',
                    'A_mm'    => '51.4',
                    'mass_kg' => '2.5',
                    'cdyn_kn' => '62.3',
                    'co_kn'   => '45.2',
                    'pu_kn'   => '1.898',
                ],
                'cross_refs' => [
                    ['brand' => 'SNR',     'value' => 'CE066',                                    'type' => 'bearing'],
                    ['brand' => 'FKL',     'value' => 'LSQFR308 TBT.H.T.Zn',                  'type' => 'bearing'],
                    ['brand' => 'SNR',     'value' => 'UC 308 X1',                              'type' => 'bearing'],
                    ['brand' => 'SNR',     'value' => 'UCF308 A01X1',                           'type' => 'bearing'],
                    ['brand' => 'PEER',    'value' => 'W308-40MM-FDT-MF-AP-SP1 (PER.W308RRBP52-F-A)',           'type' => 'bearing'],
                    ['brand' => 'PEER',    'value' => 'W308-40MM-FDT-MF-AP-SP1 W308RRBP52-F-B (BX-PER.W308RRBP52-F)', 'type' => 'bearing'],
                    ['brand' => 'SNR',     'value' => 'XUCF308B01B169',                         'type' => 'bearing'],
                    ['brand' => 'AMAZONE', 'value' => '957305 AMAZONE',                          'type' => 'application'],
                    ['brand' => 'AMAZONE', 'value' => 'CE066 AMAZONE',                           'type' => 'application'],
                    ['brand' => 'AMAZONE', 'value' => 'CE078 AMAZONE',                           'type' => 'application'],
                    ['brand' => 'FKL',     'value' => 'LSQFR308 TBS.H.T.Zn FKL',               'type' => 'application'],
                    ['brand' => 'RBF',     'value' => 'PN00042 RBF Housing',                     'type' => 'application'],
                    ['brand' => 'Z&S',     'value' => 'SL308MR3L Z&S',                          'type' => 'application'],
                    ['brand' => 'UCFE',    'value' => 'UCFE308 A01X1= UC308X1+FE308A01',        'type' => 'application'],
                    ['brand' => 'UCFE',    'value' => 'UCFE308 A01X1',                          'type' => 'application'],
                ],
                'name_uk' => 'BUQ-308-2T3H-DS',
                'name_en' => 'BUQ-308-2T3H-DS',
                'name_pl' => 'BUQ-308-2T3H-DS',
                'desc_uk'       => 'Посилений квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори для прикочувальних котків (аналог UCF 308 / UC 308 X1) з внутрішнім діаметром d = 40 мм. Кріпильна база J = 101.5 мм, довжина корпусу L = 130 мм, різьблення H/T = M12, Cdyn = 62.3 кН, Co = 45.2 кН, Pu = 1.898 кН, маса 2.5 кг. Посилена комбінована система ущільнень (індекс -DS) забезпечує герметичний захист зони кочення від ґрунтового пилу, вологи та абразиву в умовах постійного контакту з ґрунтом. Пряма заміна SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 та SNR UCF308 A01X1; застосовується у прикочувальних котках AMAZONE (арт. 957305, CE066, CE078) та інших європейських ґрунтообробних агрегатів.',
                'meta_title_uk' => 'VELNOX BUQ-308-2T3H-DS — вузол котка d40, AMAZONE CE066',
                'meta_desc_uk'  => 'Підшипниковий вузол VELNOX BUQ-308-2T3H-DS (d=40 мм, Cdyn 62.3 кН) для котків. Пряма заміна AMAZONE CE066, 957305, SNR UC 308 X1.',
                'desc_en'       => 'Heavy-duty square flange bearing unit with 4 mounting holes for press wheels (equivalent to UCF 308 / UC 308 X1), bore diameter d = 40 mm. Mounting base J = 101.5 mm, housing length L = 130 mm, thread H/T = M12, Cdyn = 62.3 kN, Co = 45.2 kN, Pu = 1.898 kN, weight 2.5 kg. The reinforced combined sealing system (-DS) provides sealed protection of the rolling zone against soil dust, moisture and abrasives under continuous soil contact. Direct replacement for SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 and SNR UCF308 A01X1; used in AMAZONE press wheels (part no. 957305, CE066, CE078) and other European tillage equipment.',
                'meta_title_en' => 'VELNOX BUQ-308-2T3H-DS — press wheel unit d40, AMAZONE CE066',
                'meta_desc_en'  => 'VELNOX BUQ-308-2T3H-DS bearing unit (d=40 mm, Cdyn 62.3 kN) for press wheels. Direct replacement for AMAZONE CE066, 957305, SNR UC 308 X1.',
                'desc_pl'       => 'Wzmocniony kwadratowy kołnierzowy węzeł łożyskowy na 4 otwory montażowe do rolek dogniatających (zamiennik UCF 308 / UC 308 X1), średnica wewnętrzna d = 40 mm. Baza montażowa J = 101,5 mm, długość obudowy L = 130 mm, gwint H/T = M12, Cdyn = 62,3 kN, Co = 45,2 kN, Pu = 1,898 kN, masa 2,5 kg. Wzmocniony kombinowany system uszczelnień (-DS) zapewnia hermetyczną ochronę strefy toczenia przed pyłem glebowym, wilgocią i ścierniwem przy stałym kontakcie z glebą. Bezpośredni zamiennik SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 i SNR UCF308 A01X1; stosowany w rolkach dogniatających AMAZONE (nr art. 957305, CE066, CE078) i innych europejskich agregatach uprawowych.',
                'meta_title_pl' => 'VELNOX BUQ-308-2T3H-DS — węzeł rolki d40, AMAZONE CE066',
                'meta_desc_pl'  => 'Węzeł łożyskowy VELNOX BUQ-308-2T3H-DS (d=40 mm, Cdyn 62,3 kN) do rolek. Bezpośredni zamiennik AMAZONE CE066, 957305, SNR UC 308 X1.',
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
                DB::table('product_cross_refs')->insert(['product_id' => $productId, 'brand' => $ref['brand'], 'value' => $ref['value'], 'type' => $ref['type'] ?? 'bearing']);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }
        }

        // =========================================================
        // 8. PRODUCT TABLE: bearings-t3
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'bearings-t3'],
            [
                'slug'          => 'bearings-t3',
                'category_id'   => $bearingsCatId,
                'spec_columns'  => json_encode(['d_mm','L_mm','J_mm','H_T','A_mm','A1_mm','A2_mm','B_mm','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'd_mm'  => [['label' => 'd',   'x' => 1014, 'y' => 2401]],
                    'L_mm'  => [['label' => 'L',   'x' => 436,  'y' => 2715]],
                    'J_mm'  => [['label' => 'J',   'x' => 437,  'y' => 2678]],
                    'H_T'   => [['label' => 'H/T', 'x' => 244,  'y' => 2083]],
                    'A_mm'  => [['label' => 'A',   'x' => 372,  'y' => 2074], ['label' => 'A', 'x' => 368, 'y' => 2758]],
                    'A1_mm' => [['label' => 'A1',  'x' => 871,  'y' => 2723]],
                    'A2_mm' => [['label' => 'A2',  'x' => 824,  'y' => 2681]],
                    'B_mm'  => [['label' => 'B',   'x' => 1014, 'y' => 2130]],
                ]),
                'schema_viewbox'  => '150 2036 2117 786',
                'sort_order'    => 3,
            ]
        );
        $t3 = $tableId('bearings-t3');

        foreach (['uk' => 'Підшипниковий вузол BUQ 309-2T3H', 'en' => 'Bearing Unit BUQ 309-2T3H', 'pl' => 'Węzeł łożyskowy BUQ 309-2T3H'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t3, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h.webp',          'sort_order' => 1],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-drawing-1.webp', 'sort_order' => 2],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-drawing-2.webp', 'sort_order' => 3],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-drawing-3.webp', 'sort_order' => 4],
            ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-schema.webp',   'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t3/schema.svg',                          'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t3, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 9. PRODUCTS — bearings-t3
        // =========================================================
        $t3Products = [
            [
                'slug'    => 'buq-309-2t3h',
                'article' => 'BUQ 309-2T3H',
                'table_id' => $t3,
                'specs'   => [
                    'd_mm'    => '45',
                    'L_mm'    => '137',
                    'J_mm'    => '105',
                    'H_T'     => '14',
                    'A_mm'    => '54',
                    'A1_mm'   => '44',
                    'A2_mm'   => '22',
                    'B_mm'    => '51.1',
                    'mass_kg' => '3.4',
                    'cdyn_kn' => '59.6',
                    'co_kn'   => '80.8',
                    'pu_kn'   => '2.503',
                ],
                'cross_refs' => [
                    ['brand' => 'CT-AGRI',  'value' => 'CJI 309 GGG+19000509 (Assy)',  'type' => 'bearing'],
                    ['brand' => 'FKL',      'value' => 'LSQFR 309-2TB.H.T',            'type' => 'bearing'],
                    ['brand' => 'CT-AGRI',  'value' => 'LSQFR 309-2TB.H.T',            'type' => 'bearing'],
                    ['brand' => 'Farmet',   'value' => '4000412',                       'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M14581',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => '15626ND',                       'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => '18888ND',                       'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M10257',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M13082ND',                      'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M15626',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M17627',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M24607',                        'type' => 'application'],
                    ['brand' => '19000509А','value' => 'CJI309GGG+',                   'type' => 'application'],
                    ['brand' => 'FKL',      'value' => 'LEFG 209 TDT',                 'type' => 'application'],
                ],
                'name_uk' => 'BUQ 309-2T3H',
                'name_en' => 'BUQ 309-2T3H',
                'name_pl' => 'BUQ 309-2T3H',
                'desc_uk'       => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори серії 309 для прикочувальних котків з внутрішнім діаметром d = 45 мм. Кріпильна база J = 105 мм, довжина корпусу L = 137 мм, ширина внутрішнього кільця B = 51.1 мм, Cdyn = 59.6 кН, Co = 80.8 кН, Pu = 2.503 кН. Посилена герметизація — трикромкове ущільнення в парі з двокромковим з кожної сторони — забезпечує ресурс у вузлах з ударними навантаженнями та абразивним середовищем. Пряма заміна FKL LSQFR 309 2TB.H.T та вузла CJI 309 GGG+19000509; використовується у прикочувальних котках Farmet (арт. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                'meta_title_uk' => 'VELNOX BUQ 309-2T3H — вузол котка d45, Farmet M14581 LEFG 209 TDT',
                'meta_desc_uk'  => 'Фланцевий вузол VELNOX BUQ 309-2T3H, d=45 мм, Cdyn 59.6 кН. Пряма заміна Farmet M14581, 4000412, FKL LEFG 209 TDT. Для котків.',
                'desc_en'       => 'Square flange bearing unit with 4 mounting holes, 309 series, for press wheels, bore diameter d = 45 mm. Mounting base J = 105 mm, housing length L = 137 mm, inner ring width B = 51.1 mm, Cdyn = 59.6 kN, Co = 80.8 kN, Pu = 2.503 kN. Reinforced sealing — triple-lip seal paired with a double-lip seal on each side — ensures service life in assemblies subject to impact loads and abrasive environments. Direct replacement for FKL LSQFR 309 2TB.H.T and the CJI 309 GGG+19000509 assembly; used in Farmet press wheels (part no. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                'meta_title_en' => 'VELNOX BUQ 309-2T3H — press wheel unit d45, Farmet M14581 LEFG 209 TDT',
                'meta_desc_en'  => 'Flange bearing unit VELNOX BUQ 309-2T3H, d=45 mm, Cdyn 59.6 kN. Direct replacement for Farmet M14581, 4000412, FKL LEFG 209 TDT. For press wheels.',
                'desc_pl'       => 'Kwadratowy kołnierzowy węzeł łożyskowy na 4 otwory montażowe, seria 309, do rolek dogniatających, średnica wewnętrzna d = 45 mm. Baza montażowa J = 105 mm, długość obudowy L = 137 mm, szerokość pierścienia wewnętrznego B = 51,1 mm, Cdyn = 59,6 kN, Co = 80,8 kN, Pu = 2,503 kN. Wzmocnione uszczelnienie — trójkrawędziowy uszczelniacz w parze z dwukrawędziowym po każdej stronie — zapewnia żywotność w węzłach narażonych na obciążenia udarowe i środowisko ścierne. Bezpośredni zamiennik FKL LSQFR 309 2TB.H.T i węzła CJI 309 GGG+19000509; stosowany w rolkach dogniatających Farmet (nr art. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                'meta_title_pl' => 'VELNOX BUQ 309-2T3H — węzeł rolki d45, Farmet M14581 LEFG 209 TDT',
                'meta_desc_pl'  => 'Kołnierzowy węzeł łożyskowy VELNOX BUQ 309-2T3H, d=45 mm, Cdyn 59,6 kN. Bezpośredni zamiennik Farmet M14581, 4000412, FKL LEFG 209 TDT. Do rolek dogniatających.',
            ],
        ];

        foreach ($t3Products as $p) {
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
                DB::table('product_cross_refs')->insert(['product_id' => $productId, 'brand' => $ref['brand'], 'value' => $ref['value'], 'type' => $ref['type']]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }

            // 3D model asset (file exists: public/models/BUQ-309-2T3H.glb)
            if ($p['slug'] === 'buq-309-2t3h') {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                    ['path' => '/velnox/models/BUQ-309-2T3H.glb', 'sort_order' => 0]
                );
            }
        }

        // =========================================================
        // 10. SPEC DEFINITIONS — new for bearings-t4
        // =========================================================
        $newSpecs = [
            ['key' => 'd1_mm',  'svg_label' => 'd1', 'sort_order' => 33],
            ['key' => 'J1_mm',  'svg_label' => 'J1', 'sort_order' => 34],
            ['key' => 'J2_mm',  'svg_label' => 'J2', 'sort_order' => 35],
            ['key' => 'A3_mm',  'svg_label' => 'A3', 'sort_order' => 36],
            ['key' => 'T_size', 'svg_label' => null,  'sort_order' => 37],
            ['key' => 'H_mm',   'svg_label' => 'H',  'sort_order' => 38],
        ];
        foreach ($newSpecs as $spec) {
            DB::table('spec_definitions')->updateOrInsert(['key' => $spec['key']], $spec);
        }

        // =========================================================
        // 11. SPEC TRANSLATIONS — new + update L1_mm / L2_mm
        // =========================================================
        $t4SpecTranslations = [
            'd1_mm' => [
                'uk' => ['label' => 'Діаметр центрування d1 (мм)',           'unit' => 'мм'],
                'en' => ['label' => 'Centering diameter d1 (mm)',             'unit' => 'mm'],
                'pl' => ['label' => 'Średnica centrowania d1 (mm)',           'unit' => 'mm'],
            ],
            'J1_mm' => [
                'uk' => ['label' => 'Відстань між отворами J1 (мм)',          'unit' => 'мм'],
                'en' => ['label' => 'Distance between holes J1 (mm)',         'unit' => 'mm'],
                'pl' => ['label' => 'Rozstaw otworów J1 (mm)',                'unit' => 'mm'],
            ],
            'J2_mm' => [
                'uk' => ['label' => 'Відстань між отворами J2 (мм)',          'unit' => 'мм'],
                'en' => ['label' => 'Distance between holes J2 (mm)',         'unit' => 'mm'],
                'pl' => ['label' => 'Rozstaw otworów J2 (mm)',                'unit' => 'mm'],
            ],
            'A3_mm' => [
                'uk' => ['label' => 'Висота діаметру центрування A3 (мм)',    'unit' => 'мм'],
                'en' => ['label' => 'Centering diameter height A3 (mm)',      'unit' => 'mm'],
                'pl' => ['label' => 'Wysokość średnicy centrowania A3 (mm)',  'unit' => 'mm'],
            ],
            'T_size' => [
                'uk' => ['label' => 'Розмір різьби T',                        'unit' => ''],
                'en' => ['label' => 'Threaded hole size T',                   'unit' => ''],
                'pl' => ['label' => 'Rozmiar gwintu T',                       'unit' => ''],
            ],
            'H_mm' => [
                'uk' => ['label' => 'Отвір H (мм)',                           'unit' => 'мм'],
                'en' => ['label' => 'Hole diameter H (mm)',                   'unit' => 'mm'],
                'pl' => ['label' => 'Średnica otworu H (mm)',                 'unit' => 'mm'],
            ],
            // Update existing L1_mm / L2_mm to correct labels for T4
            'L1_mm' => [
                'uk' => ['label' => 'Загальна ширина корпусу L1 (мм)',        'unit' => 'мм'],
                'en' => ['label' => 'Housing overall width L1 (mm)',          'unit' => 'mm'],
                'pl' => ['label' => 'Całkowita szerokość obudowy L1 (mm)',    'unit' => 'mm'],
            ],
            'L2_mm' => [
                'uk' => ['label' => 'Загальна ширина корпусу L2 (мм)',        'unit' => 'мм'],
                'en' => ['label' => 'Housing overall width L2 (mm)',          'unit' => 'mm'],
                'pl' => ['label' => 'Całkowita szerokość obudowy L2 (mm)',    'unit' => 'mm'],
            ],
        ];

        foreach ($t4SpecTranslations as $key => $locales) {
            $sid = $specId($key);
            if (!$sid) continue;
            foreach ($locales as $locale => $fields) {
                foreach ($fields as $field => $value) {
                    DB::table('translations')->updateOrInsert(
                        ['entity_type' => 'spec_definitions', 'entity_id' => $sid, 'locale' => $locale, 'field' => $field],
                        ['value' => $value]
                    );
                }
            }
        }

        // =========================================================
        // 12. PRODUCT TABLE: bearings-t4 (BUCR-SG-309-S2)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'bearings-t4'],
            [
                'slug'             => 'bearings-t4',
                'category_id'      => $bearingsCatId,
                'spec_columns'     => json_encode(['d_mm','d1_mm','L1_mm','J1_mm','L2_mm','J2_mm','A_mm','A1_mm','A2_mm','A3_mm','T_size','H_mm','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode(new \stdClass()),
                'schema_viewbox'   => null,
                'sort_order'       => 4,
            ]
        );
        $t4 = $tableId('bearings-t4');

        foreach (['uk' => 'BUCR-SG-309-S2 — Таблиця 4', 'en' => 'BUCR-SG-309-S2 — Table 4', 'pl' => 'BUCR-SG-309-S2 — Tabela 4'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t4, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2.webp',          'sort_order' => 1],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-drawing-1.webp', 'sort_order' => 2],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-drawing-2.webp', 'sort_order' => 3],
            ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-schema.webp',   'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t4/schema.svg',                           'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t4, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 13. PRODUCTS — bearings-t4
        // =========================================================
        $t4Products = [
            [
                'slug'    => 'bucr-sg-309-s2',
                'article' => 'BUCR-SG-309-S2',
                'specs'   => [
                    'd_mm'    => '45',
                    'd1_mm'   => '74',
                    'L1_mm'   => '152',
                    'J1_mm'   => '120',
                    'L2_mm'   => '150',
                    'J2_mm'   => '120',
                    'A_mm'    => '66.9',
                    'A1_mm'   => '18',
                    'A2_mm'   => '12',
                    'A3_mm'   => '7',
                    'T_size'  => '4хM12x1.25',
                    'H_mm'    => '4x12.3',
                    'mass_kg' => '5.6',
                    'cdyn_kn' => '52.7',
                    'co_kn'   => '31.5',
                    'pu_kn'   => '1.32',
                ],
                'cross_refs' => [
                    ['brand' => 'CT-AGRI', 'value' => 'M43400468',                        'type' => 'bearing'],
                    ['brand' => '',         'value' => 'M43400468 H.60 S.PAR',             'type' => 'bearing'],
                    ['brand' => 'Ri.Ma',    'value' => 'M43400468 Bearing unit PN 0102',   'type' => 'bearing'],
                    ['brand' => 'FKL',      'value' => 'ZGKU 309 2S',                      'type' => 'bearing'],
                    ['brand' => 'RBF',      'value' => 'PN00102',                          'type' => 'bearing'],
                    ['brand' => 'GASPARDO', 'value' => '17014180',                         'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M23400435 — Bearing housing section', 'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M23400436 — Bearing housing section', 'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400413',                        'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400468',                        'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400468R',                       'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'R17015300',                        'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400468 Bearing Unit',           'type' => 'application'],
                ],
                'name_uk' => 'BUCR-SG-309-S2',
                'name_en' => 'BUCR-SG-309-S2',
                'name_pl' => 'BUCR-SG-309-S2',
            ],
        ];

        foreach ($t4Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $t4]
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
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }

            // 3D model asset (file exists: public/models/BUCR-SG-309-S2.glb)
            if ($p['slug'] === 'bucr-sg-309-s2') {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                    ['path' => '/velnox/models/BUCR-SG-309-S2.glb', 'sort_order' => 0]
                );
            }
        }

    }
}
