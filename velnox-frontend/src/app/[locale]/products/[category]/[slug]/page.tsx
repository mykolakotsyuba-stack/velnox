import { fetchProduct } from '@/entities/product/api/productApi';
import { ProductTemplate } from '@/features/products/ProductTemplate/ProductTemplate';
import { notFound } from 'next/navigation';
import type { Locale } from '@/entities/product/model/types';
import type { Metadata } from 'next';
import { seoMeta } from '@/shared/lib/seo';

interface ProductPageProps {
    params: { locale: Locale; category: string; slug: string };
}

export async function generateMetadata({ params: { locale, category, slug } }: ProductPageProps): Promise<Metadata> {
    try {
        const product = await fetchProduct(slug, locale);
        const title = product.meta_title ?? `${product.name} — ${product.article}`;
        const description = product.meta_description
            ?? `${product.name} ${product.article}. Technical specifications, dimensions, cross-references.`;

        const firstImage = product.images.find(i => i.type === 'gallery')?.path;

        const seo = seoMeta(locale, `/products/${category}/${slug}`);
        return {
            title,
            description,
            ...seo,
            openGraph: {
                title,
                description,
                type: 'website',
                ...seo.openGraph,
                ...(firstImage && { images: [{ url: firstImage, width: 800, height: 800, alt: product.article }] }),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                ...(firstImage && { images: [firstImage] }),
            },
        };
    } catch {
        return {};
    }
}

function ProductJsonLd({ product, category, slug, locale }: {
    product: Parameters<typeof ProductTemplate>[0]['product'];
    category: string;
    slug: string;
    locale: string;
}) {
    const firstImage = product.images.find(i => i.type === 'gallery')?.path;
    const specsMap = Object.fromEntries(product.specs.map(s => [s.key, s.value]));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.desc ?? product.meta_description ?? undefined,
        sku: product.article,
        mpn: product.article,
        image: firstImage ?? undefined,
        brand: {
            '@type': 'Brand',
            name: 'VELNOX',
        },
        manufacturer: {
            '@type': 'Organization',
            name: 'VELNOX',
        },
        additionalProperty: product.specs.slice(0, 10).map(s => ({
            '@type': 'PropertyValue',
            name: s.label,
            value: s.value,
            unitText: s.unit || undefined,
        })),
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'VELNOX', item: `/${locale}` },
            { '@type': 'ListItem', position: 2, name: 'Products', item: `/${locale}/products` },
            { '@type': 'ListItem', position: 3, name: category, item: `/${locale}/products/${category}` },
            { '@type': 'ListItem', position: 4, name: product.article },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
        </>
    );
}

export default async function ProductPage({ params: { locale, category, slug } }: ProductPageProps) {
    try {
        const product = await fetchProduct(slug, locale);
        return (
            <>
                <ProductJsonLd product={product} category={category} slug={slug} locale={locale} />
                <ProductTemplate product={product} locale={locale} />
            </>
        );
    } catch {
        notFound();
    }
}

// ISR: static generation with revalidation
export const revalidate = 60;
