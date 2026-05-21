'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    if (!val || val === '-') return <span>—</span>;
    const items = val
        .split(/\n|;/)
        .map(s => s.trim())
        .filter(Boolean);
    if (items.length <= 1) return <span>{val}</span>;
    return (
        <ul className="analogues-list" style={{ paddingLeft: '14px', margin: 0 }}>
            {items.map((item, i) => (
                <li key={i} style={{ marginBottom: '2px' }}>
                    {item}
                </li>
            ))}
        </ul>
    );
}

/* ─── Brand cell: кожен бренд з нового рядка ─── */
function renderBrandCell(val: string | null | undefined) {
    if (!val || val === '-') return <span>—</span>;
    const brands = val.split(/\n|\//).map(s => s.trim()).filter(Boolean);
    if (brands.length <= 1) return <span>{val}</span>;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {brands.map((brand, i) => <span key={i}>{brand}</span>)}
        </div>
    );
}

/* ─── Designation cell: список + перенос після ). Розбиває по \n і " / " (НЕ по "/" у дробах типу 1/4) ─── */
function renderDesignationCell(val: string | null | undefined) {
    if (!val || val === '-') return <span>—</span>;
    const items: string[] = [];
    val.split(/\n/).map(s => s.trim()).filter(Boolean)
        .forEach(line => line.split(' / ').forEach(p => { const t = p.trim(); if (t) items.push(t); }));

    const renderWithParenBreaks = (text: string) => {
        const parts = text.split(') ');
        if (parts.length <= 1) return <>{text}</>;
        return <>
            {parts.map((part, j) => (
                <span key={j}>
                    {j < parts.length - 1 ? part + ')' : part}
                    {j < parts.length - 1 && <br />}
                </span>
            ))}
        </>;
    };

    if (items.length <= 1) return <span>{renderWithParenBreaks(items[0] ?? val)}</span>;
    return (
        <ul className="analogues-list" style={{ paddingLeft: '14px', margin: 0 }}>
            {items.map((item, i) => (
                <li key={i} style={{ marginBottom: '2px' }}>{renderWithParenBreaks(item)}</li>
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

function articleToSlug(article: string): string {
    return article.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function HubsCategoryPage({ locale, products }: HubsCategoryPageProps) {
    const t = useTranslations();
    const heroRef = useInView(0.12);
    const approachRef = useInView(0.1);
    const app1Ref = useInView(0.2);
    const app2Ref = useInView(0.2);
    const app3Ref = useInView(0.2);
    const ctaRef = useInView();

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
                    fetch(`${base}/v1/product-tables/hubs-t1?locale=${locale}`),
                    fetch(`${base}/v1/product-tables/hubs-t2?locale=${locale}`),
                    fetch(`${base}/v1/product-tables/hubs-t3?locale=${locale}`),
                ]);
                const safeJson = async (res: Response) => res.ok ? res.json() : { products: [] };
                const [data1, data2, data3] = await Promise.all([safeJson(res1), safeJson(res2), safeJson(res3)]);

                const mapT1 = (p: any) => ({
                    part_number:  p.article,
                    oem:          (p.cross_refs ?? []).map((r: any) => r.brand ? `${r.value} ${r.brand}` : r.value).join('\n'),
                    j_mm:         p.specs?.hub_J_mm,
                    D_mm:         p.specs?.hub_D_mm,
                    D1_mm:        p.specs?.hub_D1_mm,
                    d_mm:         p.specs?.hub_d_mm,
                    C_mm:         p.specs?.hub_C_mm,
                    hole_thread:  p.specs?.hub_hole_thread,
                    G:            p.specs?.hub_G,
                    L_mm:         p.specs?.hub_L_mm,
                    L1_mm:        p.specs?.hub_L1_mm,
                    F_mm:         p.specs?.hub_F_mm,
                    mass_kg:      p.specs?.mass_kg,
                    cdyn_kn:      p.specs?.cdyn_kn,
                    co_kn:        p.specs?.co_kn,
                    pu_kn:        p.specs?.pu_kn,
                });
                const mapT2 = (p: any) => ({
                    part_number:  p.article,
                    j_mm:         p.specs?.hub_J_mm,
                    D_mm:         p.specs?.hub_D_mm,
                    hole_thread:  p.specs?.hub_hole_thread,
                    d_mm:         p.specs?.hub_d_mm,
                    C_mm:         p.specs?.hub_C_mm,
                    M_thread:     p.specs?.hub_M_thread,
                    L_mm:         p.specs?.hub_L_mm,
                    L1_mm:        p.specs?.hub_L1_mm,
                    E_mm:         p.specs?.hub_E_mm,
                    F_mm:         p.specs?.hub_F_mm,
                    mass_kg:      p.specs?.mass_kg,
                    cdyn_kn:      p.specs?.cdyn_kn,
                    co_kn:        p.specs?.co_kn,
                    pu_kn:        p.specs?.pu_kn,
                });
                const mapT3 = (p: any) => ({
                    part_number:  p.article,
                    j_mm:         p.specs?.hub_J_mm,
                    D_mm:         p.specs?.hub_D_mm,
                    D1_mm:        p.specs?.hub_D1_mm,
                    d_mm:         p.specs?.hub_d_mm,
                    hole_thread:  p.specs?.hub_hole_thread,
                    L_mm:         p.specs?.hub_L_mm,
                    B_mm:         p.specs?.hub_B_mm,
                    mass_kg:      p.specs?.mass_kg,
                    cdyn_kn:      p.specs?.cdyn_kn,
                    co_kn:        p.specs?.co_kn,
                    pu_kn:        p.specs?.pu_kn,
                });

                setTable1Data(Array.isArray(data1?.products) ? data1.products.map(mapT1).filter((r: any) => r.part_number) : []);
                setTable2Data(Array.isArray(data2?.products) ? data2.products.map(mapT2) : []);
                setTable3Data(Array.isArray(data3?.products) ? data3.products.map(mapT3) : []);
            } catch (err) {
                console.error('Error fetching hub tables:', err);
            }
        };
        fetchTables();
    }, [locale]);

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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', minWidth: 0 }}>
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '2px', minWidth: 0 }} onClick={() => toggle(col)}>
                        <span style={{ flex: '1 1 0', minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{label}</span>
                        <SortIcon dir={sortCol === col ? sortDir : null} />
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
                            src="/images/hubs/hero-hub.png"
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
                            src="/images/hubs/horsch-field.png"
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
                <div className={styles.tableSectionContainer}>

                    {/* TABLE 1 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table1.desc')}</p>
                        <div className={styles.tableDiagramContainer}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/velnox/images/products/hubs-t1/schema.png" alt="Hub Table 1 Technical Drawing" style={{ maxWidth: '100%', maxHeight: '280px', width: 'auto', height: 'auto', display: 'block' }} loading="lazy" />
                        </div>
                        <div className={styles.tableScroll}>
                            <table className={`${styles.techTable} ${styles.techTableWide}`}>
                                <thead>
                                    <tr>
                                        <Th col="Part Number" label="Позначення Velnox" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="OEM" label="Перехресні аналоги" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="J (mm)" label="Діаметр ділильного кола J (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['j_mm'] || []} selectedFilters={filters['j_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D (mm)" label="Зовнішній діаметр D (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['D_mm'] || []} selectedFilters={filters['D_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D1 (mm)" label="Зовнішній діаметр D1 (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['D1_mm'] || []} selectedFilters={filters['D1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="d (mm)" label="Діаметр отвору d (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['d_mm'] || []} selectedFilters={filters['d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="C (mm)" label="Відстань між отворами C (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['C_mm'] || []} selectedFilters={filters['C_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="H/T" label="Отвір / Різьба H/T" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['hole_thread'] || []} selectedFilters={filters['hole_thread'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="G" label="Внутрішня різьба G" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['G'] || []} selectedFilters={filters['G'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L (mm)" label="Загальна довжина L (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['L_mm'] || []} selectedFilters={filters['L_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L1 (mm)" label="Глибина розточки L1 (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['L1_mm'] || []} selectedFilters={filters['L1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="F (mm)" label="Довжина різьбової частини F (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['F_mm'] || []} selectedFilters={filters['F_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Mass (kg)" label="Маса (кг)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['mass_kg'] || []} selectedFilters={filters['mass_kg'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Cdyn (kN)" label="Динамічна вантажо-підйомність Cdyn (кН)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['cdyn_kn'] || []} selectedFilters={filters['cdyn_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Co (kN)" label="Статична вантажо-підйомність Co (кН)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['co_kn'] || []} selectedFilters={filters['co_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Pu (kN)" label="Граничне навантаження втомної міцності Pu (кН)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['pu_kn'] || []} selectedFilters={filters['pu_kn'] || []} onFilterChange={handleFilterChange} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT1.map((row, i) => {
                                        const slugT1 = articleToSlug(row['part_number'] || '');
                                        return (
                                        <tr key={i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                <Link href={`/${locale}/products/hubs/${slugT1}`} className={styles.designationLink}>{row['part_number']}</Link>
                                            </td>
                                            <td data-label="Перехресні аналоги" className={styles.analoguesCell}>{renderTightCell(row['oem'])}</td>
                                            <td data-label="J (мм)">{row['j_mm']}</td>
                                            <td data-label="D (мм)">{row['D_mm']}</td>
                                            <td data-label="D1 (мм)">{row['D1_mm']}</td>
                                            <td data-label="d (мм)">{row['d_mm']}</td>
                                            <td data-label="C (мм)">{row['C_mm']}</td>
                                            <td data-label="H/T">{row['hole_thread']}</td>
                                            <td data-label="G">{row['G']}</td>
                                            <td data-label="L (мм)">{row['L_mm']}</td>
                                            <td data-label="L1 (мм)">{row['L1_mm']}</td>
                                            <td data-label="F (мм)">{row['F_mm']}</td>
                                            <td data-label="Маса (кг)">{row['mass_kg']}</td>
                                            <td data-label="Cdyn (кН)">{row['cdyn_kn']}</td>
                                            <td data-label="Co (кН)">{row['co_kn']}</td>
                                            <td data-label="Pu (кН)">{row['pu_kn']}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['part_number'] || '')}>
                                                    {t('hubsPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                    {sortedT1.length === 0 && (
                                        <tr><td colSpan={16} className={styles.emptyState}>Нічого не знайдено</td></tr>
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
                    src="/images/hubs/bednar-field.png"
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
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table2.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table2.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={`${styles.techTable} ${styles.techTableWide}`}>
                                <thead>
                                    <tr>
                                        <Th col="Part Number" label="Позначення Velnox" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="J (mm)" label="Діаметр ділильного кола J (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['j_mm'] || []} selectedFilters={filters['j_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D (mm)" label="Зовнішній діаметр D (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['D_mm'] || []} selectedFilters={filters['D_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="H/T" label="Отвір / Різьба H/T" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['hole_thread'] || []} selectedFilters={filters['hole_thread'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="d (mm)" label="Діаметр отвору d (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['d_mm'] || []} selectedFilters={filters['d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="C (mm)" label="Відстань між отворами C (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['C_mm'] || []} selectedFilters={filters['C_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="M_thread" label="Різьба M" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['M_thread'] || []} selectedFilters={filters['M_thread'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L (mm)" label="Загальна довжина L (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['L_mm'] || []} selectedFilters={filters['L_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L1 (mm)" label="Глибина розточки L1 (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['L1_mm'] || []} selectedFilters={filters['L1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="E (mm)" label="Відстань E (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['E_mm'] || []} selectedFilters={filters['E_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="F (mm)" label="Довжина різьбової частини F (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['F_mm'] || []} selectedFilters={filters['F_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Mass (kg)" label="Маса (кг)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['mass_kg'] || []} selectedFilters={filters['mass_kg'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Cdyn (kN)" label="Динамічна вантажо-підйомність Cdyn (кН)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['cdyn_kn'] || []} selectedFilters={filters['cdyn_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Co (kN)" label="Статична вантажо-підйомність Co (кН)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['co_kn'] || []} selectedFilters={filters['co_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Pu (kN)" label="Граничне навантаження втомної міцності Pu (кН)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['pu_kn'] || []} selectedFilters={filters['pu_kn'] || []} onFilterChange={handleFilterChange} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT2.map((row, i) => {
                                        const slugT2 = articleToSlug(row['part_number'] || '');
                                        return (
                                        <tr key={i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                <Link href={`/${locale}/products/hubs/${slugT2}`} className={styles.designationLink}>{row['part_number']}</Link>
                                            </td>
                                            <td data-label="J (мм)">{row['j_mm']}</td>
                                            <td data-label="D (мм)">{row['D_mm']}</td>
                                            <td data-label="H/T">{row['hole_thread']}</td>
                                            <td data-label="d (мм)">{row['d_mm']}</td>
                                            <td data-label="C (мм)">{row['C_mm']}</td>
                                            <td data-label="M">{row['M_thread']}</td>
                                            <td data-label="L (мм)">{row['L_mm']}</td>
                                            <td data-label="L1 (мм)">{row['L1_mm']}</td>
                                            <td data-label="E (мм)">{row['E_mm']}</td>
                                            <td data-label="F (мм)">{row['F_mm']}</td>
                                            <td data-label="Маса (кг)">{row['mass_kg']}</td>
                                            <td data-label="Cdyn (кН)">{row['cdyn_kn']}</td>
                                            <td data-label="Co (кН)">{row['co_kn']}</td>
                                            <td data-label="Pu (кН)">{row['pu_kn']}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['part_number'] || '')}>
                                                    {t('hubsPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                    {sortedT2.length === 0 && (
                                        <tr><td colSpan={16} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── APP BLOCK 3 ── */}
            <section ref={app3Ref.ref} className={`${styles.blueprintBlock} ${app3Ref.inView ? styles.blueprintVisible : ''}`}>
                <Image
                    src="/images/hubs/seeder-field.png"
                    alt=""
                    fill
                    priority={false}
                    style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
                />
                <div className={styles.blueprintDarkOverlay} />
                <div className={styles.blueprintLayout}>
                    <div className={styles.blueprintText}>
                        <span className={styles.blueprintTag}>
                            <span className={styles.blueprintTagLine} />
                            HIGH-SPEED SEEDERS
                        </span>
                        <h2 className={styles.blueprintTitle}>{t('hubsPage.app3.title')}</h2>
                        <p className={styles.blueprintLead}>{t('hubsPage.app3.desc')}</p>
                        <div className={styles.blueprintMeta}>
                            <div className={styles.blueprintMetaItem}>
                                <span className={styles.blueprintMetaLabel}>Сфера застосування</span>
                                <span className={styles.blueprintMetaValue}>{t('hubsPage.app3.applications')}</span>
                            </div>
                            <div className={styles.blueprintMetaItem}>
                                <span className={styles.blueprintMetaLabel}>OEM-сумісність</span>
                                <span className={styles.blueprintMetaValue}>{t('hubsPage.app3.oem_focus')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    {/* TABLE 3 */}
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table3.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={`${styles.techTable} ${styles.techTableWide}`}>
                                <thead>
                                    <tr>
                                        <Th col="Part Number" label="Позначення Velnox" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="J (mm)" label="Діаметр ділильного кола J (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['j_mm'] || []} selectedFilters={filters['j_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D (mm)" label="Зовнішній діаметр D (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['D_mm'] || []} selectedFilters={filters['D_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="D1 (mm)" label="Зовнішній діаметр D1 (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['D1_mm'] || []} selectedFilters={filters['D1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="d (mm)" label="Діаметр отвору d (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['d_mm'] || []} selectedFilters={filters['d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="H/T" label="Отвір / Різьба H/T" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['hole_thread'] || []} selectedFilters={filters['hole_thread'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L (mm)" label="Загальна довжина L (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['L_mm'] || []} selectedFilters={filters['L_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="B (mm)" label="Ширина B (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['B_mm'] || []} selectedFilters={filters['B_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Mass (kg)" label="Маса (кг)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['mass_kg'] || []} selectedFilters={filters['mass_kg'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Cdyn (kN)" label="Динамічна вантажо-підйомність Cdyn (кН)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['cdyn_kn'] || []} selectedFilters={filters['cdyn_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Co (kN)" label="Статична вантажо-підйомність Co (кН)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['co_kn'] || []} selectedFilters={filters['co_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Pu (kN)" label="Граничне навантаження втомної міцності Pu (кН)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['pu_kn'] || []} selectedFilters={filters['pu_kn'] || []} onFilterChange={handleFilterChange} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT3.map((row, i) => {
                                        const slugT3 = articleToSlug(row['part_number'] || '');
                                        return (
                                        <tr key={i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                <Link href={`/${locale}/products/hubs/${slugT3}`} className={styles.designationLink}>{row['part_number']}</Link>
                                            </td>
                                            <td data-label="J (мм)">{row['j_mm']}</td>
                                            <td data-label="D (мм)">{row['D_mm']}</td>
                                            <td data-label="D1 (мм)">{row['D1_mm']}</td>
                                            <td data-label="d (мм)">{row['d_mm']}</td>
                                            <td data-label="H/T">{row['hole_thread']}</td>
                                            <td data-label="L (мм)">{row['L_mm']}</td>
                                            <td data-label="B (мм)">{row['B_mm']}</td>
                                            <td data-label="Маса (кг)">{row['mass_kg']}</td>
                                            <td data-label="Cdyn (кН)">{row['cdyn_kn']}</td>
                                            <td data-label="Co (кН)">{row['co_kn']}</td>
                                            <td data-label="Pu (кН)">{row['pu_kn']}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['part_number'] || '')}>
                                                    {t('hubsPage.block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                    {sortedT3.length === 0 && (
                                        <tr><td colSpan={13} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA SECTION */}
            <section className={styles.cta} ref={ctaRef.ref}>
                <div className={`${styles.container} ${ctaRef.inView ? styles.animIn : ''}`}>
                    <h2 className={styles.ctaTitle}>{t('hubsPage.block3.title')}</h2>
                    <p className={styles.ctaText}>{t('hubsPage.block3.text')}</p>
                    <div className={styles.ctaButtons}>
                        <button className={styles.btnPrimary} onClick={() => setModalProduct('General Engineering Support')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            {t('hubsPage.block3.btn_contact')}
                        </button>
                        <button className={styles.btnSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            {t('hubsPage.block3.btn_pdf')}
                        </button>
                        <button className={styles.btnSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            {t('hubsPage.block3.btn_cad')}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
