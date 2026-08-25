import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import type { Locale } from '@/entities/product/model/types';
import '../globals.css';

const GA_ID = 'G-0PJ20XKJ07';

const OG_LOCALE: Record<string, string> = { en: 'en_US', uk: 'uk_UA', pl: 'pl_PL' };
const isProd = process.env.DEPLOY_TARGET === 'prod';

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
    return {
        metadataBase: new URL('https://velnox.eu'),
        verification: { google: 'nqGJPtlGbwCbJNrFOvXw7UcvYbciBfD2z8h2m8KPWXg' },
        robots: isProd ? { index: true, follow: true } : { index: false, follow: false },
        openGraph: {
            siteName: 'VELNOX',
            type: 'website',
            locale: OG_LOCALE[locale] ?? 'en_US',
        },
    };
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
    // Обов'язково для next-intl 3.22+ — встановлює locale для поточного запиту
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
                </Script>
            </head>
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
