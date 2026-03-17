'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import styles from './agro.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';

interface AgroCategoryPageProps {
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
            ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

/* ─── Lead Modal ─── */
function LeadModal({ onClose, defaultDesignation = '' }: { onClose: () => void; defaultDesignation?: string }) {
    const t = useTranslations('distributors');
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({
        company: '', name: '', phone: '', email: '', country: '',
        message: defaultDesignation ? `Запит на: ${defaultDesignation}` : ''
    });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>
                {sent ? (
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>{t('form.success_title')}</h3>
                        <p>{t('form.success_body')}</p>
                        <button className={styles.formBtnClose} onClick={onClose}>{t('form.close')}</button>
                    </div>
                ) : (
                    <>
                        <span className={styles.modalTag}>{t('form.tag')}</span>
                        <h2 className={styles.modalTitle}>{t('form.title')}</h2>
                        <form className={styles.leadForm} onSubmit={handleSubmit}>
                            <div className={`${styles.formRow} ${styles.formField1}`}>
                                <input required type="text" placeholder={t('form.company_ph')}
                                    value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                            </div>
                            <div className={`${styles.formRow} ${styles.formField2}`}>
                                <input required type="text" placeholder={t('form.name_ph')}
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                <input required type="tel" placeholder="+380..."
                                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <input className={styles.formField3} required type="email" placeholder="contact@company.com"
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <textarea className={styles.formField4} rows={4} placeholder={t('form.message_ph')}
                                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                            <div className={styles.modalBottom}>
                                <button type="submit" className={styles.formSubmit}>{t('form.submit')}</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

/* ─── Sortable Table ─── */
type SortDir = 'asc' | 'desc' | null;

function SortIcon({ dir }: { dir: SortDir }) {
    return <span className={styles.sortIcon} aria-hidden>{dir === 'asc' ? '↑' : dir === 'desc' ? '↓' : '↕'}</span>;
}

function useSortableTable(data: any[]) {
    const [sortCol, setSortCol] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    const toggle = useCallback((col: string) => {
        setSortCol(prev => {
            if (prev !== col) { setSortDir('asc'); return col; }
            setSortDir(d => d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc');
            return col;
        });
    }, []);

    const sorted = useMemo(() => {
        if (!sortCol || !sortDir) return data;
        return [...data].sort((a, b) => {
            const av = a[sortCol] ?? '', bv = b[sortCol] ?? '';
            const an = parseFloat(String(av)), bn = parseFloat(String(bv));
            const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : String(av).localeCompare(String(bv));
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortCol, sortDir]);

    return { sorted, sortCol, sortDir, toggle };
}

export function AgroCategoryPage({ locale, products }: AgroCategoryPageProps) {
    const t = useTranslations();
    const heroRef = useInView(0.12);
    const approachRef = useInView(0.1);
    const app1Ref = useInView(0.2);
    const app2Ref = useInView(0.2);
    const app3Ref = useInView(0.2);

    const [modalProduct, setModalProduct] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [table1Data, setTable1Data] = useState<any[]>([]);
    const [table2Data, setTable2Data] = useState<any[]>([]);
    const [table3Data, setTable3Data] = useState<any[]>([]);

    const searchHeaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!searchHeaderRef.current) return;
            const elementOffsetTop = searchHeaderRef.current.offsetTop;
            if (window.scrollY > elementOffsetTop - 80) {
                searchHeaderRef.current.classList.add(styles.isSticky);
            } else {
                searchHeaderRef.current.classList.remove(styles.isSticky);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const [res1, res2, res3] = await Promise.all([
                    fetch(`${base}/v1/products/tables/agro-table1`),
                    fetch(`${base}/v1/products/tables/agro-table2`),
                    fetch(`${base}/v1/products/tables/agro-table3`),
                ]);
                const [d1, d2, d3] = await Promise.all([res1.json(), res2.json(), res3.json()]);
                setTable1Data(Array.isArray(d1) ? d1 : []);
                setTable2Data(Array.isArray(d2) ? d2 : []);
                setTable3Data(Array.isArray(d3) ? d3 : []);
            } catch (err) {
                console.error('Error fetching agro tables:', err);
            }
        };
        fetchTables();
    }, []);

    const filteredT1 = useMemo(() => {
        if (!searchQuery) return table1Data;
        const q = searchQuery.toLowerCase();
        return table1Data.filter(row => Object.values(row).some(v => v && String(v).toLowerCase().includes(q)));
    }, [searchQuery, table1Data]);

    const filteredT2 = useMemo(() => {
        if (!searchQuery) return table2Data;
        const q = searchQuery.toLowerCase();
        return table2Data.filter(row => Object.values(row).some(v => v && String(v).toLowerCase().includes(q)));
    }, [searchQuery, table2Data]);

    const filteredT3 = useMemo(() => {
        if (!searchQuery) return table3Data;
        const q = searchQuery.toLowerCase();
        return table3Data.filter(row => Object.values(row).some(v => v && String(v).toLowerCase().includes(q)));
    }, [searchQuery, table3Data]);

    const { sorted: sortedT1, sortCol: sc1, sortDir: sd1, toggle: tog1 } = useSortableTable(filteredT1);
    const { sorted: sortedT2, sortCol: sc2, sortDir: sd2, toggle: tog2 } = useSortableTable(filteredT2);
    const { sorted: sortedT3, sortCol: sc3, sortDir: sd3, toggle: tog3 } = useSortableTable(filteredT3);

    const app1Class = app1Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;
    const app2Class = app2Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;
    const app3Class = app3Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;

    function Th({ col, label, toggle, sortCol, sortDir }: {
        col: string; label: string;
        toggle: (c: string) => void;
        sortCol: string | null; sortDir: SortDir;
    }) {
        return (
            <th className={styles.sortableTh} onClick={() => toggle(col)}>
                {label} <SortIcon dir={sortCol === col ? sortDir : null} />
            </th>
        );
    }

    /* ── TABLE COLUMNS: заповни після отримання даних ── */
    // TODO: Замінити колонки на реальні з ТЗ після отримання даних
    const table1Cols = [
        'Part Number', 'Bearing designation', 'Brand name',
        // ↓ Додай потрібні колонки тут
    ];
    const table2Cols = [
        'Part Number', 'Bearing designation', 'Brand name',
        // ↓ Додай потрібні колонки тут
    ];
    const table3Cols = [
        'Part Number', 'Bearing designation', 'Brand name',
        // ↓ Додай потрібні колонки тут
    ];

    return (
        <main className={styles.page}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* ── HERO ── */}
            <section className={styles.hero} ref={heroRef.ref}>
                <div className={heroRef.inView
                    ? `${styles.container} ${styles.heroContainer} ${styles.animIn}`
                    : `${styles.container} ${styles.heroContainer}`}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine} />
                            VELNOX AGRO BEARINGS
                        </div>
                        <h1 className={styles.heroTitle}>{t('agroPage.hero.title')}</h1>
                        <p className={styles.heroSubtitle}>{t('agroPage.hero.subtitle')}</p>
                        <p className={styles.heroDescription}>{t('agroPage.hero.desc')}</p>
                    </div>
                </div>
            </section>

            {/* ── 3 CARDS ── */}
            <section className={styles.approach} ref={approachRef.ref}>
                <div className={approachRef.inView ? `${styles.container} ${styles.animIn}` : styles.container}>
                    <h2 className={styles.sectionTitle}>{t('agroPage.block1.title')}</h2>
                    <div className={styles.featureGrid}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {i === 1 && <path d="M12 2l8 4v5c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l8-4z" />}
                                        {i === 2 && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>}
                                        {i === 3 && <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.54 2.54l4.24 4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m2.54-2.54l4.24-4.24" />}
                                    </svg>
                                </div>
                                <h3>{t(`agroPage.block1.card${i}_title`)}</h3>
                                <p>{t(`agroPage.block1.card${i}_desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── APP BLOCK 1 (placeholder — замінити фото та текст) ── */}
            <section ref={app1Ref.ref} className={app1Class}>
                <div className={styles.appWatermark}>AGRO</div>
                <div className={styles.appInner}>
                    <div className={styles.appHeader}>
                        <span className={styles.appTag}>TODO: TAG 1</span>
                        <h2 className={styles.appTitle}>{t('agroPage.app1.title')}</h2>
                    </div>
                    <div className={styles.appBody}>
                        <p className={`${styles.appPara} ${styles.appParaLead} ${app1Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.1s' }}>
                            {t('agroPage.app1.desc')}
                        </p>
                        <p className={`${styles.appPara} ${app1Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.25s' }}>
                            <strong className={styles.appKeyword}>Сфера застосування:</strong> {t('agroPage.app1.applications')}
                        </p>
                        <p className={`${styles.appPara} ${app1Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <strong className={styles.appKeyword}>OEM-фокус:</strong> {t('agroPage.app1.oem_focus')}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── STICKY SEARCH ── */}
            <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                <div className={`${styles.container} ${styles.stickyContainer}`}>
                    <div className={styles.tablesHeader}>
                        <div className={styles.headerTitles}>
                            <h2 className={styles.sectionTitle}>{t('agroPage.block2.title')}</h2>
                            <p className={styles.tablesIntro}>{t('agroPage.block2.intro')}</p>
                        </div>
                        <div className={styles.searchWrap}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder={t('agroPage.block2.search_placeholder')}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TABLES ── */}
            <section className={styles.tablesSection}>
                <div className={styles.container}>

                    {/* TABLE 1 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('agroPage.block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('agroPage.block2.table1.desc')}</p>
                        <div className={styles.diagramPlaceholder}>[ СХЕМА ]</div>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        {table1Cols.map(col => (
                                            <Th key={col} col={col} label={col} toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        ))}
                                        <th className={styles.actionCol} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT1.map((row, i) => (
                                        <tr key={i}>
                                            {table1Cols.map(col => (
                                                <td key={col} className={col === 'Part Number' ? styles.partNumCell : undefined}>
                                                    {row[col] ?? '-'}
                                                </td>
                                            ))}
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['Part Number'] || '')}>
                                                    {t('agroPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedT1.length === 0 && (
                                        <tr><td colSpan={table1Cols.length + 1} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── APP BLOCK 2 ── */}
            <section ref={app2Ref.ref} className={app2Class}>
                <div className={styles.appWatermark}>AGRO 2</div>
                <div className={styles.appInner}>
                    <div className={styles.appHeader}>
                        <span className={styles.appTag}>TODO: TAG 2</span>
                        <h2 className={styles.appTitle}>{t('agroPage.app2.title')}</h2>
                    </div>
                    <div className={styles.appBody}>
                        <p className={`${styles.appPara} ${styles.appParaLead} ${app2Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.1s' }}>
                            {t('agroPage.app2.desc')}
                        </p>
                        <p className={`${styles.appPara} ${app2Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.25s' }}>
                            <strong className={styles.appKeyword}>Сфера застосування:</strong> {t('agroPage.app2.applications')}
                        </p>
                        <p className={`${styles.appPara} ${app2Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <strong className={styles.appKeyword}>OEM-фокус:</strong> {t('agroPage.app2.oem_focus')}
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.tablesSection}>
                <div className={styles.container}>

                    {/* TABLE 2 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('agroPage.block2.table2.title')}</h3>
                        <p className={styles.tableDesc}>{t('agroPage.block2.table2.desc')}</p>
                        <div className={styles.diagramPlaceholder}>[ СХЕМА ]</div>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        {table2Cols.map(col => (
                                            <Th key={col} col={col} label={col} toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        ))}
                                        <th className={styles.actionCol} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT2.map((row, i) => (
                                        <tr key={i}>
                                            {table2Cols.map(col => (
                                                <td key={col} className={col === 'Part Number' ? styles.partNumCell : undefined}>
                                                    {row[col] ?? '-'}
                                                </td>
                                            ))}
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['Part Number'] || '')}>
                                                    {t('agroPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedT2.length === 0 && (
                                        <tr><td colSpan={table2Cols.length + 1} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── APP BLOCK 3 ── */}
            <section ref={app3Ref.ref} className={app3Class}>
                <div className={styles.appWatermark}>AGRO 3</div>
                <div className={styles.appInner}>
                    <div className={styles.appHeader}>
                        <span className={styles.appTag}>TODO: TAG 3</span>
                        <h2 className={styles.appTitle}>{t('agroPage.app3.title')}</h2>
                    </div>
                    <div className={styles.appBody}>
                        <p className={`${styles.appPara} ${styles.appParaLead} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.1s' }}>
                            {t('agroPage.app3.desc')}
                        </p>
                        <p className={`${styles.appPara} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.25s' }}>
                            <strong className={styles.appKeyword}>Сфера застосування:</strong> {t('agroPage.app3.applications')}
                        </p>
                        <p className={`${styles.appPara} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <strong className={styles.appKeyword}>OEM-фокус:</strong> {t('agroPage.app3.oem_focus')}
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.tablesSection}>
                <div className={styles.container}>

                    {/* TABLE 3 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('agroPage.block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('agroPage.block2.table3.desc')}</p>
                        <div className={styles.diagramPlaceholder}>[ СХЕМА ]</div>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        {table3Cols.map(col => (
                                            <Th key={col} col={col} label={col} toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        ))}
                                        <th className={styles.actionCol} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT3.map((row, i) => (
                                        <tr key={i}>
                                            {table3Cols.map(col => (
                                                <td key={col} className={col === 'Part Number' ? styles.partNumCell : undefined}>
                                                    {row[col] ?? '-'}
                                                </td>
                                            ))}
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['Part Number'] || '')}>
                                                    {t('agroPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedT3.length === 0 && (
                                        <tr><td colSpan={table3Cols.length + 1} className={styles.emptyState}>Нічого не знайдено</td></tr>
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
