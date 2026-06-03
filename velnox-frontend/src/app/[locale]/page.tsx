import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';
import { HomePage } from './home/HomePage';

const locales: Locale[] = ['en', 'pl', 'uk'];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

const meta: Record<string, { title: string; description: string }> = {
    en: {
        title: 'VELNOX — Engineering Bearings & Hub Assemblies for OEM',
        description: 'VELNOX engineers bearings and hub assemblies for seeding complexes and OEM manufacturers. 12+ years, 400+ clients, 98% batch repeatability.',
    },
    uk: {
        title: 'VELNOX — Інженерні підшипники та вузли для OEM',
        description: 'VELNOX — інженерні вузли та підшипники для посівних комплексів і OEM-виробників. 12+ років досвіду, 400+ клієнтів, 98% повторюваність партій.',
    },
    pl: {
        title: 'VELNOX — Łożyska inżynierskie i węzły dla OEM',
        description: 'VELNOX projektuje łożyska i węzły dla kompleksów siewnych i producentów OEM. 12+ lat doświadczenia, 400+ klientów, 98% powtarzalności partii.',
    },
};

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
    const m = meta[locale] ?? meta.en;
    return {
        title: m.title,
        description: m.description,
        ...seoMeta(locale, ''),
        openGraph: { title: m.title, description: m.description, type: 'website', ...seoMeta(locale, '').openGraph },
        twitter: { card: 'summary_large_image', title: m.title, description: m.description },
    };
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
