import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';

interface ProductsPageProps {
    params: { locale: Locale };
}

export function generateMetadata({ params: { locale } }: ProductsPageProps): Metadata {
    return seoMeta(locale, '/products');
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
