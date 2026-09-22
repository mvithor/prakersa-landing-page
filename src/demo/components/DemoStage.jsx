import { useEffect, useMemo, useState } from 'react';
import Section from '@/components/common/Section';
import styles from './Demo.module.css';
import ProfilList from './ProfilList';
import StudentDiagnosis from './StudentDiagnosis';
import PreparationPanel from './PreparationPanel';
import PlacementPanel from './PlacementPanel';
import ResultPanel from './ResultPanel';
import ThresholdPanel, { RingkasanKesiapan } from './ThresholdPanel';
import LimitsPanel from './LimitsPanel';
import { fmt, gulirKe } from './shared';
import { demoStore, useDemoStore, useProfiles } from '../demoStore';
import { ringkasKelas } from '../engine/profile';
import { ARKETIPE, KELAS_DEMO, SISWA } from '../data/demoFixture';

const STAGE_MS = 4500;

const TAHAP = [
  { id: 1, judul: 'Diagnosis', sub: 'Profil tiap siswa dari dua dimensi' },
  { id: 2, judul: 'Persiapan', sub: 'Pembinaan, penguatan, dan pembekalan' },
  { id: 3, judul: 'Penempatan', sub: 'Industri cocok dan keputusan akhir' },
];

const kurangiGerak = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M6 3l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2.5 7.2l3 3 6-6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// initialPhase: 'idle' | 'done'. 'done' membuka semua tahap tanpa animasi
// (dipakai untuk uji dan untuk tangkapan layar).
export default function DemoStage({ initialPhase = 'idle' }) {
  const { ambang, selectedId } = useDemoStore();
  const profil = useProfiles();
  const ringkas = useMemo(() => ringkasKelas(profil), [profil]);

  const [fase, setFase] = useState(initialPhase);
  const [tahap, setTahap] = useState(initialPhase === 'done' ? 3 : 0);
  const [jeda, setJeda] = useState(false);

  const terpilih = profil.find((p) => p.id === selectedId) || profil[0];
  const siswa = SISWA.find((s) => s.id === terpilih.id);

  // Animasi urut. Satu tahap menyala tiap STAGE_MS, bisa dijeda atau dilewati.
  useEffect(() => {
    if (fase !== 'running' || jeda) return undefined;
    const t = setTimeout(() => {
      if (tahap >= 3) setFase('done');
      else setTahap(tahap + 1);
    }, STAGE_MS);
    return () => clearTimeout(t);
  }, [fase, tahap, jeda]);

  const jalankan = () => {
    demoStore.reset();
    demoStore.set({ selectedId: ARKETIPE.RG });
    setJeda(false);
    if (kurangiGerak()) {
      setTahap(3);
      setFase('done');
    } else {
      setTahap(1);
      setFase('running');
    }
  };

  const lewati = () => {
    setTahap(3);
    setFase('done');
    setJeda(false);
  };

  const statusTahap = (id) => {
    if (fase === 'idle') return 'idle';
    if (fase === 'done' || id < tahap) return 'done';
    return id === tahap ? 'aktif' : 'idle';
  };

  const nilaiMetrik = (v) => (fase === 'idle' ? '-' : fmt(v));
  const metrik = [
    { label: 'Siswa dalam kelas', nilai: ringkas.total },
    { label: 'Perlu pendampingan', nilai: ringkas.perluPendampingan },
    { label: 'Siap langsung', nilai: ringkas.siapLangsung },
    { label: 'Data belum cukup', nilai: ringkas.dataBelumCukup },
  ];

  const pilihSiswa = (id) => demoStore.set({ selectedId: id, lens: null });

  return (
    <Section tone="paper" labelledBy="demo-title" containerSize="wide">
      <div id="demo" className={styles.root}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Demo interaktif</p>
          <h2 id="demo-title" className={styles.title}>
            Lihat Prakersa bekerja pada satu kelas
          </h2>
          <p className={styles.subtitle}>
            Tekan jalankan untuk melihat {ringkas.total} siswa contoh didiagnosis, disiapkan, lalu dicocokkan dengan
            industri. Setiap angka dihitung di browser dari data simulasi.
          </p>
          <p className={styles.simNote}>Semua nama siswa dan industri di demo ini fiktif.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>
                {KELAS_DEMO.nama}, {KELAS_DEMO.sekolah}
              </div>
              <div className={styles.cardSub}>Data simulasi, bukan data siswa sungguhan</div>
            </div>
            <div className={styles.actions}>
              {fase === 'done' && (
                <span className={styles.doneBadge}>
                  <CheckIcon /> Demo selesai
                </span>
              )}
              {fase === 'idle' && (
                <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={jalankan}>
                  Jalankan demo
                </button>
              )}
              {fase === 'running' && (
                <>
                  <button
                    type="button"
                    className={styles.btn}
                    aria-pressed={jeda}
                    onClick={() => setJeda((j) => !j)}
                  >
                    {jeda ? 'Lanjutkan' : 'Jeda'}
                  </button>
                  <button type="button" className={styles.btn} onClick={lewati}>
                    Lewati ke hasil
                  </button>
                </>
              )}
              {fase === 'done' && (
                <button type="button" className={styles.btn} onClick={jalankan}>
                  Ulangi demo
                </button>
              )}
            </div>
          </div>

          <div className={styles.strip}>
            {metrik.map((m) => (
              <div key={m.label} className={styles.metric}>
                <div className={`${styles.metricValue} ${fase === 'idle' ? styles.metricIdle : ''}`}>
                  {nilaiMetrik(m.nilai)}
                </div>
                <div className={styles.metricLabel}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.stages}>
            {TAHAP.map((t, i) => {
              const status = statusTahap(t.id);
              const kelas = `${styles.stage} ${status === 'aktif' ? styles.stageActive : ''} ${
                status === 'done' ? styles.stageDone : ''
              }`;
              const isi = (
                <>
                  <span className={styles.stageNum} aria-hidden="true">
                    {t.id}
                  </span>
                  <span>
                    <span className={styles.stageTitle}>{t.judul}</span>
                    <br />
                    <span className={styles.stageSub}>{t.sub}</span>
                  </span>
                </>
              );
              return (
                <FragmentTahap key={t.id} sisipArrow={i > 0}>
                  {fase === 'done' ? (
                    <button
                      type="button"
                      className={kelas}
                      onClick={() => gulirKe(`demo-tahap-${t.id}`)}
                      aria-label={`Ke tahap ${t.id}: ${t.judul}`}
                    >
                      {isi}
                    </button>
                  ) : (
                    <div className={kelas} aria-current={status === 'aktif' ? 'step' : undefined}>
                      {isi}
                    </div>
                  )}
                </FragmentTahap>
              );
            })}
          </div>
          <p className={styles.srOnly} role="status" aria-live="polite">
            {fase === 'running' && tahap > 0 ? `Tahap ${tahap} dari 3: ${TAHAP[tahap - 1].judul}` : ''}
            {fase === 'done' ? 'Demo selesai. Semua tahap terbuka.' : ''}
          </p>

          {fase === 'idle' && (
            <div className={styles.idleHint}>Tekan Jalankan demo untuk memulai.</div>
          )}

          {tahap >= 1 && (
            <section id="demo-tahap-1" className={`${styles.panel} ${styles.reveal}`} aria-labelledby="t1-judul">
              <div className={styles.panelHead}>
                <h3 id="t1-judul" className={styles.panelTitle}>
                  Diagnosis: siapa yang siap, siapa yang perlu dibantu
                </h3>
                <p className={styles.panelLead}>
                  Setiap siswa dinilai dari dua dimensi yang dipisah, perilaku kerja dan kompetensi teknis, sehingga
                  penyebab masalahnya terlihat.
                </p>
              </div>
              <p className={styles.panelLead} style={{ marginBottom: 'var(--space-4, 1rem)' }}>
                Ambang ditentukan Kepala Jurusan per jurusan. Geser untuk melihat efeknya pada seluruh kelas.
              </p>
              <ThresholdPanel ambang={ambang} onChange={(a) => demoStore.set({ ambang: a })} ringkas={ringkas} />
              <RingkasanKesiapan ringkas={ringkas} />
              <div className={styles.grid2}>
                <ProfilList profilList={profil} selectedId={terpilih.id} onSelect={pilihSiswa} />
                <StudentDiagnosis profil={terpilih} siswa={siswa} ambang={ambang} />
              </div>
            </section>
          )}

          {tahap >= 2 && (
            <section id="demo-tahap-2" className={`${styles.panel} ${styles.reveal}`} aria-labelledby="t2-judul">
              <div className={styles.panelHead}>
                <h3 id="t2-judul" className={styles.panelTitle}>
                  Persiapan: bantuan yang tepat sebelum PKL
                </h3>
                <p className={styles.panelLead}>
                  Rencana persiapan disusun dari profil, jadi guru tahu siapa membantu apa, dan pembekalan tidak
                  seragam untuk semua.
                </p>
              </div>
              <PreparationPanel profil={terpilih} siswa={siswa} profilList={profil} ambang={ambang} />
            </section>
          )}

          {tahap >= 3 && (
            <>
              <section id="demo-tahap-3" className={`${styles.panel} ${styles.reveal}`} aria-labelledby="t3-judul">
                <div className={styles.panelHead}>
                  <h3 id="t3-judul" className={styles.panelTitle}>
                    Penempatan: industri yang cocok untuk siswa ini
                  </h3>
                  <p className={styles.panelLead}>
                    Industri disaring lalu diberi skor dengan bobot yang berbeda untuk tiap profil. Skor selalu disertai
                    seberapa lengkap datanya.
                  </p>
                </div>
                <PlacementPanel profil={terpilih} siswa={siswa} />
              </section>

              <section id="demo-hasil" className={`${styles.panel} ${styles.reveal}`} aria-labelledby="t4-judul">
                <div className={styles.panelHead}>
                  <h3 id="t4-judul" className={styles.panelTitle}>
                    Hasil untuk tiga pihak
                  </h3>
                  <p className={styles.panelLead}>
                    Satu data yang sama, tiga tampilan: Kepala Jurusan memutuskan, siswa mendapat rencana, industri
                    menerima profil kesiapan.
                  </p>
                </div>
                <ResultPanel key={terpilih.id} profil={terpilih} siswa={siswa} ambang={ambang} />
              </section>
            </>
          )}

          <LimitsPanel />
        </div>
      </div>
    </Section>
  );
}

// Menyisipkan panah antar tahap tanpa membungkus dengan elemen tambahan.
function FragmentTahap({ sisipArrow, children }) {
  return (
    <>
      {sisipArrow && (
        <div className={styles.arrow} aria-hidden="true">
          <Chevron />
        </div>
      )}
      {children}
    </>
  );
}