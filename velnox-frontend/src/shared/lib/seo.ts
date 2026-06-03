import type { Metadata } from 'next';

const PROD_ORIGIN = 'https://velnox.eu';
const LOCALES = ['en', 'uk', 'pl'] as const;
const isProd = process.env.DEPLOY_TARGET === 'prod';

export function seoMeta(locale: string, pathname: string): Metadata {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) {
        languages[l] = `${PROD_ORIGIN}/${l}${pathname}`;
    }

    return {
        alternates: {
            canonical: `${PROD_ORIGIN}/${locale}${pathname}`,
            languages,
        },
        openGraph: {
            url: `${PROD_ORIGIN}/${locale}${pathname}`,
        },
        ...(!isProd && { robots: { index: false, follow: false } }),
    };
}
