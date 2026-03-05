import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/shared/layouts/MainLayout';
import type { Locale } from '@/entities/product/model/types';
import '../globals.css';

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: { locale: Locale };
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
    // Обов'язково для next-intl 3.22+ — встановлює locale для поточного запиту
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                {/* locale prop потрібен щоб client-компоненти (Header) отримали правильну мову */}
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <MainLayout locale={locale}>
                        {children}
                    </MainLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
