import type { ReactNode } from 'react';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    children: ReactNode;
    locale: string;
}

/**
 * MainLayout — глобальна обгортка сайту
 *
 * Щоб змінити хедер/футер на ВСЬОМУ сайті → редагуй лише цей файл.
 * Всі сторінки через [locale]/layout.tsx використовують цей компонент.
 */
export function MainLayout({ children, locale }: MainLayoutProps) {
    return (
        <div className={styles.layout}>
            <Header locale={locale} />
            <main className={styles.main}>{children}</main>
            <Footer />
        </div>
    );
}
