import { apiFetch } from '@/shared/lib/api';
import { notFound } from 'next/navigation';
import type { Locale } from '@/entities/product/model/types';

interface NewsArticlePageProps {
    params: { locale: Locale; slug: string };
}

export default async function NewsArticlePage({ params: { locale, slug } }: NewsArticlePageProps) {
    try {
        const article = await apiFetch<{
            title: string;
            category: string;
            body: string;
            published_at: string;
        }>(`/news/${slug}`, { params: { locale } });

        return (
            <article>
                <span>{article.category}</span>
                <h1>{article.title}</h1>
                <time>{article.published_at}</time>
                <div dangerouslySetInnerHTML={{ __html: article.body }} />
            </article>
        );
    } catch {
        notFound();
    }
}
