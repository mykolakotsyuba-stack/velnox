import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { NewsListPage } from '@/features/news/NewsListPage';
import type { Locale } from '@/entities/product/model/types';

interface Props {
    params: { locale: Locale };
}

const meta: Record<string, { title: string; description: string }> = {
    en: {
        title: 'News | VELNOX — Engineering Solutions & Updates',
        description: 'Latest news, engineering solutions and product updates from VELNOX — bearing units, hub assemblies and custom OEM solutions.',
    },
    uk: {
        title: 'Новини | VELNOX — Інженерні рішення та оновлення',
        description: 'Останні новини, інженерні рішення та оновлення продукції VELNOX — підшипникові вузли, ступичні вузли та кастомні OEM-рішення.',
    },
    pl: {
        title: 'Aktualności | VELNOX — Rozwiązania inżynieryjne i aktualizacje',
        description: 'Najnowsze wiadomości, rozwiązania inżynieryjne i aktualizacje produktów VELNOX — węzły łożyskowe, węzły piast i niestandardowe rozwiązania OEM.',
    },
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const m = meta[locale] ?? meta.en;
    return { title: m.title, description: m.description };
}

export default function NewsPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <NewsListPage locale={locale} />;
}
