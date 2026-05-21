import styles from '../ProductTable/productTable.module.css';

interface ProductSchemaProps {
    src: string;
    alt?: string;
    maxHeight?: number;
}

export function ProductSchema({ src, alt = 'Technical drawing', maxHeight = 300 }: ProductSchemaProps) {
    return (
        <div className={styles.schemaCont}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={styles.schemaImg}
                style={{ maxHeight }}
                loading="lazy"
            />
        </div>
    );
}
