import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/entities/product/model/types';
import { DistributorsPage } from './DistributorsPage';

export default function Page({ params: { locale } }: { params: { locale: Locale } }) {
    setRequestLocale(locale);
    return <DistributorsPage />;
}
