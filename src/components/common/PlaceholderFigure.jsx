import { cn } from '@/utils/cn';
import styles from './PlaceholderFigure.module.css';

export default function PlaceholderFigure({ label, src, alt, ratio = '16 / 10', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? label ?? ''}
        className={cn(styles.image, className)}
        style={{ aspectRatio: ratio }}
      />
    );
  }

  return (
    <div className={cn(styles.figure, className)} style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <span className={styles.label}>{label}</span>
    </div>
  );
}