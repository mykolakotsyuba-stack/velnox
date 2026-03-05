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
