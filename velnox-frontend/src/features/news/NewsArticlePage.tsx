'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './news.module.css';

const ARTICLE_META: Record<string, { date: string; coverImage: string }> = {
    'velnox-seals-seeder-coulters': {
        date: '2026-05-27',
        coverImage: '/velnox/images/articles/velnox-seals-seeder-coulters.webp',
    },
    'velnox-bearing-solution-rotary-harrows': {
        date: '2026-05-27',
        coverImage: '/velnox/images/articles/velnox-bearing-rotary-harrows.webp',
    },
};

function formatDate(dateStr: string, locale: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === 'uk' ? 'uk-UA' : locale === 'pl' ? 'pl-PL' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function NewsArticlePage({ locale, slug }: { locale: string; slug: string }) {
    const t = useTranslations('news');
    const meta = ARTICLE_META[slug];

    if (!meta) {
        return (
            <div className={styles.articlePage}>
                <div className={styles.articleInner}>
                    <Link href={`/${locale}/news`} className={styles.articleBack}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {t('back_to_list')}
                    </Link>
                    <h1 className={styles.articleTitle}>{t('not_found')}</h1>
                </div>
            </div>
        );
    }

    const title = t(`articles.${slug}.title`);
    const body = t.raw(`articles.${slug}.body`);

    return (
        <div className={styles.articlePage}>
            <div className={styles.articleHero}>
                <Image
                    src={meta.coverImage}
                    alt={title}
                    width={1280}
                    height={720}
                    className={styles.articleHeroImage}
                    priority
                    sizes="(max-width: 960px) 100vw, 960px"
                />
            </div>

            <div className={styles.articleInner}>
                <Link href={`/${locale}/news`} className={styles.articleBack}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t('back_to_list')}
                </Link>

                <header className={styles.articleHeader}>
                    <time className={styles.articleDate}>{formatDate(meta.date, locale)}</time>
                    <h1 className={styles.articleTitle}>{title}</h1>
                </header>

                <div
                    className={styles.articleBody}
                    dangerouslySetInnerHTML={{ __html: body }}
                />
            </div>
        </div>
    );
}
