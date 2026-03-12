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
            ['slug' => 'ce066-performance'],
            [
                'article'         => 'CE066',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'bearing_designation' => 'CE066',
                    'brand_name' => 'SNR / FKL / PEER / SN',
                    'cross_reference' => '957305 AMAZONE, CE066 AMAZONE, CE078 AMAZONE, LSQFR308 TBS.H.T.Zn FKL',
                    'bore_diameter_d_mm' => 40.0,
                    'total_housing_width_a1_mm' => 40.6,
                    'housing_flange_thickness_a2_mm' => 19.0,
                    'distance_between_holes_j_mm' => 101.5,
                    'total_length_l_mm' => 130.0,
                    'hole_thread_ht' => 'M12',
                    'overall_width_a_mm' => 51.4,
                    'mass_kg' => null,
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
                    'bearing_designation' => 'CJI 309 GGG+19000509 (Assy), LSQFR 309-2TB.H.T',
                    'brand_name' => 'CT-AGRI / FKL',
                    'cross_reference' => 'Farmet: 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607',
                    'bore_diameter_d_mm' => 45.0,
                    'total_length_l_mm' => 137.0,
                    'distance_between_holes_j_mm' => 105.0,
                    'hole_thread_ht_mm' => 14.0,
                    'overall_width_a_mm' => 54.0,
                    'total_housing_width_a1_mm' => 44.0,
                    'housing_flange_thickness_a2_mm' => 22.0,
                    'width_inner_ring_b_mm' => 51.1,
                    'mass_kg' => null,
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
                    'bearing_designation' => 'M43400468, M43400468 H.60 S.PAR',
                    'brand_name' => 'CT-AGRI / Ri.Ma / RBF / FKL',
                    'cross_reference' => 'Gaspardo: 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300',
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
                    'mass_kg' => null,
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
                    'bearing_designation' => '207XTR-R-DFC-A534 (PER.207RRSB-FC-A), GH.PN 00032, LSGR 207-TBS',
                    'brand_name' => 'PEER / RBF / FKL / CT-AGRI / NTE (Slovakia)',
                    'cross_reference' => 'Lemken: 31910034, 3199372; Opall Agri: 3421370; INA/FAG: F232812 - 0200, GGF35A08, GGME07 - AH07; SNR: UC 207 X1',
                    'bore_diameter_d_mm' => 35.0,
                    'outside_diameter_d_mm' => 125.0,
                    'pitch_circle_diameter_j_mm' => 100.0,
                    'hole_thread_ht' => 'M12',
                    'overall_width_a_mm' => 40.0,
                    'housing_flange_thickness_a2_mm' => 20.0,
                    'width_inner_ring_b_mm' => null,
                    'mass_kg' => 0.643,
                    'static_load_rating_co_kn' => null,
                    'dynamic_load_rating_cdyn_kn' => null,
                    'fatigue_load_limit_pu_kn' => null,
                ],
                'oem_cross'       => ['31910034 Lemken', '3199372 Lemken', '3421370 Opall Agri'],
                'is_active' => true,
            ]
        );

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
