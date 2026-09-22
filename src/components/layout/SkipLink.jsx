import styles from './SkipLink.module.css';

// Tautan pertama di halaman, muncul saat pengguna keyboard menekan Tab.
export default function SkipLink({ targetId }) {
  return (
    <a className={styles.skip} href={`#${targetId}`}>
      Lewati ke konten utama
    </a>
  );
}
