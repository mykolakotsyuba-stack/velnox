import { setRequestLocale } from 'next-intl/server';
import { NewsArticlePage } from '@/features/news/NewsArticlePage';
import type { Locale } from '@/entities/product/model/types';

interface Props {
    params: { locale: Locale; slug: string };
}

export default function NewsArticleRoute({ params: { locale, slug } }: Props) {
    setRequestLocale(locale);
    return <NewsArticlePage locale={locale} slug={slug} />;
}
