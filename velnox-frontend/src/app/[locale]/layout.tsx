import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import type { Locale } from '@/entities/product/model/types';
import '../globals.css';

const OG_LOCALE: Record<string, string> = { en: 'en_US', uk: 'uk_UA', pl: 'pl_PL' };

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
    return {
        metadataBase: new URL('https://velnox.eu'),
        robots: { index: true, follow: true },
        openGraph: {
            siteName: 'VELNOX',
            type: 'website',
            locale: OG_LOCALE[locale] ?? 'en_US',
            url: `https://velnox.eu/${locale}`,
        },
        alternates: {
            languages: {
                en: 'https://velnox.eu/en',
                uk: 'https://velnox.eu/uk',
                pl: 'https://velnox.eu/pl',
            },
        },
    };
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
    // Обов'язково для next-intl 3.22+ — встановлює locale для поточного запиту
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    {/* locale prop потрібен щоб client-компоненти (Header) отримали правильну мову */}
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <MainLayout locale={locale}>
                            {children}
                        </MainLayout>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
