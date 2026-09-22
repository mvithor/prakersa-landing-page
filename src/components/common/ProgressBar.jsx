import styles from './ProgressBar.module.css';

export default function ProgressBar({ value, max, label }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <span className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  );
}
