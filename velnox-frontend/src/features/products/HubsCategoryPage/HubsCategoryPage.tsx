'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
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
    return (
        <span className={styles.sortIcon} aria-hidden>
            {dir === 'asc' ? '↑' : dir === 'desc' ? '↓' : '↕'}
        </span>
    );
}


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
            const av = a[sortCol] ?? '';
            const bv = b[sortCol] ?? '';
            const an = parseFloat(String(av));
            const bn = parseFloat(String(bv));
            const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : String(av).localeCompare(String(bv));
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortCol, sortDir]);

    return { sorted, sortCol, sortDir, toggle };
}

export function HubsCategoryPage({ locale, products }: HubsCategoryPageProps) {
    const t = useTranslations();
    const heroRef = useInView(0.12);
    const approachRef = useInView(0.1);
    const app1Ref = useInView(0.2);
    const app2Ref = useInView(0.2);
    const app3Ref = useInView(0.2);

    const [modalProduct, setModalProduct] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [openFilterCol, setOpenFilterCol] = useState<string | null>(null);
    const [table1Data, setTable1Data] = useState<any[]>([]);
    const [table2Data, setTable2Data] = useState<any[]>([]);
    const [table3Data, setTable3Data] = useState<any[]>([]);

    const searchHeaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!searchHeaderRef.current) return;
            const elementOffsetTop = searchHeaderRef.current.offsetTop;
            if (window.scrollY > elementOffsetTop - 100) {
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
                    fetch(`${base}/v1/products/tables/hubs-table1`),
                    fetch(`${base}/v1/products/tables/hubs-table2`),
                    fetch(`${base}/v1/products/tables/hubs-table3`),
                ]);
                const [data1, data2, data3] = await Promise.all([res1.json(), res2.json(), res3.json()]);
                setTable1Data(Array.isArray(data1) ? data1 : []);
                setTable2Data(Array.isArray(data2) ? data2 : []);
                setTable3Data(Array.isArray(data3) ? data3 : []);
            } catch (err) {
                console.error('Error fetching hub tables:', err);
            }
        };
        fetchTables();
    }, []);

        const handleFilterChange = useCallback((col: string, val: string) => {
        setFilters(prev => {
            const colFilters = prev[col] || [];
            const newFilters = colFilters.includes(val)
                ? colFilters.filter(x => x !== val)
                : [...colFilters, val];
            return { ...prev, [col]: newFilters };
        });
    }, []);

    const filteredT1 = useMemo(() => {
        let rows = table1Data;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            rows = rows.filter(row => Object.values(row).some(val => val && String(val).toLowerCase().includes(q)));
        }
        Object.entries(filters).forEach(([col, activeVals]) => {
            if (activeVals.length > 0) {
                rows = rows.filter(row => activeVals.includes(String(row[col] ?? '')));
            }
        });
        return rows;
    }, [searchQuery, filters, table1Data]);

    const filteredT2 = useMemo(() => {
        let rows = table2Data;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            rows = rows.filter(row => Object.values(row).some(val => val && String(val).toLowerCase().includes(q)));
        }
        Object.entries(filters).forEach(([col, activeVals]) => {
            if (activeVals.length > 0) {
                rows = rows.filter(row => activeVals.includes(String(row[col] ?? '')));
            }
        });
        return rows;
    }, [searchQuery, filters, table2Data]);

    const filteredT3 = useMemo(() => {
        let rows = table3Data;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            rows = rows.filter(row => Object.values(row).some(val => val && String(val).toLowerCase().includes(q)));
        }
        Object.entries(filters).forEach(([col, activeVals]) => {
            if (activeVals.length > 0) {
                rows = rows.filter(row => activeVals.includes(String(row[col] ?? '')));
            }
        });
        return rows;
    }, [searchQuery, filters, table3Data]);

    
    // Unique bore diameter values across all tables
    const allOptions = useMemo(() => {
        const all: Record<string, Set<string>> = {};
        [...table1Data, ...table2Data, ...table3Data].forEach(r => {
            Object.keys(r).forEach(k => {
                const v = r[k];
                if (v != null && String(v).trim() !== '' && String(v).trim() !== '-') {
                    if (!all[k]) all[k] = new Set();
                    all[k].add(String(v));
                }
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
    }, [table1Data, table2Data, table3Data]);

    const { sorted: sortedT1, sortCol: sc1, sortDir: sd1, toggle: tog1 } = useSortableTable(filteredT1);
    const { sorted: sortedT2, sortCol: sc2, sortDir: sd2, toggle: tog2 } = useSortableTable(filteredT2);
    const { sorted: sortedT3, sortCol: sc3, sortDir: sd3, toggle: tog3 } = useSortableTable(filteredT3);

    const app1Class = app1Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;
    const app2Class = app2Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;
    const app3Class = app3Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;

    function Th({ 
        col, label, toggle, sortCol, sortDir, 
        hasFilter, filterOptions, selectedFilters, onFilterChange 
    }: { 
        col: string; label: string; 
        toggle: (c: string) => void; 
        sortCol: string | null; sortDir: SortDir;
        hasFilter?: boolean; filterOptions?: string[]; 
        selectedFilters?: string[]; onFilterChange?: (col: string, val: string) => void;
    }) {
        const isFilterOpen = openFilterCol === col;
        
        return (
            <th className={styles.sortableTh} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggle(col)}>
                        {label} <SortIcon dir={sortCol === col ? sortDir : null} />
                    </div>
                    {hasFilter && (
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenFilterCol(isFilterOpen ? null : col);
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: selectedFilters?.length ? 'var(--color-accent)' : 'inherit' }}
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
                                        {filterOptions?.map(opt => (
                                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedFilters?.includes(opt) || false}
                                                    onChange={() => onFilterChange?.(col, opt)}
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
    }

    return (
        <main className={styles.page}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* HERO */}
            <section className={styles.hero} ref={heroRef.ref}>
                <div className={heroRef.inView ? `${styles.container} ${styles.heroContainer} ${styles.animIn}` : `${styles.container} ${styles.heroContainer}`}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine}></span>
                            VELNOX BEARING HUBS
                        </div>
                        <h1 className={styles.heroTitle}>{t('hubsPage.hero.title')}</h1>
                        <p className={styles.heroSubtitle}>{t('hubsPage.hero.subtitle')}</p>
                        <p className={styles.heroDescription}>{t('hubsPage.hero.desc')}</p>
                    </div>
                    <div className={styles.heroImageWrap}>
                        <Image
                            src="/velnox/images/hubs/hero-hub.png"
                            alt="VELNOX Bearing Hub"
                            width={520}
                            height={520}
                            priority
                            className={styles.heroImage}
                        />
                    </div>
                </div>
            </section>

            {/* 3 CARDS */}
            <section className={styles.approach} ref={approachRef.ref}>
                <div className={approachRef.inView ? `${styles.container} ${styles.animIn}` : styles.container}>
                    <h2 className={styles.sectionTitle}>{t('hubsPage.block1.title')}</h2>
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
                                <h3>{t(`hubsPage.block1.card${i}_title`)}</h3>
                                <p>{t(`hubsPage.block1.card${i}_desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── APP BLOCK 1 — BLUEPRINT OVERLAY (before search) ── */}
            <section ref={app1Ref.ref} className={`${styles.blueprintBlock} ${app1Ref.inView ? styles.blueprintVisible : ''}`}>
                        {/* HORSCH background photo */}
                        <Image
                            src="/velnox/images/hubs/horsch-field.png"
                            alt=""
                            fill
                            priority
                            style={{ objectFit: 'cover', objectPosition: '45% 62%' }}
                        />
                        <div className={styles.blueprintDarkOverlay} />



                        <div className={styles.blueprintLayout}>
                            {/* LEFT: Text */}
                            <div className={styles.blueprintText}>
                                <span className={styles.blueprintTag}>
                                    <span className={styles.blueprintTagLine} />
                                    DISK HARROWS
                                </span>
                                <h2 className={styles.blueprintTitle}>{t('hubsPage.app1.title')}</h2>
                                <p className={styles.blueprintLead}>{t('hubsPage.app1.desc')}</p>
                                <div className={styles.blueprintMeta}>
                                    <div className={styles.blueprintMetaItem}>
                                        <span className={styles.blueprintMetaLabel}>Сфера застосування</span>
                                        <span className={styles.blueprintMetaValue}>{t('hubsPage.app1.applications')}</span>
                                    </div>
                                    <div className={styles.blueprintMetaItem}>
                                        <span className={styles.blueprintMetaLabel}>OEM-сумісність</span>
                                        <span className={styles.blueprintMetaValue}>{t('hubsPage.app1.oem_focus')}</span>
                                    </div>
                                </div>

                            </div>

                        </div>
            </section>

            {/* STICKY SEARCH — after blueprint block */}
            <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                <div className={styles.stickyContainer}>
                    <div className={styles.container}>
                        <div className={styles.tablesHeader}>
                            <div className={styles.headerTitles}>
                                <h2 className={styles.sectionTitle}>{t('hubsPage.block2.title')}</h2>
                                <p className={styles.tablesIntro}>{t('hubsPage.block2.intro')}</p>
                            </div>
                            <div className={styles.searchWrap}>
                                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder={t('hubsPage.block2.search_placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLES SECTION */}
            <section className={styles.tablesSection}>
                <div className={styles.container}>

                    {/* TABLE 1 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table1.desc')}</p>
                        <div className={styles.diagramPlaceholder}>[ СХЕМА УЩІЛЬНЮВАЛЬНОЇ СИСТЕМИ ]</div>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <Th col="Part Number" label="Part Number" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="Bearing designation" label="Bearing" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="Brand name" label="Brand" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Brand name'] || []} selectedFilters={filters['Brand name'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="J (mm)" label="J" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['J (mm)'] || []} selectedFilters={filters['J (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D (mm)" label="D" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['D (mm)'] || []} selectedFilters={filters['D (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D1 (mm)" label="D1" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['D1 (mm)'] || []} selectedFilters={filters['D1 (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th 
                                            col="d (mm)" label="d" toggle={tog1} sortCol={sc1} sortDir={sd1} 
                                            
                                        hasFilter filterOptions={allOptions['d (mm)'] || []} selectedFilters={filters['d (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="C (mm)" label="C" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['C (mm)'] || []} selectedFilters={filters['C (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="H/T" label="H/T" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['H/T'] || []} selectedFilters={filters['H/T'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="G" label="G" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['G'] || []} selectedFilters={filters['G'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L (mm)" label="L" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['L (mm)'] || []} selectedFilters={filters['L (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L1 (mm)" label="L1" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['L1 (mm)'] || []} selectedFilters={filters['L1 (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="F (mm)" label="F" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['F (mm)'] || []} selectedFilters={filters['F (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Mass (kg)" label="Mass" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Mass (kg)'] || []} selectedFilters={filters['Mass (kg)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Cdyn (kN)" label="Cdyn" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Cdyn (kN)'] || []} selectedFilters={filters['Cdyn (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Co (kN)" label="Co" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Co (kN)'] || []} selectedFilters={filters['Co (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Pu (kN)" label="Pu" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Pu (kN)'] || []} selectedFilters={filters['Pu (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT1.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number" className={styles.partNumCell}>{row['Part Number']}</td>
                                            <td data-label="Bearing" style={{ fontSize: '12px' }}>{renderTightCell(row['Bearing designation'])}</td>
                                            <td data-label="Brand" style={{ fontSize: '12px' }}>{row['Brand name']}</td>
                                            <td data-label="J">{row['J (mm)']}</td>
                                            <td data-label="D">{row['D (mm)']}</td>
                                            <td data-label="D1">{row['D1 (mm)']}</td>
                                            <td data-label="d">{row['d (mm)']}</td>
                                            <td data-label="C">{row['C (mm)']}</td>
                                            <td data-label="H/T">{row['H/T']}</td>
                                            <td data-label="G">{row['G']}</td>
                                            <td data-label="L">{row['L (mm)']}</td>
                                            <td data-label="L1">{row['L1 (mm)']}</td>
                                            <td data-label="F">{row['F (mm)']}</td>
                                            <td data-label="Mass">{row['Mass (kg)']}</td>
                                            <td data-label="Cdyn">{row['Cdyn (kN)']}</td>
                                            <td data-label="Co">{row['Co (kN)']}</td>
                                            <td data-label="Pu">{row['Pu (kN)']}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['Part Number'] || '')}>
                                                    {t('hubsPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedT1.length === 0 && (
                                        <tr><td colSpan={18} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── APP BLOCK 2 — CUTTING NODES: text RIGHT, machine visible LEFT ── */}
            <section ref={app2Ref.ref} className={`${styles.blueprintBlock} ${app2Ref.inView ? styles.blueprintVisible : ''}`}>
                <Image
                    src="/velnox/images/hubs/bednar-field.png"
                    alt=""
                    fill
                    priority={false}
                    style={{ objectFit: 'cover', objectPosition: '30% 50%' }}
                />
                {/* Overlay: dark on RIGHT (text zone), transparent on LEFT (machine visible) */}
                <div className={styles.blueprintDarkOverlayRight} />
                <div className={`${styles.blueprintLayout} ${styles.blueprintLayoutRight}`}>
                    <div className={styles.blueprintSpacer} />
                    <div className={`${styles.blueprintText} ${styles.blueprintTextRight}`}>
                        <span className={styles.blueprintTag} style={{ color: '#34d399' }}>
                            <span className={styles.blueprintTagLine} style={{ background: '#34d399' }} />
                            CUTTING NODES
                        </span>
                        <h2 className={styles.blueprintTitle}>{t('hubsPage.app2.title')}</h2>
                        <p className={styles.blueprintLead}>{t('hubsPage.app2.desc')}</p>
                        <div className={styles.blueprintMeta}>
                            <div className={styles.blueprintMetaItem}>
                                <span className={styles.blueprintMetaLabel} style={{ color: '#34d399' }}>Сфера застосування</span>
                                <span className={styles.blueprintMetaValue}>{t('hubsPage.app2.applications')}</span>
                            </div>
                            <div className={styles.blueprintMetaItem}>
                                <span className={styles.blueprintMetaLabel} style={{ color: '#34d399' }}>OEM-сумісність</span>
                                <span className={styles.blueprintMetaValue}>{t('hubsPage.app2.oem_focus')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TABLE 2 */}
            <section className={styles.tablesSection}>
                <div className={styles.container}>
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table2.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table2.desc')}</p>
                        <div className={styles.diagramPlaceholder}>[ СХЕМА УЩІЛЬНЮВАЛЬНОЇ СИСТЕМИ ]</div>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <Th col="Part Number" label="Part Number" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="Bearing designation" label="Bearing" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="Brand name" label="Brand" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['Brand name'] || []} selectedFilters={filters['Brand name'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="J (mm)" label="J" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['J (mm)'] || []} selectedFilters={filters['J (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D (mm)" label="D" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['D (mm)'] || []} selectedFilters={filters['D (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="H/T" label="H/T" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['H/T'] || []} selectedFilters={filters['H/T'] || []} onFilterChange={handleFilterChange} />
                                        <Th 
                                            col="d (mm)" label="d" toggle={tog2} sortCol={sc2} sortDir={sd2} 
                                            
                                        hasFilter filterOptions={allOptions['d (mm)'] || []} selectedFilters={filters['d (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="C (mm)" label="C" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['C (mm)'] || []} selectedFilters={filters['C (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="M" label="M" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['M'] || []} selectedFilters={filters['M'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L (mm)" label="L" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['L (mm)'] || []} selectedFilters={filters['L (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L1 (mm)" label="L1" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['L1 (mm)'] || []} selectedFilters={filters['L1 (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="E (mm)" label="E" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['E (mm)'] || []} selectedFilters={filters['E (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="F (mm)" label="F" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['F (mm)'] || []} selectedFilters={filters['F (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Mass (kg)" label="Mass" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['Mass (kg)'] || []} selectedFilters={filters['Mass (kg)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Cdyn (kN)" label="Cdyn" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['Cdyn (kN)'] || []} selectedFilters={filters['Cdyn (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Co (kN)" label="Co" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['Co (kN)'] || []} selectedFilters={filters['Co (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Pu (kN)" label="Pu" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['Pu (kN)'] || []} selectedFilters={filters['Pu (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT2.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number" className={styles.partNumCell}>{row['Part Number']}</td>
                                            <td data-label="Bearing" style={{ fontSize: '12px' }}>{renderTightCell(row['Bearing designation'])}</td>
                                            <td data-label="Brand" style={{ fontSize: '12px' }}>{row['Brand name']}</td>
                                            <td data-label="J">{row['J (mm)']}</td>
                                            <td data-label="D">{row['D (mm)']}</td>
                                            <td data-label="H/T">{row['H/T']}</td>
                                            <td data-label="d">{row['d (mm)']}</td>
                                            <td data-label="C">{row['C (mm)']}</td>
                                            <td data-label="M">{row['M']}</td>
                                            <td data-label="L">{row['L (mm)']}</td>
                                            <td data-label="L1">{row['L1 (mm)']}</td>
                                            <td data-label="E">{row['E (mm)']}</td>
                                            <td data-label="F">{row['F (mm)']}</td>
                                            <td data-label="Mass">{row['Mass (kg)']}</td>
                                            <td data-label="Cdyn">{row['Cdyn (kN)']}</td>
                                            <td data-label="Co">{row['Co (kN)']}</td>
                                            <td data-label="Pu">{row['Pu (kN)']}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['Part Number'] || '')}>
                                                    {t('hubsPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedT2.length === 0 && (
                                        <tr><td colSpan={18} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </section>

            <section className={styles.tablesSection}>
                <div className={styles.container}>

                    {/* ── APP BLOCK 3 ── */}
                    <section className={app3Class} ref={app3Ref.ref}>
                        <div className={styles.appWatermark}>SEEDERS</div>
                        <div className={styles.appInner}>
                            <div className={styles.appHeader}>
                                <span className={styles.appTag}>HIGH-SPEED SEEDERS</span>
                                <h2 className={styles.appTitle}>{t('hubsPage.app3.title')}</h2>
                            </div>
                            <div className={styles.appBody}>
                                <p className={`${styles.appPara} ${styles.appParaLead} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.1s' }}>
                                    {t('hubsPage.app3.desc')}
                                </p>
                                <p className={`${styles.appPara} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.25s' }}>
                                    <strong className={styles.appKeyword}>Сфера застосування:</strong> {t('hubsPage.app3.applications')}
                                </p>
                                <p className={`${styles.appPara} ${app3Ref.inView ? styles.appParaVisible : ''}`} style={{ transitionDelay: '0.4s' }}>
                                    <strong className={styles.appKeyword}>OEM-фокус:</strong> {t('hubsPage.app3.oem_focus')}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* TABLE 3 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table3.desc')}</p>
                        <div className={styles.diagramPlaceholder}>[ СХЕМА УЩІЛЬНЮВАЛЬНОЇ СИСТЕМИ ]</div>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <Th col="Part Number" label="Part Number" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="Bearing designation" label="Bearing" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="Brand name" label="Brand" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['Brand name'] || []} selectedFilters={filters['Brand name'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="J (mm)" label="J" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['J (mm)'] || []} selectedFilters={filters['J (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D (mm)" label="D" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['D (mm)'] || []} selectedFilters={filters['D (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D1 (mm)" label="D1" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['D1 (mm)'] || []} selectedFilters={filters['D1 (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th 
                                            col="d (mm)" label="d" toggle={tog3} sortCol={sc3} sortDir={sd3} 
                                            
                                        hasFilter filterOptions={allOptions['d (mm)'] || []} selectedFilters={filters['d (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="H/T" label="H/T" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['H/T'] || []} selectedFilters={filters['H/T'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L (mm)" label="L" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['L (mm)'] || []} selectedFilters={filters['L (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="B (mm)" label="B" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['B (mm)'] || []} selectedFilters={filters['B (mm)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Mass (kg)" label="Mass" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['Mass (kg)'] || []} selectedFilters={filters['Mass (kg)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Cdyn (kN)" label="Cdyn" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['Cdyn (kN)'] || []} selectedFilters={filters['Cdyn (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Co (kN)" label="Co" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['Co (kN)'] || []} selectedFilters={filters['Co (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Pu (kN)" label="Pu" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['Pu (kN)'] || []} selectedFilters={filters['Pu (kN)'] || []} onFilterChange={handleFilterChange} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT3.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number" className={styles.partNumCell}>{row['Part Number']}</td>
                                            <td data-label="Bearing" style={{ fontSize: '12px' }}>{renderTightCell(row['Bearing designation'])}</td>
                                            <td data-label="Brand" style={{ fontSize: '12px' }}>{row['Brand name']}</td>
                                            <td data-label="J">{row['J (mm)']}</td>
                                            <td data-label="D">{row['D (mm)']}</td>
                                            <td data-label="D1">{row['D1 (mm)']}</td>
                                            <td data-label="d">{row['d (mm)']}</td>
                                            <td data-label="H/T">{row['H/T']}</td>
                                            <td data-label="L">{row['L (mm)']}</td>
                                            <td data-label="B">{row['B (mm)']}</td>
                                            <td data-label="Mass">{row['Mass (kg)']}</td>
                                            <td data-label="Cdyn">{row['Cdyn (kN)']}</td>
                                            <td data-label="Co">{row['Co (kN)']}</td>
                                            <td data-label="Pu">{row['Pu (kN)']}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['Part Number'] || '')}>
                                                    {t('hubsPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedT3.length === 0 && (
                                        <tr><td colSpan={15} className={styles.emptyState}>Нічого не знайдено</td></tr>
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
