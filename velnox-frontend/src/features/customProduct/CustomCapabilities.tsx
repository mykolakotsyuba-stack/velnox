import { useTranslations } from 'next-intl';
import React from 'react';
import styles from './oem.module.css';

export function OemCapabilities() {
    const t = useTranslations('oemPage.capabilities');

    return (
        <section className={styles.capabilities}>
            <h2 className={styles.sectionTitle}>{t('title')}</h2>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>{t('structural.title')}</h3>
                    <p>{t('structural.desc')}</p>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>{t('sealing.title')}</h3>
                    <p>{t('sealing.desc')}</p>
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>{t('resource.title')}</h3>
                    <p>{t('resource.desc')}</p>
                </div>
            </div>
        </section>
    );
}
