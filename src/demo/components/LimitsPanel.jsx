import styles from './Demo.module.css';
import { BATAS_DEMO } from '../data/demoFixture';

const CATATAN_DEFAULT =
  'Demo ini menghitung profil dan pencocokan di browser dari data simulasi. Hasilnya menggambarkan cara kerja aturan penilaian, bukan hasil pemakaian di sekolah nyata.';

// sudah/belum/catatan opsional, default ke isi demo sekolah supaya pemakaian
// lama (<LimitsPanel />) tidak berubah. Demo industri memakai BATAS_DEMO_MITRA.
export default function LimitsPanel({ sudah = BATAS_DEMO.sudah, belum = BATAS_DEMO.belum, catatan = CATATAN_DEFAULT }) {
  return (
    <details className={styles.limits}>
      <summary>Yang sudah berjalan dan yang belum</summary>
      <div className={styles.limitsCols}>
        <div>
          <div className={styles.prepTitle}>Sudah berjalan di sistem</div>
          <ul className={styles.bullets}>
            {sudah.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className={styles.prepTitle}>Belum ada atau sedang disiapkan</div>
          <ul className={styles.bullets}>
            {belum.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className={`${styles.small} ${styles.muted}`} style={{ marginTop: '0.75rem' }}>
        {catatan}
      </p>
    </details>
  );
}