'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';
import styles from './bearings.module.css';
import type { Locale, ProductListItem } from '@/entities/product/model/types';
import crossRefData from '../data/bearingsCrossRefData.json';
import sealingData from '../data/bearingsSealingData.json';

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
                        <h2 className={styles.introTitle}>Розрахунковий ресурс та<br />експлуатаційні навантаження</h2>
                        <p className={styles.introCopy}>
                            Для OEM-виробників критично важливо точно прогнозувати життєвий цикл кожного вузла.
                            База даних VELNOX містить вичерпні параметри <strong>динамічної (C<sub>dyn</sub>) та статичної (C<sub>0</sub>)</strong> вантажопідйомності,
                            а також межі втомного навантаження (P<sub>u</sub>). Ці дані дозволяють конструкторським відділам закладати
                            правильний запас міцності ще на етапі 3D-моделювання техніки.
                        </p>
                    </div>
                    <div className={styles.introGraphic}>
                        {/* Force vector SVG diagram */}
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.forceDiagram}>
                            {/* Bearing housing outline */}
                            <circle cx="100" cy="100" r="55" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" />
                            <circle cx="100" cy="100" r="35" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
                            <circle cx="100" cy="100" r="18" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" />

                            {/* Radial force arrow (downward) */}
                            <line x1="100" y1="40" x2="100" y2="75" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" className={styles.forceLine} />
                            <polygon points="100,80 95,68 105,68" fill="#3b82f6" />
                            <text x="107" y="55" fill="rgba(59,130,246,0.9)" fontSize="11" fontFamily="monospace">Fr</text>

                            {/* Axial force arrow (rightward) */}
                            <line x1="160" y1="100" x2="127" y2="100" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 2" className={styles.forceLine} />
                            <polygon points="122,100 134,95 134,105" fill="#22c55e" />
                            <text x="164" y="104" fill="rgba(34,197,94,0.9)" fontSize="11" fontFamily="monospace">Fa</text>

                            {/* Rotation indicator */}
                            <path d="M 100 62 A 38 38 0 0 1 138 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                            <polygon points="140,95 136,107 144,107" fill="rgba(255,255,255,0.2)" transform="rotate(45 140 101)" />

                            {/* Cdyn label */}
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

/* ─── Main Page Component ─── */
type CrossRefRow = {
    'Артикул VELNOX': string;
    'Позначення аналога (FKL)': string;
    'Основні ОЕМ-аналоги (Крос-референси)': string;
    'Застосування на техніці (Бренди та агрегати)': string;
};

