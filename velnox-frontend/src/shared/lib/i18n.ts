import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';
import type { Locale } from '@/entities/product/model/types';

export default getRequestConfig(async ({ requestLocale }) => {
    // next-intl 3.22+: використовуємо requestLocale замість locale
    let locale = await requestLocale;

    // Перевірка коректності locale
    if (!locale || !routing.locales.includes(locale as Locale)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`../../../messages/${locale}.json`)).default,
    };
});

/**
 * Fallback-хелпер для динамічного контенту товарів з API
 * Якщо для locale немає перекладу — повертає EN (базовий)
 */
export function getProductTranslation<T extends Record<string, unknown>>(
    translations: Partial<Record<Locale, T>>,
    locale: Locale
): T | undefined {
    return translations[locale] ?? translations['en'];
}
