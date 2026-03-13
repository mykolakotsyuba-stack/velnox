'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect, useMemo } from 'react';
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
                            Розрахунковий ресурс та<br />експлуатаційні навантаження
                        </h2>
                        <p className={styles.introCopy}>
                            Для OEM-виробників критично важливо точно прогнозувати життєвий цикл кожного вузла.
                            База даних VELNOX містить вичерпні параметри <strong>динамічної (C<sub>dyn</sub>) та статичної (C<sub>0</sub>)</strong> вантажопідйомності,
                            а також межі втомного навантаження (P<sub>u</sub>). Ці дані дозволяють конструкторським відділам закладати
                            правильний запас міцності ще на етапі 3D-моделювання техніки.
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
                <h2 className={styles.crossRefTitle}>Безшовна інтеграція<br />без зміни креслень</h2>
                <p className={styles.crossRefCopy}>
                    Впровадження інженерних рішень VELNOX не вимагає переробки конструкторської документації чи зміни посадкових місць.
                    Наші підшипникові вузли є <strong>100% геометричними та функціональними аналогами</strong> продукції провідних
                    європейських брендів та оригінальних деталей (OEM) сільськогосподарської та промислової техніки.
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

/* ─── Main Page Component ─── */

export function BearingsCategoryPage({ locale, products = [] }: { locale: Locale, products?: ProductListItem[] }) {
    const t = useTranslations('bearingsPage');
    const heroRef = useInView();
    const approachRef = useInView();
    const tablesRef = useInView();
    const ctaRef = useInView();

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

    const [modalProduct, setModalProduct] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // API base URL
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    // Table data states
    const [table2Data, setTable2Data] = useState<any[]>([]);
    const [table3Data, setTable3Data] = useState<any[]>([]);
    const [table4Data, setTable4Data] = useState<any[]>([]);
    const [table5Data, setTable5Data] = useState<any[]>([]);
    const [loadingTables, setLoadingTables] = useState(true);

    // Fetch table data from API
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const [res2, res3, res4, res5] = await Promise.all([
                    fetch(`${apiBase}/v1/products/tables/performance`),
                    fetch(`${apiBase}/v1/products/tables/cross-references`),
                    fetch(`${apiBase}/v1/products/tables/extended-specs`),
                    fetch(`${apiBase}/v1/products/tables/additional-data`),
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
    }, [apiBase]);

    // Table 1: BUQ Dimensional Specs
    const filteredT1 = useMemo(() => {
        const typedBuq = buqData as typeof buqData;
        if (!searchQuery) return typedBuq;
        const q = searchQuery.toLowerCase();
        return typedBuq.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery]);

    // Table 2: Performance data — from API
    const filteredT2 = useMemo(() => {
        if (!searchQuery) return table2Data;
        const q = searchQuery.toLowerCase();
        return table2Data.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, table2Data]);

    // Table 3: Cross-references & applications — from API
    const filteredT3 = useMemo(() => {
        if (!searchQuery) return table3Data;
        const q = searchQuery.toLowerCase();
        return table3Data.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, table3Data]);

    // Table 4: Additional specs — from API
    const filteredT4 = useMemo(() => {
        if (!searchQuery) return table4Data;
        const q = searchQuery.toLowerCase();
        return table4Data.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, table4Data]);

    // Table 5: Additional specs — from API
    const filteredT5 = useMemo(() => {
        if (!searchQuery) return table5Data;
        const q = searchQuery.toLowerCase();
        return table5Data.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, table5Data]);

    return (
        <main className={styles.page}>
            {modalProduct !== null && (
                <LeadModal onClose={() => setModalProduct(null)} defaultDesignation={modalProduct} />
            )}

            {/* 1. HERO SECTION */}
            <section className={styles.hero} ref={heroRef.ref}>
                <div className={`${styles.container} ${styles.heroContainer} ${heroRef.inView ? styles.animIn : ''}`}>
                    <div className={styles.heroEyebrow}>
                        <span className={styles.eyebrowLine}></span>
                        VELNOX BEARING UNITS
                    </div>
                    <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
                    <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
                </div>
            </section>

            {/* 2. ENGINEERING APPROACH */}
            <section className={styles.approach} ref={approachRef.ref}>
                <div className={`${styles.container} ${approachRef.inView ? styles.animIn : ''}`}>
                    <h2 className={styles.sectionTitle}>{t('block1.title')}</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <h3>{t('block1.card1_title')}</h3>
                            <p>{t('block1.card1_desc')}</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h3>{t('block1.card2_title')}</h3>
                            <p>{t('block1.card2_desc')}</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                            </div>
                            <h3>{t('block1.card3_title')}</h3>
                            <p>{t('block1.card3_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Application: Packer Roller ─── */}
            <PackerRollerIntro />

            {/* 3. TECHNICAL TABLES */}
            <section className={styles.tablesSection} ref={tablesRef.ref}>
                <div className={`${styles.container} ${tablesRef.inView ? styles.animIn : ''}`}>
                    {/* ─── BUQ Drawing Composite (above Table 1) ─── */}
                    <div className={styles.buqDrawingBlock}>
                        <div className={styles.buqDrawingTitle}>ТЕХНІЧНЕ КРЕСЛЕННЯ — BUQ SERIES</div>
                        <div className={styles.buqDrawingCompositeSingle}>
                            <Image
                                src="/velnox/images/products/buq-drawing-composite.png"
                                alt="BUQ Series Blueprint"
                                width={1200}
                                height={600}
                                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>

                    <div className={styles.tablesHeaderWrap} ref={searchHeaderRef}>
                        <div className={`${styles.container} ${styles.stickyContainer}`}>
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

                    {/* ─── Table 1: BUQ Dimensional & Load Specs ─── */}
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table1.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={`${styles.techTable} ${styles.techTableCompact}`}>
                                <thead>
                                    <tr>
                                        <th>Part Number</th>
                                        <th>Cross-Reference</th>
                                        <th>Brand</th>
                                        <th>d (mm)</th>
                                        <th>d (inch)</th>
                                        <th>A1 (mm)</th>
                                        <th>A2 (mm)</th>
                                        <th>J (mm)</th>
                                        <th>L (mm)</th>
                                        <th>N (mm)</th>
                                        <th>A (mm)</th>
                                        <th>Mass (kg)</th>
                                        <th>Cdyn (kN)</th>
                                        <th>Co (kN)</th>
                                        <th>Pu (kN)</th>
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT1.map((row, i) => (
                                        <tr key={row.slug || i}>
                                            <td data-label="Part Number">
                                                <Link href={`/${locale}/products/bearings/${row.slug}`} className={styles.designationLink}>
                                                    {row.article}
                                                </Link>
                                            </td>
                                            <td data-label="Cross-Reference" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row.cross_ref}</td>
                                            <td data-label="Brand">{row.brand}</td>
                                            <td data-label="d (mm)">{row.d_mm}</td>
                                            <td data-label="d (inch)">{row.d_inch ?? '—'}</td>
                                            <td data-label="A1 (mm)">{row.A1}</td>
                                            <td data-label="A2 (mm)">{row.A2}</td>
                                            <td data-label="J (mm)">{row.J}</td>
                                            <td data-label="L (mm)">{row.L}</td>
                                            <td data-label="N (mm)">{row.N}</td>
                                            <td data-label="A (mm)">{row.A}</td>
                                            <td data-label="Mass (kg)">{row.mass_kg}</td>
                                            <td data-label="Cdyn (kN)">{row.Cdyn}</td>
                                            <td data-label="Co (kN)">{row.Co}</td>
                                            <td data-label="Pu (kN)">{row.Pu}</td>
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
                </div>
            </section>

            {/* ─── Intro Block: Performance ─── */}
            <PerformanceIntro />

            {/* ─── Section: Table 2: Performance Data ─── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table2.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table2.desc')}</p>

                        {/* Diagram for Table 2 */}
                        <div className={styles.tableDiagramContainer}>
                            <Image
                                src="/velnox/images/bearings/table2-diagram.png"
                                alt="Table 2 Bearing Diagram"
                                width={600}
                                height={400}
                                priority={false}
                                className={styles.tableDiagram}
                            />
                        </div>

                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <th>Part No</th>
                                        <th>Designation</th>
                                        <th>Brand</th>
                                        <th>Cross-Ref</th>
                                        <th>Bore d</th>
                                        <th>A1</th>
                                        <th>A2</th>
                                        <th>J</th>
                                        <th>L</th>
                                        <th>H/T</th>
                                        <th>A</th>
                                        <th>Mass</th>
                                        <th>Cdyn</th>
                                        <th>Co</th>
                                        <th>Pu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT2.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part No">{row['Part Number'] || '-'}</td>
                                            <td data-label="Designation" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Bearing designation'] || '-'}</td>
                                            <td data-label="Brand" style={{ fontSize: '12px' }}>{row['Brand name'] || '-'}</td>
                                            <td data-label="Cross-Ref" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Cross-Refference'] || '-'}</td>
                                            <td data-label="Bore d">{row['Bore diameter d (mm)'] || '-'}</td>
                                            <td data-label="A1">{row['Total housing width A1 (mm)'] || '-'}</td>
                                            <td data-label="A2">{row['Housing flange thickness A2 (mm)'] || '-'}</td>
                                            <td data-label="J">{row['Distance between the holes J (mm)'] || '-'}</td>
                                            <td data-label="L">{row['Total length L (mm)'] || '-'}</td>
                                            <td data-label="H/T">{row['Hole / Thread H/T'] || '-'}</td>
                                            <td data-label="A">{row['Overall width A (mm)'] || '-'}</td>
                                            <td data-label="Mass">{row['Mass kg'] || '-'}</td>
                                            <td data-label="Cdyn">{row['Dynamic load rating Cdyn (kN)'] || '-'}</td>
                                            <td data-label="Co">{row['Static load rating Co (kN)'] || '-'}</td>
                                            <td data-label="Pu">{row['Fatigue load limit Pu (kN)'] || '-'}</td>
                                        </tr>
                                    ))}
                                    {filteredT2.length === 0 && (
                                        <tr><td colSpan={14} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Intro Block: Cross-References ─── */}
            <CrossRefIntro />

            {/* ─── Section: Packer Rollers (Пакерні котки) with Sealing Info ─── */}
            <section className={`${styles.sealingSection} ${styles.appSectionVisible}`}>
                <div className={styles.appWatermark} aria-hidden="true">Ущільнення</div>
                <div className={styles.appInner}>
                    <div className={styles.appHeader}>
                        <span className={styles.appTag}>Ущільнення</span>
                        <h2 className={styles.appTitle}>{t('packer_roller.sealing_title')}</h2>
                    </div>
                    <div className={styles.appBody}>
                        <p className={`${styles.appPara} ${styles.appParaLead} ${styles.appParaVisible}`}>
                            Ущільнення <strong className={styles.appKeyword}>ТРИКРОМКОВЕ + ДВОКРОМКОВЕ</strong>
                            — Підшипникові вузли VELNOX оснащені комбінованою системою ущільнення, яка включає
                            <strong className={styles.appKeyword}> трикромочне та додаткове двокромочне ущільнення</strong> з обох сторін підшипника.
                        </p>
                        <p className={`${styles.appPara} ${styles.appParaVisible}`}>
                            Трикромочне ущільнення забезпечує основний захист від пилу, бруду та вологи, а двокромочне ущільнення виконує функцію додаткового бар'єра,
                            обмежуючи <strong className={styles.appKeyword}>проникнення забруднень</strong> у складних умовах експлуатації.
                        </p>
                        <p className={`${styles.appPara} ${styles.appParaVisible}`}>
                            Застосування посилених систем ущільнення з обох сторін підшипника дозволяє використовувати підшипникові вузли VELNOX у більш широкому діапазоні
                            <strong className={styles.appKeyword}> застосувань та умов експлуатації</strong>, особливо в аграрному середовищі.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Section: Table 3: Cross-References & Applications ─── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table3.desc')}</p>

                        {/* Diagram for Table 3 */}
                        <div className={styles.tableDiagramContainer}>
                            <Image
                                src="/velnox/images/bearings/table3-diagram.png"
                                alt="Table 3 Bearing Diagram"
                                width={600}
                                height={400}
                                priority={false}
                                className={styles.tableDiagram}
                            />
                        </div>

                        <div className={`${styles.tableScroll} ${styles.noScroll}`}>
                            <table className={`${styles.techTable} ${styles.noScroll}`}>
                                <thead>
                                    <tr>
                                        <th>Part Number</th>
                                        <th>Bearing Designation</th>
                                        <th>Brand</th>
                                        <th>Cross-Reference</th>
                                        <th>Bore d (mm)</th>
                                        <th>Length L (mm)</th>
                                        <th>J (mm)</th>
                                        <th>H/T (mm)</th>
                                        <th>A (mm)</th>
                                        <th>A1 (mm)</th>
                                        <th>A2 (mm)</th>
                                        <th>B (mm)</th>
                                        <th>Co (kN)</th>
                                        <th>Cdyn (kN)</th>
                                        <th>Pu (kN)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT3.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number">{row['Part Number'] || '-'}</td>
                                            <td data-label="Bearing Designation" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Bearing designation'] || '-'}</td>
                                            <td data-label="Brand" style={{ fontSize: '12px' }}>{row['Brand \\nname'] || '-'}</td>
                                            <td data-label="Cross-Reference" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Cross-Refference'] || '-'}</td>
                                            <td data-label="Bore d (mm)">{row['Bore diameter d (mm)'] || '-'}</td>
                                            <td data-label="Length L (mm)">{row['Total length L (mm)'] || '-'}</td>
                                            <td data-label="J (mm)">{row['Distance between the holes J (mm)'] || '-'}</td>
                                            <td data-label="H/T (mm)">{row['Hole / Thread H/T (mm)'] || '-'}</td>
                                            <td data-label="A (mm)">{row['Overall width A (mm)'] || '-'}</td>
                                            <td data-label="A1 (mm)">{row['Total housing width A1 (mm)'] || '-'}</td>
                                            <td data-label="A2 (mm)">{row['Housing flange thickness A2 (mm)'] || '-'}</td>
                                            <td data-label="B (mm)">{row['Width inner ring B (mm)'] || '-'}</td>
                                            <td data-label="Co (kN)">{row['Static load rating Co (kN)'] || '-'}</td>
                                            <td data-label="Cdyn (kN)">{row['Dynamic load rating Cdyn (kN)'] || '-'}</td>
                                            <td data-label="Pu (kN)">{row['Fatigue load limit Pu (kN)'] || '-'}</td>
                                        </tr>
                                    ))}
                                    {filteredT3.length === 0 && (
                                        <tr><td colSpan={15} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Intro Block: Sealing Systems ─── */}
            <SealingIntro />

            {/* ─── Sealing Info Block (Requested) ─── */}
            <section className={styles.tablesSection}>
                <div className={styles.container}>
                    <div className={`${styles.buqDrawingBlock} ${styles.sealingInfoBlock}`}>
                        <div className={styles.sealingInfoTag}>{t('sealing_info.tag')}</div>
                        <div className={styles.sealingInfoTitle}>
                            {t('sealing_info.title')}
                        </div>
                        <div className={styles.sealingInfoContent}>
                            <p>{t('sealing_info.p1')}</p>
                            <p>{t('sealing_info.p2')}</p>
                            <p>{t('sealing_info.p3')}</p>
                        </div>
                    </div>

                    {/* Placeholder for Sealing Scheme (Figure) */}
                    <div className={styles.buqDrawingBlock}>
                        <div className={styles.buqDrawingTitle}>FIGURE: SEALING SYSTEM SCHEME</div>
                        <div className={styles.buqDrawingCompositeSingle}>
                            <div style={{ 
                                width: '100%', 
                                height: '300px', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px dashed rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255,255,255,0.3)'
                            }}>
                                [ SEALING SYSTEM SCHEME IMAGE ]
                            </div>
                        </div>
                    </div>

                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table4.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table4.desc')}</p>
                        <div className={`${styles.tableScroll} ${styles.noScroll}`}>
                            <table className={`${styles.techTable} ${styles.noScroll}`}>
                                <thead>
                                    <tr>
                                        <th>Part Number</th>
                                        <th>Bearing Designation</th>
                                        <th>Brand</th>
                                        <th>Cross-Reference</th>
                                        <th>Bore d (mm)</th>
                                        <th>d1 (mm)</th>
                                        <th>L1 (mm)</th>
                                        <th>J1 (mm)</th>
                                        <th>L2 (mm)</th>
                                        <th>J2 (mm)</th>
                                        <th>A (mm)</th>
                                        <th>A1 (mm)</th>
                                        <th>A2 (mm)</th>
                                        <th>A3 (mm)</th>
                                        <th>T</th>
                                        <th>H (mm)</th>
                                        <th>Mass (kg)</th>
                                        <th>Cdyn (kN)</th>
                                        <th>Co (kN)</th>
                                        <th>Pu (kN)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT4.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part Number">{row['Part Number'] || '-'}</td>
                                            <td data-label="Bearing Designation" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Bearing designation'] || '-'}</td>
                                            <td data-label="Brand" style={{ fontSize: '12px' }}>{row['Brand \\nname'] || '-'}</td>
                                            <td data-label="Cross-Reference" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Cross-Refference'] || '-'}</td>
                                            <td data-label="Bore d (mm)">{row['Bore diameter d (mm)'] || '-'}</td>
                                            <td data-label="d1 (mm)">{row['Centering diameter d1 (mm)'] || '-'}</td>
                                            <td data-label="L1 (mm)">{row['Housing overall width L1 (mm)'] || '-'}</td>
                                            <td data-label="J1 (mm)">{row['Distance between the holes J1 (mm)'] || '-'}</td>
                                            <td data-label="L2 (mm)">{row['Housing overall width L2 (mm)'] || '-'}</td>
                                            <td data-label="J2 (mm)">{row['Distance between the holes J2 (mm)'] || '-'}</td>
                                            <td data-label="A (mm)">{row['Overall width A (mm)'] || '-'}</td>
                                            <td data-label="A1 (mm)">{row['Flange width A1 (mm)'] || '-'}</td>
                                            <td data-label="A2 (mm)">{row['Flange width A2 (mm)'] || '-'}</td>
                                            <td data-label="A3 (mm)">{row['Centering diameter height A3 (mm)'] || '-'}</td>
                                            <td data-label="T">{row['Threaded hole size T'] || '-'}</td>
                                            <td data-label="H (mm)">{row['Hole diameter H (mm)'] || '-'}</td>
                                            <td data-label="Mass (kg)">{row['Mass kg'] || '-'}</td>
                                            <td data-label="Cdyn (kN)">{row['Dynamic load rating Cdyn (kN)'] || '-'}</td>
                                            <td data-label="Co (kN)">{row['Static load rating Co (kN)'] || '-'}</td>
                                            <td data-label="Pu (kN)">{row['Fatigue load limit Pu (kN)'] || '-'}</td>
                                        </tr>
                                    ))}
                                    {filteredT4.length === 0 && (
                                        <tr><td colSpan={17} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Section: Table 5: Additional Bearing Specifications ─── */}
            <section className={styles.tablesSection}>
                <div className={styles.tableSectionContainer}>
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table5.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table5.desc')}</p>
                        <div className={`${styles.tableScroll} ${styles.noScroll}`}>
                            <table className={`${styles.techTable} ${styles.noScroll}`}>
                                <thead>
                                    <tr>
                                        <th>Part No</th>
                                        <th>Designation</th>
                                        <th>Brand</th>
                                        <th>Cross-Ref</th>
                                        <th>Bore d</th>
                                        <th>Out D</th>
                                        <th>Pitch J</th>
                                        <th>H/T</th>
                                        <th>A</th>
                                        <th>A2</th>
                                        <th>B</th>
                                        <th>Mass</th>
                                        <th>Co</th>
                                        <th>Cdyn</th>
                                        <th>Pu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT5.map((row, i) => (
                                        <tr key={i}>
                                            <td data-label="Part No">{row['Part Number'] || '-'}</td>
                                            <td data-label="Designation" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Bearing designation'] || '-'}</td>
                                            <td data-label="Brand" style={{ fontSize: '12px' }}>{row['Brand \\nname'] || '-'}</td>
                                            <td data-label="Cross-Ref" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{row['Cross-Refference'] || '-'}</td>
                                            <td data-label="Bore d">{row['Bore diameter d (mm)'] || '-'}</td>
                                            <td data-label="Out D">{row['Outside diameter D (mm)'] || '-'}</td>
                                            <td data-label="Pitch J">{row['Pitch circle diameter J (mm)'] || '-'}</td>
                                            <td data-label="H/T">{row['Hole / Thread H/T'] || '-'}</td>
                                            <td data-label="A">{row['Overall width A (mm)'] || '-'}</td>
                                            <td data-label="A2">{row['Housing flange thickness A2 (mm)'] || '-'}</td>
                                            <td data-label="B">{row['Width inner ring B (mm)'] || '-'}</td>
                                            <td data-label="Mass">{row['Mass kg'] || '-'}</td>
                                            <td data-label="Co">{row['Static load rating Co (kN)'] || '-'}</td>
                                            <td data-label="Cdyn">{row['Dynamic load rating Cdyn (kN)'] || '-'}</td>
                                            <td data-label="Pu">{row['Fatigue load limit Pu (kN)'] || '-'}</td>
                                        </tr>
                                    ))}
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
