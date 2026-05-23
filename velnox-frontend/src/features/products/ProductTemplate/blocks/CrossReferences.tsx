"use client";

import { useTranslations } from 'next-intl';
import type { CrossRef } from '@/entities/product/model/types';
import styles from './CrossReferences.module.css';

interface CrossReferencesProps {
    refs: CrossRef[];
}

export function CrossReferences({ refs }: CrossReferencesProps) {
    const t = useTranslations('product');

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{t('cross_refs')}</h2>
            <div className={styles.grid}>
                {refs.map((ref, i) => (
                    <div key={i} className={styles.pill}>
                        <span className={styles.brand}>{ref.brand}</span>
                        <span className={styles.value}>{ref.value}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
