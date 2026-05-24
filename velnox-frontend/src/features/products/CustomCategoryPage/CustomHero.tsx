import { useTranslations } from 'next-intl';
import React from 'react';
import styles from './custom.module.css';
import Image from 'next/image';

export function CustomHero() {
    const t = useTranslations('customPage.hero');

    return (
        <section className={styles.hero}>
            <Image
                src="/velnox/images/custom/hero_bg.png"
                alt="VELNOX Custom Solutions"
                fill
                priority
                className={styles.heroBgImg}
                quality={85}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.container}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{t('title')}</h1>
                    <p className={styles.heroDesc}>{t('subtitle')}</p>
                </div>
            </div>
        </section>
    );
}
