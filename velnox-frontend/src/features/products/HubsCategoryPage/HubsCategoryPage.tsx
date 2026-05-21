'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './hubs.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';
import { ProductTable, type ColDef } from '@/features/products/shared/ProductTable/ProductTable';
import { ProductSchema } from '@/features/products/shared/ProductSchema/ProductSchema';
import ptStyles from '@/features/products/shared/ProductTable/productTable.module.css';

interface HubsCategoryPageProps {
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

/* ─────────────────────────────────────────────────────
   Column structure — keys only, labels come from API spec_labels + t()
   Rule: NEVER hardcode label strings here.
   - spec keys (hub_J_mm, mass_kg …) → sl['hub_J_mm'] from API
   - non-spec keys (part_number, oem) → t('hubsPage.cols.*') from messages
────────────────────────────────────────────────────── */
type SlMap = Record<string, string>;

function buildT1Cols(sl: SlMap, partLabel: string, oemLabel: string): ColDef[] {
    return [
        { key: 'part_number',    label: partLabel,                   width: '110px' },
        { key: 'oem',            label: oemLabel,                    width: '120px' },
        { key: 'hub_J_mm',       label: sl['hub_J_mm']       || 'J (mm)',   hasFilter: true },
        { key: 'hub_D_mm',       label: sl['hub_D_mm']       || 'D (mm)',   hasFilter: true },
        { key: 'hub_D1_mm',      label: sl['hub_D1_mm']      || 'D1 (mm)',  hasFilter: true },
        { key: 'hub_d_mm',       label: sl['hub_d_mm']       || 'd (mm)',   hasFilter: true },
        { key: 'hub_C_mm',       label: sl['hub_C_mm']       || 'C (mm)',   hasFilter: true },
        { key: 'hub_hole_thread',label: sl['hub_hole_thread'] || 'H/T',     hasFilter: true },
        { key: 'hub_G',          label: sl['hub_G']          || 'G',        hasFilter: true },
        { key: 'hub_L_mm',       label: sl['hub_L_mm']       || 'L (mm)',   hasFilter: true },
        { key: 'hub_L1_mm',      label: sl['hub_L1_mm']      || 'L1 (mm)', hasFilter: true },
        { key: 'hub_F_mm',       label: sl['hub_F_mm']       || 'F (mm)',   hasFilter: true },
        { key: 'mass_kg',        label: sl['mass_kg']        || 'Mass (kg)',hasFilter: true },
        { key: 'cdyn_kn',        label: sl['cdyn_kn']        || 'Cdyn (kN)',hasFilter: true },
        { key: 'co_kn',          label: sl['co_kn']          || 'Co (kN)',  hasFilter: true },
        { key: 'pu_kn',          label: sl['pu_kn']          || 'Pu (kN)', hasFilter: true },
    ];
}

function buildT2Cols(sl: SlMap, partLabel: string): ColDef[] {
    return [
        { key: 'part_number',    label: partLabel,                   width: '110px' },
        { key: 'hub_J_mm',       label: sl['hub_J_mm']       || 'J (mm)',   hasFilter: true },
        { key: 'hub_D_mm',       label: sl['hub_D_mm']       || 'D (mm)',   hasFilter: true },
        { key: 'hub_hole_thread',label: sl['hub_hole_thread'] || 'H/T',     hasFilter: true },
        { key: 'hub_D1_mm',      label: sl['hub_D1_mm']      || 'D1 (mm)',  hasFilter: true },
        { key: 'hub_C_mm',       label: sl['hub_C_mm']       || 'C (mm)',   hasFilter: true },
        { key: 'hub_M_thread',   label: sl['hub_M_thread']   || 'M',        hasFilter: true },
        { key: 'hub_L_mm',       label: sl['hub_L_mm']       || 'L (mm)',   hasFilter: true },
        { key: 'hub_L1_mm',      label: sl['hub_L1_mm']      || 'L1 (mm)', hasFilter: true },
        { key: 'hub_E_mm',       label: sl['hub_E_mm']       || 'E (mm)',   hasFilter: true },
        { key: 'hub_F_mm',       label: sl['hub_F_mm']       || 'F (mm)',   hasFilter: true },
        { key: 'mass_kg',        label: sl['mass_kg']        || 'Mass (kg)',hasFilter: true },
        { key: 'cdyn_kn',        label: sl['cdyn_kn']        || 'Cdyn (kN)',hasFilter: true },
        { key: 'co_kn',          label: sl['co_kn']          || 'Co (kN)',  hasFilter: true },
        { key: 'pu_kn',          label: sl['pu_kn']          || 'Pu (kN)', hasFilter: true },
    ];
}

function buildT3Cols(sl: SlMap, partLabel: string): ColDef[] {
    return [
        { key: 'part_number',    label: partLabel,                   width: '110px' },
        { key: 'hub_J_mm',       label: sl['hub_J_mm']       || 'J (mm)',   hasFilter: true },
        { key: 'hub_D_mm',       label: sl['hub_D_mm']       || 'D (mm)',   hasFilter: true },
        { key: 'hub_D1_mm',      label: sl['hub_D1_mm']      || 'D1 (mm)',  hasFilter: true },
        { key: 'hub_d_mm',       label: sl['hub_d_mm']       || 'd (mm)',   hasFilter: true },
        { key: 'hub_hole_thread',label: sl['hub_hole_thread'] || 'H/T',     hasFilter: true },
        { key: 'hub_L_mm',       label: sl['hub_L_mm']       || 'L (mm)',   hasFilter: true },
        { key: 'hub_B_mm',       label: sl['hub_B_mm']       || 'B (mm)',   hasFilter: true },
        { key: 'mass_kg',        label: sl['mass_kg']        || 'Mass (kg)',hasFilter: true },
        { key: 'cdyn_kn',        label: sl['cdyn_kn']        || 'Cdyn (kN)',hasFilter: true },
        { key: 'co_kn',          label: sl['co_kn']          || 'Co (kN)',  hasFilter: true },
        { key: 'pu_kn',          label: sl['pu_kn']          || 'Pu (kN)', hasFilter: true },
    ];
}

/* ─────────────────────────────────────────────────────
   Main Page Component
────────────────────────────────────────────────────── */
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

