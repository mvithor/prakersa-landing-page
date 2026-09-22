import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/utils/cn';
import Icon from '@/components/common/Icon';
import styles from './ScrollToTop.module.css';

export default function ScrollToTop() {
  const visible = useScrolled(640);

  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={cn(styles.button, visible && styles.visible)}
      onClick={handleClick}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <Icon name="arrowUp" size={20} />
      <span className={styles.label}>Kembali ke atas</span>
    </button>
  );
}
