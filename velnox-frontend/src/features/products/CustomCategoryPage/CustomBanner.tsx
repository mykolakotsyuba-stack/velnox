import { useTranslations } from 'next-intl';
import React from 'react';
import styles from './custom.module.css';
import Image from 'next/image';

export function CustomBanner() {
    const t = useTranslations('customPage.banner');

    return (
        <section className={styles.bottomBanner}>
            <div className={styles.bottomBannerContent}>
                <div className={styles.bottomBannerImage}>
                    <Image
                        src="/velnox/images/custom/banner_bg.png"
                        alt="VELNOX Engineering"
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={85}
                    />
                </div>
                <div className={styles.bottomBannerTextWrapper}>
                    <div className={styles.bottomBannerText}>
                        <p className={styles.bannerTextMain}>{t('text1')}</p>
                        <p className={styles.bannerTextSub}>{t('text2')}</p>
                    </div>
                </div>
            </div>
            <div className={styles.bottomBannerFooter}>
                <div className={styles.container}>
                    {t('footer')}
                </div>
            </div>
        </section>
    );
}
