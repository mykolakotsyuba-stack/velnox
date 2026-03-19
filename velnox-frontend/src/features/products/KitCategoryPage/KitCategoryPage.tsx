'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styles from './kit.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';

interface KitCategoryPageProps {
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
    const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', message: defaultDesignation ? `Запит на: ${defaultDesignation}` : '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                </button>
                {sent ? (
                    <div className={styles.successState}>
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
                                <input required type="text" placeholder={t('form.company_ph')} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                            </div>
                            <div className={`${styles.formRow} ${styles.formField2}`}>
                                <input required type="text" placeholder={t('form.name_ph')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                <input required type="tel" placeholder="+380..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <input className={styles.formField3} required type="email" placeholder="contact@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <textarea className={styles.formField4} rows={4} placeholder={t('form.message_ph')} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
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


/* ─── Render structured list for tight cells ─── */
function renderTightCell(val: string | null | undefined) {
    if (!val || val === '-') return <span style={{ whiteSpace: 'nowrap' }}>—</span>;
    const items = val
        .split(/\n|;/)
        .map(s => s.trim())
        .filter(Boolean);
    if (items.length <= 1) return <span style={{ whiteSpace: 'nowrap' }}>{val}</span>;
    return (
        <ul className="analogues-list" style={{ paddingLeft: '16px', margin: 0 }}>
            {items.map((item, i) => (
                <li key={i} style={{ whiteSpace: 'nowrap', marginBottom: '4px' }}>
                    {item}
                </li>
            ))}
        </ul>
    );
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

/* ─── Table column definitions ─── */
const TABLE_COLS: Record<number, { col: string; label: string }[]> = {
    1:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'D (mm)', label: 'D' }, { col: 'B (mm)', label: 'B' },
        { col: 'C (mm)', label: 'C' }, { col: 'Mass (kg)', label: 'Mass' },
        { col: 'Cdyn (kN)', label: 'Cdyn' }, { col: 'Co (kN)', label: 'Co' }, { col: 'Pu (kN)', label: 'Pu' },
    ],
    2:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'D (mm)', label: 'D' }, { col: 'B (mm)', label: 'B' },
        { col: 'C (mm)', label: 'C' }, { col: 'Mass (kg)', label: 'Mass' },
        { col: 'Cdyn (kN)', label: 'Cdyn' }, { col: 'Co (kN)', label: 'Co' },
    ],
    3:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'd1 (mm)', label: 'd1' }, { col: 'D (mm)', label: 'D' },
        { col: 'B (mm)', label: 'B' }, { col: 'C (mm)', label: 'C' }, { col: 'α (°)', label: 'α' },
        { col: 'Mass (kg)', label: 'Mass' }, { col: 'Cdyn (kN)', label: 'Cdyn' },
        { col: 'Co (kN)', label: 'Co' }, { col: 'Pu (kN)', label: 'Pu' },
    ],
    5:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'D (mm)', label: 'D' }, { col: 'B (mm)', label: 'B' },
        { col: 'C (mm)', label: 'C' }, { col: 'α (°)', label: 'α' },
        { col: 'Mass (kg)', label: 'Mass' }, { col: 'Cdyn (kN)', label: 'Cdyn' }, { col: 'Co (kN)', label: 'Co' },
    ],
    6:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'd_groove (mm)', label: 'd_gr' }, { col: 'D (mm)', label: 'D' },
        { col: 'L (mm)', label: 'L' }, { col: 'C (mm)', label: 'C' }, { col: 'e (mm)', label: 'e' },
        { col: 'Mass (kg)', label: 'Mass' }, { col: 'Cdyn (kN)', label: 'Cdyn' },
        { col: 'Co (kN)', label: 'Co' }, { col: 'Pu (kN)', label: 'Pu' },
    ],
    7:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'd1 (mm)', label: 'd1' }, { col: 'D (mm)', label: 'D' },
        { col: 'B (mm)', label: 'B' }, { col: 'C (mm)', label: 'C' }, { col: 'α (°)', label: 'α' },
        { col: 'Mass (kg)', label: 'Mass' }, { col: 'Cdyn (kN)', label: 'Cdyn' },
        { col: 'Co (kN)', label: 'Co' }, { col: 'Pu (kN)', label: 'Pu' },
    ],
    8:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'D (mm)', label: 'D' }, { col: 'B (mm)', label: 'B' },
        { col: 'C (mm)', label: 'C' }, { col: 'α (°)', label: 'α' },
        { col: 'Mass (kg)', label: 'Mass' }, { col: 'Cdyn (kN)', label: 'Cdyn' },
        { col: 'Co (kN)', label: 'Co' }, { col: 'Pu (kN)', label: 'Pu' },
    ],
    9:  [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
        { col: 'd (mm)', label: 'd' }, { col: 'D (mm)', label: 'D' }, { col: 'B (mm)', label: 'B' },
        { col: 'C (mm)', label: 'C' }, { col: 'α (°)', label: 'α' },
        { col: 'Mass (kg)', label: 'Mass' }, { col: 'Cdyn (kN)', label: 'Cdyn' },
        { col: 'Co (kN)', label: 'Co' }, { col: 'Pu (kN)', label: 'Pu' },
    ],
    10: [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
    ],
    11: [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
    ],
    12: [
        { col: 'Part Number', label: 'Part No' }, { col: 'Bearing designation', label: 'Bearing' },
        { col: 'Brand name', label: 'Brand' }, { col: 'Cross-Reference', label: 'Cross-Ref' },
    ],
};

