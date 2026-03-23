import { useTranslations } from 'next-intl';
import React from 'react';
import styles from './custom.module.css';

export function CustomCapabilities() {
    const t = useTranslations('oemPage.capabilities');

    return (
        <section className={styles.capabilities}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>{t('title')}</h2>
                <div className={styles.grid}>
                    {/* Element 1 */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t('structural.title')}</h3>
                        <p className={styles.cardDesc}>{t('structural.desc')}</p>
                    </div>
                    {/* Element 2 */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t('sealing.title')}</h3>
                        <p className={styles.cardDesc}>{t('sealing.desc')}</p>
                    </div>
                    {/* Element 3 */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t('resource.title')}</h3>
                        <p className={styles.cardDesc}>{t('resource.desc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
