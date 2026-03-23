import { useTranslations } from 'next-intl';
import React from 'react';
import styles from './custom.module.css';
import Image from 'next/image';

export function CustomHero() {
    const t = useTranslations('oemPage.hero');

    return (
        <section className={styles.hero}>
            {/* Background image component using Next.js Image for optimization, 
                assuming `/velnox/images/...` handles basePath properly or next/image resolves absolute paths. */}
            <Image
                src="/velnox/images/oem_hero_bg.png"
                alt="OEM Background"
                fill
                priority
                style={{ objectFit: 'cover', zIndex: 0, opacity: 0.2 }}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.container}>
                <div className={styles.heroContent}>
                    <div className={styles.eyebrow}>
                        <span className={styles.eyebrowLine}></span>
                        {t('eyebrow')}
                    </div>
                    <h1 className={styles.heroTitle}>{t('title')}</h1>
                    <p className={styles.heroDesc}>{t('desc')}</p>
                </div>
            </div>
        </section>
    );
}
