import React from 'react';
import styles from '@/features/oem/oem.module.css';
import { OemHero } from '@/features/oem/OemHero';
import { OemCapabilities } from '@/features/oem/OemCapabilities';
import { OemForm } from '@/features/oem/OemForm';

interface Props {
    locale: string;
}

export function OemPage({ locale }: Props) {
    return (
        <main className={styles.oemPage}>
            <OemHero />
            <OemCapabilities />
            <OemForm />
        </main>
    );
}
