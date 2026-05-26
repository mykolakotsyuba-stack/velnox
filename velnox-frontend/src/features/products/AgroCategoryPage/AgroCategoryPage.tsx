'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './agro.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';
import { ProductTable, type ColDef } from '@/features/products/shared/ProductTable/ProductTable';
import { ProductSchema } from '@/features/products/shared/ProductSchema/ProductSchema';
import ptStyles from '@/features/products/shared/ProductTable/productTable.module.css';

interface AgroCategoryPageProps {
    locale: Locale;
    products?: ProductListItem[];
}

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
        message: defaultDesignation ? `${t('crosses.request_for')}${defaultDesignation}` : ''
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

/* ─────────────────────────────────────────────────────────────────
   Column builders — placeholder: will be filled with user data.
   spec keys come from spec_labels (API). Non-spec keys:
     part_number, oem, bearing_part, bearing_brand — from mapRow.
──────────────────────────────────────────────────────────────────── */
type SlMap = Record<string, string>;

function buildT1Cols(sl: SlMap, partLabel: string, t: any): ColDef[] {
    return [
        { key: 'part_number',   label: partLabel,                                   width: '130px' },
        { key: 'bearing_part',  label: t('crosses.bearing_designation'),                     hasFilter: false },
        { key: 'bearing_brand', label: t('crosses.brand'),                                     hasFilter: false },
        { key: 'oem',           label: t('crosses.cross_analogues'),                        hasFilter: false },
        { key: 'd_mm',          label: sl['d_mm']    || 'Діаметр отвору d (мм)',    hasFilter: true },
        { key: 'D_mm',          label: sl['D_mm']    || 'Зовнішній діаметр D (мм)', hasFilter: true },
        { key: 'B_mm',          label: sl['B_mm']    || 'Ширина B (мм)',            hasFilter: true },
        { key: 'd1_mm',         label: sl['d1_mm']   || 'd1 (мм)',                  hasFilter: true },
        { key: 'r_12_mm',       label: sl['r_12_mm'] || 'r 1,2 (мм)',              hasFilter: true },
        { key: 'cdyn_kn',       label: sl['cdyn_kn'] || 'Cdyn (кН)',               hasFilter: true },
        { key: 'co_kn',         label: sl['co_kn']   || 'Co (кН)',                 hasFilter: true },
        { key: 'pu_kn',         label: sl['pu_kn']   || 'Pu (кН)',                 hasFilter: true },
        { key: 'mass_kg',       label: sl['mass_kg'] || 'Маса (кг)',               hasFilter: true },
    ];
}

function buildT2Cols(sl: SlMap, partLabel: string, t: any): ColDef[] {
    return [
        { key: 'part_number',   label: partLabel,                                                   width: '130px' },
        { key: 'bearing_part',  label: t('crosses.bearing_designation'),                                     hasFilter: false },
        { key: 'bearing_brand', label: t('crosses.brand'),                                                     hasFilter: false },
        { key: 'oem',           label: t('crosses.cross_analogues'),                                        hasFilter: false },
        { key: 'd_inch',        label: sl['d_inch']   || 'Діаметр отвору d (дюйм)',                 hasFilter: true },
        { key: 'd_mm',          label: sl['d_mm']     || 'Діаметр отвору d (мм)',                   hasFilter: true },
        { key: 'B_mm',          label: sl['B_mm']     || 'B (мм)',                                  hasFilter: true },
        { key: 'C_mm',          label: sl['C_mm']     || 'C (мм)',                                  hasFilter: true },
        { key: 'Da_mm',         label: sl['Da_mm']    || 'Da (мм)',                                 hasFilter: true },
        { key: 'L_mm',          label: sl['L_mm']     || 'L (мм)',                                  hasFilter: true },
        { key: 'A_fl_mm',       label: sl['A_fl_mm']  || 'A (мм)',                                  hasFilter: true },
        { key: 'A1_mm',         label: sl['A1_mm']    || 'A1 (мм)',                                 hasFilter: true },
        { key: 'J_mm',          label: sl['J_mm']     || 'J (мм)',                                  hasFilter: true },
        { key: 'N_mm',          label: sl['N_mm']     || 'N (мм)',                                  hasFilter: true },
        { key: 'Fr_kn',         label: sl['Fr_kn']    || 'Fr (кН)',                                 hasFilter: true },
        { key: 'Fa_kn',         label: sl['Fa_kn']    || 'Fa (кН)',                                 hasFilter: true },
        { key: 'mass_kg',       label: sl['mass_kg']  || 'Маса (кг)',                               hasFilter: true },
        { key: 'cdyn_kn',       label: sl['cdyn_kn']  || 'Cdyn (кН)',                               hasFilter: true },
        { key: 'co_kn',         label: sl['co_kn']    || 'Co (кН)',                                 hasFilter: true },
    ];
}

