"use client";

import { useTranslations } from 'next-intl';
import styles from './CtaBlock.module.css';

interface CtaBlockProps {
    article: string;
}

export function CtaBlock({ article }: CtaBlockProps) {
    const t = useTranslations('product');

    return (
        <section className={`${styles.section} print-hide`}>
            <div className={styles.content}>
                <h2 className={styles.title}>{t('cta_title')}</h2>
                <p className={styles.desc}>{t('cta_desc')}</p>
                <div className={styles.actions}>
                    <button className={styles.btnPrimary} onClick={() => alert(`Open contact form for ${article}`)}>
                        {t('btn_contact')}
                    </button>
                    <button className={styles.btnOutline}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        {t('btn_pdf')}
                    </button>
                </div>
            </div>
        </section>
    );
}