const TABLE_NUMBERS = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12];

/* ─── Single Table Component ─── */
function KitTable({ tableNum, data, searchQuery, filters, allOptions, setFilters, onRequest, t }: {
    tableNum: number;
    data: any[];
    searchQuery: string;
    filters: Record<string, string[]>;
    allOptions: Record<string, string[]>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    onRequest: (part: string) => void;
    t: ReturnType<typeof useTranslations>;
}) {
    const cols = TABLE_COLS[tableNum] ?? TABLE_COLS[1];
    const [openFilterCol, setOpenFilterCol] = useState<string | null>(null);

    const { sorted: sortedData, sortCol, sortDir, toggle } = useSortableTable(
        useMemo(() => {
            let rows = data;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                rows = rows.filter(row => Object.values(row).some(v => v && String(v).toLowerCase().includes(q)));
            }
            Object.entries(filters).forEach(([col, activeVals]) => {
                if (activeVals.length > 0) {
                    rows = rows.filter(row => activeVals.includes(String(row[col] ?? '')));
                }
            });
            return rows;
        }, [data, searchQuery, filters])
    );

    const handleFilterChange = (col: string, val: string) => {
        setFilters(prev => {
            const colFilters = prev[col] || [];
            const newFilters = colFilters.includes(val)
                ? colFilters.filter(x => x !== val)
                : [...colFilters, val];
            return { ...prev, [col]: newFilters };
        });
    };

    return (
        <div className={styles.tableBlock}>
            <h3>{t(`kitPage.block2.table${tableNum}.title`)}</h3>
            <p className={styles.tableDesc}>{t(`kitPage.block2.table${tableNum}.desc`)}</p>
            {/* Diagram placeholder — replace with Image when scheme is available */}
            <div className={styles.diagramPlaceholder}>[ СХЕМА ТАБЛИЦІ {tableNum} ]</div>
            <div className={styles.tableScroll}>
                <table className={styles.techTable}>
                    <thead>
                        <tr>
                            {cols.map(({ col, label }) => {
                                const hasFilter = !['Part Number', 'Cross-Reference', 'Bearing designation'].includes(col);
                                const isFilterOpen = openFilterCol === col;
                                return (
                                    <th key={col} className={styles.sortableTh} style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggle(col)}>
                                                {label}
                                                <span className={styles.sortIcon}>
                                                    {sortCol === col ? (sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕') : '↕'}
                                                </span>
                                            </div>
                                            {hasFilter && (
                                                <div style={{ position: 'relative' }}>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenFilterCol(isFilterOpen ? null : col);
                                                        }}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: (filters[col] && filters[col].length) ? 'var(--color-accent)' : 'inherit' }}
                                                    >
                                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                                        </svg>
                                                    </button>
                                                    {isFilterOpen && (
                                                        <div style={{
                                                            position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                                                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                                            borderRadius: '6px', padding: '12px', zIndex: 100,
                                                            width: '180px', maxHeight: '250px', overflowY: 'auto',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        }} onClick={e => e.stopPropagation()}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                {(allOptions[col] || []).map(opt => (
                                                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={(filters[col] || []).includes(opt)}
                                                                            onChange={() => handleFilterChange(col, opt)}
                                                                        />
                                                                        {opt}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                            <th className={styles.actionCol} />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, i) => (
                            <tr key={i}>
                                {cols.map(({ col, label }) => (
                                    <td key={col}
                                        className={col === 'Part Number' ? styles.partNumCell : col === 'Cross-Reference' ? styles.analoguesCell : undefined}
                                        data-label={label}
                                    >
                                        {col === 'Cross-Reference' || col === 'Bearing designation' ? renderTightCell(row[col]) : (row[col] ?? '-')}
                                    </td>
                                ))}
                                <td className={styles.actionCol} data-label="">
                                    <button className={styles.reqBtn} onClick={() => onRequest(row['Part Number'] || '')}>
                                        {t('kitPage.block2.btn_request')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedData.length === 0 && (
                            <tr><td colSpan={cols.length + 1} className={styles.emptyState}>Нічого не знайдено</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export function KitCategoryPage({ locale, products }: KitCategoryPageProps) {
    const t = useTranslations();
    const heroRef = useInView(0.12);
    const approachRef = useInView(0.1);
    const app1Ref = useInView(0.2);
    const app2Ref = useInView(0.2);
    const app3Ref = useInView(0.2);

    const [modalProduct, setModalProduct] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [tablesData, setTablesData] = useState<Record<number, any[]>>({});
    const searchHeaderRef = useRef<HTMLDivElement>(null);

    // Unique bore diameter values across all tables
    const allOptions = useMemo(() => {
        const all: Record<string, Set<string>> = {};
        Object.values(tablesData).forEach(table => {
            table.forEach(r => {
                Object.keys(r).forEach(k => {
                    const v = r[k];
                    if (v != null && String(v).trim() !== '' && String(v).trim() !== '-') {
                        if (!all[k]) all[k] = new Set();
                        all[k].add(String(v));
                    }
                });
            });
        });
        const result: Record<string, string[]> = {};
        Object.keys(all).forEach(k => {
            result[k] = [...all[k]].sort((a, b) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                return a.localeCompare(b);
            });
        });
        return result;
    }, [tablesData]);

    useEffect(() => {
        const handleScroll = () => {
            if (!searchHeaderRef.current) return;
            const top = searchHeaderRef.current.offsetTop;
            searchHeaderRef.current.classList.toggle(styles.isSticky, window.scrollY > top - 80);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        Promise.all(
            TABLE_NUMBERS.map(n =>
                fetch(`${base}/v1/products/tables/kit-table${n}`)
                    .then(r => r.ok ? r.json() : [])
                    .catch(() => [])
            )
        ).then(results => {
            const map: Record<number, any[]> = {};
            TABLE_NUMBERS.forEach((n, i) => { map[n] = Array.isArray(results[i]) ? results[i] : []; });
            setTablesData(map);
        });
    }, []);

    return (
        <main className={styles.page}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* HERO */}
            <section className={styles.hero} ref={heroRef.ref}>
                <div className={heroRef.inView ? `${styles.container} ${styles.heroContainer} ${styles.animIn}` : `${styles.container} ${styles.heroContainer}`}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroEyebrow}><span className={styles.eyebrowLine} />VELNOX KIT BEARINGS</div>
                        <h1 className={styles.heroTitle}>{t('kitPage.hero.title')}</h1>
                        <p className={styles.heroSubtitle}>{t('kitPage.hero.subtitle')}</p>
                        <p className={styles.heroDescription}>{t('kitPage.hero.desc')}</p>
                    </div>
                </div>
            </section>

            {/* 3 CARDS */}
            <section className={styles.approach} ref={approachRef.ref}>
                <div className={approachRef.inView ? `${styles.container} ${styles.animIn}` : styles.container}>
                    <h2 className={styles.sectionTitle}>{t('kitPage.block1.title')}</h2>
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
                                <h3>{t(`kitPage.block1.card${i}_title`)}</h3>
                                <p>{t(`kitPage.block1.card${i}_desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STICKY SEARCH */}
            <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                <div className={`${styles.container} ${styles.stickyContainer}`}>
                    <div className={styles.tablesHeader}>
                        <div className={styles.headerTitles}>
                            <h2 className={styles.sectionTitle}>{t('kitPage.block2.title')}</h2>
                            <p className={styles.tablesIntro}>{t('kitPage.block2.intro')}</p>
                        </div>
                        <div className={styles.searchWrap}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input type="text" className={styles.searchInput}
                                placeholder={t('kitPage.block2.search_placeholder')}
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── APP BLOCK 1 ── */}
            <section ref={app1Ref.ref} className={app1Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection}>
                <div className={styles.appWatermark}>KIT 1</div>
                <div className={styles.appInner}>
                    <div className={styles.appHeader}>
                        <h2 className={styles.appTitle}>{t('kitPage.app1.title')}</h2>
                    </div>
                    <div className={styles.appBody}>
                        <p className={`${styles.appPara} ${styles.appParaLead} ${app1Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.1s' }}>
                            {t('kitPage.app1.desc')}
                        </p>
                        <p className={`${styles.appPara} ${app1Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.25s' }}>
                            <strong className={styles.appKeyword}>Сфера застосування:</strong> {t('kitPage.app1.applications')}
                        </p>
                        <p className={`${styles.appPara} ${app1Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <strong className={styles.appKeyword}>OEM-фокус:</strong> {t('kitPage.app1.oem_focus')}
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    {[1, 2, 3].map(n => (
                        <KitTable key={n} tableNum={n} data={tablesData[n] ?? []} searchQuery={searchQuery} filters={filters} allOptions={allOptions} setFilters={setFilters} onRequest={setModalProduct} t={t} />
                    ))}
                </div>
            </section>

            {/* ── APP BLOCK 2 ── */}
            <section ref={app2Ref.ref} className={app2Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection}>
                <div className={styles.appWatermark}>KIT 2</div>
                <div className={styles.appInner}>
                    <div className={styles.appHeader}>
                        <h2 className={styles.appTitle}>{t('kitPage.app2.title')}</h2>
                    </div>
                    <div className={styles.appBody}>
                        <p className={`${styles.appPara} ${styles.appParaLead} ${app2Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.1s' }}>
                            {t('kitPage.app2.desc')}
                        </p>
                        <p className={`${styles.appPara} ${app2Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.25s' }}>
                            <strong className={styles.appKeyword}>Сфера застосування:</strong> {t('kitPage.app2.applications')}
                        </p>
                        <p className={`${styles.appPara} ${app2Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <strong className={styles.appKeyword}>OEM-фокус:</strong> {t('kitPage.app2.oem_focus')}
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    {[5, 6, 7].map(n => (
                        <KitTable key={n} tableNum={n} data={tablesData[n] ?? []} searchQuery={searchQuery} filters={filters} allOptions={allOptions} setFilters={setFilters} onRequest={setModalProduct} t={t} />
                    ))}
                </div>
            </section>

            {/* ── APP BLOCK 3 ── */}
            <section ref={app3Ref.ref} className={app3Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection}>
                <div className={styles.appWatermark}>KIT 3</div>
                <div className={styles.appInner}>
                    <div className={styles.appHeader}>
                        <h2 className={styles.appTitle}>{t('kitPage.app3.title')}</h2>
                    </div>
                    <div className={styles.appBody}>
                        <p className={`${styles.appPara} ${styles.appParaLead} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.1s' }}>
                            {t('kitPage.app3.desc')}
                        </p>
                        <p className={`${styles.appPara} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.25s' }}>
                            <strong className={styles.appKeyword}>Сфера застосування:</strong> {t('kitPage.app3.applications')}
                        </p>
                        <p className={`${styles.appPara} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <strong className={styles.appKeyword}>OEM-фокус:</strong> {t('kitPage.app3.oem_focus')}
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    {[8, 9, 10, 11, 12].map(n => (
                        <KitTable key={n} tableNum={n} data={tablesData[n] ?? []} searchQuery={searchQuery} filters={filters} allOptions={allOptions} setFilters={setFilters} onRequest={setModalProduct} t={t} />
                    ))}
                </div>
            </section>
        </main>
    );
}