function buildT3Cols(sl: SlMap, partLabel: string, t: any): ColDef[] {
    return [
        { key: 'part_number',   label: partLabel,                                    width: '130px' },
        { key: 'bearing_part',  label: t('crosses.bearing_designation'),  hasFilter: false },
        { key: 'bearing_brand', label: t('crosses.brand'),                  hasFilter: false },
        { key: 'oem',           label: t('crosses.cross_analogues'),     hasFilter: false },
        { key: 'd_inch',        label: sl['d_inch']   || 'Діаметр отвору d (дюйм)', hasFilter: true },
        { key: 'd_mm',          label: sl['d_mm']     || 'Діаметр отвору d (мм)',   hasFilter: true },
        { key: 'B_mm',          label: sl['B_mm']     || 'B (мм)',                  hasFilter: true },
        { key: 'C_mm',          label: sl['C_mm']     || 'C (мм)',                  hasFilter: true },
        { key: 'a_mm',          label: sl['a_mm']     || 'a (мм)',                  hasFilter: true },
        { key: 'Da_mm',         label: sl['Da_mm']    || 'Da (мм)',                 hasFilter: true },
        { key: 'L_mm',          label: sl['L_mm']     || 'L (мм)',                  hasFilter: true },
        { key: 'A_fl_mm',       label: sl['A_fl_mm']  || 'A (мм)',                  hasFilter: true },
        { key: 'A1_mm',         label: sl['A1_mm']    || 'A1 (мм)',                 hasFilter: true },
        { key: 'J_mm',          label: sl['J_mm']     || 'J (мм)',                  hasFilter: true },
        { key: 'N_mm',          label: sl['N_mm']     || 'N (мм)',                  hasFilter: true },
        { key: 'M_mm',          label: sl['M_mm']     || 'M (мм)',                  hasFilter: true },
        { key: 'Fr_kn',         label: sl['Fr_kn']    || 'Fr (кН)',                 hasFilter: true },
        { key: 'Fa_kn',         label: sl['Fa_kn']    || 'Fa (кН)',                 hasFilter: true },
        { key: 'cdyn_kn',       label: sl['cdyn_kn']  || 'Cdyn (кН)',               hasFilter: true },
        { key: 'co_kn',         label: sl['co_kn']    || 'Co (кН)',                 hasFilter: true },
        { key: 'mass_kg',       label: sl['mass_kg']  || 'Маса (кг)',               hasFilter: true },
        { key: 'pu_kn',         label: sl['pu_kn']    || 'Pu (кН)',                 hasFilter: true },
    ];
}

