import Image from 'next/image';
import styles from './VisualBlock.module.css';

interface VisualBlockProps {
    model3dUrl?: string | null;
    drawingUrl?: string | null;
    article: string;
}

export function VisualBlock({ model3dUrl, drawingUrl, article }: VisualBlockProps) {
    return (
        <div className={styles.wrapper}>
            {model3dUrl ? (
                <div className={styles.model}>
                    {/* TODO: Тут буде 3D viewer (напр. Three.js або STEP viewer) */}
                    <Image src={model3dUrl} alt={`${article} 3D model`} fill style={{ objectFit: 'contain' }} />
                </div>
            ) : (
                <div className={styles.placeholder}>
                    <span>3D / Drawing</span>
                </div>
            )}

            {drawingUrl && (
                <a href={drawingUrl} target="_blank" rel="noopener noreferrer" className={styles.drawingLink}>
                    📐 View Technical Drawing
                </a>
            )}
        </div>
    );
}
