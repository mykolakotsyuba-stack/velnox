import { useTranslations } from 'next-intl';
import styles from './Installations.module.css';

interface InstallationsProps {
    items: string[];
}

export function Installations({ items }: InstallationsProps) {
    const t = useTranslations('product');
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{t('installations')}</h2>
            <ul className={styles.list}>
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </section>
    );
}