function buildT4Cols(sl: SlMap, partLabel: string, t: any): ColDef[] {
    return [
        { key: 'part_number',   label: partLabel,                                    width: '120px' },
        { key: 'bearing_part',  label: t('crosses.bearing_designation'),  hasFilter: false },
        { key: 'bearing_brand', label: t('crosses.brand'),                  hasFilter: false },
        { key: 'oem',           label: t('crosses.cross_analogues'),     hasFilter: false },
        { key: 'd_inch',        label: sl['d_inch']  || 'Діаметр отвору d (дюйм)', hasFilter: true },
        { key: 'd_mm',          label: sl['d_mm']    || 'Діаметр отвору d (мм)',   hasFilter: true },
        { key: 'B_mm',          label: sl['B_mm']    || 'B (мм)',                  hasFilter: true },
        { key: 'L_mm',          label: sl['L_mm']    || 'L (мм)',                  hasFilter: true },
        { key: 'A1_mm',         label: sl['A1_mm']   || 'A1 (мм)',                 hasFilter: true },
        { key: 'C_mm',          label: sl['C_mm']    || 'C (мм)',                  hasFilter: true },
        { key: 'Da_mm',         label: sl['Da_mm']   || 'Da (мм)',                 hasFilter: true },
        { key: 'D_mm',          label: sl['D_mm']    || 'D (мм)',                  hasFilter: true },
        { key: 'J_mm',          label: sl['J_mm']    || 'J (мм)',                  hasFilter: true },
        { key: 'N_mm',          label: sl['N_mm']    || 'N (мм)',                  hasFilter: true },
        { key: 'cdyn_kn',       label: sl['cdyn_kn'] || 'Cdyn (кН)',               hasFilter: true },
        { key: 'co_kn',         label: sl['co_kn']   || 'Co (кН)',                 hasFilter: true },
        { key: 'mass_kg',       label: sl['mass_kg'] || 'Маса (кг)',               hasFilter: true },
        { key: 'pu_kn',         label: sl['pu_kn']   || 'Pu (кН)',                 hasFilter: true },
    ];
}

const CROSS_REF_KEYS = new Set(['bearing_part', 'bearing_brand', 'oem']);

