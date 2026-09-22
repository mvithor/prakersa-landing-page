import styles from './PKLStatusFigure.module.css';

const STAGES = [
  { code: 'H1', title: 'Profil Terbentuk', status: 'live' },
  { code: 'H2', title: 'Validasi Industri', status: 'building' },
  { code: 'H3', title: 'Data Hasil Siswa', status: 'vision' },
];

export default function PKLStatusFigure({ className }) {
  return (
    <div className={`${styles.panel} ${className ?? ''}`}>
      <p className={styles.caption}>Status siklus PKL pertama</p>
      <div className={styles.track}>
        {STAGES.map((stage, index) => (
          <div key={stage.code} className={styles.stageWrap}>
            <div className={`${styles.stage} ${styles[`stage-${stage.status}`]}`}>
              <span className={styles.code}>{stage.code}</span>
              <span className={styles.title}>{stage.title}</span>
            </div>
            {index < STAGES.length - 1 && <span className={styles.connector} />}
          </div>
        ))}
      </div>
      <p className={styles.hint}>Menunggu pilot SMK Al-Huda memulai siklus PKL pertama.</p>
    </div>
  );
}