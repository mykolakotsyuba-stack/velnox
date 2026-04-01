import { useTranslations } from 'next-intl';
import React from 'react';
import styles from './oem.module.css';

export function OemHero() {
    const t = useTranslations('oemPage.hero');

    return (
        <section className={styles.hero}>
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
                <span className={styles.eyebrow}>{t('eyebrow')}</span>
                <h1 className={styles.heroTitle}>{t('title')}</h1>
                <p className={styles.heroDesc}>{t('desc')}</p>
            </div>
        </section>
    );
}
