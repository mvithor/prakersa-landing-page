import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PATHS } from '@/routes/paths';
import Button from '@/components/common/Button';
import Section from '@/components/common/Section';
import styles from './NotFound.module.css';

export default function NotFound() {
  useDocumentTitle('Halaman tidak ditemukan');

  return (
    <Section tone="mist" spacing="hero" containerSize="narrow" labelledBy="notfound-title">
      <h1 id="notfound-title" className={styles.title}>
        Halaman tidak ditemukan
      </h1>
      <p className={styles.text}>
        Alamat yang Anda buka tidak ada atau sudah dipindahkan. Periksa kembali ejaannya, atau mulai
        lagi dari beranda.
      </p>
      <div className={styles.action}>
        <Button to={PATHS.home} size="lg">
          Buka beranda
        </Button>
      </div>
    </Section>
  );
}
