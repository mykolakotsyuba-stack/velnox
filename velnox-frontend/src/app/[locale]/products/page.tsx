import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';

interface ProductsPageProps {
    params: { locale: Locale };
}

const meta: Record<string, { title: string; description: string }> = {
    en: {
        title: 'Products | VELNOX — Bearings, Hubs, Agro & Kit',
        description: 'VELNOX product catalog: bearing units, hub assemblies, agricultural bearings, seeder kit bearings, and custom OEM solutions.',
    },
    uk: {
        title: 'Продукція | VELNOX — Підшипники, ступиці, агро та кіт',
        description: 'Каталог продукції VELNOX: підшипникові вузли, ступичні вузли, агропідшипники, підшипники для посівних комплексів та кастомні OEM-рішення.',
    },
    pl: {
        title: 'Produkty | VELNOX — Łożyska, piasty, agro i kit',
        description: 'Katalog produktów VELNOX: węzły łożyskowe, węzły piast, łożyska rolnicze, łożyska do siewników i niestandardowe rozwiązania OEM.',
    },
};

export function generateMetadata({ params: { locale } }: ProductsPageProps): Metadata {
    const m = meta[locale] ?? meta.en;
    return { title: m.title, description: m.description, ...seoMeta(locale, '/products') };
}

const CATEGORIES = ['bearings', 'hubs', 'agro', 'kit', 'custom'] as const;

export default function ProductsPage({ params: { locale } }: ProductsPageProps) {
    const t = useTranslations('categories');

    return (
        <main>
            <h1>Products</h1>
            <div>
                {CATEGORIES.map((slug) => (
                    <Link key={slug} href={`/${locale}/products/${slug}`}>
                        <div>
                            <h2>{t(slug)}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
