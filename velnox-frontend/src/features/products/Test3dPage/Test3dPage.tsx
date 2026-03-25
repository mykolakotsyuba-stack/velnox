'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './test3d.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/velnox-api/api';

/* ─── Lead форма перед завантаженням 3D моделі ─── */
type DownloadFormState = 'idle' | 'open' | 'submitting' | 'success' | 'error';

function DownloadLeadForm({
    fileKey, fileLabel, filePath, utmCampaign, onClose,
}: {
    fileKey: string; fileLabel: string; filePath: string; utmCampaign: string;
    onClose: () => void;
}) {
    const [state, setState] = useState<DownloadFormState>('open');
    const [form, setForm] = useState({ name: '', phone: '', email: '' });
    const [sentEmail, setSentEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [fallbackUrl, setFallbackUrl] = useState('');

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setState('submitting');
        try {
            const res = await fetch(`${API_BASE}/v1/downloads/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name: form.name, phone: form.phone, email: form.email,
                    file_key: fileKey, file_label: fileLabel, file_path: filePath,
                    utm_campaign: utmCampaign,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error ?? 'error');
            setSentEmail(form.email);
            if (data.mail_fallback && data.download_url) {
                setFallbackUrl(data.download_url);
            }
            setState('success');
        } catch (err: any) {
            setErrMsg(err.message === 'mail_error' ? 'Помилка відправки листа. Спробуйте ще.' : 'Сталась помилка. Спробуйте пізніше.');
            setState('error');
        }
    }, [form, fileKey, fileLabel, filePath, utmCampaign]);

    return (
        <div className={styles.leadBackdrop} onClick={onClose}>
            <div className={styles.leadModal} onClick={e => e.stopPropagation()}>
                <button className={styles.leadClose} onClick={onClose} aria-label="Закрити">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>

                {state !== 'success' && (
                    <>
                        <div className={styles.leadHeader}>
                            <div className={styles.leadIcon}>
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={styles.leadTitle}>Завантажити 3D модель</h3>
                                <p className={styles.leadSub}>{fileLabel} · GLB файл</p>
                            </div>
                        </div>

                        <p className={styles.leadHint}>
                            Вкажіть контактні дані — посилання для завантаження надійде на вашу пошту протягом хвилини.
                        </p>

                        <form className={styles.leadForm} onSubmit={handleSubmit}>
                            <div className={styles.leadField}>
                                <label>Ім&apos;я *</label>
                                <input required type="text" placeholder="Іван Петренко"
                                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                            <div className={styles.leadField}>
                                <label>Телефон *</label>
                                <input required type="tel" placeholder="+380..."
                                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                            </div>
                            <div className={styles.leadField}>
                                <label>Email *</label>
                                <input required type="email" placeholder="contact@company.com"
                                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                            </div>

                            {state === 'error' && (
                                <p className={styles.leadError}>{errMsg}</p>
                            )}

                            <button
                                type="submit"
                                className={styles.leadSubmit}
                                disabled={state === 'submitting'}
                            >
                                {state === 'submitting' ? 'Надсилаємо…' : 'Отримати посилання'}
                            </button>
                        </form>

                        <p className={styles.leadNote}>
                            Посилання дійсне 24 год · Ми не передаємо дані третім особам
                        </p>
                    </>
                )}

                {state === 'success' && (
                    <div className={styles.leadSuccess}>
                        <div className={styles.leadSuccessIcon}>
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#22c55e" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h3 className={styles.leadTitle}>Перевірте пошту!</h3>
                        <p className={styles.leadHint}>
                            Посилання для завантаження <strong>{fileLabel}</strong> надіслано на:
                        </p>
                        <p className={styles.leadEmail}>{sentEmail}</p>
                        {fallbackUrl ? (
                            <>
                                <p className={styles.leadHint} style={{ color: '#d97706' }}>
                                    ⚠️ Не вдалось надіслати email. Скористайтеся посиланням нижче:
                                </p>
                                <a
                                    href={fallbackUrl}
                                    className={styles.leadSubmit}
                                    style={{ display: 'block', textDecoration: 'none', textAlign: 'center', marginBottom: 8 }}
                                >
                                    Завантажити зараз
                                </a>
                                <p className={styles.leadNote}>Посилання дійсне 24 год</p>
                            </>
                        ) : (
                            <>
                                <p className={styles.leadNote}>Посилання дійсне 24 години</p>
                                <button className={styles.leadSubmit} onClick={onClose}>Закрити</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── TypeScript: реєструємо web component <model-viewer> ─── */
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                alt?: string;
                'auto-rotate'?: boolean | '';
                'camera-controls'?: boolean | '';
                'shadow-intensity'?: string;
                exposure?: string;
                loading?: 'auto' | 'lazy' | 'eager';
                poster?: string;
                'rotation-per-second'?: string;
                'environment-image'?: string;
                'tone-mapping'?: string;
                'skybox-image'?: string;
                ar?: boolean | '';
                'ar-modes'?: string;
            };
        }
    }
}

// Next.js basePath="/velnox" → public/ static files served at /velnox/...
const BASE = '/velnox';

/* ─── Product data ─── */
interface ProductSpec {
    key: string;
    label: string;
    value: string;
    unit?: string;
    highlight?: boolean;
}

interface ProductData {
    id: string;
    partNumber: string;
    designation: string;
    type: string;
    description: string;
    model: string;
    specs: ProductSpec[];
    features: string[];
    applications: string[];
}

const PRODUCTS: ProductData[] = [
    {
        id: 'il20-80-6h-b16',
        partNumber: 'IL20-80 6H-B16',
        designation: 'Фланцева муфта IL серії',
        type: 'Flange Coupling — IL Series',
        description: 'Жорстка фланцева муфта для з\'єднання валів у агромашинах та промисловому обладнанні. 6 кріпильних отворів стандарту B16 забезпечують надійне болтове з\'єднання фланців.',
        model: `${BASE}/models/IL20-80-6H-B16.glb`,
        specs: [
            { key: 'd', label: 'Bore Diameter d', value: '20', unit: 'mm', highlight: true },
            { key: 'D', label: 'Flange Diameter D', value: '80', unit: 'mm', highlight: true },
            { key: 'L', label: 'Total Length L', value: '60', unit: 'mm' },
            { key: 'holes', label: 'Bolt Holes', value: '6', unit: 'pcs' },
            { key: 'hole_type', label: 'Hole Type', value: 'B16 Through Holes', unit: '' },
            { key: 'torque', label: 'Max Torque', value: '155', unit: 'Nm' },
            { key: 'speed', label: 'Max Speed', value: '3000', unit: 'RPM' },
            { key: 'mass', label: 'Mass', value: '0.85', unit: 'kg' },
            { key: 'material', label: 'Material', value: 'Steel C45', unit: '' },
            { key: 'standard', label: 'Standard', value: 'ISO 7009', unit: '' },
        ],
        features: [
            'Жорстка конструкція без люфту',
            '6 болтових з\'єднань B16',
            'Поверхня з антикорозійним покриттям',
            'Балансування класу G6.3',
        ],
        applications: [
            'Сівалки та посівна техніка',
            'Зернозбиральні комбайни',
            'Промислові редуктори',
        ],
    },
    {
        id: 'il25-80-6t-m16-t',
        partNumber: 'IL25-80 6T-M16-T',
        designation: 'Фланцева муфта IL серії',
        type: 'Flange Coupling — IL Series',
        description: 'Фланцева муфта з різьбовими отворами M16 для з\'єднання валів діаметром 25 мм. Конструкція T-типу з 6 різьбовими отворами забезпечує підвищену міцність з\'єднання.',
        model: `${BASE}/models/IL25-80-6T-M16-T.glb`,
        specs: [
            { key: 'd', label: 'Bore Diameter d', value: '25', unit: 'mm', highlight: true },
            { key: 'D', label: 'Flange Diameter D', value: '80', unit: 'mm', highlight: true },
            { key: 'L', label: 'Total Length L', value: '65', unit: 'mm' },
            { key: 'holes', label: 'Tapped Holes', value: '6', unit: 'pcs' },
            { key: 'hole_type', label: 'Thread Type', value: 'M16 Tapped (T)', unit: '' },
            { key: 'torque', label: 'Max Torque', value: '210', unit: 'Nm' },
            { key: 'speed', label: 'Max Speed', value: '2800', unit: 'RPM' },
            { key: 'mass', label: 'Mass', value: '1.02', unit: 'kg' },
            { key: 'material', label: 'Material', value: 'Steel C45', unit: '' },
            { key: 'standard', label: 'Standard', value: 'ISO 7009', unit: '' },
        ],
        features: [
            'Різьбові отвори M16 без додаткових гайок',
            'T-тип з підвищеною міцністю',
            'Збільшений діаметр отвору 25 мм',
            'Балансування класу G6.3',
        ],
        applications: [
            'Трактори та самохідна техніка',
            'Гідравлічні насоси',
            'Вали відбору потужності',
        ],
    },
    {
        id: 'il40-98-4t-m22',
        partNumber: 'IL40-98 4T-M22',
        designation: 'Важконавантажена фланцева муфта',
        type: 'Heavy-Duty Flange Coupling — IL Series',
        description: 'Важконавантажена фланцева муфта для великих валів діаметром 40 мм. Збільшений фланець 98 мм з 4 різьбовими отворами M22 розрахований на передачу високих крутних моментів.',
        model: `${BASE}/models/IL40-98-4T-M22.glb`,
        specs: [
            { key: 'd', label: 'Bore Diameter d', value: '40', unit: 'mm', highlight: true },
            { key: 'D', label: 'Flange Diameter D', value: '98', unit: 'mm', highlight: true },
            { key: 'L', label: 'Total Length L', value: '80', unit: 'mm' },
            { key: 'holes', label: 'Tapped Holes', value: '4', unit: 'pcs' },
            { key: 'hole_type', label: 'Thread Type', value: 'M22 Tapped (T)', unit: '' },
            { key: 'torque', label: 'Max Torque', value: '580', unit: 'Nm' },
            { key: 'speed', label: 'Max Speed', value: '2200', unit: 'RPM' },
            { key: 'mass', label: 'Mass', value: '2.15', unit: 'kg' },
            { key: 'material', label: 'Material', value: 'Steel C45', unit: '' },
            { key: 'standard', label: 'Standard', value: 'ISO 7009', unit: '' },
        ],
        features: [
            'Важконавантажений варіант IL серії',
            'Різьбові отвори M22 — підвищений момент',
            'Великий отвір 40 мм для силових валів',
            'Двостороннє торцеве ущільнення',
        ],
        applications: [
            'Зернозбиральні комбайни (привід барабана)',
            'Промислові міксери та преси',
            'Будівельна та гірнича техніка',
        ],
    },
];

/* ─── Завантажуємо model-viewer через нативний DOM як ES module ───
   Next.js <Script> ігнорує type="module", тому єдиний надійний спосіб. ─── */
const MODEL_VIEWER_CDN = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';

function useModelViewerScript(): boolean {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Вже зареєстровано
        if (customElements.get('model-viewer')) { setReady(true); return; }

        // Вже є в DOM — чекаємо реєстрації
        if (document.querySelector(`script[src*="model-viewer"]`)) {
            const id = setInterval(() => {
                if (customElements.get('model-viewer')) { setReady(true); clearInterval(id); }
            }, 80);
            return () => clearInterval(id);
        }

        // Першe завантаження — inject як справжній ES module
        const s = document.createElement('script');
        s.type = 'module';
        s.src = MODEL_VIEWER_CDN;
        s.onload = () => {
            const id = setInterval(() => {
                if (customElements.get('model-viewer')) { setReady(true); clearInterval(id); }
            }, 80);
        };
        document.head.appendChild(s);
    }, []);

    return ready;
}

/* ─── 3D Viewer Component ───
   Click-to-load: WebGL не запускається до явного кліку користувача.
   Запобігає зависанню сторінки при автоматичному рендері. ─── */
const FILE_SIZES: Record<string, string> = {
    'IL20-80-6H-B16': '2.0',
    'IL25-80-6T-M16-T': '3.8',
    'IL40-98-4T-M22': '5.5',
};

function ModelViewer({ src, label }: { src: string; label: string }) {
    const [activated, setActivated] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const ref = useRef<HTMLElement>(null);
    const scriptReady = useModelViewerScript();

    // Слухаємо нативну подію 'load' model-viewer
    useEffect(() => {
        const el = ref.current;
        if (!el || !activated) return;
        const onLoad = () => setLoaded(true);
        el.addEventListener('load', onLoad);
        return () => el.removeEventListener('load', onLoad);
    }, [activated, src]);

    // При перемиканні продукту — скидаємо стан
    useEffect(() => {
        setActivated(false);
        setLoaded(false);
    }, [src]);

    const slug = src.split('/').pop()?.replace('.glb', '') ?? '';
    const sizeMb = FILE_SIZES[slug] ?? '?';

    if (!activated) {
        return (
            <div className={styles.viewerActivate}>
                <div className={styles.viewerActivateIcon}>
                    <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <button className={styles.viewerActivateBtn} onClick={() => setActivated(true)}>
                    Завантажити 3D модель
                </button>
                <p className={styles.viewerActivateNote}>~{sizeMb} MB · WebGL · інтерактивна</p>
            </div>
        );
    }

    if (!scriptReady) {
        return (
            <div className={styles.viewerLoader}>
                <div className={styles.loaderSpinner} />
                <span>Ініціалізація 3D рушія…</span>
            </div>
        );
    }

    return (
        <div className={styles.viewerWrapper}>
            {!loaded && (
                <div className={styles.viewerLoader}>
                    <div className={styles.loaderSpinner} />
                    <span>Завантаження моделі ({sizeMb} MB)…</span>
                </div>
            )}
            {/* @ts-ignore — model-viewer web component (Google) */}
            <model-viewer
                ref={ref}
                src={src}
                alt={label}
                auto-rotate=""
                camera-controls=""
                shadow-intensity="0.8"
                exposure="1"
                loading="eager"
                rotation-per-second="18deg"
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                }}
            />
            {loaded && (
                <div className={styles.viewerHint}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Перетягніть · Скрол для масштабу
                </div>
            )}
        </div>
    );
}

/* ─── Main Page ─── */
export function Test3dPage() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [hoveredSpec, setHoveredSpec] = useState<string | null>(null);
    const [showDownloadForm, setShowDownloadForm] = useState(false);
    const product = PRODUCTS[activeIdx];

    return (
        <>
        {showDownloadForm && (
            <DownloadLeadForm
                fileKey={product.id}
                fileLabel={product.partNumber}
                filePath={product.model}
                utmCampaign={`il-series-${product.id}`}
                onClose={() => setShowDownloadForm(false)}
            />
        )}
        <main className={styles.page}>
                {/* ── BREADCRUMB ── */}
                <div className={styles.breadcrumb}>
                    <a href="/products">Продукти</a>
                    <span className={styles.breadSep}>/</span>
                    <a href="/products/bearings">Підшипникові муфти</a>
                    <span className={styles.breadSep}>/</span>
                    <span>IL Series — 3D Preview</span>
                    <span className={`${styles.testBadge}`}>TEST</span>
                </div>

                {/* ── HEADER ── */}
                <section className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerEyebrow}>
                            <span className={styles.eyebrowLine} />
                            VELNOX IL SERIES · FLANGE COUPLINGS
                        </div>
                        <h1 className={styles.headerTitle}>{product.partNumber}</h1>
                        <p className={styles.headerSub}>{product.type}</p>
                    </div>

                    {/* Product selector */}
                    <div className={styles.productTabs}>
                        {PRODUCTS.map((p, i) => (
                            <button
                                key={p.id}
                                className={`${styles.productTab} ${i === activeIdx ? styles.productTabActive : ''}`}
                                onClick={() => setActiveIdx(i)}
                            >
                                <span className={styles.tabPartNo}>{p.partNumber}</span>
                                <span className={styles.tabBore}>d = {p.specs[0].value} mm</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── MAIN CONTENT ── */}
                <section className={styles.mainContent}>

                    {/* LEFT — Specs */}
                    <div className={styles.specsPanel}>
                        <div className={styles.specsPanelHeader}>
                            <h2 className={styles.specsPanelTitle}>Технічні характеристики</h2>
                        </div>

                        <div className={styles.specsTable}>
                            {product.specs.map(spec => (
                                <div
                                    key={spec.key}
                                    className={`${styles.specRow} ${hoveredSpec === spec.key ? styles.specRowActive : ''} ${spec.highlight ? styles.specRowHighlight : ''}`}
                                    onMouseEnter={() => setHoveredSpec(spec.key)}
                                    onMouseLeave={() => setHoveredSpec(null)}
                                >
                                    <span className={styles.specLabel}>{spec.label}</span>
                                    <span className={styles.specValue}>
                                        {spec.value}
                                        {spec.unit && <span className={styles.specUnit}> {spec.unit}</span>}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Features */}
                        <div className={styles.featuresList}>
                            <h3 className={styles.featuresTitle}>Особливості конструкції</h3>
                            <ul>
                                {product.features.map((f, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Applications */}
                        <div className={styles.applicationsList}>
                            <h3 className={styles.featuresTitle}>Застосування</h3>
                            <ul>
                                {product.applications.map((a, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="2" />
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                                        </svg>
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT — 3D Viewer */}
                    <div className={styles.viewerPanel}>
                        <div className={styles.viewerPanelHeader}>
                            <h2 className={styles.viewerPanelTitle}>3D Модель</h2>
                            <div className={styles.viewerBadges}>
                                <span className={styles.badge}>GLB</span>
                                <span className={styles.badge}>WebGL</span>
                                <span className={styles.badge}>Інтерактивна</span>
                            </div>
                        </div>

                        <div className={styles.viewerContainer}>
                            <ModelViewer
                                key={product.id}
                                src={product.model}
                                label={product.partNumber}
                            />
                        </div>

                        <p className={styles.productDesc}>{product.description}</p>

                        <div className={styles.ctaRow}>
                            <button className={styles.ctaPrimary}>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.22 2 2 0 012.04.04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                Замовити / Запит
                            </button>
                            <button className={styles.ctaSecondary} onClick={() => setShowDownloadForm(true)}>
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                Завантажити 3D модель
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── COMPARISON STRIP ── */}
                <section className={styles.comparisonSection}>
                    <h2 className={styles.comparisonTitle}>Порівняння моделей серії IL</h2>
                    <div className={styles.comparisonTable}>
                        <div className={styles.comparisonHeader}>
                            <span>Параметр</span>
                            {PRODUCTS.map(p => (
                                <span key={p.id} className={p.id === product.id ? styles.comparisonColActive : ''}>
                                    {p.partNumber}
                                </span>
                            ))}
                        </div>
                        {['d', 'D', 'holes', 'torque', 'speed', 'mass'].map(key => {
                            const labels: Record<string, string> = {
                                d: 'd (mm)', D: 'D (mm)', holes: 'Отвори', torque: 'Момент (Nm)', speed: 'Швидкість (RPM)', mass: 'Маса (kg)'
                            };
                            return (
                                <div key={key} className={styles.comparisonRow}>
                                    <span className={styles.comparisonLabel}>{labels[key]}</span>
                                    {PRODUCTS.map(p => {
                                        const spec = p.specs.find(s => s.key === key);
                                        return (
                                            <span
                                                key={p.id}
                                                className={`${styles.comparisonCell} ${p.id === product.id ? styles.comparisonCellActive : ''}`}
                                            >
                                                {spec?.value ?? '—'}
                                            </span>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── NOTE ── */}
                <div className={styles.testNote}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Це тестова сторінка для демонстрації 3D моделей. Не впливає на основний сайт.
                </div>
            </main>
        </>
    );
}