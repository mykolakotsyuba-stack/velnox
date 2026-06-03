import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CustomCategoryPage } from '@/features/products/CustomCategoryPage/CustomCategoryPage';
import type { Locale } from '@/entities/product/model/types';
import { seoMeta } from '@/shared/lib/seo';

interface Props {
    params: { locale: Locale };
}

const meta: Record<string, { title: string; description: string }> = {
    en: {
        title: 'Custom OEM Solutions | VELNOX — Engineering to Order',
        description: 'VELNOX custom OEM bearing and hub solutions. Engineering-to-order for agricultural machinery, industrial equipment, and specialized applications.',
    },
    uk: {
        title: 'Кастомні OEM-рішення | VELNOX — Інженерія на замовлення',
        description: 'Кастомні OEM-рішення VELNOX: підшипники та вузли на замовлення для сільськогосподарської техніки, промислового обладнання та спеціалізованих застосувань.',
    },
    pl: {
        title: 'Niestandardowe rozwiązania OEM | VELNOX — Inżynieria na zamówienie',
        description: 'Niestandardowe rozwiązania OEM VELNOX: łożyska i węzły na zamówienie dla maszyn rolniczych, urządzeń przemysłowych i zastosowań specjalistycznych.',
    },
};

export function generateMetadata({ params: { locale } }: Props): Metadata {
    const m = meta[locale] ?? meta.en;
    return { title: m.title, description: m.description, ...seoMeta(locale, '/products/custom') };
}

export default function CustomPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <CustomCategoryPage locale={locale} />;
}
