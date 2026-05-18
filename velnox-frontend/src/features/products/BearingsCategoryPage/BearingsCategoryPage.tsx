'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styles from './bearings.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';
import buqData from '../data/buqTable1Data.json';

/* ─── Shared Hooks ─── */
function useInView(threshold = 0.12) {
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

/* ─── Lead form Modal ─── */
function LeadModal({ onClose, defaultDesignation = '' }: { onClose: () => void, defaultDesignation?: string }) {
    const t = useTranslations('distributors');
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', country: '', message: defaultDesignation ? `Запит на: ${defaultDesignation}` : '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

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
                                <button type="submit" className={styles.formSubmit}>
                                    {t('form.submit')}
                                </button>
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

/* ─── Brand cell: each brand on its own line ─── */
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

/* ─── Intro Block 2: Performance Specs ─── */
function PerformanceIntro() {
    const { ref, inView } = useInView(0.1);
    return (
        <section className={`${styles.introBlock} ${styles.introBlockPerformance} ${inView ? styles.animIn : ''}`} ref={ref as React.Ref<HTMLElement>}>
            <div className={styles.container}>
                <div className={styles.introBanner}>
                    <div className={styles.introText}>
                        <div className={styles.introTag}>PERFORMANCE DATA</div>
                        <h2 className={styles.introTitle}>
                            Ресурс та навантаження вузлів
                        </h2>
                        <p className={styles.introCopy}>
                            Для OEM-виробників критично точно оцінювати ресурс і навантаження вузлів.<br />
                            VELNOX надає параметри:<br />
                            динамічної (C) та статичної (C₀) вантажопідйомності,<br />
                            а також допустимі експлуатаційні навантаження.<br /><br />
                            <strong>Це дозволяє:</strong>
                            <ul className={styles.introList}>
                                <li>коректно розрахувати ресурс</li>
                                <li>закласти запас міцності</li>
                                <li>інтегрувати вузол без ризиків</li>
                            </ul>
                        </p>
                    </div>
                    <div className={styles.introGraphic}>
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.forceDiagram}>
                            <circle cx="100" cy="100" r="55" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
                            <circle cx="100" cy="100" r="35" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
                            <circle cx="100" cy="100" r="18" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" />
                            <line x1="100" y1="40" x2="100" y2="75" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" className={styles.forceLine} />
                            <polygon points="100,80 95,68 105,68" fill="#3b82f6" />
                            <text x="107" y="55" fill="rgba(59,130,246,0.9)" fontSize="11" fontFamily="monospace">Fr</text>
                            <line x1="160" y1="100" x2="127" y2="100" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 2" className={styles.forceLine} />
                            <polygon points="122,100 134,95 134,105" fill="#22c55e" />
                            <text x="164" y="104" fill="rgba(34,197,94,0.9)" fontSize="11" fontFamily="monospace">Fa</text>
                            <path d="M 100 62 A 38 38 0 0 1 138 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                            <polygon points="140,95 136,107 144,107" fill="rgba(255,255,255,0.2)" transform="rotate(45 140 101)" />
                            <text x="60" y="150" fill="rgba(59,130,246,0.7)" fontSize="10" fontFamily="monospace">Cdyn</text>
                            <text x="112" y="150" fill="rgba(34,197,94,0.7)" fontSize="10" fontFamily="monospace">Co</text>
                            <line x1="57" y1="153" x2="195" y2="153" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Intro Block 3: Cross-References Banner ─── */
function CrossRefIntro() {
    const { ref, inView } = useInView(0.1);
    const brands = ['HORSCH', 'LEMKEN', 'JOHN DEERE', 'SKF', 'INA', 'KINZE', 'CASE IH', 'NEW HOLLAND', 'AMAZONE', 'FAG', 'NSK'];
    return (
        <section className={`${styles.introBlock} ${styles.introBlockCrossRef} ${inView ? styles.animIn : ''}`} ref={ref as React.Ref<HTMLElement>}>
            <div className={styles.crossRefBannerContent}>
                <div className={styles.crossRefTag}>CROSS-REFERENCES & INSTALLATIONS</div>
                <h2 className={styles.crossRefTitle}>Безшовна інтеграція<br />без змін у конструкції техніки</h2>
                <p className={styles.crossRefCopy}>
                    Використання підшипникових вузлів VELNOX не потребує змін у кресленнях або посадкових місцях. Наші рішення є геометричними та функціональними аналогами вузлів провідних європейських брендів та оригінальних OEM-компонентів, тому можуть інтегруватися у техніку без додаткових доопрацювань.
                </p>
            </div>
            {/* Infinite marquee */}
            <div className={styles.marqueeWrapper}>
                <div className={styles.marqueeTrack}>
                    {[...brands, ...brands].map((brand, i) => (
                        <div key={i} className={styles.marqueeBrand}>{brand}</div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Intro Block 4: Sealing Systems ─── */
function SealingIntro() {
    const { ref, inView } = useInView(0.05);
    return (
        <section className={`${styles.introBlock} ${styles.introBlockSealing} ${inView ? styles.animIn : ''}`} ref={ref as React.Ref<HTMLElement>}>
            <div className={styles.container}>
                <div className={styles.sealingSplit}>
                    <div className={styles.sealingText}>
                        <div className={styles.introTag} style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>SEALING SYSTEMS</div>
                        <h2 className={styles.introTitle}>Інженерія захисту:<br />Адаптація під ваше середовище</h2>
                        <p className={styles.introCopy}>
                            Ми не пропонуємо підбирати деталі просто за розміром. Філософія VELNOX
                            полягає у підборі <strong>багатокромкової системи ущільнень</strong> строго під реальні умови
                            експлуатації вашої машини. Від базових контактних рішень для нейтральних середовищ до
                            екстремальних систем <strong>(Dirtblock + Forged cover plate)</strong>, розроблених для важких дискових борін.
                            Ви визначаєте агресивність середовища — ми гарантуємо, що абразив, пил та волога
                            ніколи не досягнуть тіла кочення.
                        </p>
                    </div>
                    <div className={styles.sealingDiagram}>
                        {/* Exploded view diagram */}
                        <div className={`${styles.sealLayer} ${styles.layer1} ${inView ? styles.exploded : ''}`}>
                            <div className={styles.sealLayerLabel}>Forged Cover Plate</div>
                        </div>
                        <div className={`${styles.sealLayer} ${styles.layer2} ${inView ? styles.exploded : ''}`}>
                            <div className={styles.sealLayerLabel}>Dirtblock Seal</div>
                        </div>
                        <div className={`${styles.sealLayer} ${styles.layer3} ${inView ? styles.exploded : ''}`}>
                            <div className={styles.sealLayerLabel}>T Seal (3-Lip)</div>
                        </div>
                        <div className={`${styles.sealLayer} ${styles.layer4} ${inView ? styles.exploded : ''}`}>
                            <div className={styles.sealLayerLabel}>Inner Ring Body</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Applications: keyword highlight helper ─── */
const APP_KEYWORDS = [
    'радіальних навантажень', 'сильного забруднення', 'низьких швидкостей обертання',
    'підсилених корпусів', 'систем ущільнення', 'оптимізованих внутрішніх зазорів',
    'захисту від забруднень', 'тривалого ресурсу', 'мінімальними вимогами до обслуговування',
    'стабільну роботу та зменшення простоїв', 'ударних впливів', 'запас міцності',
];

function HighlightedText({ text }: { text: string }) {
    const escaped = APP_KEYWORDS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(pattern);
    return (
        <>
            {parts.map((part, i) =>
                APP_KEYWORDS.some(k => k.toLowerCase() === part.toLowerCase())
                    ? <strong key={i} className={styles.appKeyword}>{part}</strong>
                    : part
            )}
        </>
    );
}

/* ─── Intro Block 5: Packer Roller Application ─── */
function PackerRollerIntro() {
    const t = useTranslations('bearingsPage.packer_roller');
    const { ref, inView } = useInView(0.05);
    const paragraphs = t('content').split('\n\n');

    return (
        <section
            className={`${styles.applicationsSection} ${inView ? styles.appSectionVisible : ''}`}
            ref={ref as React.Ref<HTMLElement>}
        >
            <div className={styles.appWatermark} aria-hidden>Applications</div>
            <div className={styles.appInner}>
                <div className={styles.appHeader}>
                    <span className={styles.appTag}>Applications</span>
                    <h2 className={styles.appTitle}>{t('title')}</h2>
                </div>
                <div className={styles.appBody}>
                    {paragraphs.map((para, i) => (
                        <p
                            key={i}
                            className={`${styles.appPara} ${i === 0 ? styles.appParaLead : ''} ${inView ? styles.appParaVisible : ''}`}
                            style={{ transitionDelay: `${0.25 + i * 0.15}s` }}
                        >
                            <HighlightedText text={para} />
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Helpers ─── */
const HAS_3D = new Set(['buq-309-2t3h', 'bucr-sg-309-s2', 'bup-207-x3l']);

function articleToSlug(article: string): string {
    return article.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/* ─── Main Page Component ─── */

export function BearingsCategoryPage({ locale, products = [] }: { locale: Locale, products?: ProductListItem[] }) {
    const t = useTranslations('bearingsPage');
    const heroRef = useInView();
    const approachRef = useInView();
    const tablesRef = useInView();
    const ctaRef = useInView();

    const searchHeaderRef = useRef<HTMLDivElement>(null);

    // Sticky header: IntersectionObserver без rootMargin
    // Observer стріляє коли sentinel перетинає верхній край viewport.
    // top < 0  → sentinel прокручено вгору → вмикаємо sticky
    // top >= 0 → sentinel видимий або нижче viewport → вимикаємо sticky
    useEffect(() => {
        const sentinel = document.getElementById('sticky-sentinel');
        if (!sentinel || !searchHeaderRef.current) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (!searchHeaderRef.current) return;
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    searchHeaderRef.current.classList.add(styles.isSticky);
                } else {
                    searchHeaderRef.current.classList.remove(styles.isSticky);
                }
            },
            { threshold: 0 }
        );
        obs.observe(sentinel);
        return () => obs.disconnect();
    }, []);

    const [modalProduct, setModalProduct] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [openFilterCol, setOpenFilterCol] = useState<string | null>(null);

    // Table data states
    const [table2Data, setTable2Data] = useState<any[]>([]);
    const [table3Data, setTable3Data] = useState<any[]>([]);
    const [table4Data, setTable4Data] = useState<any[]>([]);
    const [table5Data, setTable5Data] = useState<any[]>([]);
    const [loadingTables, setLoadingTables] = useState(true);

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

    // Fetch table data from API
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const [res2, res3, res4, res5] = await Promise.all([
                    fetch(`${apiBase}/v1/products/tables/bearings-t2`),
                    fetch(`${apiBase}/v1/products/tables/bearings-t3`),
                    fetch(`${apiBase}/v1/products/tables/bearings-t4`),
                    fetch(`${apiBase}/v1/products/tables/bearings-t5`),
                ]);

                if (res2.ok) setTable2Data(await res2.json());
                if (res3.ok) setTable3Data(await res3.json());
                if (res4.ok) setTable4Data(await res4.json());
                if (res5.ok) setTable5Data(await res5.json());
            } catch (err) {
                console.error('Error fetching table data:', err);
            } finally {
                setLoadingTables(false);
            }
        };

        fetchTableData();
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

    // Table 1: BUQ Dimensional Specs
    const filteredT1 = useMemo(() => {
        let rows = buqData as any[];
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
    }, [searchQuery, filters]);

    // Table 2: Performance data — from API
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

    // Table 3: Cross-references & applications — from API
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

    // Table 4: Additional specs — from API
    const filteredT4 = useMemo(() => {
        let rows = table4Data;
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
    }, [searchQuery, filters, table4Data]);

    // Table 5: Additional specs — from API
    const filteredT5 = useMemo(() => {
        let rows = table5Data;
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
    }, [searchQuery, filters, table5Data]);

    // Unique bore diameter values across all tables
    const allOptions = useMemo(() => {
        const all: Record<string, Set<string>> = {};
        const buq = buqData as any[];
        [...buq, ...table2Data, ...table3Data, ...table4Data, ...table5Data].forEach(r => {
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
    }, [table2Data, table3Data, table4Data, table5Data]);

    const { sorted: sortedT1, sortCol: sc1, sortDir: sd1, toggle: tog1 } = useSortableTable(filteredT1);
    const { sorted: sortedT2, sortCol: sc2, sortDir: sd2, toggle: tog2 } = useSortableTable(filteredT2);
    const { sorted: sortedT3, sortCol: sc3, sortDir: sd3, toggle: tog3 } = useSortableTable(filteredT3);
    const { sorted: sortedT4, sortCol: sc4, sortDir: sd4, toggle: tog4 } = useSortableTable(filteredT4);
    const { sorted: sortedT5, sortCol: sc5, sortDir: sd5, toggle: tog5 } = useSortableTable(filteredT5);

    return (
        <main className={styles.page}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* 1. HERO SECTION */}
            <section className={styles.hero} ref={heroRef.ref}>
                <div className={`${styles.container} ${styles.heroContainer} ${heroRef.inView ? styles.animIn : ''}`}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine}></span>
                            VELNOX BEARING UNITS
                        </div>
                        <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
                        <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
                    </div>
                    <div className={styles.heroImageWrap}>
                        <Image
                            src="/velnox/images/bearings/hero-bearing.png"
                            alt="VELNOX Bearing Unit Cross Section"
                            width={520}
                            height={520}
                            priority
                            className={styles.heroImage}
                        />
                    </div>
                </div>
            </section>



            {/* ─── Application: Packer Roller ─── */}
            <PackerRollerIntro />

            {/* 3. TECHNICAL TABLES */}
            <section className={styles.tablesSection} ref={tablesRef.ref}>
                <div className={`${styles.tableSectionContainer} ${tablesRef.inView ? styles.animIn : ''}`}>

                    {/* Sentinel element — коли він зникає з viewport, header стає sticky */}
                    <div id="sticky-sentinel" style={{ height: 1, marginTop: -1 }} />

                    <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                        <div className={styles.stickyContainer}>
                            <div className={styles.container}>
                                <div className={styles.tablesHeader}>
                                    <div className={styles.headerTitles}>
                                        <h2 className={styles.sectionTitle}>{t('block2.title')}</h2>
                                        <p className={styles.tablesIntro}>{t('block2.intro')}</p>
                                    </div>
                                    <div className={styles.searchWrap}>
                                        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input
                                            type="text"
                                            className={styles.searchInput}
                                            placeholder={t('block2.search_placeholder')}
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── BUQ Technical Schema (above Table 1) ─── */}
                    <div className={styles.buqDrawingBlock}>
                        <div className={styles.buqDrawingTitle}>ТЕХНІЧНЕ КРЕСЛЕННЯ — BUQ SERIES</div>
                        <div className={styles.buqDrawingCompositeSingle}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/velnox/images/products/_shared/bearings-t1/schema.webp"
                                alt="BUQ Series Technical Drawing"
                                style={{ maxWidth: '100%', maxHeight: '280px', width: 'auto', height: 'auto', display: 'block' }}
                            />
                        </div>
                    </div>

                    {/* ─── Table 1: BUQ Dimensional & Load Specs ─── */}
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table1.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={`${styles.techTable} ${styles.techTableCompact}`}>
                                <thead>
                                    <tr>
                                        <Th col="article" label="Позначення Velnox" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="cross_ref" label="Перехресні аналоги" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="brand" label="Бренд" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['brand'] || []} selectedFilters={filters['brand'] || []} onFilterChange={handleFilterChange} />
                                        <Th
                                            col="d_mm" label="Діаметр отвору d (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1}

                                        hasFilter filterOptions={allOptions['d_mm'] || []} selectedFilters={filters['d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="d_inch" label="Діаметр отвору d (дюйм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['d_inch'] || []} selectedFilters={filters['d_inch'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="A1" label="Загальна ширина корпусу A1 (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['A1'] || []} selectedFilters={filters['A1'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="A2" label="Товщина фланця корпусу A2 (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['A2'] || []} selectedFilters={filters['A2'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="J" label="Відстань між отворами J (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['J'] || []} selectedFilters={filters['J'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="L" label="Загальна довжина L (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['L'] || []} selectedFilters={filters['L'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="N" label="Діаметр отвору N (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['N'] || []} selectedFilters={filters['N'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="A" label="Загальна ширина A (мм)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['A'] || []} selectedFilters={filters['A'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="mass_kg" label="Маса (кг)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['mass_kg'] || []} selectedFilters={filters['mass_kg'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Cdyn" label="Динамічна вантажо-підйомність Cdyn (кН)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Cdyn'] || []} selectedFilters={filters['Cdyn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Co" label="Статична вантажо-підйомність Co (кН)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Co'] || []} selectedFilters={filters['Co'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="Pu" label="Граничне навантаження втомної міцності Pu (кН)" toggle={tog1} sortCol={sc1} sortDir={sd1} hasFilter filterOptions={allOptions['Pu'] || []} selectedFilters={filters['Pu'] || []} onFilterChange={handleFilterChange} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT1.map((row, i) => (
                                        <tr key={row.slug || i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                <Link href={`/${locale}/products/bearings/${row.slug}`} className={styles.designationLink}>
                                                    {row.article}
                                                </Link>
                                            </td>
                                            <td data-label="Перехресні аналоги" className={styles.analoguesCell}>{renderTightCell(row.cross_ref)}</td>
                                            <td data-label="Бренд">{renderBrandCell(row.brand)}</td>
                                            <td data-label="Діаметр отвору d (мм)">{row.d_mm}</td>
                                            <td data-label="Діаметр отвору d (дюйм)">{row.d_inch ?? '—'}</td>
                                            <td data-label="Загальна ширина корпусу A1 (мм)">{row.A1}</td>
                                            <td data-label="Товщина фланця корпусу A2 (мм)">{row.A2}</td>
                                            <td data-label="Відстань між отворами J (мм)">{row.J}</td>
                                            <td data-label="Загальна довжина L (мм)">{row.L}</td>
                                            <td data-label="Діаметр отвору N (мм)">{row.N}</td>
                                            <td data-label="Загальна ширина A (мм)">{row.A}</td>
                                            <td data-label="Маса (кг)">{row.mass_kg}</td>
                                            <td data-label="Динамічна вантажо-підйомність Cdyn (кН)">{row.Cdyn}</td>
                                            <td data-label="Статична вантажо-підйомність Co (кН)">{row.Co}</td>
                                            <td data-label="Граничне навантаження втомної міцності Pu (кН)">{row.Pu}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row.article)}>
                                                    {t('block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredT1.length === 0 && (
                                        <tr><td colSpan={16} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* ─── Section: Table 2: Performance Data ─── */}
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table2.title')}</h3>
                        <p className={styles.tableDesc}></p>

                        {/* Diagram for Table 2 — same file as product card */}
                        <div className={styles.tableDiagramContainer}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/velnox/images/products/_shared/bearings-t2/schema.webp"
                                alt="BUQ 308-2T3H-DS Technical Drawing"
                                style={{ maxWidth: '100%', maxHeight: '280px', width: 'auto', height: 'auto', display: 'block' }}
                                loading="lazy"
                            />
                        </div>

                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <Th col="part_number" label="Позначення Velnox" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="bearing_designation" label="Позначення підшипника" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="brand_name" label="Бренд" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['brand_name'] || []} selectedFilters={filters['brand_name'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="cross_reference" label="Перехресні аналоги" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="bore_diameter_d_mm" label="Діаметр отвору d (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['bore_diameter_d_mm'] || []} selectedFilters={filters['bore_diameter_d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="total_housing_width_a1_mm" label="Загальна ширина корпусу A1 (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['total_housing_width_a1_mm'] || []} selectedFilters={filters['total_housing_width_a1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="housing_flange_thickness_a2_mm" label="Товщина фланця корпусу A2 (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['housing_flange_thickness_a2_mm'] || []} selectedFilters={filters['housing_flange_thickness_a2_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="distance_between_holes_j_mm" label="Відстань між отворами J (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['distance_between_holes_j_mm'] || []} selectedFilters={filters['distance_between_holes_j_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="total_length_l_mm" label="Загальна довжина L (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['total_length_l_mm'] || []} selectedFilters={filters['total_length_l_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="hole_thread_ht" label="Отвір / Різьба H/T" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['hole_thread_ht'] || []} selectedFilters={filters['hole_thread_ht'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="overall_width_a_mm" label="Загальна ширина A (мм)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['overall_width_a_mm'] || []} selectedFilters={filters['overall_width_a_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="mass_kg" label="Маса (кг)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['mass_kg'] || []} selectedFilters={filters['mass_kg'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="dynamic_load_rating_cdyn_kn" label="Динамічна вантажо-підйомність Cdyn (кН)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['dynamic_load_rating_cdyn_kn'] || []} selectedFilters={filters['dynamic_load_rating_cdyn_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="static_load_rating_co_kn" label="Статична вантажо-підйомність Co (кН)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['static_load_rating_co_kn'] || []} selectedFilters={filters['static_load_rating_co_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="fatigue_load_limit_pu_kn" label="Граничне навантаження втомної міцності Pu (кН)" toggle={tog2} sortCol={sc2} sortDir={sd2} hasFilter filterOptions={allOptions['fatigue_load_limit_pu_kn'] || []} selectedFilters={filters['fatigue_load_limit_pu_kn'] || []} onFilterChange={handleFilterChange} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT2.map((row, i) => {
                                        const slug2 = articleToSlug(row['part_number'] || '');
                                        return (
                                        <tr key={i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                <Link href={`/${locale}/products/bearings/${slug2}`} className={styles.designationLink}>
                                                    {row['part_number'] || '-'}
                                                </Link>
                                            </td>
                                            <td data-label="Позначення підшипника">{renderTightCell(row['bearing_designation'])}</td>
                                            <td data-label="Бренд">{renderBrandCell(row['brand_name'])}</td>
                                            <td data-label="Перехресні аналоги" className={styles.analoguesCell}>{renderTightCell(row['cross_reference'])}</td>
                                            <td data-label="Діаметр отвору d (мм)">{row['bore_diameter_d_mm'] || '-'}</td>
                                            <td data-label="Загальна ширина корпусу A1 (мм)">{row['total_housing_width_a1_mm'] || '-'}</td>
                                            <td data-label="Товщина фланця корпусу A2 (мм)">{row['housing_flange_thickness_a2_mm'] || '-'}</td>
                                            <td data-label="Відстань між отворами J (мм)">{row['distance_between_holes_j_mm'] || '-'}</td>
                                            <td data-label="Загальна довжина L (мм)">{row['total_length_l_mm'] || '-'}</td>
                                            <td data-label="Отвір / Різьба H/T">{row['hole_thread_ht'] || '-'}</td>
                                            <td data-label="Загальна ширина A (мм)">{row['overall_width_a_mm'] || '-'}</td>
                                            <td data-label="Маса (кг)">{row['mass_kg'] || '-'}</td>
                                            <td data-label="Динамічна вантажо-підйомність Cdyn (кН)">{row['dynamic_load_rating_cdyn_kn'] || '-'}</td>
                                            <td data-label="Статична вантажо-підйомність Co (кН)">{row['static_load_rating_co_kn'] || '-'}</td>
                                            <td data-label="Граничне навантаження втомної міцності Pu (кН)">{row['fatigue_load_limit_pu_kn'] || '-'}</td>
                                        </tr>
                                        );
                                    })}
                                    {filteredT2.length === 0 && (
                                        <tr><td colSpan={14} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* ─── Section: Table 3: Cross-References & Applications ─── */}
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table3.desc')}</p>

                        {/* Diagram for Table 3 — same file as product card */}
                        <div className={styles.tableDiagramContainer}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/velnox/images/products/_shared/bearings-t3/schema.webp"
                                alt="BUQ 309-2T3H Technical Drawing"
                                style={{ maxWidth: '100%', maxHeight: '280px', width: 'auto', height: 'auto', display: 'block' }}
                                loading="lazy"
                            />
                        </div>

                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <Th col="part_number" label="Позначення Velnox" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="bearing_designation" label="Позначення підшипника" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="brand_name" label="Бренд" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['brand_name'] || []} selectedFilters={filters['brand_name'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="cross_reference" label="Перехресні аналоги" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="bore_diameter_d_mm" label="Діаметр отвору d (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['bore_diameter_d_mm'] || []} selectedFilters={filters['bore_diameter_d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="total_length_l_mm" label="Загальна довжина L (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['total_length_l_mm'] || []} selectedFilters={filters['total_length_l_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="distance_between_holes_j_mm" label="Відстань між отворами J (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['distance_between_holes_j_mm'] || []} selectedFilters={filters['distance_between_holes_j_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="hole_thread_ht_mm" label="Отвір / Різьба H/T (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['hole_thread_ht_mm'] || []} selectedFilters={filters['hole_thread_ht_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="overall_width_a_mm" label="Загальна ширина A (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['overall_width_a_mm'] || []} selectedFilters={filters['overall_width_a_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="total_housing_width_a1_mm" label="Загальна ширина корпусу A1 (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['total_housing_width_a1_mm'] || []} selectedFilters={filters['total_housing_width_a1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="housing_flange_thickness_a2_mm" label="Товщина фланця корпусу A2 (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['housing_flange_thickness_a2_mm'] || []} selectedFilters={filters['housing_flange_thickness_a2_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="width_inner_ring_b_mm" label="Ширина внутрішнього кільця B (мм)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['width_inner_ring_b_mm'] || []} selectedFilters={filters['width_inner_ring_b_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="static_load_rating_co_kn" label="Статична вантажо-підйомність Co (кН)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['static_load_rating_co_kn'] || []} selectedFilters={filters['static_load_rating_co_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="dynamic_load_rating_cdyn_kn" label="Динамічна вантажо-підйомність Cdyn (кН)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['dynamic_load_rating_cdyn_kn'] || []} selectedFilters={filters['dynamic_load_rating_cdyn_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="fatigue_load_limit_pu_kn" label="Граничне навантаження втомної міцності Pu (кН)" toggle={tog3} sortCol={sc3} sortDir={sd3} hasFilter filterOptions={allOptions['fatigue_load_limit_pu_kn'] || []} selectedFilters={filters['fatigue_load_limit_pu_kn'] || []} onFilterChange={handleFilterChange} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT3.map((row, i) => {
                                        const slug3 = articleToSlug(row['part_number'] || '');
                                        return (
                                        <tr key={i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                {row['part_number'] ? (
                                                    <Link href={`/${locale}/products/bearings/${slug3}`} className={styles.designationLink}>{row['part_number']}</Link>
                                                ) : '-'}
                                            </td>
                                            <td data-label="Позначення підшипника">{renderTightCell(row['bearing_designation'])}</td>
                                            <td data-label="Бренд">{renderBrandCell(row['brand_name'])}</td>
                                            <td data-label="Перехресні аналоги" className={styles.analoguesCell}>{renderTightCell(row['cross_reference'])}</td>
                                            <td data-label="Діаметр отвору d (мм)">{row['bore_diameter_d_mm'] || '-'}</td>
                                            <td data-label="Загальна довжина L (мм)">{row['total_length_l_mm'] || '-'}</td>
                                            <td data-label="Відстань між отворами J (мм)">{row['distance_between_holes_j_mm'] || '-'}</td>
                                            <td data-label="Отвір / Різьба H/T (мм)">{row['hole_thread_ht_mm'] || '-'}</td>
                                            <td data-label="Загальна ширина A (мм)">{row['overall_width_a_mm'] || '-'}</td>
                                            <td data-label="Загальна ширина корпусу A1 (мм)">{row['total_housing_width_a1_mm'] || '-'}</td>
                                            <td data-label="Товщина фланця корпусу A2 (мм)">{row['housing_flange_thickness_a2_mm'] || '-'}</td>
                                            <td data-label="Ширина внутрішнього кільця B (мм)">{row['width_inner_ring_b_mm'] || '-'}</td>
                                            <td data-label="Статична вантажо-підйомність Co (кН)">{row['static_load_rating_co_kn'] || '-'}</td>
                                            <td data-label="Динамічна вантажо-підйомність Cdyn (кН)">{row['dynamic_load_rating_cdyn_kn'] || '-'}</td>
                                            <td data-label="Граничне навантаження втомної міцності Pu (кН)">{row['fatigue_load_limit_pu_kn'] || '-'}</td>
                                        </tr>
                                        );
                                    })}
                                    {filteredT3.length === 0 && (
                                        <tr><td colSpan={15} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* ─── Grouped Technical Tables Section (Tables 4 & 5) ─── */}
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table4.title')}</h3>
                        <div className={styles.tableScroll}>
                            <table className={`${styles.techTable} ${styles.techTableWide}`}>
                                <thead>
                                    <tr>
                                        <Th col="part_number" label="Позначення Velnox" toggle={tog4} sortCol={sc4} sortDir={sd4} />
                                        <Th col="bearing_designation" label="Позначення підшипника" toggle={tog4} sortCol={sc4} sortDir={sd4} />
                                        <Th col="brand_name" label="Бренд" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['brand_name'] || []} selectedFilters={filters['brand_name'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="cross_reference" label="Перехресні аналоги" toggle={tog4} sortCol={sc4} sortDir={sd4} />
                                        <Th col="bore_diameter_d_mm" label="Діаметр отвору d (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['bore_diameter_d_mm'] || []} selectedFilters={filters['bore_diameter_d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="centering_diameter_d1_mm" label="Центруючий діаметр d1 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['centering_diameter_d1_mm'] || []} selectedFilters={filters['centering_diameter_d1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="housing_overall_width_l1_mm" label="Загальна ширина корпусу L1 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['housing_overall_width_l1_mm'] || []} selectedFilters={filters['housing_overall_width_l1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="distance_between_holes_j1_mm" label="Відстань між отворами J1 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['distance_between_holes_j1_mm'] || []} selectedFilters={filters['distance_between_holes_j1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="housing_overall_width_l2_mm" label="Загальна ширина корпусу L2 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['housing_overall_width_l2_mm'] || []} selectedFilters={filters['housing_overall_width_l2_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="distance_between_holes_j2_mm" label="Відстань між отворами J2 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['distance_between_holes_j2_mm'] || []} selectedFilters={filters['distance_between_holes_j2_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="overall_width_a_mm" label="Загальна ширина A (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['overall_width_a_mm'] || []} selectedFilters={filters['overall_width_a_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="flange_width_a1_mm" label="Ширина фланця A1 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['flange_width_a1_mm'] || []} selectedFilters={filters['flange_width_a1_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="flange_width_a2_mm" label="Ширина фланця A2 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['flange_width_a2_mm'] || []} selectedFilters={filters['flange_width_a2_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="centering_diameter_height_a3_mm" label="Висота центруючого діаметра A3 (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['centering_diameter_height_a3_mm'] || []} selectedFilters={filters['centering_diameter_height_a3_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="threaded_hole_size_t" label="Різьбовий отвір T" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['threaded_hole_size_t'] || []} selectedFilters={filters['threaded_hole_size_t'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="hole_diameter_h_mm" label="Діаметр отвору H (мм)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['hole_diameter_h_mm'] || []} selectedFilters={filters['hole_diameter_h_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="mass_kg" label="Маса (кг)" toggle={tog4} sortCol={sc4} sortDir={sd4} hasFilter filterOptions={allOptions['mass_kg'] || []} selectedFilters={filters['mass_kg'] || []} onFilterChange={handleFilterChange} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT4.map((row, i) => {
                                        const slug4 = articleToSlug(row['part_number'] || '');
                                        return (
                                        <tr key={i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                {row['part_number'] ? (
                                                    <Link href={`/${locale}/products/bearings/${slug4}`} className={styles.designationLink}>{row['part_number']}</Link>
                                                ) : '-'}
                                            </td>
                                            <td data-label="Позначення підшипника">{renderDesignationCell(row['bearing_designation'])}</td>
                                            <td data-label="Бренд">{renderBrandCell(row['brand_name'])}</td>
                                            <td data-label="Перехресні аналоги" className={styles.analoguesCell}>{renderTightCell(row['cross_reference'])}</td>
                                            <td data-label="Діаметр отвору d (мм)">{row['bore_diameter_d_mm'] || '-'}</td>
                                            <td data-label="Центруючий діаметр d1 (мм)">{row['centering_diameter_d1_mm'] || '-'}</td>
                                            <td data-label="Загальна ширина корпусу L1 (мм)">{row['housing_overall_width_l1_mm'] || '-'}</td>
                                            <td data-label="Відстань між отворами J1 (мм)">{row['distance_between_holes_j1_mm'] || '-'}</td>
                                            <td data-label="Загальна ширина корпусу L2 (мм)">{row['housing_overall_width_l2_mm'] || '-'}</td>
                                            <td data-label="Відстань між отворами J2 (мм)">{row['distance_between_holes_j2_mm'] || '-'}</td>
                                            <td data-label="Загальна ширина A (мм)">{row['overall_width_a_mm'] || '-'}</td>
                                            <td data-label="Ширина фланця A1 (мм)">{row['flange_width_a1_mm'] || '-'}</td>
                                            <td data-label="Ширина фланця A2 (мм)">{row['flange_width_a2_mm'] || '-'}</td>
                                            <td data-label="Висота центруючого діаметра A3 (мм)">{row['centering_diameter_height_a3_mm'] || '-'}</td>
                                            <td data-label="Різьбовий отвір T">{row['threaded_hole_size_t'] || '-'}</td>
                                            <td data-label="Діаметр отвору H (мм)">{row['hole_diameter_h_mm'] || '-'}</td>
                                            <td data-label="Маса (кг)">{row['mass_kg'] || '-'}</td>
                                        </tr>
                                        );
                                    })}
                                    {filteredT4.length === 0 && (
                                        <tr><td colSpan={17} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ─── Section: Table 5: Additional Bearing Specifications ─── */}

                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table5.title')}</h3>
                        <div className={styles.tableDiagramContainer}>
                            <Image
                                src="/velnox/images/products/_shared/bearings-t5/schema.webp"
                                alt="BUP 207-X3L Technical Drawing"
                                width={1200}
                                height={800}
                                style={{ maxWidth: '100%', maxHeight: '280px', width: 'auto', height: 'auto' }}
                                loading="lazy"
                            />
                        </div>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <Th col="part_number" label="Позначення Velnox" toggle={tog5} sortCol={sc5} sortDir={sd5} />
                                        <Th col="bearing_designation" label="Позначення підшипника" toggle={tog5} sortCol={sc5} sortDir={sd5} />
                                        <Th col="brand_name" label="Бренд" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['brand_name'] || []} selectedFilters={filters['brand_name'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="cross_reference" label="Перехресні аналоги" toggle={tog5} sortCol={sc5} sortDir={sd5} />
                                        <Th col="bore_diameter_d_mm" label="Діаметр отвору d (мм)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['bore_diameter_d_mm'] || []} selectedFilters={filters['bore_diameter_d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="outside_diameter_d_mm" label="Зовнішній діаметр D (мм)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['outside_diameter_d_mm'] || []} selectedFilters={filters['outside_diameter_d_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="pitch_circle_diameter_j_mm" label="Діаметр кола отворів J (мм)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['pitch_circle_diameter_j_mm'] || []} selectedFilters={filters['pitch_circle_diameter_j_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="hole_thread_ht" label="Отвір / Різьба H/T" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['hole_thread_ht'] || []} selectedFilters={filters['hole_thread_ht'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="overall_width_a_mm" label="Загальна ширина A (мм)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['overall_width_a_mm'] || []} selectedFilters={filters['overall_width_a_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="housing_flange_thickness_a2_mm" label="Товщина фланця корпусу A2 (мм)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['housing_flange_thickness_a2_mm'] || []} selectedFilters={filters['housing_flange_thickness_a2_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="width_inner_ring_b_mm" label="Ширина внутрішнього кільця B (мм)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['width_inner_ring_b_mm'] || []} selectedFilters={filters['width_inner_ring_b_mm'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="mass_kg" label="Маса (кг)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['mass_kg'] || []} selectedFilters={filters['mass_kg'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="static_load_rating_co_kn" label="Статична вантажо-підйомність Co (кН)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['static_load_rating_co_kn'] || []} selectedFilters={filters['static_load_rating_co_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="dynamic_load_rating_cdyn_kn" label="Динамічна вантажо-підйомність Cdyn (кН)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['dynamic_load_rating_cdyn_kn'] || []} selectedFilters={filters['dynamic_load_rating_cdyn_kn'] || []} onFilterChange={handleFilterChange} />
                                        <Th col="fatigue_load_limit_pu_kn" label="Граничне навантаження втомної міцності Pu (кН)" toggle={tog5} sortCol={sc5} sortDir={sd5} hasFilter filterOptions={allOptions['fatigue_load_limit_pu_kn'] || []} selectedFilters={filters['fatigue_load_limit_pu_kn'] || []} onFilterChange={handleFilterChange} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT5.map((row, i) => {
                                        const slug5 = articleToSlug(row['part_number'] || '');
                                        return (
                                        <tr key={i}>
                                            <td data-label="Позначення Velnox" className={styles.partNumCell}>
                                                {row['part_number'] ? (
                                                    <Link href={`/${locale}/products/bearings/${slug5}`} className={styles.designationLink}>{row['part_number']}</Link>
                                                ) : '-'}
                                            </td>
                                            <td data-label="Позначення підшипника">{renderDesignationCell(row['bearing_designation'])}</td>
                                            <td data-label="Бренд">{renderBrandCell(row['brand_name'])}</td>
                                            <td data-label="Перехресні аналоги" className={styles.analoguesCell}>{renderTightCell(row['cross_reference'])}</td>
                                            <td data-label="Діаметр отвору d (мм)">{row['bore_diameter_d_mm'] || '-'}</td>
                                            <td data-label="Зовнішній діаметр D (мм)">{row['outside_diameter_d_mm'] || '-'}</td>
                                            <td data-label="Діаметр кола отворів J (мм)">{row['pitch_circle_diameter_j_mm'] || '-'}</td>
                                            <td data-label="Отвір / Різьба H/T">{row['hole_thread_ht'] || '-'}</td>
                                            <td data-label="Загальна ширина A (мм)">{row['overall_width_a_mm'] || '-'}</td>
                                            <td data-label="Товщина фланця корпусу A2 (мм)">{row['housing_flange_thickness_a2_mm'] || '-'}</td>
                                            <td data-label="Ширина внутрішнього кільця B (мм)">{row['width_inner_ring_b_mm'] || '-'}</td>
                                            <td data-label="Маса (кг)">{row['mass_kg'] || '-'}</td>
                                            <td data-label="Статична вантажо-підйомність Co (кН)">{row['static_load_rating_co_kn'] || '-'}</td>
                                            <td data-label="Динамічна вантажо-підйомність Cdyn (кН)">{row['dynamic_load_rating_cdyn_kn'] || '-'}</td>
                                            <td data-label="Граничне навантаження втомної міцності Pu (кН)">{row['fatigue_load_limit_pu_kn'] || '-'}</td>
                                        </tr>
                                        );
                                    })}
                                    {filteredT5.length === 0 && (
                                        <tr><td colSpan={15} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CTA SECTION */}
            <section className={styles.cta} ref={ctaRef.ref}>
                <div className={`${styles.container} ${ctaRef.inView ? styles.animIn : ''}`}>
                    <h2 className={styles.ctaTitle}>{t('block3.title')}</h2>
                    <p className={styles.ctaText}>{t('block3.text')}</p>
                    <div className={styles.ctaButtons}>
                        <button className={styles.btnPrimary} onClick={() => setModalProduct('General Engineering Support')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            {t('block3.btn_contact')}
                        </button>
                        <button className={styles.btnSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            {t('block3.btn_pdf')}
                        </button>
                        <button className={styles.btnSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            {t('block3.btn_cad')}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
