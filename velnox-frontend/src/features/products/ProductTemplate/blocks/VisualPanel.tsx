'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './VisualPanel.module.css';

/* ── model-viewer type declaration ── */
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
                loading?: string;
                'rotation-per-second'?: string;
            };
        }
    }
}

const MODEL_VIEWER_CDN = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';

function useModelViewerScript(): boolean {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (customElements.get('model-viewer')) { setReady(true); return; }
        if (document.querySelector(`script[src*="model-viewer"]`)) {
            const id = setInterval(() => {
                if (customElements.get('model-viewer')) { setReady(true); clearInterval(id); }
            }, 80);
            return () => clearInterval(id);
        }
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

interface ModelBlock3DProps {
    src: string;
    label: string;
    sizeMb?: string;
    hero?: boolean;
}

export function ModelBlock3D({ src, label, sizeMb, hero = false }: ModelBlock3DProps) {
    const [activated, setActivated] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const ref = useRef<HTMLElement>(null);
    const scriptReady = useModelViewerScript();

    useEffect(() => {
        const el = ref.current;
        if (!el || !activated) return;
        const onLoad = () => setLoaded(true);
        el.addEventListener('load', onLoad);
        return () => el.removeEventListener('load', onLoad);
    }, [activated]);

    return (
        <section className={`${styles.section} ${hero ? styles.heroSection : ''}`}>
            <div className={styles.header}>
                <span className={styles.label}>3D МОДЕЛЬ</span>
                <h3 className={styles.title}>{label}</h3>
            </div>

            <div className={`${styles.viewerBox} ${hero ? styles.heroViewerBox : ''}`}>
                {!activated && (
                    <div className={styles.activate}>
                        <div className={styles.activateIcon}>
                            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <button className={styles.activateBtn} onClick={() => setActivated(true)}>
                            Завантажити 3D модель
                        </button>
                        <p className={styles.activateNote}>~{sizeMb} MB · WebGL · інтерактивна</p>
                    </div>
                )}

                {activated && !scriptReady && (
                    <div className={styles.loader}>
                        <div className={styles.spinner} />
                        <span>Ініціалізація…</span>
                    </div>
                )}

                {activated && scriptReady && (
                    <>
                        {!loaded && (
                            <div className={styles.loader}>
                                <div className={styles.spinner} />
                                <span>Завантаження (~{sizeMb} MB)…</span>
                            </div>
                        )}
                        {/* @ts-ignore */}
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
                    </>
                )}

                {activated && loaded && (
                    <p className={styles.hint}>Перетягніть · Скрол для масштабу</p>
                )}
            </div>
        </section>
    );
}
