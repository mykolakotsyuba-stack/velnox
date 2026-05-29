import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/entities/product/model/types';
import { HomePage } from './home/HomePage';

const locales: Locale[] = ['en', 'pl', 'uk'];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
    setRequestLocale(locale);
    return (
        <>
            {/* Preload the hero slider's first-slide background (LCP candidate) so the
                browser fetches it during HTML parse, before CSS/JS. Paths must include
                the /velnox/ basePath manually (raw <link> isn't processed by Next).
                Keep in sync with SLIDES[0].bgImg in ProductSlider.tsx. */}
            <link rel="preload" as="image" href="/velnox/images/bg_seeder_highspeed-m.webp" media="(max-width: 820px)" fetchPriority="high" />
            <link rel="preload" as="image" href="/velnox/images/bg_seeder_highspeed.webp" media="(min-width: 821px)" fetchPriority="high" />
            <HomePage locale={locale} />
        </>
    );
}
