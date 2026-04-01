import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AboutPage } from './AboutPage';
import type { Locale } from '@/entities/product/model/types';

interface Props {
    params: { locale: Locale };
}

const meta: Record<string, { title: string; description: string }> = {
    en: {
        title: 'About VELNOX | Engineering Bearings & OEM Assemblies',
        description: 'VELNOX is an engineering brand of bearings and hub assemblies for OEM manufacturers, engineering departments and distributors. 12+ years, 400+ clients, 98% batch repeatability.',
    },
    uk: {
        title: 'Про нас | VELNOX — Інженерні підшипники та OEM-вузли',
        description: 'VELNOX — інженерний бренд підшипників і вузлів для OEM-виробників, конструкторських відділів та дистриб\'юторів. 12+ років досвіду, 400+ клієнтів.',
    },
    pl: {
        title: 'O nas | VELNOX — Łożyska inżynierskie i węzły OEM',
        description: 'VELNOX to inżynieryjna marka łożysk i węzłów dla producentów OEM, działów projektowych i dystrybutorów. 12+ lat doświadczenia, 400+ klientów.',
    },
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const m = meta[locale] ?? meta.en;
    return {
        title: m.title,
        description: m.description,
        openGraph: {
            title: m.title,
            description: m.description,
            images: [{ url: '/velnox/images/about/hero_bearing_final.png', width: 1200, height: 630 }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: m.title,
            description: m.description,
        },
    };
}

export default function About({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <AboutPage locale={locale} />;
}
