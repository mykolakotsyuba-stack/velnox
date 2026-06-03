import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NewsArticlePage } from '@/features/news/NewsArticlePage';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';

interface Props {
    params: { locale: Locale; slug: string };
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'news' });
    const title = t(`articles.${slug}.title`);
    return { title: `${title} | VELNOX`, description: title, ...seoMeta(locale, `/news/${slug}`) };
}

export default function NewsArticleRoute({ params: { locale, slug } }: Props) {
    setRequestLocale(locale);
    return <NewsArticlePage locale={locale} slug={slug} />;
}
