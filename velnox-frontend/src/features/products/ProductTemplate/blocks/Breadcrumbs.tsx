import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
    category: string;
    productName: string;
    locale: string;
}

export function Breadcrumbs({ category, productName, locale }: BreadcrumbsProps) {
    const tn  = useTranslations('nav');
    const tcat = useTranslations('categories');
    return (
        <nav className={styles.breadcrumbs} aria-label="breadcrumb">
            <Link href={`/${locale}`}>VELNOX</Link>
            <span className={styles.sep}>/</span>
            <Link href={`/${locale}/products`}>{tn('products')}</Link>
            <span className={styles.sep}>/</span>
            <Link href={`/${locale}/products/${category}`}>{tcat(category)}</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>{productName}</span>
        </nav>
    );
}
