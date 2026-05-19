"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CrossRef } from '@/entities/product/model/types';
import styles from './CrossReferences.module.css';

interface CrossReferencesProps {
    refs: CrossRef[];
}

export function CrossReferences({ refs }: CrossReferencesProps) {
    const t = useTranslations('product');
    const [showAll, setShowAll] = useState(false);

    const displayRefs = showAll ? refs : refs.slice(0, 10);
    const hasMore = refs.length > 10;

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{t('cross_refs')}</h2>
            <div className={styles.grid}>
                {displayRefs.map((ref, i) => (
                    <div key={i} className={styles.pill}>
                        <span className={styles.brand}>{ref.brand}</span>
                        <span className={styles.value}>{ref.value}</span>
                    </div>
                ))}
            </div>
            {hasMore && !showAll && (
                <button
                    className={styles.showAllBtn}
                    onClick={() => setShowAll(true)}
                >
                    {t('show_all')} ({refs.length - 10})
                </button>
            )}
        </section>
    );
}
