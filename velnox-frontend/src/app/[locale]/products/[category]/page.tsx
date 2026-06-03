import type { Metadata } from 'next';
import { fetchProducts } from '@/entities/product/api/productApi';
import Link from 'next/link';
import { BearingsCategoryPage } from '@/features/products/BearingsCategoryPage/BearingsCategoryPage';
import { HubsCategoryPage } from '@/features/products/HubsCategoryPage/HubsCategoryPage';
import { AgroCategoryPage } from '@/features/products/AgroCategoryPage/AgroCategoryPage';
import { KitCategoryPage } from '@/features/products/KitCategoryPage/KitCategoryPage';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';

interface CategoryPageProps {
    params: { locale: Locale; category: string };
}

const categoryMeta: Record<string, Record<string, { title: string; description: string }>> = {
    bearings: {
        en: { title: 'Bearing Units | VELNOX — BUQ, BUCR, BUP Series', description: 'VELNOX bearing units: BUQ, BUCR, BUP series for agricultural machinery, OEM equipment and industrial applications. Full specs and cross-references.' },
        uk: { title: 'Підшипникові вузли | VELNOX — Серії BUQ, BUCR, BUP', description: 'Підшипникові вузли VELNOX: серії BUQ, BUCR, BUP для сільськогосподарської техніки, OEM-обладнання та промислових застосувань.' },
        pl: { title: 'Węzły łożyskowe | VELNOX — Serie BUQ, BUCR, BUP', description: 'Węzły łożyskowe VELNOX: serie BUQ, BUCR, BUP do maszyn rolniczych, urządzeń OEM i zastosowań przemysłowych.' },
    },
    hubs: {
        en: { title: 'Hub Assemblies | VELNOX — Disc Harrows, Seeders, Cutting Nodes', description: 'VELNOX hub assemblies for disc harrows, seeders and cutting nodes. Compatible with HORSCH, Bednar, Köckerling, Väderstad.' },
        uk: { title: 'Ступичні вузли | VELNOX — Дискові борони, сівалки, ріжучі вузли', description: 'Ступичні вузли VELNOX для дискових борін, сівалок та ріжучих вузлів. Сумісні з HORSCH, Bednar, Köckerling, Väderstad.' },
        pl: { title: 'Węzły piast | VELNOX — Brony talerzowe, siewniki, węzły tnące', description: 'Węzły piast VELNOX do bron talerzowych, siewników i węzłów tnących. Kompatybilne z HORSCH, Bednar, Köckerling, Väderstad.' },
    },
    agro: {
        en: { title: 'Agricultural Bearings | VELNOX — Seeder & Harrow Bearings', description: 'VELNOX agricultural bearings for seeders, harrows and farming equipment. Deep groove, disc hub units, and specialty bearings.' },
        uk: { title: 'Агропідшипники | VELNOX — Підшипники для сівалок і борін', description: 'Агропідшипники VELNOX для сівалок, борін та сільськогосподарської техніки. Кулькові, ступичні вузли, спеціалізовані підшипники.' },
        pl: { title: 'Łożyska rolnicze | VELNOX — Łożyska do siewników i bron', description: 'Łożyska rolnicze VELNOX do siewników, bron i sprzętu rolniczego. Kulkowe, węzły piast, łożyska specjalistyczne.' },
    },
    kit: {
        en: { title: 'Seeder Kit Bearings | VELNOX — Precision Bearings for Seeders', description: 'VELNOX seeder kit bearings: precision bearings for planter units, coulter assemblies, and seeding equipment.' },
        uk: { title: 'Підшипники для посівних комплексів | VELNOX', description: 'Підшипники VELNOX для посівних комплексів: точні підшипники для висівних апаратів, сошникових вузлів та посівної техніки.' },
        pl: { title: 'Łożyska do siewników | VELNOX — Precyzyjne łożyska', description: 'Łożyska VELNOX do siewników: precyzyjne łożyska do zespołów siewnych, redlic i sprzętu siewnego.' },
    },
};

export function generateMetadata({ params: { locale, category } }: CategoryPageProps): Metadata {
    const m = categoryMeta[category]?.[locale] ?? categoryMeta[category]?.en ?? { title: `${category} | VELNOX`, description: '' };
    return { title: m.title, description: m.description, ...seoMeta(locale, `/products/${category}`) };
}

export function generateStaticParams() {
    return [
        { category: 'bearings' },
        { category: 'hubs' },
        { category: 'agro' },
        { category: 'kit' },
    ];
}

export default async function CategoryPage({ params: { locale, category } }: CategoryPageProps) {
    if (category === 'bearings') {
        const { data: bearings } = await fetchProducts({ locale, category: 'bearings', per_page: 1000 });
        return <BearingsCategoryPage locale={locale} products={bearings} />;
    }

    if (category === 'hubs') {
        const { data: hubs } = await fetchProducts({ locale, category: 'hubs', per_page: 1000 });
        return <HubsCategoryPage locale={locale} products={hubs} />;
    }

    if (category === 'agro') {
        const { data: agro } = await fetchProducts({ locale, category: 'agro', per_page: 1000 });
        return <AgroCategoryPage locale={locale} products={agro} />;
    }

    if (category === 'kit') {
        const { data: kit } = await fetchProducts({ locale, category: 'kit', per_page: 1000 });
        return <KitCategoryPage locale={locale} products={kit} />;
    }

    const { data: products } = await fetchProducts({ locale, category });

    return (
        <main>
            <h1>{category}</h1>
            <div>
                {products.map((product) => (
                    <Link key={product.slug} href={`/${locale}/products/${category}/${product.slug}`}>
                        <div>
                            <h3>{product.name}</h3>
                            <p>{product.article}</p>
                            {product.specs.Cdyn && <p>Cdyn: {product.specs.Cdyn} kN</p>}
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