type SealingRow = {
    'Артикул VELNOX': string;
    'Позначення аналога (FKL)': string;
    'Конфігурація ущільнення': string;
    'Інженерні особливості та принцип дії': string;
};

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

    // Table 1: Dimensional Specs (from API)
    const filteredBearings = useMemo(() => {
        if (!searchQuery) return products;
        const q = searchQuery.toLowerCase();
        return products.filter(b =>
            Object.values(b.specs || {}).some(val => val && String(val).toLowerCase().includes(q)) ||
            b.article.toLowerCase().includes(q) ||
            b.name.toLowerCase().includes(q)
        );
    }, [searchQuery, products]);

    // Table 2: Performance data — from API products (Cdyn, Co, Pu, mass from specs)
    const filteredT2 = useMemo(() => {
        if (!searchQuery) return products;
        const q = searchQuery.toLowerCase();
        return products.filter(b =>
            b.article.toLowerCase().includes(q) ||
            b.name.toLowerCase().includes(q) ||
            String(b.specs?.cdyn_kn || '').includes(q) ||
            String(b.specs?.co_kn || '').includes(q)
        );
    }, [searchQuery, products]);

    // Table 3: Cross-references & applications
    const typedCrossRef = crossRefData as CrossRefRow[];
    const filteredT3 = useMemo(() => {
        if (!searchQuery) return typedCrossRef;
        const q = searchQuery.toLowerCase();
        return typedCrossRef.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, typedCrossRef]);

    // Table 4: Sealing systems
    const typedSealing = sealingData as SealingRow[];
    const filteredT4 = useMemo(() => {
        if (!searchQuery) return typedSealing;
        const q = searchQuery.toLowerCase();
        return typedSealing.filter(row =>
            Object.values(row).some(val => val && String(val).toLowerCase().includes(q))
        );
    }, [searchQuery, typedSealing]);

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

            {/* 3. TECHNICAL TABLES */}
            <section className={styles.tablesSection} ref={tablesRef.ref}>
                <div className={`${styles.container} ${tablesRef.inView ? styles.animIn : ''}`}>
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

                    {/* ─── Table 1: Dimensional Specs ─── */}
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table1.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table1.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <th>{t('block2.table1.col_designation')}</th>
                                        <th>{t('block2.table1.col_d')}</th>
                                        <th>{t('block2.table1.col_j')}</th>
                                        <th>{t('block2.table1.col_width')}</th>
                                        <th>{t('block2.table1.col_holes')}</th>
                                        <th>{t('block2.table1.col_l')}</th>
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBearings.slice(0, 50).map((b, i) => (
                                        <tr key={b.slug || i}>
                                            <td>
                                                <Link href={`/${locale}/products/bearings/${b.slug}`} className={styles.designationLink}>
                                                    {b.article}
                                                </Link>
                                            </td>
                                            <td>{b.specs?.d_mm || b.specs?.d || '-'}</td>
                                            <td>{b.specs?.j_mm || b.specs?.J || '-'}</td>
                                            <td>{b.specs?.width_mm || b.specs?.B || '-'}</td>
                                            <td>{b.specs?.holes || '-'}</td>
                                            <td>{b.specs?.l_mm || b.specs?.L || '-'}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(b.article)}>
                                                    {t('block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBearings.length === 0 && (
                                        <tr><td colSpan={7} className={styles.emptyState}>Нічого не знайдено</td></tr>
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
                <div className={styles.container}>
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table2.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table2.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <th>Артикул VELNOX</th>
                                        <th>Аналог FKL</th>
                                        <th>Cdyn, kN</th>
                                        <th>Co, kN</th>
                                        <th>Pu, kN</th>
                                        <th>Маса, kg</th>
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT2.slice(0, 50).map((b, i) => (
                                        <tr key={b.slug || i}>
                                            <td>
                                                <Link href={`/${locale}/products/bearings/${b.slug}`} className={styles.designationLink}>
                                                    {b.article}
                                                </Link>
                                            </td>
                                            <td>{b.name || '-'}</td>
                                            <td>{b.specs?.cdyn_kn || b.specs?.Cdyn || '-'}</td>
                                            <td>{b.specs?.co_kn || b.specs?.Co || '-'}</td>
                                            <td>{b.specs?.pu_kn || b.specs?.Pu || '-'}</td>
                                            <td>{b.specs?.mass_kg || b.specs?.KG || '-'}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(b.article)}>
                                                    {t('block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredT2.length === 0 && (
                                        <tr><td colSpan={7} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Intro Block: Cross-References ─── */}
            <CrossRefIntro />

            {/* ─── Section: Table 3: Cross-References & Applications ─── */}
            <section className={styles.tablesSection}>
                <div className={styles.container}>
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table4.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table4.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <th>Артикул VELNOX</th>
                                        <th>Аналог FKL</th>
                                        <th>Крос-референси (OEM)</th>
                                        <th>Застосування (Техніка)</th>
                                        <th className={styles.actionCol}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT3.map((row, i) => (
                                        <tr key={i}>
                                            <td className={styles.designationCol}>{row['Артикул VELNOX']}</td>
                                            <td>{row['Позначення аналога (FKL)']}</td>
                                            <td>{row['Основні ОЕМ-аналоги (Крос-референси)']}</td>
                                            <td>{row['Застосування на техніці (Бренди та агрегати)']}</td>
                                            <td className={styles.actionCol}>
                                                <button className={styles.reqBtn} onClick={() => setModalProduct(row['Артикул VELNOX'])}>
                                                    {t('block2.btn_request')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredT3.length === 0 && (
                                        <tr><td colSpan={5} className={styles.emptyState}>Нічого не знайдено</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Intro Block: Sealing Systems ─── */}
            <SealingIntro />

            {/* ─── Section: Table 4: Sealing Systems ─── */}
            <section className={styles.tablesSection}>
                <div className={styles.container}>
                    <div className={styles.tableBlock}>
                        <h3>{t('block2.table3.title')}</h3>
                        <p className={styles.tableDesc}>{t('block2.table3.desc')}</p>
                        <div className={styles.tableScroll}>
                            <table className={styles.techTable}>
                                <thead>
                                    <tr>
                                        <th>Артикул VELNOX</th>
                                        <th>Аналог FKL</th>
                                        <th>Конфігурація ущільнення</th>
                                        <th>Принцип дії</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredT4.map((row, i) => (
                                        <tr key={i}>
                                            <td className={styles.designationCol} style={{ whiteSpace: 'pre-line', fontSize: '12px' }}>{row['Артикул VELNOX'].replace(/<br>/g, '\n')}</td>
                                            <td style={{ whiteSpace: 'pre-line', fontSize: '12px' }}>{row['Позначення аналога (FKL)'].replace(/<br>/g, '\n')}</td>
                                            <td><span className={styles.sealBadge}>{row['Конфігурація ущільнення']}</span></td>
                                            <td>{row['Інженерні особливості та принцип дії']}</td>
                                        </tr>
                                    ))}
                                    {filteredT4.length === 0 && (
                                        <tr><td colSpan={4} className={styles.emptyState}>Нічого не знайдено</td></tr>
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
