import type { MetadataRoute } from 'next';

const SITE = 'https://velnox.eu';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/download/', '/*/theme-preview', '/*/products/test-3d', '/*/admin'],
        },
        sitemap: `${SITE}/sitemap.xml`,
        host: SITE,
    };
}
