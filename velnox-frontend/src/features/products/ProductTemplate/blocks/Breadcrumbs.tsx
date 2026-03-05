import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbsProps {
    category: string;
    productName: string;
    locale: string;
}

export function Breadcrumbs({ category, productName, locale }: BreadcrumbsProps) {
    return (
        <nav className={styles.breadcrumbs} aria-label="breadcrumb">
            <Link href={`/${locale}`}>VELNOX</Link>
            <span className={styles.sep}>/</span>
            <Link href={`/${locale}/products`}>Products</Link>
            <span className={styles.sep}>/</span>
            <Link href={`/${locale}/products/${category}`}>{category}</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>{productName}</span>
        </nav>
    );
}
