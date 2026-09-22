import styles from './Demo.module.css';
import { Marker } from './shared';
import { PROFIL_META, isKlasifikasi } from '../engine/profile';
import { ARKETIPE } from '../data/demoFixture';

const URUTAN = [
  { kode: 'SP', label: 'Siap penuh' },
  { kode: 'RB', label: 'Risiko behavior' },
  { kode: 'RK', label: 'Risiko kompetensi' },
  { kode: 'RG', label: 'Risiko ganda' },
  { kode: 'DBC', label: 'Data belum cukup' },
];

export default function ProfilList({ profilList, selectedId, onSelect }) {
  const terpilih = profilList.find((p) => p.id === selectedId);
  return (
    <div>
      <div className={styles.arketipe} role="group" aria-label="Coba siswa dari profil lain">
        <span className={`${styles.small} ${styles.muted}`} style={{ alignSelf: 'center' }}>
          Coba siswa dari profil
        </span>
        {['SP', 'RB', 'RK', 'RG'].map((k) => (
          <button
            key={k}
            type="button"
            className={`${styles.btn} ${styles.btnSm}`}
            aria-pressed={terpilih?.statusProfil === k && selectedId === ARKETIPE[k]}
            onClick={() => onSelect(ARKETIPE[k])}
          >
            <Marker kode={k} size={12} /> {PROFIL_META[k].label}
          </button>
        ))}
      </div>

      <div className={styles.groups}>
        {URUTAN.map(({ kode, label }) => {
          const anggota = profilList.filter((p) =>
            kode === 'DBC' ? !isKlasifikasi(p.statusProfil) : p.statusProfil === kode,
          );
          return (
            <section key={kode} className={`${styles.group} ${styles[`group_${kode}`]}`}>
              <div className={styles.groupHead}>
                <Marker kode={kode} size={13} />
                <span>{label}</span>
                <span className={styles.groupCount}>{anggota.length} siswa</span>
              </div>
              <div className={styles.chips}>
                {anggota.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.chip} ${p.id === selectedId ? styles.chipOn : ''}`}
                    aria-pressed={p.id === selectedId}
                    onClick={() => onSelect(p.id)}
                  >
                    {p.nama}
                  </button>
                ))}
                {anggota.length === 0 && <span className={`${styles.small} ${styles.muted}`}>Tidak ada</span>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}