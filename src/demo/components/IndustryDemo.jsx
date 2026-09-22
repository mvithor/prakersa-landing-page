import { useMemo, useState } from 'react';
import Section from '@/components/common/Section';
import styles from './Demo.module.css';
import { DetailKriteria } from './PlacementPanel';
import LimitsPanel from './LimitsPanel';
import { ProfilBadge, KeyakinanBadge, fmt } from './shared';
import { hitungProfil } from '../engine/profile';
import { cocokkanMitraTerhadapSiswaContoh, terapkanSimulasiDipulangkan } from '../engine/matching';
import {
  SISWA,
  INDUSTRI,
  AMBANG_DEFAULT,
  ARKETIPE,
  ARKETIPE_MITRA,
  BATAS_DEMO_MITRA,
  namaIndustri,
} from '../data/demoFixture';

// Tiga arketipe kematangan mitra, dipetakan ke industri fiktif spesifik di fixture
// (lihat ARKETIPE_MITRA di demoFixture.js). Pengunjung MEMILIH salah satu untuk
// dijelajahi, tidak pernah mendeskripsikan tempatnya sendiri.
const KEMATANGAN_INFO = {
  BARU: {
    label: 'Mitra baru',
    desc: 'Belum pernah menerima siswa PKL sama sekali.',
  },
  BERKEMBANG: {
    label: 'Mitra berkembang',
    desc: 'Pernah menerima satu atau dua siswa, di bawah ambang minimal untuk dirata-rata.',
  },
  MAPAN: {
    label: 'Mitra mapan',
    desc: 'Pernah menerima tiga siswa atau lebih, riwayatnya sudah bisa dihitung.',
  },
};

const KUADRAN_URUT = ['SP', 'RB', 'RK', 'RG'];

function useSiswaContoh() {
  // Profil dihitung sekali dari ambang default, sama seperti panggung demo sekolah.
  return useMemo(
    () =>
      KUADRAN_URUT.map((kuadran) => {
        const siswa = SISWA.find((s) => s.id === ARKETIPE[kuadran]);
        return { siswa, profil: hitungProfil(siswa, AMBANG_DEFAULT) };
      }),
    [],
  );
}

function KartuKuadran({ hasil }) {
  const { kuadran, siswa, match_score, confidence, flags, reasons } = hasil;
  return (
    <section className={`${styles.group} ${styles[`group_${kuadran}`]}`}>
      <div className={styles.groupHead}>
        <ProfilBadge statusProfil={kuadran} />
        <span className={styles.groupCount}>seperti {siswa.nama}</span>
        <span className={styles.rankScore} style={{ marginLeft: 'auto', fontSize: '1.3rem' }}>
          {match_score}
          <small>skor kecocokan</small>
        </span>
      </div>

      <div className={styles.flags}>
        <KeyakinanBadge level={confidence.level} persen={confidence.persen} />
        {flags.map((f) => (
          <span key={f.kode} className={styles.flag}>
            {f.teks}
          </span>
        ))}
      </div>

      <ul className={styles.reasons}>
        {reasons.map((r) => (
          <li
            key={r.text}
            className={r.tone === 'plus' ? styles.tonePlus : r.tone === 'minus' ? styles.toneMinus : styles.toneNetral}
          >
            <span className={styles.srOnly}>
              {r.tone === 'plus' ? 'Nilai plus: ' : r.tone === 'minus' ? 'Catatan: ' : ''}
            </span>
            <span style={{ gridColumn: 2 }}>{r.text}</span>
          </li>
        ))}
      </ul>

      <DetailKriteria item={hasil} />
    </section>
  );
}

