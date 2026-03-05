import { fetchProduct } from '@/entities/product/api/productApi';
import { ProductTemplate } from '@/features/products/ProductTemplate/ProductTemplate';
import { notFound } from 'next/navigation';
import type { Locale } from '@/entities/product/model/types';

interface ProductPageProps {
    params: { locale: Locale; category: string; slug: string };
}

/**
 * Картка товару — делегує рендер у ProductTemplate (Singleton)
 * Ця сторінка — лише завантаження даних. Вся логіка — у ProductTemplate.
 */
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
