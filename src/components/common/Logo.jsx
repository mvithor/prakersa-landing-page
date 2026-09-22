import { site } from '@/data/site';
import { cn } from '@/utils/cn';
import styles from './Logo.module.css';

// Logo sementara buatan sendiri: matriks dua kali dua dengan satu kuadran menyala.
// Ganti dengan logo resmi dari tim desain bila sudah ada.
export default function Logo({ tone = 'light', className }) {
  return (
    <span className={cn(styles.logo, tone === 'dark' && styles.onDark, className)}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect className={styles.markBg} width="32" height="32" rx="8" />
        <rect className={styles.cellDim} x="7" y="7" width="8" height="8" rx="2" />
        <rect className={styles.cell} x="17" y="7" width="8" height="8" rx="2" />
        <rect className={styles.cellDim} x="7" y="17" width="8" height="8" rx="2" />
        <rect className={styles.cellDim} x="17" y="17" width="8" height="8" rx="2" />
      </svg>
      <span className={styles.wordmark}>{site.name}</span>
    </span>
  );
}
