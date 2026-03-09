import Image from 'next/image';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <Image src="/velnox/images/velnox-logo-white.png" alt="VELNOX" width={300} height={65} className={styles.logo} />
                    <span>— Engineering Solutions for OEM</span>
                </div>
                <p className={styles.copy}>
                    © {new Date().getFullYear()} VELNOX. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
