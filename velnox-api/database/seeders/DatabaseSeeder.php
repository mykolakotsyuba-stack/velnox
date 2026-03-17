<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\NewsArticle;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ===== КАТЕГОРІЇ (з ТЗ) =====
        $categories = [
            ['slug' => 'bearings',  'name_en' => 'Bearing Units',                    'name_uk' => 'Підшипникові вузли',             'name_pl' => 'Węzły łożyskowe',              'sort_order' => 1],
            ['slug' => 'hubs',      'name_en' => 'Bearing Hubs',                     'name_uk' => 'Підшипникові ступиці',           'name_pl' => 'Piasty łożyskowe',             'sort_order' => 2],
            ['slug' => 'agro',      'name_en' => 'Special Agro Bearings',            'name_uk' => 'Агро-підшипники',                'name_pl' => 'Łożyska agro',                 'sort_order' => 3],
            ['slug' => 'kit',       'name_en' => 'Assembly KIT Solutions',           'name_uk' => 'Збірні KIT-рішення',             'name_pl' => 'Zestawy montażowe KIT',        'sort_order' => 4],
            ['slug' => 'custom',    'name_en' => 'Custom OEM Solutions',             'name_uk' => 'Кастомні OEM-рішення',           'name_pl' => 'Rozwiązania OEM na zamówienie','sort_order' => 5],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], array_merge($cat, ['is_active' => true]));
        }

        // ===== ДЕМO-ТОВАР (ступиця 28071300 VX з ТЗ) =====
        $hubCategory = Category::where('slug', 'hubs')->first();

        Product::updateOrCreate(
            ['slug' => '28071300-VX'],
            [
                'article'         => '28071300 VX',
                'fkl_designation' => 'PL-127',
                'category_id'     => $hubCategory->id,
                'specs' => [
                    'd'     => 55.7,
                    'D'     => 127.3,
                    'B'     => null,
                    'C'     => null,
                    'alpha' => null,
                    'mass'  => null,
                    'Cdyn'  => 48.8,
                    'Co'    => null,
                    'Pu'    => null,
                ],
                'oem_cross'    => ['28085600', 'PN60041'],
                'installations'=> ['HORSCH Focus', 'HORSCH Joker', 'HORSCH Terrano'],
                'translations' => [
                    'uk' => [
                        'product_name' => 'Ступиця ріжучого вузла',
                        'sealing_desc' => 'Пластикова кришка та ущільнення RS з базової сторони. Захисний блок від бруду DIRTBLOCK SEAL та кована кришка FORGED COVER PLATE з робочої сторони.',
                    ],
                    'en' => [
                        'product_name' => 'Disc Harrow Hub',
                        'sealing_desc' => 'Plastic cover and RS seal on the base side. DIRTBLOCK SEAL and FORGED COVER PLATE on the working side.',
                    ],
                    'pl' => [
                        'product_name' => 'Piasta brony talerzowej',
                        'sealing_desc' => 'Plastikowa osłona i uszczelka RS po stronie podstawy. DIRTBLOCK SEAL i FORGED COVER PLATE po stronie roboczej.',
                    ],
                ],
                'is_active' => true,
            ]
        );

        $bearingsCategory = Category::where('slug', 'bearings')->first();
        
        Product::updateOrCreate(
            ['slug' => 'lefg-206'],
            [
                'article'         => 'LEFG 206',
                'category_id'     => $bearingsCategory->id,
                'specs' => [
                    'd_mm'     => 30,
                    'j_mm'     => 82.5,
                    'width_mm' => 38,
                    'holes'    => 4,
                    'l_mm'     => 108,
                    'Cdyn'     => 19.5,
                ],
                'oem_cross'    => ['SKF FYJ 30 TF'],
                'installations'=> [],
                'translations' => [],
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'lefg-208-tdt'],
            [
                'article'         => 'LEFG 208 TDT',
                'category_id'     => $bearingsCategory->id,
                'specs' => [
                    'd_mm'     => 40,
                    'j_mm'     => 101.5,
                    'width_mm' => 42.9,
                    'holes'    => 4,
                    'l_mm'     => 130,
                    'Cdyn'     => 30.7,
                ],
                'oem_cross'    => ['SKF FYJ 40 TF', 'INA PCJT40'],
                'installations'=> ['Дискові борони HORSCH'],
                'translations' => [],
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
        ['slug' => 'buq-206-104-2x3h'],
        [
            'article'         => 'BUQ 206-104-2X3H',
            'fkl_designation' => 'LEFG 206-104 TDT',
            'category_id'     => $bearingsCategory->id,
            'specs' => [
                'd_mm'   => 31.75,
                'J'      => 83.0,
                'A'      => 40.2,
                'A1'     => 31.0,
                'A2'     => 13.0,
                'L'      => 108.0,
                'N'      => 16.0,
                'Cdyn'   => 19.5,
                'Co'     => 11.3,
                'Pu'     => 0.475,
                'kg'     => 1.1,
            ],
            'oem_cross'    => ["EXF206-20", "UCF206-20"],
            'installations'=> [
                'Універсальне рішення',
                'Сільськогосподарські механізми (сівалки, культиватори)',
                'Промислові конвеєри'
            ],
            'translations' => [
                'en' => [
                    'product_name'   => 'Flanged Bearing Unit VELNOX',
                    'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                    'sealing_desc'   => '3-lip seal on the base side and double 3-lip seal on the front side which is exposed to contaminants. The double 3-lip seal on the front side protects the bearing from contaminant penetration. Also, the outer seal with 3 lips, with additional sealing, protects the inner seal from mechanical damage.',
                ],
                'uk' => [
                    'product_name'   => 'Фланцевий підшипниковий вузол VELNOX',
                    'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                    'sealing_desc'   => 'Надійність роботи вузла в екстремальних умовах забезпечується спеціально спроектованою системою багатокромкових ущільнень. З базової сторони встановлено стандартне 3-кромкове ущільнення (T SEAL). З фронтальної сторони, яка безпосередньо піддається впливу агресивного середовища та забруднень, встановлено подвійне 3-кромкове ущільнення (DOUBLE T SEAL). Це рішення гарантує максимальний захист від проникнення бруду. Крім того, зовнішній контур 3-кромкового ущільнення бере на себе додаткову функцію — він захищає внутрішнє ущільнення від прямих механічних пошкоджень під час роботи техніки.',
                ],
                'pl' => [
                    'product_name'   => 'Kołnierzowy zespół łożyskowy VELNOX',
                    'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                    'sealing_desc'   => 'Uszczelnienie 3-wargowe po stronie bazowej oraz podwójne uszczelnienie 3-wargowe po stronie czołowej chronią łożysko przed zabrudzeniami. Zewnętrzne podwójne uszczelnienie chroni uszczelnienie wewnętrzne przed uszkodzeniami mechanicznymi.',
                ]
            ],
            'is_active' => true,
        ]
    );

        // ===== ІМПОРТОВАНІ ТОВАРИ З EXCEL =====
        $extraBearings = [
            ["LEFG 206-104 TDT", "31.75 (1 1/4\")", "83", "A: 40.2 / A1: 31.0 / A2: 13.0", "N: 16 mm", "108"],
            ["LEFG 207 TDT", "35.0", "92", "A: 44.4 / A1: 34.0 / A2: 13.0", "N: 14 mm", "118"],
            ["LEFG 207-104 TDT", "31.75 (1 1/4\")", "92", "A: 44.4 / A1: 34.0 / A2: 13.0", "N: 14 mm", "118"],
            ["LEFG 207-106 TDT", "34.925 (1 3/8\")", "92", "A: 44.4 / A1: 34.0 / A2: 13.0", "N: 14 mm", "118"],
            ["LEFG 209 TDT", "45.0", "105", "A: 52.2 / A1: 38.0 / A2: 16.0", "N: 16 mm", "137"],
            ["LEFG 210 TDT", "50.0", "111", "A: 54.6 / A1: 40.0 / A2: 16.0", "N: 16 mm", "143"],
            ["LEFG 214 TDT", "70.0", "152", "A: 70.7 / A1: 50.3 / A2: 21.3", "N: 19 mm", "193"],
            ["LSGR 207 TBS", "35.0", "100", "A: 40.0 / A1: — / A2: 20.0", "H/T: M12 mm", "— (Круглий фланець)"],
            ["LSQFR 308 2TD.H.T", "40.0", "101.5", "A: 48.4 / A1: 40.6 / A2: 19.0", "H/T: 4x13 mm", "130"],
            ["LSQFR 309-16 2TB.H.T", "45.0", "105", "A: 55.0 / A1: 44.0 / A2: 22.0", "H/T: 16 mm", "137"],
            ["ZGKU 309 2S", "45.0", "120 (J1, J2)", "A: 66.9 / A1: 18.0 / A2: 12.0", "H: 4x12.3 / T: 4xM12x1.25", "152 (L1) / 150 (L2)"]
        ];

        foreach ($extraBearings as $b) {
            Product::updateOrCreate(
                ['slug' => str($b[0])->slug()],
                [
                    'article'     => $b[0],
                    'category_id' => $bearingsCategory->id,
                    'specs' => [
                        'd_mm'     => $b[1],
                        'j_mm'     => $b[2],
                        'width_mm' => $b[3],
                        'holes'    => $b[4],
                        'l_mm'     => $b[5],
                    ],
                    'is_active' => true,
                ]
            );
        }

        // ===== BUQ SERIES — 8 нових продуктів з Нова таблиця 1.xlsx =====
        $buqSealingText = [
            'uk' => 'Надійність роботи вузла в екстремальних умовах забезпечується спеціально спроектованою системою багатокромкових ущільнень. З базової сторони встановлено стандартне 3-кромкове ущільнення (T SEAL). З фронтальної сторони, яка безпосередньо піддається впливу агресивного середовища та забруднень, встановлено подвійне 3-кромкове ущільнення (DOUBLE T SEAL).',
            'en' => '3-lip seal on the base side and double 3-lip seal on the front side which is exposed to contaminants. The double 3-lip seal on the front side protects the bearing from contaminant penetration.',
            'pl' => 'Uszczelnienie 3-wargowe po stronie bazowej oraz podwójne uszczelnienie 3-wargowe po stronie czołowej chronią łożysko przed zabrudzeniami.',
        ];

        $buqProducts = [
            [
                'slug'    => 'buq-207-104-2x3h',
                'article' => 'BUQ 207-104-2X3H',
                'fkl'     => 'LEFG 207-104 TDT',
                'specs'   => [
                    'd_mm'     => '31.75',  'd_inch' => '1 1/4',
                    'A1'       => 31.0,     'A2'     => 13.0,
                    'J'        => 83.0,     'L'      => 108.0,
                    'N'        => 16.0,     'A'      => '40.2',
                    'mass_kg'  => 1.1,      'Cdyn'   => 19.5,
                    'Co'       => 11.3,     'Pu'     => 0.475,
                ],
                'cross'   => ['FYJ1.1/4TF (YEL 207-104 2F + FY507M)', 'EXF207-20', 'UCF207-20'],
                'brand'   => 'SKF / SNR',
            ],
            [
                'slug'    => 'buq-207-106-2x3h',
                'article' => 'BUQ 207-106-2X3H',
                'fkl'     => 'LEFG 207-106 TDT',
                'specs'   => [
                    'd_mm'     => '34.925', 'd_inch' => '1 3/8',
                    'A1'       => 34.0,     'A2'     => 13.0,
                    'J'        => 92.0,     'L'      => 118.0,
                    'N'        => 14.0,     'A'      => '44.4',
                    'mass_kg'  => 1.6,      'Cdyn'   => 25.5,
                    'Co'       => 15.3,     'Pu'     => 0.643,
                ],
                'cross'   => ['FYJ1.3/8TF (YEL 208-106 2F + FY507M)', 'EXF207-22', 'UCF207-22'],
                'brand'   => 'SKF / SNR',
            ],
            [
                'slug'    => 'buq-207-2x3h',
                'article' => 'BUQ 207-2X3H',
                'fkl'     => 'LEFG 207 TDT',
                'specs'   => [
                    'd_mm'     => '35.0',   'd_inch' => null,
                    'A1'       => 34.0,     'A2'     => 13.0,
                    'J'        => 92.0,     'L'      => 118.0,
                    'N'        => 14.0,     'A'      => '44.4',
                    'mass_kg'  => 1.45,     'Cdyn'   => 25.5,
                    'Co'       => 15.3,     'Pu'     => 0.643,
                ],
                'cross'   => ['FYJ40TF (YEL 207 2F + FY507M)', 'EXF207', 'UCF207'],
                'brand'   => 'SKF / SNR',
            ],
            [
                'slug'    => 'buq-208-108-2x3h',
                'article' => 'BUQ 208-108-2X3H',
                'fkl'     => 'LEFG 208-108 TDT',
                'specs'   => [
                    'd_mm'     => '38.1',   'd_inch' => '1 1/2',
                    'A1'       => 36.0,     'A2'     => 14.0,
                    'J'        => 102.0,    'L'      => 130.0,
                    'N'        => '16H13',  'A'      => '51.2',
                    'mass_kg'  => 1.95,     'Cdyn'   => 30.7,
                    'Co'       => 19.0,     'Pu'     => 0.798,
                ],
                'cross'   => ['FYJ 1.1/2 TF (YEL 208-108 2F + FY508M)', 'EXF208-24', 'UCF 208-24'],
                'brand'   => 'SKF / SNR',
            ],
            [
                'slug'    => 'buq-208-2x3h',
                'article' => 'BUQ 208-2X3H',
                'fkl'     => 'LEFG 208 TDT',
                'specs'   => [
                    'd_mm'     => '40.0',   'd_inch' => null,
                    'A1'       => 36.0,     'A2'     => 14.0,
                    'J'        => 102.0,    'L'      => 130.0,
                    'N'        => 16.0,     'A'      => '51.2',
                    'mass_kg'  => 1.95,     'Cdyn'   => 30.7,
                    'Co'       => 19.0,     'Pu'     => 0.798,
                ],
                'cross'   => ['FYJ40TF (YEL 208 2F + FY508M)', 'EXF208', 'UCF208'],
                'brand'   => 'SKF / SNR',
            ],
            [
                'slug'    => 'buq-209-2t3h',
                'article' => 'BUQ-209-2T3H',
                'fkl'     => 'LEFG 209 TDT',
                'specs'   => [
                    'd_mm'     => '45.0',   'd_inch' => null,
                    'A1'       => 38.0,     'A2'     => 16.0,
                    'J'        => 105.0,    'L'      => 137.0,
                    'N'        => 16.0,     'A'      => '52.2',
                    'mass_kg'  => 2.41,     'Cdyn'   => 33.2,
                    'Co'       => 21.9,     'Pu'     => 0.92,
                ],
                'cross'   => ['FYJ 45 TF (YEL 209 2F + FY509M)', 'EXF 209', 'UCF 209'],
                'brand'   => 'SKF / SNR',
            ],
            [
                'slug'    => 'buq-210-2x3h',
                'article' => 'BUQ 210-2X3H',
                'fkl'     => 'LEFG 210 TDT',
                'specs'   => [
                    'd_mm'     => '50.0',   'd_inch' => null,
                    'A1'       => 40.0,     'A2'     => 16.0,
                    'J'        => 111.0,    'L'      => 143.0,
                    'N'        => 16.0,     'A'      => '54.6',
                    'mass_kg'  => 2.78,     'Cdyn'   => 35.1,
                    'Co'       => 23.2,     'Pu'     => 0.974,
                ],
                'cross'   => ['FYJ 50 TF (YEL 210 2F + FY510M)', 'EXF210', 'UCF 210'],
                'brand'   => 'SKF / SNR',
            ],
            [
                'slug'    => 'buq-214-2t3h',
                'article' => 'BUQ-214-2T3H',
                'fkl'     => 'LEFG 214 TDT',
                'specs'   => [
                    'd_mm'     => '70.0',   'd_inch' => null,
                    'A1'       => '50.3',   'A2'     => 21.3,
                    'J'        => 152.0,    'L'      => 193.0,
                    'N'        => 19.0,     'A'      => '70.7',
                    'mass_kg'  => 2.6,      'Cdyn'   => 62.4,
                    'Co'       => 44.0,     'Pu'     => 1.848,
                ],
                'cross'   => ['EXF 214', 'UCF 214'],
                'brand'   => 'SNR',
            ],
        ];

        foreach ($buqProducts as $buq) {
            Product::updateOrCreate(
                ['slug' => $buq['slug']],
                [
                    'article'         => $buq['article'],
                    'fkl_designation' => $buq['fkl'],
                    'category_id'     => $bearingsCategory->id,
                    'specs'           => $buq['specs'],
                    'oem_cross'       => $buq['cross'],
                    'installations'   => [
                        'Сільськогосподарська техніка (сівалки, культиватори)',
                        'Промислові конвеєри та механізми',
                        'Загальне машинобудування',
                    ],
                    'translations'    => [
                        'en' => [
                            'product_name'   => 'Flanged Bearing Unit VELNOX ' . $buq['article'],
                            'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                            'sealing_desc'   => $buqSealingText['en'],
                        ],
                        'uk' => [
                            'product_name'   => 'Фланцевий підшипниковий вузол VELNOX ' . $buq['article'],
                            'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                            'sealing_desc'   => $buqSealingText['uk'],
                        ],
                        'pl' => [
                            'product_name'   => 'Kołnierzowy zespół łożyskowy VELNOX ' . $buq['article'],
                            'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                            'sealing_desc'   => $buqSealingText['pl'],
                        ],
                    ],
                    'is_active' => true,
                ]
            );
        }

        // ===== TABLE 2: PERFORMANCE DATA (Нова таблиця 2) =====
        Product::updateOrCreate(
            ['slug' => 'buq-308-2t3h-ds'],
            [
                'article'         => 'BUQ-308-2T3H-DS',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'performance',
                    'part_number' => 'BUQ-308-2T3H-DS',
                    'bearing_designation' => "CE066\nLSQFR308 TBT.H.T.Zn\nUC 308 X1\nUCF308 A01X1\nW308-40MM-FDT-MF-AP-SP1 (PER.W308RRBP52-F-A)\nW308-40MM-FDT-MF-AP-SP1 Without thread\nW308RRBP52-F-B (BX-PER.W308RRBP52-F)\nXUCF308B01B169",
                    'brand_name' => "SNR\nFKL\nSNR\nSNR\nPEER\nPEER\nPEER\nSNR",
                    'cross_reference' => "957305 AMAZONE\nCE066 AMAZONE\nCE078 AMAZONE\nLSQFR308 TBS.H.T.Zn FKL\nPN00042 RBF Housing\nSL308MR3L Z&S\nUCFE308 A01X1=UC308X1+FE308A01\nUCFE308 A01X1",
                    'bore_diameter_d_mm' => 40.0,
                    'total_housing_width_a1_mm' => 40.6,
                    'housing_flange_thickness_a2_mm' => 19.0,
                    'distance_between_holes_j_mm' => 101.5,
                    'total_length_l_mm' => 130.0,
                    'hole_thread_ht' => 'M12',
                    'overall_width_a_mm' => 51.4,
                    'mass_kg' => 2.5,
                    'dynamic_load_rating_cdyn_kn' => 62.3,
                    'static_load_rating_co_kn' => 45.2,
                    'fatigue_load_limit_pu_kn' => 1.898,
                ],
                'is_active' => true,
            ]
        );

        // ===== TABLE 3: CROSS-REFERENCES (Нова таблиця 3) =====
        Product::updateOrCreate(
            ['slug' => 'buq-309-2t3h'],
            [
                'article'         => 'BUQ 309-2T3H',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'cross-references',
                    'bearing_designation' => "CJI 309 GGG+19000509 (Assy)\nLSQFR 309-2TB.H.T\nLSQFR 309-2TB.H.T",
                    'brand_name' => "CT-AGRI\nFKL\nCT-AGRI",
                    'cross_reference' => "4000412 Farmet\nM14581 Farmet\n15626ND Farmet\n18888ND Farmet\nM10257 Farmet\nM13082ND Farmet\nM15626 Farmet\nM17627 Farmet\nM24607 Farmet\nCJI309GGG+19000509\nLEFG 209 TDT FKL",
                    'bore_diameter_d_mm' => 45.0,
                    'total_length_l_mm' => 137.0,
                    'distance_between_holes_j_mm' => 105.0,
                    'hole_thread_ht_mm' => 14.0,
                    'overall_width_a_mm' => 54.0,
                    'total_housing_width_a1_mm' => 44.0,
                    'housing_flange_thickness_a2_mm' => 22.0,
                    'width_inner_ring_b_mm' => 51.1,
                    'mass_kg' => 3.4,
                    'static_load_rating_co_kn' => 59.6,
                    'dynamic_load_rating_cdyn_kn' => 80.8,
                    'fatigue_load_limit_pu_kn' => 2.503,
                ],
                'oem_cross'       => ['CJI309GGG+19000509', 'LSQFR 309-2TB.H.T', 'LEFG 209 TDT FKL'],
                'is_active' => true,
            ]
        );

        // ===== TABLE 4: ADDITIONAL SPECIFICATIONS (Нова таблиця 4) =====
        Product::updateOrCreate(
            ['slug' => 'bucr-sg-309-s2'],
            [
                'article'         => 'BUCR-SG-309-S2',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'extended-specs',
                    'bearing_designation' => "M43400468\nM43400468 H.60 S.PAR\nM43400468 H.60 S.PAR\nM43400468 Bearing unit\nPN 0102\nZGKU 309 2S\nPN00102",
                    'brand_name' => "CT-AGRI\n-\n-\nRi.Ma\nRBF\nFKL\nRBF",
                    'cross_reference' => "17014180 GASPARDO\nM23400435 Gaspardo - Bearing housing section\nM23400436 Gaspardo - Bearing housing section\nM43400413 Gaspardo\nM43400468 Gaspardo\nM43400468R Gaspardo\nR17015300 Gaspardo\n?43400468 Bearing Unit",
                    'bore_diameter_d_mm' => 45.0,
                    'centering_diameter_d1_mm' => 74.0,
                    'housing_overall_width_l1_mm' => 152.0,
                    'distance_between_holes_j1_mm' => 120.0,
                    'housing_overall_width_l2_mm' => 150.0,
                    'distance_between_holes_j2_mm' => 120.0,
                    'overall_width_a_mm' => 66.9,
                    'flange_width_a1_mm' => 18.0,
                    'flange_width_a2_mm' => 12.0,
                    'centering_diameter_height_a3_mm' => 7.0,
                    'threaded_hole_size_t' => '4xM12x1.25',
                    'hole_diameter_h_mm' => '4x12.3',
                    'mass_kg' => 5.6,
                    'dynamic_load_rating_cdyn_kn' => 52.7,
                    'static_load_rating_co_kn' => 31.5,
                    'fatigue_load_limit_pu_kn' => 1.32,
                ],
                'is_active' => true,
            ]
        );

        // ===== TABLE 5: EXTENDED BEARING DATA (Нова таблиця 5) =====
        Product::updateOrCreate(
            ['slug' => 'bup-207-x3l'],
            [
                'article'         => 'BUP 207-X3L',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'additional-data',
                    'bearing_designation' => "207XTR-R-DFC-A534 (PER.207RRSB-FC-A)\nGH.PN 00032\nLSGR 207-TBS\nLSGR 207-TBS\nLSGR 207-TBS\nPN 00023\nPN 00032",
                    'brand_name' => "PEER\nRBF\nFKL\nCT-AGRI\nNTE (Slovakia)\nRBF\nRBF",
                    'cross_reference' => "31910034 Lemken\n3199372 Lemken\n3421370 Opall Agri\nF232812 - 0200 INA/FAG Bearing\nGGF35A08\nGGME07 - AH07 INA/FAG Housing\nRCJ 35 35x118x39,9 4xM12\nUC 207 X1 SNR Bearing",
                    'bore_diameter_d_mm' => 35.0,
                    'outside_diameter_d_mm' => 125.0,
                    'pitch_circle_diameter_j_mm' => 100.0,
                    'hole_thread_ht' => 'M12',
                    'overall_width_a_mm' => 40.0,
                    'housing_flange_thickness_a2_mm' => 20.0,
                    'width_inner_ring_b_mm' => 28.3,
                    'mass_kg' => 1.7,
                    'static_load_rating_co_kn' => 15.3,
                    'dynamic_load_rating_cdyn_kn' => 25.5,
                    'fatigue_load_limit_pu_kn' => 0.643,
                ],
                'oem_cross'       => ['31910034 Lemken', '3199372 Lemken', '3421370 Opall Agri'],
                'is_active' => true,
            ]
        );

        // ===== HUBS TABLE 1: 28071300 VX (Disk Harrows) =====
        Product::updateOrCreate(
            ['slug' => '28071300-vx-table1'],
            [
                'article'         => '28071300 VX',
                'category_id'     => $hubCategory->id,
                'specs'           => [
                    'table_group' => 'hubs-table1',
                    'part_number' => '28071300 VX',
                    'bearing_designation' => 'HUB',
                    'brand_name' => 'HORSCH',
                    'j_mm' => 106.0,
                    'D_mm' => 127.3,
                    'D1_mm' => 64.2,
                    'd_mm' => 55.7,
                    'C_mm' => 38.0,
                    'hole_thread' => 'M12',
                    'G' => '2xM20',
                    'L_mm' => 106.5,
                    'L1_mm' => 2.0,
                    'F_mm' => 25.0,
                    'mass_kg' => 3.81,
                    'cdyn_kn' => 48.8,
                    'co_kn' => 35.3,
                    'pu_kn' => 1.483,
                ],
                'oem_cross' => ['28071300', '28077800', '28077900', '28085600', 'PN60041'],
                'is_active' => true,
            ]
        );

        // ===== HUBS TABLE 2: BAA-0004 VX (Cutting Nodes) =====
        Product::updateOrCreate(
            ['slug' => 'baa-0004-vx-table2'],
            [
                'article'         => 'BAA-0004 VX',
                'category_id'     => $hubCategory->id,
                'specs'           => [
                    'table_group' => 'hubs-table2',
                    'part_number' => 'BAA-0004 VX',
                    'bearing_designation' => '8395.TDA.5.05.015 / AGHU2898X4E-DSCS / AHU28117A-01 / BAA0004 / F-673270.04.TILL / HUB-30MM',
                    'brand_name' => 'SKF / NSK / FBJ / INA / PEER / FKL / RBF',
                    'j_mm' => 98.0,
                    'D_mm' => 117.0,
                    'hole_thread' => '6xM12x1.25',
                    'd_mm' => 27.95,
                    'C_mm' => 25.4,
                    'M_thread' => 'M22x1.5',
                    'L_mm' => 102.0,
                    'L1_mm' => 60.0,
                    'E_mm' => 17.0,
                    'F_mm' => 25.0,
                    'mass_kg' => 2.16,
                    'cdyn_kn' => 42.9,
                    'co_kn' => 36.3,
                    'pu_kn' => 1.53,
                ],
                'oem_cross' => ['1000042983 Holmer', '642668 Köckerling', 'F06160015 Gaspardo', 'KM040110 BEDNAR', 'M11308 Farmet', 'IL-117-M22 Kuhn'],
                'is_active' => true,
            ]
        );

        // ===== HUBS TABLE 3: PL-140 VX (Seeders) =====
        Product::updateOrCreate(
            ['slug' => 'pl-140-vx-table3'],
            [
                'article'         => 'PL-140 VX',
                'category_id'     => $hubCategory->id,
                'specs'           => [
                    'table_group' => 'hubs-table3',
                    'part_number' => 'PL-140 VX',
                    'bearing_designation' => 'PL-140 / SAH017',
                    'brand_name' => 'FKL / FBJ',
                    'j_mm' => 104.0,
                    'D_mm' => 140.0,
                    'D1_mm' => 62.0,
                    'd_mm' => 30.0,
                    'hole_thread' => 'M12',
                    'L_mm' => 35.0,
                    'B_mm' => 23.8,
                    'mass_kg' => 1.5,
                    'cdyn_kn' => 31.0,
                    'co_kn' => 22.2,
                    'pu_kn' => 0.932,
                ],
                'oem_cross' => ['405814', '418531', '420013', '420832 Vaderstad', 'PL-140'],
                'is_active' => true,
            ]
        );

        // ===== AGRO TABLE 1: Series 1726 Agricultural Bearings =====
        $agroCategory = Category::where('slug', 'agro')->first();
        if ($agroCategory) {
            $agro1 = [
                ['slug' => '1726206-2rs1-vx', 'article' => '1726206-2RS1 VX',
                 'bearing' => "1726206 2RS\n1726206 2RS\n1726206 2RS1\n206 NPPB\nXG206NPPB\n6206 S EE\nCS 206 2RS\nUD 206",
                 'brand' => "TIMKEN\nNSK-RHP\nSKF\nINA\nSNR\nNTE\nFBJ\nZKL",
                 'cross' => "10330 Dominoni\n211156.0 CLAAS\n2152620 Rauch\n81023064 KUHN\n831087M1 AGCO\nJD10386 JD\nYP800030 KUHN",
                 'd' => 30, 'D' => 62, 'B' => 16, 'd1' => 39.7, 'r' => 1.0, 'cdyn' => 19.5, 'co' => 11.2, 'pu' => 0.48, 'mass' => 0.18],
                ['slug' => '1726207-2rs1-vx', 'article' => '1726207-2RS1 VX',
                 'bearing' => "1726207 2RS\n1726207 2RS1\n207 NPPB\nXG207NPPB\n6207 SEE\nCS 207 2RS\nG207-XL-NPPB",
                 'brand' => "TIMKEN\nNSK-RHP\nSKF\nINA\nSNR\nFBJ\nINA",
                 'cross' => "03.2026.00 Capello\n12-058340 Ziegler\n1407629R91 CASE\n4655.1 MONOSEM\n81043576 KUHN\n831822M1 MF\nB96.00264",
                 'd' => 35, 'D' => 72, 'B' => 17, 'd1' => 46.1, 'r' => 1.0, 'cdyn' => 25.5, 'co' => 15.3, 'pu' => 0.66, 'mass' => 0.25],
                ['slug' => '1726208-2rs1-vx', 'article' => '1726208-2RS1 VX',
                 'bearing' => "1726208 2RS\n1726208 2RS1\nXG208NPPB\n6208 S EE\nCS 208 2RS\nG208-XL-NPPB\nUD 208",
                 'brand' => "TIMKEN\nSKF\nSKF\nSNR\nFBJ\nINA\nZKL",
                 'cross' => "025292 Geringhoff\n30161042 Monosem\n4655.1A Monosem\n730004600 LUK\nAZ23315 JD\nF04010184 GASPARDO",
                 'd' => 40, 'D' => 80, 'B' => 18, 'd1' => 52.0, 'r' => 1.1, 'cdyn' => 30.7, 'co' => 19.0, 'pu' => 0.8, 'mass' => 0.32],
                ['slug' => '1726209-2rs1-vx', 'article' => '1726209-2RS1 VX',
                 'bearing' => "1726209 2RS\n1726209 2RS1\n209 NPPB\nXG209NPPB\nCS 209 2RS",
                 'brand' => "TIMKEN\nNSK-RHP\nSKF\nINA\nFBJ",
                 'cross' => "000212102.0 CLAAS\n02.1032.00 CAPELLO\n12-058421 ZIEGLER\n81004584 NH\n831134M1 MF\nZ4009820 KUHN",
                 'd' => 45, 'D' => 85, 'B' => 19, 'd1' => 56.6, 'r' => 1.1, 'cdyn' => 32.5, 'co' => 20.4, 'pu' => 0.92, 'mass' => 0.37],
                ['slug' => '1726210-2rs1-vx', 'article' => '1726210-2RS1 VX',
                 'bearing' => "1726210 2RS\n1726210 2RS1\n210 NPPB\nXG210NPPB\nCS 210 2RS",
                 'brand' => "TIMKEN\nNSK-RHP\nSKF\nINA\nFBJ",
                 'cross' => "11330 Dominoni\n81005000 KUHN\n81005099 KUHN\n1726210 2RS1",
                 'd' => 50, 'D' => 90, 'B' => 20, 'd1' => 62.5, 'r' => 1.1, 'cdyn' => 35.1, 'co' => 23.2, 'pu' => 0.98, 'mass' => 0.41],
                ['slug' => '1726306-2rs1-vx', 'article' => '1726306-2RS1 VX',
                 'bearing' => "1726306 2RS1\nCS306LLU\nCS306DDU\n76306-2RS\n6306SEE\n1726306-2RS\n1726306 2S.T",
                 'brand' => "SKF\nNTN\nNSK\nFAG\nSNR\nRHP\nFKL",
                 'cross' => "580306 ZMZ\n1726306 2RS1",
                 'd' => 30, 'D' => 72, 'B' => 19, 'd1' => 44.6, 'r' => 1.1, 'cdyn' => 28.1, 'co' => 16.0, 'pu' => 0.67, 'mass' => 0.30],
                ['slug' => '1726309-2rs1-vx', 'article' => '1726309-2RS1 VX',
                 'bearing' => "1726309 2RS\n1726309 2RS1\nCS309LLU\nCS309DDU\n76309-2RS\n309NPPB",
                 'brand' => "TIMKEN\nNSK\nSKF\nNTN\nFAG\nIMT\nSNR",
                 'cross' => "F04010225R GASPARDO\n43400468 GASPARDO\n23400434 GASPARDO\n76100409 GASPARDO\n61100438 GASPARDO\nMG43400468 GASPARDO\n1726309 2RS1 ZARAMAK",
                 'd' => 45, 'D' => 100, 'B' => 25, 'd1' => 62.1, 'r' => 1.5, 'cdyn' => 52.7, 'co' => 31.5, 'pu' => 1.34, 'mass' => 0.73],
            ];
            foreach ($agro1 as $item) {
                Product::updateOrCreate(
                    ['slug' => $item['slug']],
                    [
                        'article'     => $item['article'],
                        'category_id' => $agroCategory->id,
                        'specs'       => [
                            'table_group'         => 'agro-table1',
                            'bearing_designation' => $item['bearing'],
                            'brand_name'          => $item['brand'],
                            'cross_reference'     => $item['cross'],
                            'd_mm'  => $item['d'],
                            'D_mm'  => $item['D'],
                            'B_mm'  => $item['B'],
                            'd1_mm' => $item['d1'],
                            'r_mm'  => $item['r'],
                            'cdyn_kn' => $item['cdyn'],
                            'co_kn'   => $item['co'],
                            'pu_kn'   => $item['pu'],
                            'mass_kg' => $item['mass'],
                        ],
                        'is_active' => true,
                    ]
                );
            }
        }

        // ===== ДЕМО-СТАТТЯ =====
        NewsArticle::updateOrCreate(
            ['slug' => 'oem-bearing-selection-guide'],
            [
                'category'     => 'oem-solutions',
                'published_at' => now(),
                'is_active'    => true,
                'translations' => [
                    'en' => [
                        'title'   => 'How to Select Bearing Hubs for Disc Harrows',
                        'excerpt' => 'A technical guide for OEM engineers on correct bearing hub selection based on load parameters.',
                        'body'    => '<p>Full article content...</p>',
                    ],
                    'uk' => [
                        'title'   => 'Як обрати підшипникову ступицю для дискових борін',
                        'excerpt' => 'Технічний довідник для OEM-інженерів по підбору ступиць на основі параметрів навантаження.',
                        'body'    => '<p>Повний текст статті...</p>',
                    ],
                ],
            ]
        );
    }
}
