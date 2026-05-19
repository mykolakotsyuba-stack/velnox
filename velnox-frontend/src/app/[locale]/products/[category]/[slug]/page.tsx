import { fetchProduct } from '@/entities/product/api/productApi';
import { ProductTemplate } from '@/features/products/ProductTemplate/ProductTemplate';
import { notFound } from 'next/navigation';
import type { Locale } from '@/entities/product/model/types';
import type { Metadata } from 'next';

interface ProductPageProps {
    params: { locale: Locale; category: string; slug: string };
}

export async function generateMetadata({ params: { locale, slug } }: ProductPageProps): Promise<Metadata> {
    try {
        const product = await fetchProduct(slug, locale);
        return {
            title: product.meta_title ?? product.name,
            description: product.meta_description ?? undefined,
        };
    } catch {
        return {};
    }
}

export default async function ProductPage({ params: { locale, slug } }: ProductPageProps) {
    try {
        const product = await fetchProduct(slug, locale);
        return <ProductTemplate product={product} locale={locale} />;
    } catch {
        notFound();
    }
}

// ISR: статична генерація з ревалідацією
export const revalidate = 60;
