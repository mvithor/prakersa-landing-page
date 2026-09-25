import { site } from '@/data/site';
import { cn } from '@/utils/cn';
import styles from './Logo.module.css';
import logoMark from '@/assets/prakersa-logo.png';

// Logo resmi Prakersa, file ada di src/assets/prakersa-logo.png sehingga diimpor
// lewat bundler (bukan path absolut ke folder public).
export default function Logo({ tone = 'light', className, showWordmark = true }) {
  return (
    <span className={cn(styles.logo, tone === 'dark' && styles.onDark, className)}>
      <img
        className={styles.mark}
        src={logoMark}
        alt={site.name}
      />
      {showWordmark && <span className={styles.wordmark}>{site.name}</span>}
    </span>
  );
}