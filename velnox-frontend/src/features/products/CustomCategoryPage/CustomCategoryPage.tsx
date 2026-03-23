'use client';

import React from 'react';
import type { Locale } from '@/entities/product/model/types';
import { CustomHero } from './CustomHero';
import { CustomCapabilities } from './CustomCapabilities';
import { CustomForm } from './CustomForm';
import styles from './custom.module.css';

interface CustomCategoryPageProps {
    locale: Locale;
}

export function CustomCategoryPage({ locale }: CustomCategoryPageProps) {
    return (
        <main className={styles.page}>
            <CustomHero />
            <CustomCapabilities />
            <CustomForm />
        </main>
    );
}
