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

    const filteredT1 = useMemo(() => {
        if (!searchQuery) return table1Data;
        const q = searchQuery.toLowerCase();
        return table1Data.filter(row => Object.values(row).some(val => val && String(val).toLowerCase().includes(q)));
    }, [searchQuery, table1Data]);

    const filteredT2 = useMemo(() => {
        if (!searchQuery) return table2Data;
        const q = searchQuery.toLowerCase();
        return table2Data.filter(row => Object.values(row).some(val => val && String(val).toLowerCase().includes(q)));
    }, [searchQuery, table2Data]);

    const filteredT3 = useMemo(() => {
        if (!searchQuery) return table3Data;
        const q = searchQuery.toLowerCase();
        return table3Data.filter(row => Object.values(row).some(val => val && String(val).toLowerCase().includes(q)));
    }, [searchQuery, table3Data]);

    const { sorted: sortedT1, sortCol: sc1, sortDir: sd1, toggle: tog1 } = useSortableTable(filteredT1);
    const { sorted: sortedT2, sortCol: sc2, sortDir: sd2, toggle: tog2 } = useSortableTable(filteredT2);
    const { sorted: sortedT3, sortCol: sc3, sortDir: sd3, toggle: tog3 } = useSortableTable(filteredT3);

    const app1Class = app1Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;
    const app2Class = app2Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;
    const app3Class = app3Ref.inView ? `${styles.applicationsSection} ${styles.appSectionVisible}` : styles.applicationsSection;

    function Th({ col, label, toggle, sortCol, sortDir }: { col: string; label: string; toggle: (c: string) => void; sortCol: string | null; sortDir: SortDir }) {
        return (
            <th className={styles.sortableTh} onClick={() => toggle(col)}>
                {label} <SortIcon dir={sortCol === col ? sortDir : null} />
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

                        {/* Blueprint SVG — absolutely positioned over the wheel hub */}
                        <div className={`${styles.blueprintSvgWrap} ${app1Ref.inView ? styles.blueprintVisible : ''}`}>
                            <svg viewBox="0 0 320 320" className={styles.blueprintSvg} aria-hidden>
                                <defs>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                                    </filter>
                                </defs>

                                {/* Outer housing (D = 127.3mm) */}
                                <circle className={`${styles.bpCircle} ${styles.bpC1}`} cx="160" cy="160" r="120" filter="url(#glow)" />
                                {/* Housing inner */}
                                <circle className={`${styles.bpCircle} ${styles.bpC2}`} cx="160" cy="160" r="96" strokeDasharray="6 4" />
                                {/* Bearing outer race */}
                                <circle className={`${styles.bpCircle} ${styles.bpC3}`} cx="160" cy="160" r="74" filter="url(#glow)" />
                                {/* Bearing inner race */}
                                <circle className={`${styles.bpCircle} ${styles.bpC4}`} cx="160" cy="160" r="52" />
                                {/* Bore (d = 55.7mm) */}
                                <circle className={`${styles.bpCircle} ${styles.bpBore}`} cx="160" cy="160" r="28" filter="url(#glow)" />

                                {/* Center crosshair */}
                                <line className={styles.bpDim} x1="120" y1="160" x2="200" y2="160" />
                                <line className={styles.bpDim} x1="160" y1="120" x2="160" y2="200" />
                                <circle cx="160" cy="160" r="3" fill="#38bdf8" opacity="0.9" />

                                {/* Bolt holes — 4 × M12 at J=106mm */}
                                {[0, 90, 180, 270].map((angle) => {
                                    const r = 86;
                                    const rad = (angle * Math.PI) / 180;
                                    return <circle key={angle} className={`${styles.bpHole} ${styles.bpC5}`}
                                        cx={160 + r * Math.cos(rad)} cy={160 + r * Math.sin(rad)} r="8" />;
                                })}

                                {/* D label */}
                                <line className={styles.bpDim} x1="160" y1="36" x2="160" y2="15" />
                                <line className={styles.bpDim} x1="160" y1="15" x2="280" y2="15" />
                                <text className={styles.bpLabel} x="284" y="19">D = 127.3</text>

                                {/* d label */}
                                <line className={styles.bpDim} x1="160" y1="132" x2="160" y2="110" />
                                <line className={styles.bpDim} x1="160" y1="110" x2="280" y2="110" />
                                <text className={styles.bpLabel} x="284" y="114">d = 55.7</text>

                                {/* H/T label */}
                                <line className={styles.bpDim} x1="246" y1="160" x2="270" y2="190" />
                                <text className={styles.bpLabel} x="274" y="194">H/T M12</text>

                                {/* Left labels */}
                                <line className={styles.bpLeader} x1="60" y1="110" x2="30" y2="85" />
                                <text className={styles.bpLabelLeft} x="28" y="81">КОРПУС</text>
                                <text className={styles.bpLabelLeft} x="28" y="93">З ЧАВУНУ</text>

                                <line className={styles.bpLeader} x1="86" y1="155" x2="30" y2="150" />
                                <text className={styles.bpLabelLeft} x="28" y="146">КАСЕТНЕ</text>
                                <text className={styles.bpLabelLeft} x="28" y="158">УЩІЛЬНЕННЯ</text>

                                <line className={styles.bpLeader} x1="108" y1="195" x2="30" y2="225" />
                                <text className={styles.bpLabelLeft} x="28" y="221">ВНУТРІШНІЙ</text>
                                <text className={styles.bpLabelLeft} x="28" y="233">ПІДШИПНИК</text>

                                {/* Hot points */}
                                <circle className={`${styles.bpHotPulse} ${styles.bpHP1}`} cx="160" cy="40" r="6" />
                                <circle className={styles.bpHotDot} cx="160" cy="40" r="4" />
                                <circle className={`${styles.bpHotPulse} ${styles.bpHP2}`} cx="86" cy="160" r="6" />
                                <circle className={styles.bpHotDot} cx="86" cy="160" r="4" />

                                <text className={styles.bpWatermark} x="160" y="312">VELNOX © 2026</text>
                            </svg>
                        </div>

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
                                <div className={styles.blueprintSpecs}>
                                    <div className={styles.blueprintSpec}>
                                        <span className={styles.blueprintSpecVal}>48.8 kN</span>
                                        <span className={styles.blueprintSpecLabel}>Cdyn</span>
                                    </div>
                                    <div className={styles.blueprintSpecDivider} />
                                    <div className={styles.blueprintSpec}>
                                        <span className={styles.blueprintSpecVal}>35.3 kN</span>
                                        <span className={styles.blueprintSpecLabel}>Co static</span>
                                    </div>
                                    <div className={styles.blueprintSpecDivider} />
                                    <div className={styles.blueprintSpec}>
                                        <span className={styles.blueprintSpecVal}>3.81 kg</span>
                                        <span className={styles.blueprintSpecLabel}>Mass</span>
                                    </div>
                                </div>
                            </div>

                        </div>
            </section>

            {/* STICKY SEARCH — after blueprint block */}
            <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                <div className={`${styles.container} ${styles.stickyContainer}`}>
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
                                        <Th col="Brand name" label="Brand" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="J (mm)" label="J" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="D (mm)" label="D" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="D1 (mm)" label="D1" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="d (mm)" label="d" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="C (mm)" label="C" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="H/T" label="H/T" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="G" label="G" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="L (mm)" label="L" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="L1 (mm)" label="L1" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="F (mm)" label="F" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="Mass (kg)" label="Mass" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="Cdyn (kN)" label="Cdyn" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="Co (kN)" label="Co" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <Th col="Pu (kN)" label="Pu" toggle={tog1} sortCol={sc1} sortDir={sd1} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT1.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number" className={styles.partNumCell}>{row['Part Number']}</td>
                                            <td data-label="Bearing" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Bearing designation']}</td>
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

            {/* ── APP BLOCK 2 — CUTTING NODES (full-width, photo + text only) ── */}
            <section ref={app2Ref.ref} className={`${styles.blueprintBlock} ${app2Ref.inView ? styles.blueprintVisible : ''}`}>
                <Image
                    src="/velnox/images/hubs/bednar-field.png"
                    alt=""
                    fill
                    priority={false}
                    style={{ objectFit: 'cover', objectPosition: '55% 60%' }}
                />
                <div className={styles.blueprintDarkOverlay2} />
                <div className={`${styles.blueprintLayout} ${styles.blueprintLayout2}`}>
                    <div className={styles.blueprintSpacer} />
                    <div className={styles.blueprintText}>
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
                                        <Th col="Brand name" label="Brand" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="J (mm)" label="J" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="D (mm)" label="D" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="H/T" label="H/T" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="d (mm)" label="d" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="C (mm)" label="C" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="M" label="M" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="L (mm)" label="L" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="L1 (mm)" label="L1" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="E (mm)" label="E" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="F (mm)" label="F" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="Mass (kg)" label="Mass" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="Cdyn (kN)" label="Cdyn" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="Co (kN)" label="Co" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <Th col="Pu (kN)" label="Pu" toggle={tog2} sortCol={sc2} sortDir={sd2} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT2.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number" className={styles.partNumCell}>{row['Part Number']}</td>
                                            <td data-label="Bearing" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Bearing designation']}</td>
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
                                        <Th col="Brand name" label="Brand" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="J (mm)" label="J" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="D (mm)" label="D" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="D1 (mm)" label="D1" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="d (mm)" label="d" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="H/T" label="H/T" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="L (mm)" label="L" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="B (mm)" label="B" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="Mass (kg)" label="Mass" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="Cdyn (kN)" label="Cdyn" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="Co (kN)" label="Co" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <Th col="Pu (kN)" label="Pu" toggle={tog3} sortCol={sc3} sortDir={sd3} />
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedT3.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number" className={styles.partNumCell}>{row['Part Number']}</td>
                                            <td data-label="Bearing" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Bearing designation']}</td>
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
