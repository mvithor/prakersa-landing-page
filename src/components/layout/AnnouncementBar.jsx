import { Link } from 'react-router-dom';
import { announcement } from '@/data/announcement';
import { useDismissible } from '@/hooks/useDismissible';
import Container from '@/components/common/Container';
import Icon from '@/components/common/Icon';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
  const [dismissed, dismiss] = useDismissible(`sga:pengumuman:${announcement.id}`);

  if (!announcement.enabled || dismissed) return null;

  return (
    <aside className={styles.bar} aria-label="Pengumuman">
      <Container className={styles.inner}>
        <p className={styles.text}>
          {announcement.text}{' '}
          <Link className={styles.link} to={announcement.link.to}>
            {announcement.link.label}
          </Link>
        </p>
        <button type="button" className={styles.close} onClick={dismiss}>
          <Icon name="close" size={16} />
          <span className={styles.closeLabel}>Tutup pengumuman</span>
        </button>
      </Container>
    </aside>
  );
}
