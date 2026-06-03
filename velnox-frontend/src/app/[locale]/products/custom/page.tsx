import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CustomCategoryPage } from '@/features/products/CustomCategoryPage/CustomCategoryPage';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';

interface Props {
    params: { locale: Locale };
}

export function generateMetadata({ params: { locale } }: Props): Metadata {
    return seoMeta(locale, '/products/custom');
}

export default function CustomPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <CustomCategoryPage locale={locale} />;
}