    const [table1Data, setTable1Data] = useState<any[]>([]);
    const [table2Data, setTable2Data] = useState<any[]>([]);
    const [table3Data, setTable3Data] = useState<any[]>([]);

    /* spec_labels from API — keys are spec_definitions.key, values are localized strings */
    const [sl1, setSl1] = useState<SlMap>({});
    const [sl2, setSl2] = useState<SlMap>({});
    const [sl3, setSl3] = useState<SlMap>({});

    /* schema image URLs from product_assets in DB */
    const [schema1, setSchema1] = useState<string | null>(null);
    const [schema2, setSchema2] = useState<string | null>(null);

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
                const safeJson = async (res: Response) => res.ok ? res.json() : { products: [], table: {} };
                const [data1, data2, data3] = await Promise.all([safeJson(res1), safeJson(res2), safeJson(res3)]);

                /* spec_labels: key = spec_definitions.key, value = localized label from DB */
                if (data1.table?.spec_labels) setSl1(data1.table.spec_labels);
                if (data2.table?.spec_labels) setSl2(data2.table.spec_labels);
                if (data3.table?.spec_labels) setSl3(data3.table.spec_labels);

                /* schema image from product_assets (type=schema_png) in DB */
                if (data1.table?.schema_src) setSchema1(data1.table.schema_src);
                if (data2.table?.schema_src) setSchema2(data2.table.schema_src);

                /* Row keys = spec_definitions.key — matches buildTxCols above */
                const mapRow = (p: any) => ({
                    part_number:     p.article,
                    oem:             (p.cross_refs ?? []).map((r: any) => r.brand ? `${r.value} ${r.brand}` : r.value).join('\n'),
                    ...p.specs,      // spreads all spec values with their original DB keys
                });

