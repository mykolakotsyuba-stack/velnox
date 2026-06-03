import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';
import { DistributorsPage } from './DistributorsPage';

export function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Metadata {
    return seoMeta(locale, '/distributors');
}

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
    setRequestLocale(locale);
    return <DistributorsPage />;
}
