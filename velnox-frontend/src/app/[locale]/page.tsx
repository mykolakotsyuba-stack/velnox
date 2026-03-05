import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/entities/product/model/types';
import { HomePage } from './home/HomePage';

const locales: Locale[] = ['en', 'pl', 'uk'];

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
    setRequestLocale(locale);
    return <HomePage locale={locale} />;
}
