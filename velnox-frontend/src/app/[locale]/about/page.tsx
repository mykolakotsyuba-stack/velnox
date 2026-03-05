import { setRequestLocale } from 'next-intl/server';
import { AboutPage } from './AboutPage';
import type { Locale } from '@/entities/product/model/types';

interface Props {
    params: { locale: Locale };
}

export default function About({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <AboutPage locale={locale} />;
}
