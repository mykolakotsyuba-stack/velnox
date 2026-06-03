import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';
import { DistributorsPage } from './DistributorsPage';

const meta: Record<string, { title: string; description: string }> = {
    en: {
        title: 'Distributors | VELNOX — Authorized Partners & Dealers',
        description: 'Find authorized VELNOX distributors and dealers. Engineering bearings, hub assemblies, and OEM components available through our partner network.',
    },
    uk: {
        title: 'Дистриб\'ютори | VELNOX — Авторизовані партнери та дилери',
        description: 'Знайдіть авторизованих дистриб\'юторів VELNOX. Інженерні підшипники, ступичні вузли та OEM-компоненти через мережу партнерів.',
    },
    pl: {
        title: 'Dystrybutorzy | VELNOX — Autoryzowani partnerzy i dealerzy',
        description: 'Znajdź autoryzowanych dystrybutorów VELNOX. Łożyska inżynierskie, węzły piast i komponenty OEM dostępne przez sieć partnerów.',
    },
};

export function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Metadata {
    const m = meta[locale] ?? meta.en;
    return { title: m.title, description: m.description, ...seoMeta(locale, '/distributors') };
}

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
    setRequestLocale(locale);
    return <DistributorsPage />;
}
