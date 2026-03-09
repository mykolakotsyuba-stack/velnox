'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { useTheme } from '@/shared/context/ThemeContext';

interface HeaderProps {
    locale: string;
}

const LOCALES = [
    { code: 'en', label: 'English' },
    { code: 'uk', label: 'Українська' },
    { code: 'pl', label: 'Polski' },
];

const PRODUCT_CATEGORIES = [
    { slug: 'bearings', key: 'bearings' },
    { slug: 'hubs', key: 'hubs' },
    { slug: 'agro', key: 'agro' },
    { slug: 'kit', key: 'kit' },
    { slug: 'custom', key: 'custom' },
] as const;

const NEWS_CATEGORIES = [
    { slug: 'cost-efficiency', key: 'cost_efficiency' },
    { slug: 'quality-control', key: 'quality_control' },
    { slug: 'oem-solutions', key: 'oem_solutions' },
] as const;

function useClickOutside(ref: React.RefObject<HTMLElement>, onClose: () => void) {
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [ref, onClose]);
}

export function Header({ locale }: HeaderProps) {
    const { logoPath } = useTheme();
    const t = useTranslations('nav');
    const tCat = useTranslations('categories');
    const tNews = useTranslations('news.categories');
    const pathname = usePathname();

    const [productsOpen, setProductsOpen] = useState(false);
    const [newsOpen, setNewsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const productsRef = useRef<HTMLDivElement>(null);
    const newsRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    useClickOutside(productsRef, () => setProductsOpen(false));
    useClickOutside(newsRef, () => setNewsOpen(false));
    useClickOutside(langRef, () => setLangOpen(false));

    const switchLocale = (newLocale: string) =>
        pathname.replace(`/${locale}`, `/${newLocale}`);

    const currentLang = LOCALES.find((l) => l.code === locale);

    const closeAll = () => {
        setProductsOpen(false);
        setNewsOpen(false);
        setMobileOpen(false);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>

                    {/* Лого */}
                    <Link href={`/${locale}`} className={styles.logo} onClick={closeAll}>
                        <Image src={logoPath} alt="Velnox Logo" width={140} height={35} priority />
                    </Link>

                    {/* ── DESKTOP NAV ── */}
                    <nav className={styles.nav}>

                        <Link href={`/${locale}/about`} className={styles.navLink}>
                            {t('about')}
                        </Link>

                        {/* Продукти — dropdown (hover + click) */}
                        <div
                            className={styles.dropdown}
                            ref={productsRef}
                            onMouseEnter={() => setProductsOpen(true)}
                            onMouseLeave={() => setProductsOpen(false)}
                        >
                            <button
                                className={styles.navLink}
                                onClick={() => setProductsOpen((o) => !o)}
                                aria-haspopup="true"
                                aria-expanded={productsOpen}
                            >
                                {t('products')}
                                <ChevronDown size={14} style={{ transition: 'transform .2s', transform: productsOpen ? 'rotate(180deg)' : 'none' }} />
                            </button>

                            {productsOpen && (
                                <div className={styles.dropdownMenu}>
                                    {PRODUCT_CATEGORIES.map(({ slug, key }) => (
                                        <Link
                                            key={slug}
                                            href={`/${locale}/products/${slug}`}
                                            className={styles.dropdownItem}
                                            onClick={closeAll}
                                        >
                                            {tCat(key)}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href={`/${locale}/distributors`} className={styles.navLink}>
                            {t('distributors')}
                        </Link>

                        {/* Новини — dropdown (hover + click) */}
                        <div
                            className={styles.dropdown}
                            ref={newsRef}
                            onMouseEnter={() => setNewsOpen(true)}
                            onMouseLeave={() => setNewsOpen(false)}
                        >
                            <button
                                className={styles.navLink}
                                onClick={() => setNewsOpen((o) => !o)}
                                aria-haspopup="true"
                                aria-expanded={newsOpen}
                            >
                                {t('news')}
                                <ChevronDown size={14} style={{ transition: 'transform .2s', transform: newsOpen ? 'rotate(180deg)' : 'none' }} />
                            </button>

                            {newsOpen && (
                                <div className={styles.dropdownMenu}>
                                    {NEWS_CATEGORIES.map(({ slug, key }) => (
                                        <Link
                                            key={slug}
                                            href={`/${locale}/news?category=${slug}`}
                                            className={styles.dropdownItem}
                                            onClick={closeAll}
                                        >
                                            {tNews(key)}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href={`/${locale}/contacts`} className={styles.navLink}>
                            {t('contacts')}
                        </Link>
                    </nav>

                    {/* ── DESKTOP LANG SWITCHER ── */}
                    <div className={styles.dropdown} ref={langRef}>
                        <button
                            className={styles.langToggle}
                            onClick={() => setLangOpen((o) => !o)}
                            aria-haspopup="true"
                            aria-expanded={langOpen}
                        >
                            <Globe size={15} />
                            <span>{currentLang?.label}</span>
                            <ChevronDown size={13} style={{ transition: 'transform .2s', transform: langOpen ? 'rotate(180deg)' : 'none' }} />
                        </button>

                        {langOpen && (
                            <div className={`${styles.dropdownMenu} ${styles.langMenu}`}>
                                {LOCALES.map(({ code, label }) => (
                                    <Link
                                        key={code}
                                        href={switchLocale(code)}
                                        className={`${styles.dropdownItem} ${locale === code ? styles.langActive : ''}`}
                                        onClick={() => setLangOpen(false)}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── HAMBURGER (mobile) ── */}
                    <button
                        className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ''}`}
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-label="Menu"
                    >
                        <span className={styles.burgerLine} />
                        <span className={styles.burgerLine} />
                        <span className={styles.burgerLine} />
                    </button>

                </div>
            </header>

            {/* ── MOBILE DRAWER ── */}
            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ''}`}>

                <Link href={`/${locale}/about`} className={styles.mobileNavLink} onClick={closeAll}>{t('about')}</Link>
                <Link href={`/${locale}/distributors`} className={styles.mobileNavLink} onClick={closeAll}>{t('distributors')}</Link>
                <Link href={`/${locale}/contacts`} className={styles.mobileNavLink} onClick={closeAll}>{t('contacts')}</Link>

                {/* Продукти */}
                <p className={styles.mobileSection}>{t('products')}</p>
                {PRODUCT_CATEGORIES.map(({ slug, key }) => (
                    <Link key={slug} href={`/${locale}/products/${slug}`} className={styles.mobileSubLink} onClick={closeAll}>
                        {tCat(key)}
                    </Link>
                ))}

                {/* Новини */}
                <p className={styles.mobileSection}>{t('news')}</p>
                {NEWS_CATEGORIES.map(({ slug, key }) => (
                    <Link key={slug} href={`/${locale}/news?category=${slug}`} className={styles.mobileSubLink} onClick={closeAll}>
                        {tNews(key)}
                    </Link>
                ))}

                {/* Мови */}
                <div className={styles.mobileLangRow}>
                    {LOCALES.map(({ code, label }) => (
                        <Link
                            key={code}
                            href={switchLocale(code)}
                            className={`${styles.mobileLangBtn} ${locale === code ? styles.mobileLangActive : ''}`}
                            onClick={closeAll}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

            </div>
        </>
    );
}
