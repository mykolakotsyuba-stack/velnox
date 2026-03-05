import { apiFetch } from '@/shared/lib/api';
import Link from 'next/link';
import type { Locale } from '@/entities/product/model/types';

interface NewsArticle {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    published_at: string;
    cover_image?: string;
}

interface NewsPageProps {
    params: { locale: Locale };
    searchParams: { category?: string };
}

export default async function NewsPage({ params: { locale }, searchParams }: NewsPageProps) {
    const { data: articles } = await apiFetch<{ data: NewsArticle[] }>(
        '/news',
        { params: { locale, category: searchParams.category } }
    );

    return (
        <main>
            <h1>News</h1>
            <div>
                {articles.map((article) => (
                    <article key={article.slug}>
                        <span>{article.category}</span>
                        <Link href={`/${locale}/news/${article.slug}`}>
                            <h2>{article.title}</h2>
                        </Link>
                        <p>{article.excerpt}</p>
                        <time>{article.published_at}</time>
                    </article>
                ))}
            </div>
        </main>
    );
}
