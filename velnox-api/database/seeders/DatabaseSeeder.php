<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
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
            'schema_key'      => 'buq-2xx-square',
            'category_id'     => $bearingsCategory->id,
            'specs' => [
                'table_group' => 'bearings-t1',
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

        // ===== BUQ SERIES — 8 продуктів =====
        $buqSealingEn = '3-lip seal on the base side and double 3-lip seal on the front side which is exposed to contaminants. The double 3-lip seal on the front side protects the bearing from contaminant penetration.';
        $buqSealingPl = 'Uszczelnienie 3-wargowe po stronie bazowej oraz podwójne uszczelnienie 3-wargowe po stronie czołowej chronią łożysko przed zabrudzeniami.';

        $buqProducts = [
            [
                'slug'         => 'buq-207-104-2x3h',
                'article'      => 'BUQ 207-104-2X3H',
                'fkl'          => 'LEFG 207-104 TDT',
                'specs'        => [
                    'd_mm' => '31.75', 'd_inch' => '1 1/4',
                    'A1' => 31.0, 'A2' => 13.0,
                    'J' => 83.0, 'L' => 108.0,
                    'N' => 16.0, 'A' => '40.2',
                    'mass_kg' => 1.1, 'Cdyn' => 19.5, 'Co' => 11.3, 'Pu' => 0.475,
                ],
                'cross'        => ['FYJ1.1/4TF (YEL 207-104 2F + FY507M)', 'EXF207-20', 'UCF207-20'],
                'installations'=> [
                    'Сільськогосподарська техніка (сівалки, культиватори)',
                    'Ґрунтообробна техніка різних типів',
                    'Промислові конвеєри та механізми',
                ],
                'name_uk'      => 'Квадратний фланцевий підшипниковий вузол VELNOX BUQ 207-104-2X3H',
                'name_en'      => 'Square Flanged Bearing Unit VELNOX BUQ 207-104-2X3H',
                'name_pl'      => 'Kwadratowy kołnierzowy węzeл łożyskowy VELNOX BUQ 207-104-2X3H',
                'desc_uk'      => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог індустріального стандарту UCF 207-20 / SKF FYJ 1.1/4 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 31.75 мм (1 1/4"), монтажна база J = 83 мм, Cdyn = 19.5 кН, Co = 11.3 кН, маса 1.1 кг. Система герметизації — комбінована: трикромкове контактне ущільнення доповнене двокромковим з обох сторін, що блокує проникнення пилу, вологи та абразиву у зону кочення. Виступає прямою геометричною заміною вузлів SKF FYJ 1.1/4 TF (YEL 207-104 2F + FY507M) і SNR EXF207-20 / UCF207-20; застосовується у ґрунтообробній та посівній техніці з дюймовими посадковими розмірами валів.',
                'meta_title'   => 'VELNOX BUQ 207-104-2X3H — фланцевий вузол 1 1/4", SKF FYJ 1.1/4 TF',
                'meta_desc'    => 'Фланцевий вузол VELNOX BUQ 207-104-2X3H, d=31.75 мм (1 1/4"), Cdyn 19.5 кН. Пряма заміна SKF FYJ 1.1/4 TF, SNR UCF207-20. Комбіноване ущільнення.',
            ],
            [
                'slug'         => 'buq-207-106-2x3h',
                'article'      => 'BUQ 207-106-2X3H',
                'fkl'          => 'LEFG 207-106 TDT',
                'specs'        => [
                    'd_mm' => '34.925', 'd_inch' => '1 3/8',
                    'A1' => 34.0, 'A2' => 13.0,
                    'J' => 92.0, 'L' => 118.0,
                    'N' => 14.0, 'A' => '44.4',
                    'mass_kg' => 1.6, 'Cdyn' => 25.5, 'Co' => 15.3, 'Pu' => 0.643,
                ],
                'cross'        => ['FYJ1.3/8TF (YEL 208-106 2F + FY507M)', 'EXF207-22', 'UCF207-22'],
                'installations'=> [
                    'Сільськогосподарська техніка (сівалки, культиватори)',
                    'Промислові конвеєри та механізми',
                    'Загальне машинобудування',
                ],
                'name_uk'      => 'Фланцевий підшипниковий вузол VELNOX BUQ 207-106-2X3H',
                'name_en'      => 'Flanged Bearing Unit VELNOX BUQ 207-106-2X3H',
                'name_pl'      => 'Kołnierzowy węzeл łożyskowy VELNOX BUQ 207-106-2X3H',
                'desc_uk'      => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 207-22 / SKF FYJ 1.3/8 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 34.925 мм (1 3/8"), міжцентрова відстань кріплень J = 92 мм, довжина корпусу L = 118 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.6 кг. Комбінована система захисту VELNOX: трикромкове контактне ущільнення + двокромкове з обох сторін — для роботи в умовах підвищеного запилення та вологості. Повний геометричний аналог SKF FYJ 1.3/8 TF (YEL 207-106 2F + FY507M) і SNR EXF207-22 / UCF207-22; застосовується у ґрунтообробних агрегатах та прикочувальних котках з дюймовою посадкою.',
                'meta_title'   => 'VELNOX BUQ 207-106-2X3H — фланцевий вузол 1 3/8", SKF FYJ 1.3/8 TF',
                'meta_desc'    => 'Фланцевий вузол VELNOX BUQ 207-106-2X3H, d=34.925 мм (1 3/8"), Cdyn 25.5 кН, Co 15.3 кН. Пряма заміна SKF FYJ 1.3/8 TF, SNR UCF207-22. Комбінована система захисту.',
            ],
            [
                'slug'         => 'buq-207-2x3h',
                'article'      => 'BUQ 207-2X3H',
                'fkl'          => 'LEFG 207 TDT',
                'specs'        => [
                    'd_mm' => '35.0', 'd_inch' => null,
                    'A1' => 34.0, 'A2' => 13.0,
                    'J' => 92.0, 'L' => 118.0,
                    'N' => 14.0, 'A' => '44.4',
                    'mass_kg' => 1.45, 'Cdyn' => 25.5, 'Co' => 15.3, 'Pu' => 0.643,
                ],
                'cross'        => ['FYJ35TF (YEL 207 2F + FY507M)', 'NSK UCF207', 'EXF207', 'UCF207'],
                'installations'=> [
                    'Агрегати UNIA',
                    'Техніка ТЕХМАШ та АНИТИМ',
                    'Ґрунтообробна техніка загального призначення',
                ],
                'name_uk'      => 'Класичний квадратний фланцевий підшипниковий вузол VELNOX BUQ 207-2X3H',
                'name_en'      => 'Classic Square Flanged Bearing Unit VELNOX BUQ 207-2X3H',
                'name_pl'      => 'Klasyczny kwadratowy węzeл łożyskowy VELNOX BUQ 207-2X3H',
                'desc_uk'      => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори метричного виконання (аналог UCF 207 / SKF FYJ 40 TF) з внутрішнім діаметром d = 35 мм. Монтажна база J = 92 мм, загальна ширина A = 44.4 мм, довжина L = 118 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.45 кг. Захист підшипника забезпечує комбінована система ущільнень VELNOX: трикромкове контактне + двокромкове з обох сторін для агресивних польових умов. Пряма заміна SKF FYJ 40 TF (YEL 207 2F + FY507M) і SNR EXF207 / UCF207 у вузлах дискових борін, культиваторів та прикочувальних котків.',
                'meta_title'   => 'VELNOX BUQ 207-2X3H — фланцевий вузол d35, аналог SKF FYJ 40 TF',
                'meta_desc'    => 'Квадратний фланцевий вузол VELNOX BUQ 207-2X3H, d=35 мм, Cdyn 25.5 кН. 100% аналог SKF FYJ 40 TF, SNR UCF207. Трикромкове + двокромкове ущільнення.',
            ],
            [
                'slug'         => 'buq-208-108-2x3h',
                'article'      => 'BUQ 208-108-2X3H',
                'fkl'          => 'LEFG 208-108 TDT',
                'specs'        => [
                    'd_mm' => '38.1', 'd_inch' => '1 1/2',
                    'A1' => 36.0, 'A2' => 14.0,
                    'J' => 102.0, 'L' => 130.0,
                    'N' => '16H13', 'A' => '51.2',
                    'mass_kg' => 1.95, 'Cdyn' => 30.7, 'Co' => 19.0, 'Pu' => 0.798,
                ],
                'cross'        => ['FYJ 1.1/2 TF (YEL 208-108 2F + FY508M)', 'EXF208-24', 'UCF 208-24'],
                'installations'=> [
                    'Сільськогосподарська техніка (сівалки, культиватори)',
                    'Універсальні вузли сільгосптехніки',
                    'Промислові механізми',
                ],
                'name_uk'      => 'Квадратний фланцевий підшипниковий вузол VELNOX BUQ 208-108-2X3H',
                'name_en'      => 'Square Flanged Bearing Unit VELNOX BUQ 208-108-2X3H',
                'name_pl'      => 'Kwadratowy kołnierzowy węзел łożyskowy VELNOX BUQ 208-108-2X3H',
                'desc_uk'      => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 208-24 / SKF FYJ 1.1/2 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 38.1 мм (1 1/2"), монтажна база J = 102 мм, довжина корпусу L = 130 мм, Cdyn = 30.7 кН, Co = 19.0 кН, маса 1.95 кг. Комбіноване ущільнення VELNOX — трикромкове контактне + двокромкове з обох сторін підшипника — забезпечує стабільну роботу у вузлах з прямим контактом ґрунту. Пряма заміна SKF FYJ 1.1/2 TF (YEL 208-108 2F + FY508M) і SNR EXF208-24 / UCF 208-24 у сільгосптехніці з дюймовим валом.',
                'meta_title'   => 'VELNOX BUQ 208-108-2X3H — вузол 1 1/2", SKF FYJ 1.1/2 TF',
                'meta_desc'    => 'Фланцевий вузол VELNOX BUQ 208-108-2X3H, d=38.1 мм (1 1/2"), Cdyn 30.7 кН, Co 19 кН. Пряма заміна SKF FYJ 1.1/2 TF, SNR UCF 208-24. Комбіноване ущільнення.',
            ],
            [
                'slug'         => 'buq-208-2x3h',
                'article'      => 'BUQ 208-2X3H',
                'fkl'          => 'LEFG 208 TDT',
                'specs'        => [
                    'd_mm' => '40.0', 'd_inch' => null,
                    'A1' => 36.0, 'A2' => 14.0,
                    'J' => 102.0, 'L' => 130.0,
                    'N' => 16.0, 'A' => '51.2',
                    'mass_kg' => 1.95, 'Cdyn' => 30.7, 'Co' => 19.0, 'Pu' => 0.798,
                ],
                'cross'        => ['FYJ40TF (YEL 208 2F + FY508M)', 'NSK UCF208', 'EXF208', 'UCF208'],
                'installations'=> [
                    'Дискові борони та культиватори',
                    'Техніка BURY та VELES',
                    'Ґрунтообробна техніка загального призначення',
                ],
                'name_uk'      => 'Квадратний фланцевий підшипниковий вузол VELNOX BUQ 208-2X3H',
                'name_en'      => 'Square Flanged Bearing Unit VELNOX BUQ 208-2X3H',
                'name_pl'      => 'Kwadratowy kołnierzowy węзел łożyskowy VELNOX BUQ 208-2X3H',
                'desc_uk'      => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори метричного ряду (аналог UCF 208 / SKF FYJ 40 TF) з внутрішнім діаметром d = 40 мм. Монтажна база J = 102 мм, габаритна довжина L = 130 мм, Cdyn = 30.7 кН, Co = 19.0 кН, маса 1.95 кг. Комбінована система герметизації: трикромкове контактне ущільнення та додаткове двокромкове з кожної з сторін підшипника для блокування пилу, вологи та абразиву. Повний геометричний аналог SKF FYJ 40 TF (YEL 208 2F + FY508M) і SNR EXF208 / UCF208; застосовується у боронах, культиваторах та прикочувальних котках європейської сільгосптехніки.',
                'meta_title'   => 'VELNOX BUQ 208-2X3H — фланцевий вузол d40, UCF208 SKF FYJ 40 TF',
                'meta_desc'    => 'Квадратний фланцевий вузол VELNOX BUQ 208-2X3H, d=40 мм, Cdyn 30.7 кН, Co 19 кН. Пряма заміна SKF FYJ 40 TF, SNR UCF208. Комбіноване ущільнення.',
            ],
            [
                'slug'         => 'buq-209-2t3h',
                'article'      => 'BUQ-209-2T3H',
                'fkl'          => 'LEFG 209 TDT',
                'specs'        => [
                    'd_mm' => '45.0', 'd_inch' => null,
                    'A1' => 38.0, 'A2' => 16.0,
                    'J' => 105.0, 'L' => 137.0,
                    'N' => 16.0, 'A' => '52.2',
                    'mass_kg' => 2.41, 'Cdyn' => 33.2, 'Co' => 21.9, 'Pu' => 0.92,
                ],
                'cross'        => ['FYJ45TF (YEL 209 2F + FY509M)', 'NSK UCF209', 'EXF 209', 'UCF 209'],
                'installations'=> [
                    'Культиватори та комбіновані агрегати',
                    'Техніка АМКОДОР',
                    'Промислові механізми',
                ],
                'name_uk'      => 'Фланцевий квадратний підшипниковий вузол VELNOX BUQ-209-2T3H',
                'name_en'      => 'Square Flanged Bearing Unit VELNOX BUQ-209-2T3H',
                'name_pl'      => 'Kwadratowy kołnierzowy węзел łożyskowy VELNOX BUQ-209-2T3H',
                'desc_uk'      => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 209 / SKF FYJ 45 TF) з внутрішнім діаметром d = 45 мм. Монтажна база J = 105 мм, габаритна довжина L = 137 мм, Cdyn = 33.2 кН, Co = 21.9 кН, маса 2.41 кг. Захист забезпечує комбінована система ущільнень VELNOX: трикромкове контактне у поєднанні з двокромковим з кожної з сторін підшипника — рішення для вузлів, що працюють у ґрунті та при ударних навантаженнях. Пряма заміна SKF FYJ 45 TF (YEL 209 2F + FY509M) і SNR EXF 209 / UCF 209 у культиваторах, боронах і прикочувальних котках.',
                'meta_title'   => 'VELNOX BUQ-209-2T3H — фланцевий вузол d45, аналог SKF FYJ 45 TF',
                'meta_desc'    => 'Фланцевий вузол VELNOX BUQ-209-2T3H, d=45 мм, Cdyn 33.2 кН, Co 21.9 кН. Пряма заміна SKF FYJ 45 TF, SNR UCF 209. Комбінована система ущільнень.',
            ],
            [
                'slug'         => 'buq-210-2x3h',
                'article'      => 'BUQ 210-2X3H',
                'fkl'          => 'LEFG 210 TDT',
                'specs'        => [
                    'd_mm' => '50.0', 'd_inch' => null,
                    'A1' => 40.0, 'A2' => 16.0,
                    'J' => 111.0, 'L' => 143.0,
                    'N' => 16.0, 'A' => '54.6',
                    'mass_kg' => 2.78, 'Cdyn' => 35.1, 'Co' => 23.2, 'Pu' => 0.974,
                ],
                'cross'        => ['FYJ50TF (YEL 210 2F + FY510M)', 'FAG UCF210', 'EXF210', 'UCF 210'],
                'installations'=> [
                    'Агрегати UNIA ARES',
                    'Техніка OPALL-AGRI та DIAS',
                    'Ґрунтообробна техніка загального призначення',
                ],
                'name_uk'      => 'Фланцевий підшипниковий вузол VELNOX BUQ 210-2X3H',
                'name_en'      => 'Flanged Bearing Unit VELNOX BUQ 210-2X3H',
                'name_pl'      => 'Kołnierzowy węзел łożyskowy VELNOX BUQ 210-2X3H',
                'desc_uk'      => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 210 / SKF FYJ 50 TF) з внутрішнім діаметром d = 50 мм. Монтажна база J = 111 мм, довжина корпусу L = 143 мм, Cdyn = 35.1 кН, Co = 23.2 кН, маса 2.78 кг. Комбінована система захисту (трикромкове контактне + двокромкове ущільнення) дозволяє експлуатувати вузол у польових умовах з підвищеним запиленням та присутністю вологи. Пряма заміна SKF FYJ 50 TF (YEL 210 2F + FY510M) і SNR EXF210 / UCF 210; застосовується у важких ґрунтообробних агрегатах, прикочувальних котках та конвеєрних вузлах.',
                'meta_title'   => 'VELNOX BUQ 210-2X3H — фланцевий вузол d50, SKF FYJ 50 TF UCF210',
                'meta_desc'    => 'Фланцевий вузол VELNOX BUQ 210-2X3H, d=50 мм, Cdyn 35.1 кН, Co 23.2 кН. Пряма заміна SKF FYJ 50 TF, SNR UCF 210. Комбінована система захисту.',
            ],
            [
                'slug'         => 'buq-214-2t3h',
                'article'      => 'BUQ-214-2T3H',
                'fkl'          => 'LEFG 214 TDT',
                'specs'        => [
                    'd_mm' => '70.0', 'd_inch' => null,
                    'A1' => '50.3', 'A2' => 21.3,
                    'J' => 152.0, 'L' => 193.0,
                    'N' => 19.0, 'A' => '70.7',
                    'mass_kg' => 2.6, 'Cdyn' => 62.4, 'Co' => 44.0, 'Pu' => 1.848,
                ],
                'cross'        => ['EXF 214', 'UCF 214'],
                'installations'=> [
                    'Важка ґрунтообробна техніка',
                    'Техніка VOMER HISPANIA та ESTRUCTURAS CLEYSER',
                    'Промислові механізми з підвищеними навантаженнями',
                ],
                'name_uk'      => 'Масивний квадратний підшипниковий вузол VELNOX BUQ-214-2T3H',
                'name_en'      => 'Heavy-Duty Square Flanged Bearing Unit VELNOX BUQ-214-2T3H',
                'name_pl'      => 'Ciężki kwadratowy węzeл łożyskowy VELNOX BUQ-214-2T3H',
                'desc_uk'      => 'Посилений квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 214) з внутрішнім діаметром d = 70 мм — для важких радіальних навантажений. Монтажна база J = 152 мм, довжина корпусу L = 193 мм, Cdyn = 62.4 кН, Co = 44.0 кН, Pu = 1.848 кН, маса 2.6 кг. Комбінована система ущільнень VELNOX: трикромкове контактне + двокромкове для роботи в абразивному та вологому середовищі. Пряма заміна SNR EXF 214 / UCF 214; застосовується у важких дискових боронах, глибокорозпушувачах та промислових транспортерах з високими радіальними навантаженнями.',
                'meta_title'   => 'VELNOX BUQ-214-2T3H — посилений фланцевий вузол d70, UCF 214',
                'meta_desc'    => 'Посилений фланцевий вузол VELNOX BUQ-214-2T3H, d=70 мм, Cdyn 62.4 кН, Co 44 кН. Пряма заміна SNR UCF 214. Для важких борін та розпушувачів.',
            ],
        ];

        foreach ($buqProducts as $buq) {
            Product::updateOrCreate(
                ['slug' => $buq['slug']],
                [
                    'article'         => $buq['article'],
                    'fkl_designation' => $buq['fkl'],
                    'schema_key'      => 'buq-2xx-square',
                    'category_id'     => $bearingsCategory->id,
                    'specs'           => array_merge(['table_group' => 'bearings-t1'], $buq['specs']),
                    'oem_cross'       => $buq['cross'],
                    'installations'   => $buq['installations'],
                    'translations'    => [
                        'en' => [
                            'product_name'   => $buq['name_en'],
                            'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                            'sealing_desc'   => $buqSealingEn,
                        ],
                        'uk' => [
                            'product_name'   => $buq['name_uk'],
                            'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                            'sealing_desc'   => $buq['desc_uk'],
                            'meta_title'     => $buq['meta_title'] ?? null,
                            'meta_desc'      => $buq['meta_desc'] ?? null,
                        ],
                        'pl' => [
                            'product_name'   => $buq['name_pl'],
                            'sealing_config' => 'DOUBLE T SEAL / T SEAL',
                            'sealing_desc'   => $buqSealingPl,
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
                'schema_key'      => 'buq-308',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'bearings-t2',
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
                'oem_cross' => [
                    '957305 AMAZONE',
                    'CE066 AMAZONE',
                    'CE078 AMAZONE',
                    'LSQFR308 TBS.H.T.Zn FKL',
                    'PN00042 RBF Housing',
                    'SL308MR3L Z&S',
                    'UCFE308 A01X1=UC308X1+FE308A01',
                    'UCFE308 A01X1',
                ],
                'is_active' => true,
                'translations' => [
                    'uk' => [
                        'sealing_desc' => 'Посилений квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори для прикочувальних котків (аналог UCF 308 / UC 308 X1) з внутрішнім діаметром d = 40 мм. Кріпильна база J = 101.5 мм, довжина корпусу L = 130 мм, різьблення H/T = M12, Cdyn = 62.3 кН, Co = 45.2 кН, Pu = 1.898 кН, маса 2.5 кг. Посилена комбінована система ущільнень (індекс -DS) забезпечує герметичний захист зони кочення від ґрунтового пилу, вологи та абразиву в умовах постійного контакту з ґрунтом. Пряма заміна SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 та SNR UCF308 A01X1; застосовується у прикочувальних котках AMAZONE (арт. 957305, CE066, CE078) та інших європейських ґрунтообробних агрегатів.',
                        'meta_title'   => 'VELNOX BUQ-308-2T3H-DS — вузол котка d40, AMAZONE CE066',
                        'meta_desc'    => 'Підшипниковий вузол VELNOX BUQ-308-2T3H-DS (d=40 мм, Cdyn 62.3 кН) для котків. Пряма заміна AMAZONE CE066, 957305, SNR UC 308 X1.',
                    ],
                    'en' => [
                        'product_name'   => 'Reinforced Flanged Bearing Unit VELNOX BUQ-308-2T3H-DS',
                        'sealing_desc' => 'Reinforced square flanged bearing unit with 4 mounting holes for packer rollers (analogous to UCF 308 / UC 308 X1). Inner diameter d = 40 mm. Mounting base J = 101.5 mm, housing length L = 130 mm, thread H/T = M12, Cdyn = 62.3 kN, Co = 45.2 kN, Pu = 1.898 kN, mass 2.5 kg. The reinforced combined sealing system (-DS index) provides hermetic protection of the rolling zone from soil dust, moisture, and abrasives under conditions of constant soil contact. Direct replacement for SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1, and SNR UCF308 A01X1; used in AMAZONE packer rollers (art. 957305, CE066, CE078) and other European tillage equipment.',
                        'meta_title'     => 'VELNOX BUQ-308-2T3H-DS — Roller unit d40, AMAZONE CE066',
                        'meta_desc'      => 'Bearing unit VELNOX BUQ-308-2T3H-DS (d=40 mm, Cdyn 62.3 kN) for rollers. Direct replacement for AMAZONE CE066, 957305, SNR UC 308 X1.',
                    ],
                    'pl' => [
                        'product_name'   => 'Wzmocniony węzeł łożyskowy kołnierzowy VELNOX BUQ-308-2T3H-DS',
                        'sealing_desc' => 'Wzmocniony kwadratowy kołnierzowy zespół łożyskowy z 4 otworami montażowymi do wałów uprawowych (odpowiednik UCF 308 / UC 308 X1). Średnica wewnętrzna d = 40 mm. Baza montażowa J = 101.5 mm, długość korpusu L = 130 mm, gwint H/T = M12, Cdyn = 62.3 kN, Co = 45.2 kN, Pu = 1.898 kN, masa 2.5 kg. Wzmocniony kombinowany system uszczelnień (indeks -DS) zapewnia hermetyczną ochronę strefy toczenia przed pyłem glebowym, wilgocią i ścierniwem w warunkach stałego kontaktu z glebą. Bezpośredni zamiennik SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 i SNR UCF308 A01X1; stosowany w wałach AMAZONE (art. 957305, CE066, CE078) oraz innych europejskich agregatach uprawowych.',
                        'meta_title'     => 'VELNOX BUQ-308-2T3H-DS — Węzeł wału d40, AMAZONE CE066',
                        'meta_desc'      => 'Węzeł łożyskowy VELNOX BUQ-308-2T3H-DS (d=40 mm, Cdyn 62.3 kN) do wałów. Zamiennik AMAZONE CE066, 957305, SNR UC 308 X1.',
                    ],
                ],
            ]
        );

        // ===== TABLE 3: CROSS-REFERENCES (Нова таблиця 3) =====
        Product::updateOrCreate(
            ['slug' => 'buq-309-2t3h'],
            [
                'article'         => 'BUQ 309-2T3H',
                'schema_key'      => 'buq-309-round',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'bearings-t3',
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
                'oem_cross' => [
                    '4000412 Farmet',
                    'M14581 Farmet',
                    '15626ND Farmet',
                    '18888ND Farmet',
                    'M10257 Farmet',
                    'M13082ND Farmet',
                    'M15626 Farmet',
                    'M17627 Farmet',
                    'M24607 Farmet',
                    'CJI309GGG+19000509',
                    'LSQFR 309-2TB.H.T',
                    'LEFG 209 TDT FKL',
                ],
                'is_active' => true,
                'translations' => [
                    'uk' => [
                        'sealing_desc' => 'Квадратний фланцевий підшипниковий вузол серії 309 для прикочувальних котків з внутрішнім діаметром d = 45 мм. Кріпильна база J = 105 мм, довжина корпусу L = 137 мм, ширина внутрішнього кільця B = 51.1 мм, Cdyn = 80.8 кН, Co = 59.6 кН, Pu = 2.503 кН. Посилена герметизація — трикромкове ущільнення в парі з двокромковим з кожної сторони — забезпечує ресурс у вузлах з ударними навантаженнями та абразивним середовищем. Пряма заміна FKL LSQFR 309 2TB.H.T та вузла CJI 309 GGG+19000509; використовується у прикочувальних котках Farmet (арт. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                        'meta_title'   => 'VELNOX BUQ 309-2T3H — вузол котка d45, Farmet M14581 LEFG 209 TDT',
                        'meta_desc'    => 'Фланцевий вузол VELNOX BUQ 309-2T3H, d=45 мм, Cdyn 80.8 кН. Пряма заміна Farmet M14581, 4000412, FKL LEFG 209 TDT. Для котків.',
                    ],
                    'en' => [
                        'product_name'   => 'Square Flanged Bearing Unit VELNOX BUQ 309-2T3H',
                        'sealing_desc' => 'Square flanged 309 series bearing unit for packer rollers with inner diameter d = 45 mm. Mounting base J = 105 mm, housing length L = 137 mm, inner ring width B = 51.1 mm, Cdyn = 80.8 kN, Co = 59.6 kN, Pu = 2.503 kN. Reinforced sealing — triple-lip seal combined with a double-lip seal on each side — ensures long life in units with impact loads and abrasive environments. Direct replacement for FKL LSQFR 309 2TB.H.T and CJI 309 GGG+19000509 unit; used in Farmet packer rollers (art. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                        'meta_title'     => 'VELNOX BUQ 309-2T3H — Roller unit d45, Farmet M14581',
                        'meta_desc'      => 'Flanged unit VELNOX BUQ 309-2T3H, d=45 mm, Cdyn 80.8 kN. Direct replacement for Farmet M14581, 4000412, FKL LEFG 209 TDT.',
                    ],
                    'pl' => [
                        'product_name'   => 'Kwadratowy węzeł łożyskowy kołnierzowy VELNOX BUQ 309-2T3H',
                        'sealing_desc' => 'Kwadratowy kołnierzowy zespół łożyskowy serii 309 do wałów uprawowych o średnicy wewnętrznej d = 45 mm. Baza montażowa J = 105 mm, długość korpusu L = 137 mm, szerokość pierścienia wewnętrznego B = 51.1 mm, Cdyn = 80.8 kN, Co = 59.6 kN, Pu = 2.503 kN. Wzmocnione uszczelnienie — uszczelka trójwargowa w połączeniu z dwuwargową z każdej strony — zapewnia trwałość w zespołach narażonych na obciążenia udarowe i środowisko ścierne. Bezpośredni zamiennik FKL LSQFR 309 2TB.H.T i zespołu CJI 309 GGG+19000509; stosowany w wałach Farmet (art. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                        'meta_title'     => 'VELNOX BUQ 309-2T3H — Węzeł wału d45, Farmet M14581',
                        'meta_desc'      => 'Węzeł łożyskowy VELNOX BUQ 309-2T3H, d=45 mm, Cdyn 80.8 kN. Zamiennik Farmet M14581, 4000412, FKL LEFG 209 TDT.',
                    ],
                ],
            ]
        );

        // ===== TABLE 4: ADDITIONAL SPECIFICATIONS (Нова таблиця 4) =====
        Product::updateOrCreate(
            ['slug' => 'bucr-sg-309-s2'],
            [
                'article'         => 'BUCR-SG-309-S2',
                'schema_key'      => 'bucr-sg-309',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'bearings-t4',
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
                'oem_cross' => [
                    '17014180 GASPARDO',
                    'M23400435 Gaspardo',
                    'M23400436 Gaspardo',
                    'M43400413 Gaspardo',
                    'M43400468 Gaspardo',
                    'M43400468R Gaspardo',
                    'R17015300 Gaspardo',
                ],
                'is_active' => true,
                'translations' => [
                    'uk' => [
                        'sealing_desc' => 'Тандемний (здвоєний) підшипниковий вузол типу Gaspardo з двома симетричними корпусними секціями (L1 = 152 мм, L2 = 150 мм) та посадковим діаметром d = 45 мм, діаметром корпусу d1 = 74 мм, масою 5.6 кг. Монтажні бази J1 = J2 = 120 мм, кріплення 4×M12×1.25 з кожного боку, висота A = 66.9 мм; конструкція розрахована на асиметричне навантаження секційних вузлів посівних і ґрунтообробних комплексів. Посилена багатокромкова система ущільнень захищає підшипник від ґрунтової вологи, насіннєвого пилу та абразиву під час постійної польової роботи. Пряма заміна OEM-вузлів Gaspardo (арт. 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300), FKL ZGKU 309 2S та RBF PN00102; застосовується у висівних секціях та прикочувальних котках техніки Gaspardo/Maschio.',
                        'meta_title'   => 'VELNOX BUCR-SG-309-S2 — тандемний вузол Gaspardo M43400468',
                        'meta_desc'    => 'Тандемний вузол VELNOX BUCR-SG-309-S2 для Gaspardo, d=45 мм, 4×M12, маса 5.6 кг. Заміна Gaspardo M43400468, 17014180, FKL ZGKU 309 2S.',
                    ],
                    'en' => [
                        'product_name'   => 'Tandem Flanged Bearing Unit VELNOX BUCR-SG-309-S2',
                        'sealing_desc' => 'Tandem (double) Gaspardo-type bearing unit with two symmetrical housing sections (L1 = 152 mm, L2 = 150 mm) and bore diameter d = 45 mm, housing diameter d1 = 74 mm, weight 5.6 kg. Mounting bases J1 = J2 = 120 mm, 4×M12×1.25 mounting on each side, height A = 66.9 mm; design intended for asymmetrical loads in sectional units of seeding and tillage systems. Reinforced multi-lip sealing system protects the bearing from soil moisture, seed dust, and abrasives during constant field work. Direct replacement for Gaspardo OEM units (art. 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300), FKL ZGKU 309 2S, and RBF PN00102; used in seeding sections and packer rollers of Gaspardo/Maschio machinery.',
                        'meta_title'     => 'VELNOX BUCR-SG-309-S2 — Tandem unit Gaspardo M43400468',
                        'meta_desc'      => 'Tandem unit VELNOX BUCR-SG-309-S2 for Gaspardo, d=45 mm, weight 5.6 kg. Replacement for Gaspardo M43400468, 17014180, FKL ZGKU 309 2S.',
                    ],
                    'pl' => [
                        'product_name'   => 'Węzeł łożyskowy tandemowy VELNOX BUCR-SG-309-S2',
                        'sealing_desc' => 'Tandemowy (podwójny) zespół łożyskowy typu Gaspardo z dwiema symetrycznymi sekcjami korpusu (L1 = 152 mm, L2 = 150 mm) i średnicą otworu d = 45 mm, średnicą obudowy d1 = 74 mm, waga 5.6 kg. Bazy montażowe J1 = J2 = 120 mm, mocowanie 4×M12×1.25 z każdej strony, wysokość A = 66.9 mm; konstrukcja przeznaczona do asymetrycznych obciążeń w jednostkach sekcyjnych systemów siewnych i uprawowych. Wzmocniony wielowargowy system uszczelnień chroni łożysko przed wilgocią glebową, pyłem nasion i ścierniwem podczas ciągłej pracy w polu. Bezpośredni zamiennik jednostek OEM Gaspardo (art. 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300), FKL ZGKU 309 2S i RBF PN00102; stosowany w sekcjach siewnych i wałach maszyn Gaspardo/Maschio.',
                        'meta_title'     => 'VELNOX BUCR-SG-309-S2 — Węzeł tandemowy Gaspardo M43400468',
                        'meta_desc'      => 'Węzeł tandemowy VELNOX BUCR-SG-309-S2 do Gaspardo, d=45 mm, waga 5.6 kg. Zamiennik Gaspardo M43400468, 17014180, FKL ZGKU 309 2S.',
                    ],
                ],
            ]
        );

        // ===== TABLE 5: EXTENDED BEARING DATA (Нова таблиця 5) =====
        Product::updateOrCreate(
            ['slug' => 'bup-207-x3l'],
            [
                'article'         => 'BUP 207-X3L',
                'schema_key'      => 'bup-207',
                'category_id'     => $bearingsCategory->id,
                'specs'           => [
                    'table_group' => 'bearings-t5',
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
                'oem_cross' => [
                    '31910034 Lemken',
                    '3199372 Lemken',
                    '3421370 Opall Agri',
                    'F232812 - 0200 INA/FAG Bearing',
                    'GGF35A08',
                    'GGME07 - AH07 INA/FAG Housing',
                    'RCJ 35 35x118x39,9 4xM12',
                    'UC 207 X1 SNR Bearing',
                ],
                'is_active' => true,
                'translations' => [
                    'uk' => [
                        'sealing_desc' => 'Підшипниковий вузол у круглому фланцевому корпусі типу RCJ 35 / UC 207 X1 для ґрунтообробної техніки Lemken з внутрішнім діаметром d = 35 мм та зовнішнім діаметром корпусу D = 125 мм. Монтажна база J = 100 мм под різьблення M12, загальна ширина A = 40 мм, ширина внутрішнього кільця B = 28.3 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.7 кг. Система захисту — багатокромкове ущільнення серії X3L (трикромкове контактне з базової сторони + посилене фронтальне), розраховане на ударні навантаження ґрунтообробного диска. Повний геометричний аналог Lemken 31910034 / 3199372, Opall Agri 3421370, INA/FAG F232812-0200, PEER 207XTR-R-DFC-A534 та SNR UC 207 X1; застосовується у дискових боронах Lemken серій Rubin, Heliodor, Kristall.',
                        'meta_title'   => 'VELNOX BUP 207-X3L — вузол Lemken d35, 31910034, UC 207 X1',
                        'meta_desc'    => 'Підшипниковий вузол VELNOX BUP 207-X3L для Lemken, d=35 мм, D=125 мм, Cdyn 25.5 кН. Заміна Lemken 31910034, 3199372, SNR UC 207 X1.',
                    ],
                    'en' => [
                        'product_name'   => 'Round Flanged Bearing Unit VELNOX BUP 207-X3L',
                        'sealing_desc' => 'Bearing unit in a round flanged housing type RCJ 35 / UC 207 X1 for Lemken tillage equipment with inner diameter d = 35 mm and outer diameter D = 125 mm. Mounting base J = 100 mm for M12 threads, overall width A = 40 mm, inner ring width B = 28.3 mm, Cdyn = 25.5 kN, Co = 15.3 kN, mass 1.7 kg. Sealing system — multi-lip X3L series (triple-lip contact on the base side + reinforced frontal), designed for impact loads of the tillage disc. Full geometric analog of Lemken 31910034 / 3199372, Opall Agri 3421370, INA/FAG F232812-0200, PEER 207XTR-R-DFC-A534, and SNR UC 207 X1; used in Lemken disc harrows Rubin, Heliodor, Kristall series.',
                        'meta_title'     => 'VELNOX BUP 207-X3L — Lemken unit d35, 31910034, UC 207 X1',
                        'meta_desc'      => 'Bearing unit VELNOX BUP 207-X3L for Lemken, d=35 mm, D=125 mm, Cdyn 25.5 kN. Replacement for Lemken 31910034, 3199372, SNR UC 207 X1.',
                    ],
                    'pl' => [
                        'product_name'   => 'Kołnierzowy zespół łożyskowy okrągły VELNOX BUP 207-X3L',
                        'sealing_desc' => 'Zespół łożyskowy w okrągłej obudowie kołnierzowej typu RCJ 35 / UC 207 X1 do maszyn uprawowych Lemken o średnicy wewnętrznej d = 35 mm i średnicy zewnętrznej obudowy D = 125 mm. Baza montażowa J = 100 mm pod gwint M12, szerokość całkowita A = 40 mm, szerokość pierścienia wewnętrznego B = 28.3 mm, Cdyn = 25.5 kN, Co = 15.3 kN, masa 1.7 kg. System uszczelnień — wielowargowy serii X3L (trójwargowy kontaktowy od strony bazowej + wzmocniony frontalny), zaprojektowany do obciążeń udarowych tarczy uprawowej. Pełny odpowiednik geometryczny Lemken 31910034 / 3199372, Opall Agri 3421370, INA/FAG F232812-0200, PEER 207XTR-R-DFC-A534 i SNR UC 207 X1; stosowany w bronach talerzowych Lemken serii Rubin, Heliodor, Kristall.',
                        'meta_title'     => 'VELNOX BUP 207-X3L — Węzeł Lemken d35, 31910034, UC 207 X1',
                        'meta_desc'      => 'Węzeł łożyskowy VELNOX BUP 207-X3L do Lemken, d=35 mm, D=125 mm, Cdyn 25.5 kN. Zamiennik Lemken 31910034, 3199372, SNR UC 207 X1.',
                    ],
                ],
            ]
        );

        // ===== HUBS TABLE 1: 28071300 VX (Disk Harrows) =====
        Product::updateOrCreate(
            ['slug' => '28071300-vx-table1'],
            [
                'article'         => '28071300 VX',
                'category_id'     => $hubCategory->id,
                'specs'           => [
                    'table_group' => 'hubs-t1',
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
                    'table_group' => 'hubs-t2',
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
                    'table_group' => 'hubs-t3',
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
                            'table_group'         => 'agro-t1',
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

        // ===== AGRO TABLE 2: DHU 1 1/2R209 VX (Round bore disc harrow unit) =====
        if ($agroCategory) {
            Product::updateOrCreate(
                ['slug' => 'dhu-1-12r209-vx'],
                [
                    'article'     => 'DHU 1 1/2R209 VX',
                    'category_id' => $agroCategory->id,
                    'specs'       => [
                        'table_group'         => 'agro-t2',
                        'bearing_designation' => "DHU 1 1/2 R209\nDHU 1 1/2 R209 FD209RB\nFD 209-1 1/2 RD\nST 491 B\nPER.GFD209RPPB52\nGWST209PPB38",
                        'brand_name'          => "TIMKEN\nCT-AGRI\nRBF\nPEER\nPEER\nFKL",
                        'cross_reference'     => "1934-12-0 KRAUSE\n40-109 KRAUSE\n822-208C Great Plains\nAA53919 JD\nAN280333 JD\nQ4045130 KUHN",
                        'd_inch' => '1.5004', 'd_mm' => 38.11,
                        'B_mm' => 42.85, 'C_mm' => 22.0, 'Da_mm' => 97.0,
                        'L_mm' => 127.0, 'A_mm' => 39.0, 'A1_mm' => 3.5,
                        'J_mm' => 127.0, 'N_mm' => 13.5,
                        'fr_kn' => 7.7, 'fa_kn' => 3.8,
                        'mass_kg' => 1.63, 'cdyn_kn' => 32.5, 'co_kn' => 20.4,
                    ],
                    'is_active' => true,
                ]
            );
        }

        // ===== AGRO TABLE 3: DHU 1 1/4 S209 VX (Square bore disc harrow unit) =====
        if ($agroCategory) {
            Product::updateOrCreate(
                ['slug' => 'dhu-1-14s209-vx'],
                [
                    'article'     => 'DHU1 1/4 S209 VX',
                    'category_id' => $agroCategory->id,
                    'specs'       => [
                        'table_group'         => 'agro-t3',
                        'bearing_designation' => "DHU 1 1/4 S209\nDHU 1 1/4 S209 FD209RK\nFD 209-1 1/4 SQ\nGFD209SPPB51\nFD 209K51-1 1/4 SQ-A342\nGWST 209 PPB29",
                        'brand_name'          => "TIMKEN\nCT-AGRI\nRBF\nPEER\nPEER\nFKL",
                        'cross_reference'     => "40-128 KRAUSE\n822-209C GP\n84151226 CASE\nFK311007 SUNFLOWER\nQ4008320 KUHN\nQ4044290 KUHN",
                        'd_inch' => '1.3976', 'd_mm' => 35.5,
                        'B_mm' => 42.85, 'C_mm' => 22.0, 'a_mm' => 32.8, 'Da_mm' => 97.0,
                        'L_mm' => 127.0, 'A_mm' => 39.0, 'A1_mm' => 3.5,
                        'J_mm' => 127.0, 'N_mm' => 13.5, 'M_mm' => 17.5,
                        'fr_kn' => 7.7, 'fa_kn' => 3.8,
                        'mass_kg' => 1.63, 'cdyn_kn' => 32.5, 'co_kn' => 20.4, 'pu_kn' => 0.857,
                    ],
                    'is_active' => true,
                ]
            );
        }

        // ===== AGRO TABLE 4: AA30941 VX (JD disc harrow assembly) =====
        if ($agroCategory) {
            Product::updateOrCreate(
                ['slug' => 'aa30941-vx'],
                [
                    'article'     => 'AA30941 VX',
                    'category_id' => $agroCategory->id,
                    'specs'       => [
                        'table_group'         => 'agro-t4',
                        'bearing_designation' => "AA30941\nGWST 209 PPB13\nP30941\nST 209-1 3/4",
                        'brand_name'          => "CT-AGRI\nFKL\nKABAT\nRBF\nKABAT",
                        'cross_reference'     => "A33968 Gasket\nA34792 Housing\nA34793 Housing\nAA27172 Housing\nAA30941 JD Assembly\nJD7806 Grease Nipple\nGW209PPB13 bearing",
                        'd_inch' => '1.781', 'd_mm' => 45.24,
                        'B_mm' => 36.53, 'A_mm' => 48.5, 'A1_mm' => 3.5,
                        'C_mm' => 30.1, 'Da_mm' => 93.0, 'D_mm' => 150.0,
                        'J_mm' => 120.5, 'N_mm' => 13.5,
                        'mass_kg' => 1.836, 'cdyn_kn' => 32.5, 'co_kn' => 20.4, 'pu_kn' => 0.857,
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
        
        // ===== PRODUCT IMAGES =====
        // BUQ products use interactive SVG viewer — no schema.png needed in product_images.
        // BUP/BUCR/hubs/agro/kit use static schema via staticSchemaSrc — schema.png required.

        // ── Tabl 1: BUQ-2xx (9 products share same renders from Tabl 1 folder) ──────
        $buq2xxSlugs = [
            'buq-206-104-2x3h', 'buq-207-104-2x3h', 'buq-207-106-2x3h', 'buq-207-2x3h',
            'buq-208-108-2x3h', 'buq-208-2x3h', 'buq-209-2t3h', 'buq-210-2x3h', 'buq-214-2t3h',
        ];
        foreach ($buq2xxSlugs as $slug) {
            ProductImage::where('product_slug', $slug)->delete();
            foreach ([
                ['path' => "/velnox/images/products/$slug/main.png",      'type' => 'render', 'sort_order' => 0],
                ['path' => "/velnox/images/products/$slug/drawing-1.png", 'type' => 'render', 'sort_order' => 1],
                ['path' => "/velnox/images/products/$slug/drawing-2.png", 'type' => 'render', 'sort_order' => 2],
                ['path' => "/velnox/images/products/$slug/drawing-3.png", 'type' => 'render', 'sort_order' => 3],
            ] as $img) {
                ProductImage::create(array_merge(['product_slug' => $slug], $img));
            }
        }

        $productImages = [
            // ── Tabl 2: BUQ-308 ───────────────────────────────────────────────────────
            'buq-308-2t3h-ds' => [
                ['path' => '/velnox/images/products/buq-308-2t3h-ds/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/buq-308-2t3h-ds/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/buq-308-2t3h-ds/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/buq-308-2t3h-ds/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/buq-308-2t3h-ds/schema.png',     'type' => 'schema', 'sort_order' => 4],
            ],
            // ── Tabl 3: BUQ-309 ───────────────────────────────────────────────────────
            'buq-309-2t3h' => [
                ['path' => '/velnox/images/products/buq-309-2t3h/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/buq-309-2t3h/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/buq-309-2t3h/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/buq-309-2t3h/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/buq-309-2t3h/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
            // ── Tabl 4: BUCR-SG (no folder — keep existing files) ────────────────────
            'bucr-sg-309-s2' => [
                ['path' => '/velnox/images/products/bucr-sg-309-s2/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/bucr-sg-309-s2/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/bucr-sg-309-s2/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/bucr-sg-309-s2/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/bucr-sg-309-s2/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
            // ── Tabl 5: BUP-207 ───────────────────────────────────────────────────────
            'bup-207-x3l' => [
                ['path' => '/velnox/images/products/bup-207-x3l/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/bup-207-x3l/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/bup-207-x3l/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/bup-207-x3l/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/bup-207-x3l/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
            // ── Tabl 6: Hub table1 ────────────────────────────────────────────────────
            '28071300-vx-table1' => [
                ['path' => '/velnox/images/products/28071300-vx-table1/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/28071300-vx-table1/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/28071300-vx-table1/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/28071300-vx-table1/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/28071300-vx-table1/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
            // ── Tabl 7: Hub table2 ────────────────────────────────────────────────────
            'baa-0004-vx-table2' => [
                ['path' => '/velnox/images/products/baa-0004-vx-table2/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/baa-0004-vx-table2/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/baa-0004-vx-table2/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/baa-0004-vx-table2/schema.png',    'type' => 'schema', 'sort_order' => 3],
            ],
            // ── Tabl 8: Hub table3 ────────────────────────────────────────────────────
            'pl-140-vx-table3' => [
                ['path' => '/velnox/images/products/pl-140-vx-table3/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/pl-140-vx-table3/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/pl-140-vx-table3/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/pl-140-vx-table3/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/pl-140-vx-table3/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
            // ── Tabl 10: Agro table2 ──────────────────────────────────────────────────
            'dhu-1-12r209-vx' => [
                ['path' => '/velnox/images/products/dhu-1-12r209-vx/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/dhu-1-12r209-vx/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/dhu-1-12r209-vx/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/dhu-1-12r209-vx/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/dhu-1-12r209-vx/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
            // ── Tabl 11: Agro table3 ──────────────────────────────────────────────────
            'dhu-1-14s209-vx' => [
                ['path' => '/velnox/images/products/dhu-1-14s209-vx/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/dhu-1-14s209-vx/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/dhu-1-14s209-vx/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/dhu-1-14s209-vx/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/dhu-1-14s209-vx/drawing-4.png', 'type' => 'render', 'sort_order' => 4],
                ['path' => '/velnox/images/products/dhu-1-14s209-vx/schema.png',    'type' => 'schema', 'sort_order' => 5],
            ],
        ];

        foreach ($productImages as $slug => $images) {
            ProductImage::where('product_slug', $slug)->delete();
            foreach ($images as $img) {
                ProductImage::create(array_merge(['product_slug' => $slug], $img));
            }
        }

        // ── Tabl 9: Agro table1 (7 products share same renders + schema) ────────────
        $agro1Slugs = [
            '1726206-2rs1-vx', '1726207-2rs1-vx', '1726208-2rs1-vx', '1726209-2rs1-vx',
            '1726210-2rs1-vx', '1726306-2rs1-vx', '1726309-2rs1-vx',
        ];
        foreach ($agro1Slugs as $slug) {
            ProductImage::where('product_slug', $slug)->delete();
            foreach ([
                ['path' => "/velnox/images/products/$slug/main.png",      'type' => 'render', 'sort_order' => 0],
                ['path' => "/velnox/images/products/$slug/drawing-1.png", 'type' => 'render', 'sort_order' => 1],
                ['path' => "/velnox/images/products/$slug/drawing-2.png", 'type' => 'render', 'sort_order' => 2],
                ['path' => "/velnox/images/products/$slug/drawing-3.png", 'type' => 'render', 'sort_order' => 3],
                ['path' => "/velnox/images/products/$slug/schema.png",    'type' => 'schema', 'sort_order' => 4],
            ] as $img) {
                ProductImage::create(array_merge(['product_slug' => $slug], $img));
            }
        }

        $this->call(KitTableSeeder::class);

        // ── Tabl 13 & 17: Kit products (shared images per table group) ───────────────
        $kitSharedImages = [
            'kit-t1' => [
                ['path' => '/velnox/images/products/_shared/kit-t1/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/_shared/kit-t1/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/_shared/kit-t1/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/_shared/kit-t1/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/_shared/kit-t1/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
            'kit-t5' => [
                ['path' => '/velnox/images/products/_shared/kit-t5/main.png',      'type' => 'render', 'sort_order' => 0],
                ['path' => '/velnox/images/products/_shared/kit-t5/drawing-1.png', 'type' => 'render', 'sort_order' => 1],
                ['path' => '/velnox/images/products/_shared/kit-t5/drawing-2.png', 'type' => 'render', 'sort_order' => 2],
                ['path' => '/velnox/images/products/_shared/kit-t5/drawing-3.png', 'type' => 'render', 'sort_order' => 3],
                ['path' => '/velnox/images/products/_shared/kit-t5/schema.png',    'type' => 'schema', 'sort_order' => 4],
            ],
        ];
        foreach ($kitSharedImages as $tableGroup => $images) {
            $kitProducts = Product::whereRaw("json_extract(specs, '$.table_group') = ?", [$tableGroup])->get();
            foreach ($kitProducts as $product) {
                ProductImage::where('product_slug', $product->slug)->delete();
                foreach ($images as $img) {
                    ProductImage::create(array_merge(['product_slug' => $product->slug], $img));
                }
            }
        }

        // ===== KIT spec overrides — додаткові розміри після CSV-імпорту =====
        // KitTableSeeder заповнює лише базові 4 колонки для таблиць 10-12.
        // Тут дописуємо повні технічні параметри зі скану каталогу.

        // GW212 KPP52 R-GX VX — таблиця 10 (hub for disc harrow)
        Product::where('slug', 'gw212-kpp52-r-gx-vx-kit-t10')->update([
            'specs' => \DB::raw("json_patch(specs, json('{
                \"bore_diameter_mm\": 45.212,
                \"overall_diameter_mm\": 110,
                \"body_diameter_mm\": 76,
                \"inner_ring_width_mm\": 38.25,
                \"outer_ring_width_mm\": 42.90,
                \"overall_width_mm\": 76,
                \"groove_offset_mm\": 8.4,
                \"mounting_slot_size\": \"2x180°\",
                \"mass_kg\": 1.81
            }'))"),
        ]);

        // W247647B VX — таблиця 11 (hex bore seeder hub)
        Product::where('slug', 'w247647b-vx-kit-t11')->update([
            'specs' => \DB::raw("json_patch(specs, json('{
                \"d_hex_mm\": 19.075,
                \"L_mm\": 82.50,
                \"d1_mm\": 58.70,
                \"C_mm\": 20.40,
                \"overall_width_mm\": 44.50,
                \"B_mm\": 26.20,
                \"housing_holes_center_mm\": 63.50,
                \"opening_diameter_mm\": 38.70,
                \"groove_width_mm\": 7.2,
                \"groove_depth_mm\": 7.2,
                \"mass_kg\": 0.19
            }'))"),
        ]);

        // 207KRRB12 VX — таблиця 12 (angular contact seeder bearing)
        Product::where('slug', '207krrb12-vx-kit-t12')->update([
            'specs' => \DB::raw("json_patch(specs, json('{
                \"D_mm\": 72,
                \"a_mm\": 28.6,
                \"d1_mm\": 46.1,
                \"C_mm\": 17,
                \"B_mm\": 25,
                \"mass_kg\": 0.4,
                \"co_kn\": 15.3,
                \"cdyn_kn\": 25.5
            }'))"),
        ]);
    }
}
