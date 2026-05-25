import type { SpecItem } from '@/entities/product/model/types';
import styles from './QuickSpecs.module.css';

interface QuickSpecsProps {
    specs: SpecItem[];
}

/** Keys to show in quick specs (order matters) */
const QUICK_KEYS = ['d_mm', 'D_mm', 'L_mm', 'Cdyn_kN', 'Co_kN', 'mass'];

export function QuickSpecs({ specs }: QuickSpecsProps) {
    const quickItems = QUICK_KEYS
        .map(key => specs.find(s => s.key === key))
        .filter((s): s is SpecItem => !!s)
        .slice(0, 6);

    if (quickItems.length === 0) return null;

    return (
        <div className={styles.grid}>
            {quickItems.map(spec => (
                <div key={spec.key} className={styles.item}>
                    <span className={styles.label}>{spec.label}</span>
                    <span className={styles.value}>{spec.value}</span>
                </div>
            ))}
        </div>
    );
}
