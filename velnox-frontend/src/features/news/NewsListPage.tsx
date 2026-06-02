'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './news.module.css';

const NEWS_SLUGS = [
    {
        slug: 'velnox-seals-seeder-coulters',
        date: '2026-05-27',
        coverImage: '/velnox/images/articles/velnox-seals-seeder-coulters.webp',
    },
    {
        slug: 'velnox-bearing-solution-rotary-harrows',
        date: '2026-05-27',
        coverImage: '/velnox/images/articles/velnox-bearing-rotary-harrows.webp',
    },
];

function formatDate(dateStr: string, locale: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === 'uk' ? 'uk-UA' : locale === 'pl' ? 'pl-PL' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function NewsListPage({ locale }: { locale: string }) {
    const t = useTranslations('news');

    return (
        <div className={styles.page}>
            <section className={styles.listHero}>
                <div className={styles.listHeroInner}>
                    <div className={styles.listEyebrow}>VELNOX</div>
                    <h1 className={styles.listTitle}>{t('page_title')}</h1>
                    <p className={styles.listSubtitle}>{t('page_subtitle')}</p>
                </div>
            </section>

            <div className={styles.inner}>
                <div className={styles.grid}>
                    {NEWS_SLUGS.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/${locale}/news/${item.slug}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <article className={styles.card}>
                                <div className={styles.cardImageWrap}>
                                    <Image
                                        src={item.coverImage}
                                        alt={t(`articles.${item.slug}.title`)}
                                        width={800}
                                        height={500}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                                        className={styles.cardImage}
                                    />
                                </div>
                                <div className={styles.cardBody}>
                                    <time className={styles.cardDate}>
                                        {formatDate(item.date, locale)}
                                    </time>
                                    <h2 className={styles.cardTitle}>
                                        {t(`articles.${item.slug}.title`)}
                                    </h2>
                                    <p className={styles.cardExcerpt}>
                                        {t(`articles.${item.slug}.excerpt`)}
                                    </p>
                                    <span className={styles.cardLink}>
                                        {t('read_more')}
                                        <svg
                                            className={styles.cardLinkArrow}
                                            width="14"
                                            height="14"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                        >
                                            <path
                                                d="M3 8h10M9 4l4 4-4 4"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
