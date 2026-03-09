'use client';

import { useTheme } from '../context/ThemeContext';
import styles from './ThemeSwitcher.module.css';

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className={styles.container}>
            <p className={styles.title}>Оберіть варіант дизайну</p>
            <div className={styles.buttons}>
                <button
                    className={`${styles.btn} ${theme === 'default' ? styles.active : ''}`}
                    onClick={() => setTheme('default')}
                >
                    Engineering Green
                </button>
                <button
                    className={`${styles.btn} ${theme === 'industrial-dark' ? styles.active : ''}`}
                    onClick={() => setTheme('industrial-dark')}
                >
                    Industrial Black
                </button>
                <button
                    className={`${styles.btn} ${theme === 'engineering-clean' ? styles.active : ''}`}
                    onClick={() => setTheme('engineering-clean')}
                >
                    Engineering Green + Indigo
                </button>
                <button
                    className={`${styles.btn} ${theme === 'high-tech-indigo' ? styles.active : ''}`}
                    onClick={() => setTheme('high-tech-indigo')}
                >
                    Indigo & Green Accent
                </button>
                <button
                    className={`${styles.btn} ${theme === 'pure-indigo' ? styles.active : ''}`}
                    onClick={() => setTheme('pure-indigo')}
                >
                    Pure Indigo (NEW)
                </button>
            </div>
        </div>
    );
}
