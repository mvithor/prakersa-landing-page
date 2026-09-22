import { useMemo } from 'react';
import styles from './Demo.module.css';
import ClassMap from './ClassMap';
import ThresholdPanel from './ThresholdPanel';
import { ProfilBadge, fmt, gulirKe } from './shared';
import { demoStore, useDemoStore, useProfiles } from '../demoStore';
import { ringkasKelas } from '../engine/profile';

// Pengganti ReadinessMatrix statis. Titik dihitung dari data mentah siswa
// (fixture), dan slider ambang memakai store yang sama dengan panggung demo.
export default function ReadinessMatrixLive() {
  const { ambang, selectedId } = useDemoStore();
  const profil = useProfiles();
  const ringkas = useMemo(() => ringkasKelas(profil), [profil]);
  const terpilih = profil.find((p) => p.id === selectedId);

  const pilih = (id) => demoStore.set({ selectedId: id, lens: null });
  const bukaDemo = () => {
    demoStore.set((s) => ({ bukaSeq: s.bukaSeq + 1 }));
    gulirKe('demo');
  };

  return (
    <div className={styles.root}>
      <div className={styles.matrixCard}>
        <div className={styles.matrixHead}>
          <div className={styles.matrixTitle}>Simulasi satu kelas</div>
          <div className={`${styles.small} ${styles.muted}`}>Data contoh, bukan data siswa sungguhan.</div>
        </div>

        <ClassMap profilList={profil} ambang={ambang} selectedId={selectedId} onSelect={pilih} />

        <ThresholdPanel ambang={ambang} onChange={(a) => demoStore.set({ ambang: a })} ringkas={ringkas} />

        {terpilih && (
          <p className={styles.matrixHint} aria-live="polite">
            <strong>{terpilih.nama}</strong> <ProfilBadge statusProfil={terpilih.statusProfil} />{' '}
            {terpilih.perilaku.cumulative !== null &&
              `Perilaku ${fmt(terpilih.perilaku.cumulative)}, kompetensi ${fmt(terpilih.kompetensi.cumulative)}. `}
            <button type="button" className={styles.linkBtn} onClick={bukaDemo}>
              Lihat diagnosis dan penempatannya
            </button>
          </p>
        )}
        <p className={styles.matrixHint}>
          Geser ambang untuk melihat profil berubah. Klik satu titik untuk membuka siswanya.
        </p>
      </div>
    </div>
  );
}
