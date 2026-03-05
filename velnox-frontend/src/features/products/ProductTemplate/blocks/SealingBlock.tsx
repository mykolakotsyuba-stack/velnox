import { useTranslations } from 'next-intl';
import styles from './SealingBlock.module.css';

interface SealingBlockProps {
    config?: string;
    description: string;
    label: string;
}

export function SealingBlock({ config, description, label }: SealingBlockProps) {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{label}</h2>
            {config && <div className={styles.config}>{config}</div>}
            <p className={styles.description}>{description}</p>
        </section>
    );
}
