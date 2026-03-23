import { setRequestLocale } from 'next-intl/server';
import { CustomCategoryPage } from '@/features/products/CustomCategoryPage/CustomCategoryPage';
import type { Locale } from '@/entities/product/model/types';

interface Props {
    params: { locale: Locale };
}

export default function CustomPage({ params: { locale } }: Props) {
    setRequestLocale(locale);
    return <CustomCategoryPage locale={locale} />;
}
