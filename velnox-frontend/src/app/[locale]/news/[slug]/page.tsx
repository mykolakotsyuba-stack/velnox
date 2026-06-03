import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { NewsArticlePage } from '@/features/news/NewsArticlePage';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';

interface Props {
    params: { locale: Locale; slug: string };
}

export function generateMetadata({ params: { locale, slug } }: Props): Metadata {
    return seoMeta(locale, `/news/${slug}`);
}

export default function NewsArticleRoute({ params: { locale, slug } }: Props) {
    setRequestLocale(locale);
    return <NewsArticlePage locale={locale} slug={slug} />;
}