/* ─── CrossRefPanel — shows one product at a time with a searchable selector ─── */
function CrossRefPanel({
    rows,
    selectedIdx,
    onSelect,
    filterSpecs,
    onFilterChange,
    locale,
}: {
    rows: Record<string, any>[];
    selectedIdx: number;
    onSelect: (idx: number) => void;
    filterSpecs: boolean;
    onFilterChange: (v: boolean) => void;
}) {
    const t = useTranslations();
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
                    ← {t('crosses.select_one')}
                </button>
                <table className={styles.crossTable}>
                    <thead>
                        <tr>
                            <th>{t('crosses.velnox')}</th>
                            <th>{t('crosses.bearing')}</th>
                            <th>{t('crosses.brand')}</th>
                            <th>{t('crosses.analogues')}</th>
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
                                            <Link href={`/${locale}/products/agro/${articleToSlug(row.part_number)}`} className={ptStyles.designationLink}>
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
                            <input type="text" className={styles.crossDropdownSearch} placeholder={t('crosses.search')}
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
                                    <div className={styles.crossDropdownEmpty}>{t('crosses.not_found')}</div>
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
                        <th>{t('crosses.bearing_designation')}</th>
                        <th>{t('crosses.brand')}</th>
                        <th>{t('crosses.cross_analogues')}</th>
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
                    {t('crosses.show_only_selected')}
                </label>
                <Link
                    href={`/${locale}/products/agro/${articleToSlug(selectedRow.part_number)}`}
                    className={styles.crossDetailBtn}
                >
                    {t('crosses.show_details')}
                </Link>
                <button type="button" className={styles.crossShowAllBtn} onClick={() => setShowAll(true)}>
                    {t('crosses.show_all')}
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Main Page Component
──────────────────────────────────────────────────────────────────── */
export function AgroCategoryPage({ locale, products }: AgroCategoryPageProps) {
    const t = useTranslations();
    const heroRef     = useInView(0.12);
    const approachRef = useInView(0.1);
    const specialRef  = useInView(0.15);
    const ctaRef      = useInView();

    const [modalProduct, setModalProduct]   = useState<string | null>(null);
    const [searchQuery, setSearchQuery]     = useState('');

    const [table1Data, setTable1Data] = useState<any[]>([]);
    const [table2Data, setTable2Data] = useState<any[]>([]);
    const [table3Data, setTable3Data] = useState<any[]>([]);
    const [table4Data, setTable4Data] = useState<any[]>([]);

    const [sl1, setSl1] = useState<SlMap>({});
    const [sl2, setSl2] = useState<SlMap>({});
    const [sl3, setSl3] = useState<SlMap>({});
    const [sl4, setSl4] = useState<SlMap>({});

    const [schema1, setSchema1] = useState<string | null>(null);
    const [schema2, setSchema2] = useState<string | null>(null);
    const [schema3, setSchema3] = useState<string | null>(null);
    const [schema4, setSchema4] = useState<string | null>(null);

    const [tableName1, setTableName1] = useState('');
    const [tableName2, setTableName2] = useState('');
    const [tableName3, setTableName3] = useState('');
    const [tableName4, setTableName4] = useState('');

    const searchHeaderRef  = useRef<HTMLDivElement>(null);
    const specialBlockRef  = useRef<HTMLDivElement>(null);
    const [parallaxOffset, setParallaxOffset] = useState(0);

    /* Sticky search + parallax */
    useEffect(() => {
        const handleScroll = () => {
            if (searchHeaderRef.current) {
                const elementOffsetTop = searchHeaderRef.current.offsetTop;
                searchHeaderRef.current.classList.toggle(
                    styles.isSticky, window.scrollY > elementOffsetTop - 100
                );
            }
            if (specialBlockRef.current) {
                const rect = specialBlockRef.current.getBoundingClientRect();
                const wh = window.innerHeight;
                if (rect.top < wh && rect.bottom > 0) {
                    const p = (wh - rect.top) / (wh + rect.height);
                    setParallaxOffset(p * 150 - 75);
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Fetch all 3 tables */
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const [res1, res2, res3, res4] = await Promise.all([
                    fetch(`${base}/v1/product-tables/agro-t1?locale=${locale}`),
                    fetch(`${base}/v1/product-tables/agro-t2?locale=${locale}`),
                    fetch(`${base}/v1/product-tables/agro-t3?locale=${locale}`),
                    fetch(`${base}/v1/product-tables/agro-t4?locale=${locale}`),
                ]);
                const safeJson = async (res: Response) =>
                    res.ok ? res.json() : { products: [], table: {} };
                const [data1, data2, data3, data4] = await Promise.all([
                    safeJson(res1), safeJson(res2), safeJson(res3), safeJson(res4),
                ]);

                if (data1.table?.spec_labels) setSl1(data1.table.spec_labels);
                if (data2.table?.spec_labels) setSl2(data2.table.spec_labels);
                if (data3.table?.spec_labels) setSl3(data3.table.spec_labels);
                if (data4.table?.spec_labels) setSl4(data4.table.spec_labels);

                if (data1.table?.schema_src) setSchema1(data1.table.schema_src);
                if (data2.table?.schema_src) setSchema2(data2.table.schema_src);
                if (data3.table?.schema_src) setSchema3(data3.table.schema_src);
                if (data4.table?.schema_src) setSchema4(data4.table.schema_src);

                if (data1.table?.name) setTableName1(data1.table.name);
                if (data2.table?.name) setTableName2(data2.table.name);
                if (data3.table?.name) setTableName3(data3.table.name);
                if (data4.table?.name) setTableName4(data4.table.name);

                const mapRow = (p: any) => {
                    const bearingRefs = (p.cross_refs ?? []).filter((r: any) => r.type === 'bearing');
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

                setTable1Data(Array.isArray(data1?.products) ? data1.products.map(mapRow) : []);
                setTable2Data(Array.isArray(data2?.products) ? data2.products.map(mapRow) : []);
                setTable3Data(Array.isArray(data3?.products) ? data3.products.map(mapRow) : []);
                setTable4Data(Array.isArray(data4?.products) ? data4.products.map(mapRow) : []);
            } catch (err) {
                console.error('Error fetching agro tables:', err);
            }
        };
        fetchTables();
    }, [locale]);

    /* Global search */
    const search = (rows: any[]) => {
        if (!searchQuery) return rows;
        const q = searchQuery.toLowerCase();
        return rows.filter(row =>
            Object.values(row).some(v => v && String(v).toLowerCase().includes(q))
        );
    };
    const searchedT1 = useMemo(() => search(table1Data), [table1Data, searchQuery]);
    const searchedT2 = useMemo(() => search(table2Data), [table2Data, searchQuery]);
    const searchedT3 = useMemo(() => search(table3Data), [table3Data, searchQuery]);
    const searchedT4 = useMemo(() => search(table4Data), [table4Data, searchQuery]);

    const partLabel = t('agroPage.cols.part_number');
    const colsT1 = useMemo(() => buildT1Cols(sl1, partLabel, t), [sl1, partLabel, t]);
    const colsT2 = useMemo(() => buildT2Cols(sl2, partLabel, t), [sl2, partLabel, t]);
    const colsT3 = useMemo(() => buildT3Cols(sl3, partLabel, t), [sl3, partLabel, t]);
    const colsT4 = useMemo(() => buildT4Cols(sl4, partLabel, t), [sl4, partLabel, t]);

    const specColsT1  = useMemo(() => colsT1.filter(c => !CROSS_REF_KEYS.has(c.key)), [colsT1]);
    const specColsT2  = useMemo(() => colsT2.filter(c => !CROSS_REF_KEYS.has(c.key)), [colsT2]);
    const specColsT3  = useMemo(() => colsT3.filter(c => !CROSS_REF_KEYS.has(c.key)), [colsT3]);
    const specColsT4  = useMemo(() => colsT4.filter(c => !CROSS_REF_KEYS.has(c.key)), [colsT4]);

    const [selT1, setSelT1] = useState(0);
    const [selT2, setSelT2] = useState(0);
    const [selT3, setSelT3] = useState(0);
    const [selT4, setSelT4] = useState(0);
    const [syncT1, setSyncT1] = useState(false);
    const [syncT2, setSyncT2] = useState(false);
    const [syncT3, setSyncT3] = useState(false);
    const [syncT4, setSyncT4] = useState(false);

    const clamp = (i: number, len: number) => Math.min(i, Math.max(0, len - 1));
    const specsRowsT1 = syncT1 && searchedT1.length ? [searchedT1[clamp(selT1, searchedT1.length)]] : searchedT1;
    const specsRowsT2 = syncT2 && searchedT2.length ? [searchedT2[clamp(selT2, searchedT2.length)]] : searchedT2;
    const specsRowsT3 = syncT3 && searchedT3.length ? [searchedT3[clamp(selT3, searchedT3.length)]] : searchedT3;
    const specsRowsT4 = syncT4 && searchedT4.length ? [searchedT4[clamp(selT4, searchedT4.length)]] : searchedT4;

    const renderCell = useCallback((col: string, row: any) => {
        if (col === 'part_number') {
            const slug = articleToSlug(row.part_number || '');
            return (
                <Link href={`/${locale}/products/agro/${slug}`} className={ptStyles.designationLink}>
                    {row.part_number}
                    {row['has_model_3d'] && <span className={styles.badge3d}>3D</span>}
                </Link>
            );
        }
        if (col === 'oem' || col === 'bearing_part' || col === 'bearing_brand')
            return <span className={ptStyles.analoguesCell}>{renderTightCell(row[col])}</span>;
        return row[col] ?? '—';
    }, [locale]);

    const reqBtn = useCallback((row: any) => (
        <button className={ptStyles.reqBtn} onClick={() => setModalProduct(row.part_number || '')}>
            {t('agroPage.block2.btn_request')}
        </button>
    ), [t]);

    return (
        <main className={styles.page}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* ── HERO ── */}
            <section className={styles.hero} ref={heroRef.ref as React.Ref<HTMLElement>}>
                <div className={styles.heroBgWrapper}>
                    <Image src="/velnox/images/products/agro/hero_bg.jpg" alt="VELNOX Agro Bearings" fill
                        className={styles.heroBgImg} quality={90} priority />
                    <div className={styles.heroBgOverlay} />
                </div>

                <div className={styles.heroInner}>
                    <div className={`${styles.heroContent} ${heroRef.inView ? styles.heroVisible : ''}`}>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine} />
                            {t('agroPage.hero.eyebrow')}
                        </div>
                        <div className={styles.heroLogoWrapper}>
                            <Image src="/velnox/images/velnox_logo_white.png" alt="VELNOX" width={320} height={70} style={{ objectFit: 'contain' }} className={styles.heroLogo} />
                        </div>
                        <h1 className={styles.heroTitle}>{t('agroPage.hero.title')}</h1>
                    </div>
                </div>

                {/* Scroll Down Hint */}
                <div className={styles.scrollHint} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24">
                        <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </section>

            {/* ── STICKY SEARCH ── */}
            <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                <div className={styles.stickyContainer}>
                    <div className={styles.container}>
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
            </div>

            {/* ── TABLE 1 ── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <div className={styles.tableCardHeader}>
                            <h3>{tableName1 || t('agroPage.block2.table1.title')}</h3>
                        </div>
                        <p className={styles.tableDesc}>{t('agroPage.block2.table1.desc')}</p>

                        <div className={styles.desktopSplit}>
                            <div className={styles.tableSplitLayout}>
                                <CrossRefPanel rows={searchedT1} selectedIdx={selT1} onSelect={setSelT1} filterSpecs={syncT1} onFilterChange={setSyncT1} locale={locale} />
                                <div className={styles.schemaPanel}>
                                    {schema1 && <ProductSchema src={schema1} alt="Agro table 1 — технічна схема" />}
                                </div>
                            </div>
                            <div className={styles.specsPanel}>
                                <ProductTable columns={specColsT1} rows={specsRowsT1} renderCell={renderCell} actionCell={reqBtn} />
                            </div>
                        </div>

                        <div className={styles.mobileCombined}>
                            {schema1 && <ProductSchema src={schema1} alt="Agro table 1 — технічна схема" />}
                            <ProductTable columns={colsT1} rows={searchedT1} renderCell={renderCell} actionCell={reqBtn} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SPECIAL AGRO BEARINGS BLOCK ── */}
            <section
                ref={(node) => {
                    (specialRef.ref as React.MutableRefObject<HTMLElement | null>).current = node;
                    specialBlockRef.current = node;
                }}
                className={`${styles.specialBlock} ${specialRef.inView ? styles.specialVisible : ''}`}
            >
                <div
                    className={styles.specialParallaxContainer}
                    style={{ transform: `translateY(${parallaxOffset}px)` }}
                >
                    <div className={styles.specialParallaxOverlay} />
                    <Image
                        src="/velnox/images/agro/agro-parallax-bg.png"
                        alt="Agro field background"
                        fill
                        className={styles.specialParallaxImg}
                        priority={false}
                    />
                </div>
                <div className={styles.specialBg} />
                <div className={styles.specialHero}>
                    <span className={styles.specialTagline}>{t('agroPage.special.tagline')}</span>
                    <h2 className={styles.specialTitle}>{t('agroPage.special.title')}</h2>
                    <p className={styles.specialLead}>{t('agroPage.special.lead')}</p>
                    <p className={styles.specialDesc}>{t('agroPage.special.desc')}</p>
                </div>
                <div className={styles.specialFeaturesGrid}>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32">
                                <path d="M12 2l8 4v5c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l8-4z" />
                                <circle cx="12" cy="11" r="3" />
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>{t('agroPage.special.feature1_title')}</h3>
                        <ul className={styles.featureList}>
                            {(t.raw('agroPage.special.feature1_list') as string[]).map((li, idx) => (
                                <li key={idx}>{li}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 21V9" />
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>{t('agroPage.special.feature2_title')}</h3>
                        <ul className={styles.featureList}>
                            {(t.raw('agroPage.special.feature2_list') as string[]).map((li, idx) => (
                                <li key={idx}>{li}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h3 className={styles.featureTitle}>{t('agroPage.special.feature3_title')}</h3>
                        <ul className={styles.featureList}>
                            {(t.raw('agroPage.special.feature3_list') as string[]).map((li, idx) => (
                                <li key={idx}>{li}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.specialCta}>
                    <button className={styles.specialCtaBtn} onClick={() => setModalProduct('Спеціальні агропідшипники VELNOX')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12 19.79 19.79 0 0 1 1.06 3.38 2 2 0 0 1 3.04 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {t('agroPage.special.btn_select')}
                    </button>
                </div>
            </section>

            {/* ── TABLE 2 ── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <div className={styles.tableCardHeader}>
                            <h3>{tableName2 || t('agroPage.block2.table2.title')}</h3>
                        </div>
                        <p className={styles.tableDesc}>{t('agroPage.block2.table2.desc')}</p>

                        <div className={styles.desktopSplit}>
                            <div className={styles.tableSplitLayout}>
                                <CrossRefPanel rows={searchedT2} selectedIdx={selT2} onSelect={setSelT2} filterSpecs={syncT2} onFilterChange={setSyncT2} locale={locale} />
                                <div className={styles.schemaPanel}>
                                    {schema2 && <ProductSchema src={schema2} alt="Agro table 2 — технічна схема" />}
                                </div>
                            </div>
                            <div className={styles.specsPanel}>
                                <ProductTable columns={specColsT2} rows={specsRowsT2} renderCell={renderCell} actionCell={reqBtn} />
                            </div>
                        </div>

                        <div className={styles.mobileCombined}>
                            {schema2 && <ProductSchema src={schema2} alt="Agro table 2 — технічна схема" />}
                            <ProductTable columns={colsT2} rows={searchedT2} renderCell={renderCell} actionCell={reqBtn} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TABLE 3 ── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <div className={styles.tableCardHeader}>
                            <h3>{tableName3 || t('agroPage.block2.table3.title')}</h3>
                        </div>
                        <p className={styles.tableDesc}>{t('agroPage.block2.table3.desc')}</p>

                        <div className={styles.desktopSplit}>
                            <div className={styles.tableSplitLayout}>
                                <CrossRefPanel rows={searchedT3} selectedIdx={selT3} onSelect={setSelT3} filterSpecs={syncT3} onFilterChange={setSyncT3} locale={locale} />
                                <div className={styles.schemaPanel}>
                                    {schema3 && <ProductSchema src={schema3} alt="Agro table 3 — технічна схема" />}
                                </div>
                            </div>
                            <div className={styles.specsPanel}>
                                <ProductTable columns={specColsT3} rows={specsRowsT3} renderCell={renderCell} actionCell={reqBtn} />
                            </div>
                        </div>

                        <div className={styles.mobileCombined}>
                            {schema3 && <ProductSchema src={schema3} alt="Agro table 3 — технічна схема" />}
                            <ProductTable columns={colsT3} rows={searchedT3} renderCell={renderCell} actionCell={reqBtn} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TABLE 4 ── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <div className={styles.tableCardHeader}>
                            <h3>{tableName4 || t('agroPage.block2.table4.title')}</h3>
                        </div>
                        <p className={styles.tableDesc}>{t('agroPage.block2.table4.desc')}</p>

                        <div className={styles.desktopSplit}>
                            <div className={styles.tableSplitLayout}>
                                <CrossRefPanel rows={searchedT4} selectedIdx={selT4} onSelect={setSelT4} filterSpecs={syncT4} onFilterChange={setSyncT4} locale={locale} />
                                <div className={styles.schemaPanel}>
                                    {schema4 && <ProductSchema src={schema4} alt="Agro table 4 — технічна схема" />}
                                </div>
                            </div>
                            <div className={styles.specsPanel}>
                                <ProductTable columns={specColsT4} rows={specsRowsT4} renderCell={renderCell} actionCell={reqBtn} />
                            </div>
                        </div>

                        <div className={styles.mobileCombined}>
                            {schema4 && <ProductSchema src={schema4} alt="Agro table 4 — технічна схема" />}
                            <ProductTable columns={colsT4} rows={searchedT4} renderCell={renderCell} actionCell={reqBtn} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={styles.cta} ref={ctaRef.ref as React.Ref<HTMLElement>}>
                <div className={`${styles.container} ${ctaRef.inView ? styles.animIn : ''}`}>
                    <h2 className={styles.ctaTitle}>{t('agroPage.block3.title')}</h2>
                    <p className={styles.ctaText}>{t('agroPage.block3.text')}</p>
                    <div className={styles.ctaButtons}>
                        <button className={styles.btnPrimary} onClick={() => setModalProduct('Agro Bearings — Engineering Support')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            {t('agroPage.block3.btn_contact')}
                        </button>
                        <button className={styles.btnSecondary}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            {t('agroPage.block3.btn_pdf')}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