export default function IndustryDemo() {
  const [kematangan, setKematangan] = useState(null);
  const [simulasiPulang, setSimulasiPulang] = useState(false);
  const siswaContoh = useSiswaContoh();

  const industriAsli = kematangan ? INDUSTRI.find((i) => i.id === ARKETIPE_MITRA[kematangan]) : null;

  const industri = useMemo(() => {
    if (!industriAsli) return null;
    // Simulasi tidak pernah mengubah fixture asli, cuma salinan lokal untuk tampilan.
    return simulasiPulang ? terapkanSimulasiDipulangkan(industriAsli, 'RG') : industriAsli;
  }, [industriAsli, simulasiPulang]);

  const hasil = useMemo(
    () => (industri ? cocokkanMitraTerhadapSiswaContoh(industri, siswaContoh) : []),
    [industri, siswaContoh],
  );

  const pilih = (kunci) => {
    setKematangan(kunci);
    setSimulasiPulang(false);
  };

  return (
    <Section tone="paper" labelledBy="mitra-demo-title" containerSize="wide">
      <div id="demo-mitra" className={styles.root}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Demo interaktif</p>
          <h2 id="mitra-demo-title" className={styles.title}>
            Lihat bagaimana riwayat magang membentuk siapa yang dikirim ke sini
          </h2>
          <p className={styles.subtitle}>
            Pilih salah satu contoh mitra, lalu lihat bagaimana empat profil siswa dicocokkan dengannya. Kedisiplinan,
            pengalaman supervisor, dan kemauan membimbing tidak pernah diisi sendiri oleh industri, semuanya berasal
            dari evaluasi siswa yang pernah magang di sana.
          </p>
          <p className={styles.simNote}>Semua nama industri dan siswa di demo ini fiktif.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <div className={styles.cardTitle}>Pilih contoh mitra</div>
              <div className={styles.cardSub}>Anda memilih untuk dijelajahi, bukan mengisi data tentang tempat sendiri.</div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.mitraGrid} role="group" aria-label="Pilih contoh mitra berdasarkan kematangan">
              {Object.keys(KEMATANGAN_INFO).map((kunci) => (
                <button
                  key={kunci}
                  type="button"
                  className={`${styles.btn} ${styles.mitraCard}`}
                  aria-pressed={kematangan === kunci}
                  onClick={() => pilih(kunci)}
                >
                  <strong>{KEMATANGAN_INFO[kunci].label}</strong>
                  <span className={`${styles.small} ${styles.muted}`}>{KEMATANGAN_INFO[kunci].desc}</span>
                </button>
              ))}
            </div>

            {!industri && (
              <div className={styles.idleHint}>Pilih salah satu contoh mitra di atas untuk melihat hasilnya.</div>
            )}

            {industri && (
              <>
                <div className={styles.groupHead} style={{ marginTop: '1rem' }}>
                  <strong>{namaIndustri(industriAsli)}</strong>
                  <span className={styles.groupCount}>{industriAsli.bidang}</span>
                </div>
                <p className={`${styles.small} ${styles.muted}`}>
                  {industriAsli.evaluasiMagang.n === 0
                    ? 'Belum ada evaluasi magang tercatat.'
                    : `${industriAsli.evaluasiMagang.n} evaluasi magang tercatat sejauh ini.`}{' '}
                  {industriAsli.unitDilatih.length} unit SKKNI disepakati Kepala Jurusan untuk dilatih di sini.
                </p>

                {kematangan === 'MAPAN' && (
                  <div className={styles.simBox}>
                    <span className={styles.simTag}>Simulasi</span>
                    <p className={styles.small}>
                      Riwayat magang berubah setiap ada evaluasi baru. Coba lihat efeknya kalau satu siswa profil
                      Risiko Ganda baru saja dipulangkan dari sini.
                    </p>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSm}`}
                      aria-pressed={simulasiPulang}
                      onClick={() => setSimulasiPulang((v) => !v)}
                      style={{ marginTop: '0.5rem' }}
                    >
                      {simulasiPulang ? 'Kembalikan ke riwayat awal' : 'Simulasikan: satu siswa dipulangkan dari sini'}
                    </button>
                    {simulasiPulang && (
                      <p className={styles.notice} role="status">
                        Riwayat magang bertambah jadi {industri.evaluasiMagang.n} evaluasi. Kedisiplinan turun ke{' '}
                        {fmt(industri.evaluasiMagang.kedisiplinan, 1)}/5, track record Risiko Ganda turun ke{' '}
                        {fmt(industri.trackRecord.nilai.RG, 1)}. Lihat kartu Risiko Ganda di bawah untuk efeknya pada
                        skor dan alasan.
                      </p>
                    )}
                  </div>
                )}

                <div className={styles.sectionLabel}>Kecocokan terhadap empat profil siswa</div>
                <div className={styles.groups} style={{ marginTop: '0.5rem' }}>
                  {hasil.map((h) => (
                    <KartuKuadran key={h.kuadran} hasil={h} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={styles.notice} style={{ margin: '0 var(--space-5, 1.25rem) var(--space-6, 1.5rem)' }}>
            Kedisiplinan, pengalaman supervisor, dan kemauan membimbing tidak bisa diisi sendiri oleh industri.
            Ketiganya selalu berasal dari evaluasi siswa yang pernah magang, bukan formulir yang bisa diisi
            bagus-bagus.
          </div>

          <LimitsPanel sudah={BATAS_DEMO_MITRA.sudah} belum={BATAS_DEMO_MITRA.belum} />
        </div>
      </div>
    </Section>
  );
}