import type { MetadataRoute } from 'next';

// Generate at request time so the API (only reachable at runtime, not during
// the Docker image build) can be queried for categories/products/news.
export const dynamic = 'force-dynamic';

const SITE = 'https://velnox.eu';
const LOCALES = ['en', 'pl', 'uk'] as const;

// Server-side fetch hits the API container directly over the compose network.
const API = process.env.API_INTERNAL_URL || 'http://velnox-api';

type Entry = { path: string; changefreq?: 'daily' | 'weekly' | 'monthly'; priority?: number };

// Build a sitemap entry with hreflang alternates for all locales.
function localized(path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
    const clean = path ? `/${path}` : '';
    return {
        url: `${SITE}/${LOCALES[0]}${clean}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
        alternates: {
            languages: Object.fromEntries(
                LOCALES.map((l) => [l, `${SITE}/${l}${clean}`])
            ),
        },
    };
}

async function getJson(path: string): Promise<any[]> {
    try {
        const res = await fetch(`${API}/api/v1/${path}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? json ?? [];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPaths: Entry[] = [
        { path: '', priority: 1.0 },
        { path: 'products', priority: 0.9 },
        { path: 'about', priority: 0.7 },
        { path: 'distributors', priority: 0.6 },
        { path: 'contacts', priority: 0.6 },
        { path: 'news', priority: 0.6 },
    ];

    const [categories, products, news] = await Promise.all([
        getJson('categories'),
        getJson('products'),
        getJson('news'),
    ]);

    const entries: MetadataRoute.Sitemap = staticPaths.map((p) => localized(p.path, p.priority));

    for (const c of categories) {
        if (c?.slug) entries.push(localized(`products/${c.slug}`, 0.8));
    }
    for (const p of products) {
        if (p?.slug && p?.category) entries.push(localized(`products/${p.category}/${p.slug}`, 0.7));
    }
    for (const n of news) {
        if (n?.slug) entries.push(localized(`news/${n.slug}`, 0.5));
    }

    return entries;
}
