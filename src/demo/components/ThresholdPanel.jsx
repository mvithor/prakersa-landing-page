import styles from './Demo.module.css';
import { Marker } from './shared';
import { PROFIL_META } from '../engine/profile';
import { AMBANG_MIN, AMBANG_MAX } from '../data/demoFixture';

const persenIsi = (v) => `${((v - AMBANG_MIN) / (AMBANG_MAX - AMBANG_MIN)) * 100}%`;

export function HitunganProfil({ ringkas }) {
  return (
    <div className={styles.counts}>
      {['SP', 'RB', 'RK', 'RG'].map((k) => (
        <div key={k} className={`${styles.count} ${styles[`count_${k}`]}`}>
          <Marker kode={k} size={13} />
          <span>{PROFIL_META[k].label}</span>
          <strong>{ringkas.jumlah[k]}</strong>
        </div>
      ))}
    </div>
  );
}

// Ringkasan dua kotak untuk Kepala Jurusan yang ingin gambaran cepat sebelum
// membuka daftar per siswa: berapa yang belum siap, berapa yang siap penuh.
// Data belum cukup sengaja tidak masuk salah satu kotak, karena keduanya
// bukan penilaian, jadi tidak jujur digabungkan ke "belum siap".
export function RingkasanKesiapan({ ringkas }) {
  return (
    <div className={styles.kesiapanGrid}>
      <div className={`${styles.kesiapanBox} ${styles.kesiapanBad}`}>
        <div className={styles.kesiapanLabel}>Belum siap</div>
        <div className={styles.kesiapanValue}>{ringkas.perluPendampingan} siswa</div>
      </div>
      <div className={`${styles.kesiapanBox} ${styles.kesiapanGood}`}>
        <div className={styles.kesiapanLabel}>Siap penuh</div>
        <div className={styles.kesiapanValue}>{ringkas.siapLangsung} siswa</div>
      </div>
    </div>
  );
}

export default function ThresholdPanel({ ambang, onChange, ringkas }) {
  const ubah = (kunci) => (e) => onChange({ ...ambang, [kunci]: Number(e.target.value) });
  return (
    <div>
      <div className={styles.thr}>
        <div className={styles.thrRow}>
          <label htmlFor="ambang-perilaku">Ambang perilaku</label>
          <input
            id="ambang-perilaku"
            type="range"
            min={AMBANG_MIN}
            max={AMBANG_MAX}
            step="1"
            value={ambang.perilaku}
            onChange={ubah('perilaku')}
            style={{ '--fill': persenIsi(ambang.perilaku) }}
          />
          <span className={styles.thrVal}>{ambang.perilaku}</span>
        </div>
        <div className={styles.thrRow}>
          <label htmlFor="ambang-kompetensi">Ambang kompetensi</label>
          <input
            id="ambang-kompetensi"
            type="range"
            min={AMBANG_MIN}
            max={AMBANG_MAX}
            step="1"
            value={ambang.kompetensi}
            onChange={ubah('kompetensi')}
            style={{ '--fill': persenIsi(ambang.kompetensi) }}
          />
          <span className={styles.thrVal}>{ambang.kompetensi}</span>
        </div>
      </div>
      <HitunganProfil ringkas={ringkas} />
    </div>
  );
}