                setTable1Data(Array.isArray(data1?.products) ? data1.products.map(mapRow).filter((r: any) => r.part_number) : []);
                setTable2Data(Array.isArray(data2?.products) ? data2.products.map(mapRow) : []);
                setTable3Data(Array.isArray(data3?.products) ? data3.products.map(mapRow) : []);
            } catch (err) {
                console.error('Error fetching hub tables:', err);
            }
        };
        fetchTables();
    }, [locale]);

    /* Global search pre-filter (ProductTable handles column filters internally) */
    const search = (rows: any[]) => {
        if (!searchQuery) return rows;
        const q = searchQuery.toLowerCase();
        return rows.filter(row => Object.values(row).some(v => v && String(v).toLowerCase().includes(q)));
    };

    const searchedT1 = useMemo(() => search(table1Data), [table1Data, searchQuery]);
    const searchedT2 = useMemo(() => search(table2Data), [table2Data, searchQuery]);
    const searchedT3 = useMemo(() => search(table3Data), [table3Data, searchQuery]);

    /* Non-spec column labels from messages (locale-aware) */
    const partLabel = t('hubsPage.cols.part_number');
    const oemLabel  = t('hubsPage.cols.oem');

    /* Column definitions built from API spec_labels — no hardcoded strings */
    const colsT1 = useMemo(() => buildT1Cols(sl1, partLabel, oemLabel), [sl1, partLabel, oemLabel]);
    const colsT2 = useMemo(() => buildT2Cols(sl2, partLabel), [sl2, partLabel]);
    const colsT3 = useMemo(() => buildT3Cols(sl3, partLabel), [sl3, partLabel]);

    /* Shared cell renderer — handles part_number link and oem multi-line */
    const renderCell = useCallback((col: string, row: any) => {
        if (col === 'part_number') {
            const slug = articleToSlug(row.part_number || '');
            return (
                <Link href={`/${locale}/products/hubs/${slug}`} className={ptStyles.designationLink}>
                    {row.part_number}
                </Link>
            );
        }
        if (col === 'oem') return <span className={ptStyles.analoguesCell}>{renderTightCell(row.oem)}</span>;
        return row[col] ?? '—';
    }, [locale]);

    const reqBtn = useCallback((row: any) => (
        <button className={ptStyles.reqBtn} onClick={() => setModalProduct(row.part_number || '')}>
            {t('hubsPage.block2.btn_request')}
        </button>
    ), [t]);

    return (
        <main className={styles.main}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* HERO */}
            <section
                className={`${styles.hero} ${heroRef.inView ? styles.heroVisible : ''}`}
                ref={heroRef.ref as React.Ref<HTMLElement>}
            >
                <div className={styles.heroContainer}>
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

            {/* APP BLOCK 1 — DISK HARROWS */}
            <section ref={app1Ref.ref} className={`${styles.blueprintBlock} ${app1Ref.inView ? styles.blueprintVisible : ''}`}>
                <Image src="/images/hubs/horsch-field.png" alt="" fill priority style={{ objectFit: 'cover', objectPosition: '45% 62%' }} />
                <div className={styles.blueprintDarkOverlay} />
                <div className={styles.blueprintLayout}>
                    <div className={styles.blueprintText}>
                        <span className={styles.blueprintTag}><span className={styles.blueprintTagLine} />DISK HARROWS</span>
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

            {/* STICKY SEARCH */}
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
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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

            {/* ── TABLE 1 — 28071300 VX (Disk Harrows / HORSCH) ── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table1.desc')}</p>
                        {schema1 && (
                            <ProductSchema src={schema1} alt="28071300 VX — технічна схема" />
                        )}
                        <ProductTable
                            columns={colsT1}
                            rows={searchedT1}
                            renderCell={renderCell}
                            actionCell={reqBtn}
                        />
                    </div>
                </div>
            </section>

            {/* APP BLOCK 2 — CUTTING NODES */}
            <section ref={app2Ref.ref} className={`${styles.blueprintBlock} ${app2Ref.inView ? styles.blueprintVisible : ''}`}>
                <Image src="/images/hubs/bednar-field.png" alt="" fill priority={false} style={{ objectFit: 'cover', objectPosition: '30% 50%' }} />
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

            {/* ── TABLE 2 — BAA-0004 VX (Cutting Nodes) ── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table2.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table2.desc')}</p>
                        {schema2 && (
                            <ProductSchema src={schema2} alt="BAA-0004 VX — технічна схема" />
                        )}
                        <ProductTable
                            columns={colsT2}
                            rows={searchedT2}
                            renderCell={renderCell}
                            actionCell={reqBtn}
                        />
                    </div>
                </div>
            </section>

            {/* APP BLOCK 3 — SEEDERS */}
            <section ref={app3Ref.ref} className={`${styles.blueprintBlock} ${app3Ref.inView ? styles.blueprintVisible : ''}`}>
                <Image src="/images/hubs/seeder-field.png" alt="" fill priority={false} style={{ objectFit: 'cover', objectPosition: 'center 60%' }} />
                <div className={styles.blueprintDarkOverlay} />
                <div className={styles.blueprintLayout}>
                    <div className={styles.blueprintText}>
                        <span className={styles.blueprintTag}><span className={styles.blueprintTagLine} />HIGH-SPEED SEEDERS</span>
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

            {/* ── TABLE 3 — PL-140 VX (Seeders) ── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <h3>{t('hubsPage.block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('hubsPage.block2.table3.desc')}</p>
                        <ProductTable
                            columns={colsT3}
                            rows={searchedT3}
                            renderCell={renderCell}
                            actionCell={reqBtn}
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
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
