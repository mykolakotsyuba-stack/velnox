'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo } from 'react';
import styles from './hubs.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';

interface HubsCategoryPageProps {
    locale: Locale;
    products?: ProductListItem[];
}

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

export function HubsCategoryPage({ locale, products }: HubsCategoryPageProps) {
    const t = useTranslations();
    const heroRef = useInView(0.12);
    const approachRef = useInView(0.1);
    const tablesRef = useInView(0.05);

    const [searchQuery, setSearchQuery] = useState('');
    const [table1Data, setTable1Data] = useState<any[]>([]);
    const [table2Data, setTable2Data] = useState<any[]>([]);
    const [table3Data, setTable3Data] = useState<any[]>([]);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const [res1, res2, res3] = await Promise.all([
                    fetch(`${apiBase}/v1/products/tables/hubs-table1`),
                    fetch(`${apiBase}/v1/products/tables/hubs-table2`),
                    fetch(`${apiBase}/v1/products/tables/hubs-table3`),
                ]);

                const [data1, data2, data3] = await Promise.all([
                    res1.json(),
                    res2.json(),
                    res3.json(),
                ]);

                setTable1Data(Array.isArray(data1) ? data1 : []);
                setTable2Data(Array.isArray(data2) ? data2 : []);
                setTable3Data(Array.isArray(data3) ? data3 : []);
            } catch (err) {
                console.error('Error fetching hub tables:', err);
            }
        };
        fetchTables();
    }, [apiBase]);

    const filteredT1 = useMemo(() => {
        if (!searchQuery) return table1Data;
        const q = searchQuery.toLowerCase();
        return table1Data.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, table1Data]);

    const filteredT2 = useMemo(() => {
        if (!searchQuery) return table2Data;
        const q = searchQuery.toLowerCase();
        return table2Data.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, table2Data]);

    const filteredT3 = useMemo(() => {
        if (!searchQuery) return table3Data;
        const q = searchQuery.toLowerCase();
        return table3Data.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, table3Data]);

    return (
        <main className={styles.page}>
            {/* HERO SECTION */}
            <section className={styles.hero} ref={heroRef.ref}>
                <div
                    className={
                        heroRef.inView
                            ? `${styles.container} ${styles.heroContainer} ${styles.animIn}`
                            : `${styles.container} ${styles.heroContainer}`
                    }
                >
                    <div className={styles.heroContent}>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine}></span>
                            VELNOX BEARING HUBS
                        </div>
                        <h1 className={styles.heroTitle}>{t('hubsPage.hero.title')}</h1>
                        <p className={styles.heroSubtitle}>{t('hubsPage.hero.subtitle')}</p>
                        <p className={styles.heroDescription}>
                            {t('hubsPage.hero.desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className={styles.approach} ref={approachRef.ref}>
                <div
                    className={
                        approachRef.inView
                            ? `${styles.container} ${styles.animIn}`
                            : styles.container
                    }
                >
                    <h2 className={styles.sectionTitle}>{t('hubsPage.block1.title')}</h2>
                    <div className={styles.featureGrid}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {i === 1 && (
                                            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.54 2.54l4.24 4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m2.54-2.54l4.24-4.24" />
                                        )}
                                        {i === 2 && (
                                            <>
                                                <circle cx="12" cy="12" r="10" />
                                                <circle cx="12" cy="12" r="6" />
                                                <circle cx="12" cy="12" r="2" />
                                            </>
                                        )}
                                        {i === 3 && (
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                                        )}
                                    </svg>
                                </div>
                                <h3>{t(`hubsPage.block1.card${i}_title`)}</h3>
                                <p>{t(`hubsPage.block1.card${i}_desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TABLES SECTION */}
            <section className={styles.tablesSection} ref={tablesRef.ref}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>{t('hubsPage.block2.title')}</h2>
                    <p className={styles.introText}>{t('hubsPage.block2.intro')}</p>

                    {/* Search input */}
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            placeholder={t('hubsPage.block2.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {/* TABLE 1 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table1.desc')}</p>
                        <div className={styles.diagramPlaceholder}>
                            [ SEALING SYSTEM SCHEME - TABLE 1 ]
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Part Number</th>
                                        <th>Bearing designation</th>
                                        <th>J (mm)</th>
                                        <th>D (mm)</th>
                                        <th>Cdyn (kN)</th>
                                        <th>Co (kN)</th>
                                        <th>Pu (kN)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT1.length > 0 ? (
                                        filteredT1.map((row, idx) => (
                                            <tr key={idx}>
                                                <td>{row['Part Number'] || '-'}</td>
                                                <td>{row['Bearing designation'] || '-'}</td>
                                                <td>{row['J (mm)'] || '-'}</td>
                                                <td>{row['D (mm)'] || '-'}</td>
                                                <td>{row['Cdyn (kN)'] || '-'}</td>
                                                <td>{row['Co (kN)'] || '-'}</td>
                                                <td>{row['Pu (kN)'] || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className={styles.noData}>
                                                Нічого не знайдено
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* TABLE 2 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table2.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table2.desc')}</p>
                        <div className={styles.diagramPlaceholder}>
                            [ SEALING SYSTEM SCHEME - TABLE 2 ]
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Part Number</th>
                                        <th>Bearing designation</th>
                                        <th>J (mm)</th>
                                        <th>D (mm)</th>
                                        <th>Cdyn (kN)</th>
                                        <th>Co (kN)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT2.length > 0 ? (
                                        filteredT2.map((row, idx) => (
                                            <tr key={idx}>
                                                <td>{row['Part Number'] || '-'}</td>
                                                <td>{row['Bearing designation'] || '-'}</td>
                                                <td>{row['J (mm)'] || '-'}</td>
                                                <td>{row['D (mm)'] || '-'}</td>
                                                <td>{row['Cdyn (kN)'] || '-'}</td>
                                                <td>{row['Co (kN)'] || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className={styles.noData}>
                                                Нічого не знайдено
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* TABLE 3 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table3.desc')}</p>
                        <div className={styles.diagramPlaceholder}>
                            [ SEALING SYSTEM SCHEME - TABLE 3 ]
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Part Number</th>
                                        <th>Bearing designation</th>
                                        <th>L (mm)</th>
                                        <th>B (mm)</th>
                                        <th>Cdyn (kN)</th>
                                        <th>Co (kN)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT3.length > 0 ? (
                                        filteredT3.map((row, idx) => (
                                            <tr key={idx}>
                                                <td>{row['Part Number'] || '-'}</td>
                                                <td>{row['Bearing designation'] || '-'}</td>
                                                <td>{row['L (mm)'] || '-'}</td>
                                                <td>{row['B (mm)'] || '-'}</td>
                                                <td>{row['Cdyn (kN)'] || '-'}</td>
                                                <td>{row['Co (kN)'] || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className={styles.noData}>
                                                Нічого не знайдено
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
