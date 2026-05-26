'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './bearings.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';
import { ProductTable, type ColDef } from '@/features/products/shared/ProductTable/ProductTable';
import { ProductSchema } from '@/features/products/shared/ProductSchema/ProductSchema';
import ptStyles from '@/features/products/shared/ProductTable/productTable.module.css';

/* ─── helpers ─── */
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

function articleToSlug(article: string): string {
    return article.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function renderTightCell(val: string | null | undefined) {
    if (!val || val === '-') return <span>—</span>;
    const items = val.split(/\n|;/).map(s => s.trim()).filter(Boolean);
    if (items.length <= 1) return <span>{val}</span>;
    return (
        <ul className="analogues-list" style={{ paddingLeft: '14px', margin: 0 }}>
            {items.map((item, i) => <li key={i} style={{ marginBottom: '2px' }}>{item}</li>)}
        </ul>
    );
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

/* ─── Packer Roller Application ─── */
function PackerRollerIntro() {
    const t = useTranslations('bearingsPage.packer_roller');
    const { ref, inView } = useInView(0.05);
    const paragraphs = t('content').split('\n\n');
    return (
        <section
            className={`${styles.applicationsSection} ${inView ? styles.appSectionVisible : ''}`}
            ref={ref as React.Ref<HTMLElement>}
        >
            <div className={styles.appWatermark} aria-hidden>{t('watermark')}</div>
            <div className={styles.appInner}>
                <div className={styles.appHeader}>
                    <span className={styles.appTag}>{t('tag')}</span>
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

/* ─── Dynamic column builder from API spec_labels ─── */
type SlMap = Record<string, string>;
const CROSS_REF_KEYS = new Set(['bearing_part', 'bearing_brand', 'oem']);

function buildCols(sl: SlMap, specColumns: string[] | undefined, partLabel: string): ColDef[] {
    const base: ColDef[] = [
        { key: 'part_number',   label: partLabel,                width: '130px' },
        { key: 'bearing_part',  label: 'Позначення підшипника',  hasFilter: false },
        { key: 'bearing_brand', label: 'Бренд',                  hasFilter: false },
        { key: 'oem',           label: 'Перехресні аналоги',     hasFilter: false },
    ];
    const specKeys = specColumns?.length ? specColumns : Object.keys(sl);
    const specCols: ColDef[] = specKeys.map(key => ({
        key,
        label: sl[key] || key,
        hasFilter: true,
    }));
    return [...base, ...specCols];
}

/* ─── CrossRefPanel — searchable selector + cross-ref table ─── */
function CrossRefPanel({
    rows,
    selectedIdx,
    onSelect,
    filterSpecs,
    onFilterChange,
    locale,
    categorySlug,
}: {
    rows: Record<string, any>[];
    selectedIdx: number;
    onSelect: (idx: number) => void;
    filterSpecs: boolean;
    onFilterChange: (v: boolean) => void;
    locale: Locale;
    categorySlug: string;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [showAll, setShowAll] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    if (!rows.length) return null;
    const idx = Math.min(selectedIdx, rows.length - 1);
    const selectedRow = rows[idx];

    if (showAll) {
        return (
            <div className={styles.crossesPanel}>
                <button type="button" className={styles.crossShowAllBtn} onClick={() => setShowAll(false)}>
                    ← Обрати один
                </button>
                <table className={styles.crossTable}>
                    <thead>
                        <tr>
                            <th>Velnox</th>
                            <th>Підшипник</th>
                            <th>Бренд</th>
                            <th>Аналоги</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.flatMap((row, ri) => {
                            const p = (row.bearing_part || '').split('\n').filter(Boolean);
                            const b = (row.bearing_brand || '').split('\n').filter(Boolean);
                            const o = (row.oem || '').split('\n').filter(Boolean);
                            const len = Math.max(p.length, o.length, 1);
                            return Array.from({ length: len }, (_, i) => (
                                <tr key={`${ri}-${i}`}>
                                    {i === 0 && (
                                        <td rowSpan={len} className={styles.crossAllName}>
                                            <Link href={`/${locale}/products/${categorySlug}/${articleToSlug(row.part_number)}`} className={ptStyles.designationLink}>
                                                {row.part_number}
                                            </Link>
                                            {row.has_model_3d && <span className={styles.badge3d}>3D</span>}
                                        </td>
                                    )}
                                    <td>{p[i] || ''}</td>
                                    <td>{b[i] || ''}</td>
                                    <td>{o[i] || ''}</td>
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    const parts  = (selectedRow.bearing_part  || '').split('\n').filter(Boolean);
    const brands = (selectedRow.bearing_brand || '').split('\n').filter(Boolean);
    const oems   = (selectedRow.oem           || '').split('\n').filter(Boolean);
    const maxLen = Math.max(parts.length, oems.length, 1);

    const q = query.toLowerCase();
    const matchingRows = query
        ? rows.filter(r => (r.part_number || '').toLowerCase().includes(q))
        : rows;

    return (
        <div className={styles.crossesPanel}>
            <div className={styles.crossNav}>
                <button type="button" className={styles.crossNavBtn}
                    onClick={() => onSelect(idx > 0 ? idx - 1 : rows.length - 1)} title="Попередній">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <div className={styles.crossSelector} ref={wrapRef}>
                    <button type="button" className={styles.crossSelectorBtn} onClick={() => setOpen(v => !v)}>
                        <svg className={styles.crossSearchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span>{selectedRow.part_number}</span>
                        {selectedRow.has_model_3d && <span className={styles.badge3d}>3D</span>}
                        <svg className={`${styles.crossChevron}${open ? ` ${styles.crossChevronOpen}` : ''}`}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    {open && (
                        <div className={styles.crossDropdown}>
                            <input type="text" className={styles.crossDropdownSearch} placeholder="Пошук..."
                                value={query} onChange={e => setQuery(e.target.value)} autoFocus />
                            <div className={styles.crossDropdownList}>
                                {matchingRows.map(row => {
                                    const origIdx = rows.indexOf(row);
                                    return (
                                        <button key={origIdx} type="button"
                                            className={`${styles.crossDropdownItem}${idx === origIdx ? ` ${styles.crossDropdownItemActive}` : ''}`}
                                            onClick={() => { onSelect(origIdx); setOpen(false); setQuery(''); }}>
                                            {row.part_number}
                                            {row.has_model_3d && <span className={styles.badge3d}>3D</span>}
                                        </button>
                                    );
                                })}
                                {matchingRows.length === 0 && (
                                    <div className={styles.crossDropdownEmpty}>Не знайдено</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button type="button" className={styles.crossNavBtn}
                    onClick={() => onSelect(idx < rows.length - 1 ? idx + 1 : 0)} title="Наступний">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            <table className={styles.crossTable}>
                <thead>
                    <tr>
                        <th>Позначення підшипника</th>
                        <th>Бренд</th>
                        <th>Перехресні аналоги</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: maxLen }, (_, i) => (
                        <tr key={i}>
                            <td>{parts[i] || ''}</td>
                            <td>{brands[i] || ''}</td>
                            <td>{oems[i] || ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.crossFooter}>
                <label className={styles.crossFilterCheck}>
                    <input type="checkbox" checked={filterSpecs}
                        onChange={e => onFilterChange(e.target.checked)} />
                    Показати тільки обраний
                </label>
                <Link
                    href={`/${locale}/products/${categorySlug}/${articleToSlug(selectedRow.part_number)}`}
                    className={styles.crossDetailBtn}
                >
                    Показати детальніше
                </Link>
                <button type="button" className={styles.crossShowAllBtn} onClick={() => setShowAll(true)}>
                    Показати всі
                </button>
            </div>
        </div>
    );
}

/* ─── Table state ─── */
interface TableState {
    data: Record<string, any>[];
    specLabels: SlMap;
    specColumns: string[] | undefined;
    schema: string | null;
    name: string;
    selectedIdx: number;
    syncFilter: boolean;
}

const TABLE_IDS = [1, 2, 3, 4, 5] as const;

function emptyTableState(): TableState {
    return { data: [], specLabels: {}, specColumns: undefined, schema: null, name: '', selectedIdx: 0, syncFilter: false };
}

/* ─── Main Page Component ─── */
export function BearingsCategoryPage({ locale, products = [] }: { locale: Locale; products?: ProductListItem[] }) {
    const t = useTranslations();
    const heroRef = useInView(0.12);
    const ctaRef = useInView();

    const [modalProduct, setModalProduct] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [tables, setTables] = useState<Record<number, TableState>>(() => {
        const init: Record<number, TableState> = {};
        TABLE_IDS.forEach(id => { init[id] = emptyTableState(); });
        return init;
    });

    const searchHeaderRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const responses = await Promise.all(
                    TABLE_IDS.map(n =>
                        fetch(`${base}/v1/product-tables/bearings-t${n}?locale=${locale}`)
                    )
                );
                const safeJson = async (res: Response) =>
                    res.ok ? res.json() : { products: [], table: {} };
                const allData = await Promise.all(responses.map(safeJson));

                const mapRow = (p: any) => {
                    const bearingRefs = (p.cross_refs ?? []).filter((r: any) => r.type === 'bearing' || !r.type);
                    const appRefs     = (p.cross_refs ?? []).filter((r: any) => r.type === 'application');
                    return {
                        part_number:   p.article,
                        has_model_3d:  p.has_model_3d ?? false,
                        bearing_part:  bearingRefs.map((r: any) => r.value).join('\n'),
                        bearing_brand: bearingRefs.map((r: any) => r.brand).filter(Boolean).join('\n'),
                        oem:           appRefs.map((r: any) => r.brand ? `${r.value} ${r.brand}` : r.value).join('\n'),
                        ...p.specs,
                    };
                };

                const newTables: Record<number, TableState> = {};
                TABLE_IDS.forEach((id, i) => {
                    const d = allData[i];
                    newTables[id] = {
                        data:        Array.isArray(d?.products) ? d.products.map(mapRow) : [],
                        specLabels:  d?.table?.spec_labels ?? {},
                        specColumns: d?.table?.spec_columns,
                        schema:      d?.table?.schema_src ?? null,
                        name:        d?.table?.name ?? '',
                        selectedIdx: 0,
                        syncFilter:  false,
                    };
                });
                setTables(newTables);
            } catch (err) {
                console.error('Error fetching bearings tables:', err);
            }
        };
        fetchTables();
    }, [locale]);

    const search = useCallback((rows: any[]) => {
        if (!searchQuery) return rows;
        const q = searchQuery.toLowerCase();
        return rows.filter(row =>
            Object.values(row).some(v => v && String(v).toLowerCase().includes(q))
        );
    }, [searchQuery]);

    const partLabel = t('bearingsPage.cols.part_number');

    const tableConfigs = useMemo(() => {
        return TABLE_IDS.map(id => {
            const tbl = tables[id];
            const searched = search(tbl.data);
            const cols = buildCols(tbl.specLabels, tbl.specColumns, partLabel);
            const specCols = cols.filter(c => !CROSS_REF_KEYS.has(c.key));
            const clampIdx = Math.min(tbl.selectedIdx, Math.max(0, searched.length - 1));
            const specsRows = tbl.syncFilter && searched.length ? [searched[clampIdx]] : searched;
            return { id, tbl, searched, cols, specCols, specsRows };
        });
    }, [tables, search, partLabel]);

    const setSelection = useCallback((id: number, idx: number) => {
        setTables(prev => ({ ...prev, [id]: { ...prev[id], selectedIdx: idx } }));
    }, []);

    const setSyncFilter = useCallback((id: number, v: boolean) => {
        setTables(prev => ({ ...prev, [id]: { ...prev[id], syncFilter: v } }));
    }, []);

    const renderCell = useCallback((col: string, row: any) => {
        if (col === 'part_number') {
            const slug = articleToSlug(row.part_number || '');
            return (
                <Link href={`/${locale}/products/bearings/${slug}`} className={ptStyles.designationLink}>
                    {row.part_number}
                    {row.has_model_3d && <span className={styles.badge3d}>3D</span>}
                </Link>
            );
        }
        if (col === 'oem' || col === 'bearing_part' || col === 'bearing_brand')
            return <span className={ptStyles.analoguesCell}>{renderTightCell(row[col])}</span>;
        return row[col] ?? '—';
    }, [locale]);

    const reqBtn = useCallback((row: any) => (
        <button className={ptStyles.reqBtn} onClick={() => setModalProduct(row.part_number || '')}>
            {t('bearingsPage.block2.btn_request')}
        </button>
    ), [t]);

    return (
        <main className={styles.page}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* HERO */}
            <section className={styles.hero} ref={heroRef.ref as React.Ref<HTMLElement>}>
                <div className={styles.heroBgWrapper}>
                    <Image src="/velnox/images/bearings/hero_bg.png" alt="VELNOX Bearings" fill
                        className={styles.heroBgImg} quality={90} priority />
                    <div className={styles.heroBgOverlay} />
                </div>

                <div className={styles.heroInner}>
                    <div className={`${styles.heroContent} ${heroRef.inView ? styles.heroVisible : ''}`}>
                        <div className={styles.heroLogoWrapper}>
                            <Image src="/velnox/images/velnox_logo_white.png" alt="VELNOX" width={320} height={70} style={{ objectFit: 'contain' }} className={styles.heroLogo} />
                        </div>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine} />
                            {t('bearingsPage.hero.eyebrow')}
                        </div>
                        <h1 className={styles.heroTitle}>{t('bearingsPage.hero.title')}</h1>
                    </div>
                </div>

                {/* Scroll Down Hint */}
                <div className={styles.scrollHint} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24">
                        <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </section>

            <PackerRollerIntro />

            {/* STICKY SEARCH */}
            <div id="sticky-sentinel" style={{ height: 1, marginTop: -1 }} />

            <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                <div className={styles.stickyContainer}>
                    <div className={styles.container}>
                        <div className={styles.tablesHeader}>
                            <div className={styles.headerTitles}>
                                <h2 className={styles.sectionTitle}>{t('bearingsPage.block2.title')}</h2>
                                <p className={styles.tablesIntro}>{t('bearingsPage.block2.intro')}</p>
                            </div>
                            <div className={styles.searchWrap}>
                                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder={t('bearingsPage.block2.search_placeholder')}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5 TABLES */}
            {tableConfigs.map(({ id, tbl, searched, cols, specCols, specsRows }) => {
                if (tbl.data.length === 0 && !tbl.name) return null;
                return (
                    <section key={id} className={styles.tablesSection}>
                        <div className={styles.tableSectionContainer}>
                            <div className={styles.tableBlock}>
                                <div className={styles.tableCardHeader}>
                                    <h3>{tbl.name || t(`bearingsPage.block2.table${id}.title`)}</h3>
                                </div>

                                <div className={styles.desktopSplit}>
                                    <div className={styles.tableSplitLayout}>
                                        <CrossRefPanel
                                            rows={searched}
                                            selectedIdx={tbl.selectedIdx}
                                            onSelect={(idx) => setSelection(id, idx)}
                                            filterSpecs={tbl.syncFilter}
                                            onFilterChange={(v) => setSyncFilter(id, v)}
                                            locale={locale}
                                            categorySlug="bearings"
                                        />
                                        <div className={styles.schemaPanel}>
                                            {tbl.schema && (
                                                <ProductSchema src={tbl.schema} alt={`Bearings table ${id} — технічна схема`} />
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.specsPanel}>
                                        <ProductTable columns={specCols} rows={specsRows} renderCell={renderCell} actionCell={reqBtn} />
                                    </div>
                                </div>

                                <div className={styles.mobileCombined}>
                                    {tbl.schema && (
                                        <ProductSchema src={tbl.schema} alt={`Bearings table ${id} — технічна схема`} />
                                    )}
                                    <ProductTable columns={cols} rows={searched} renderCell={renderCell} actionCell={reqBtn} />
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* CTA */}
            <section className={styles.cta} ref={ctaRef.ref}>
                <div className={`${styles.container} ${ctaRef.inView ? styles.animIn : ''}`}>
                    <h2 className={styles.ctaTitle}>{t('bearingsPage.block3.title')}</h2>
                    <p className={styles.ctaText}>{t('bearingsPage.block3.text')}</p>
                    <div className={styles.ctaButtons}>
                        <button className={styles.btnPrimary} onClick={() => setModalProduct('General Engineering Support')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            {t('bearingsPage.block3.btn_contact')}
                        </button>
                        <button className={styles.btnSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            {t('bearingsPage.block3.btn_pdf')}
                        </button>
                        <button className={styles.btnSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            {t('bearingsPage.block3.btn_cad')}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
