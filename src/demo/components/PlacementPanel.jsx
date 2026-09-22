import { useMemo } from 'react';
import styles from './Demo.module.css';
import { AvatarLetter, KeyakinanBadge, Marker, fmt } from './shared';
import { demoStore, useDemoStore } from '../demoStore';
import { cocokkanIndustri } from '../engine/matching';
import { PROFIL_META } from '../engine/profile';
import { CRITERIA_KEYS, LABEL_KRITERIA } from '../engine/pklScoring';
import { INDUSTRI, namaIndustri } from '../data/demoFixture';

const LABEL_KEMATANGAN = { BARU: 'Mitra baru', BERKEMBANG: 'Mitra berkembang', MAPAN: 'Mitra mapan' };

export function DetailKriteria({ item }) {
  const EVAL_KEYS = new Set(['kedisiplinan', 'supervisor', 'mentoring']);
  const catatan = (b) => {
    if (EVAL_KEYS.has(b.key)) {
      const n = b.extra?.n ?? 0;
      return b.available
        ? `Dari ${n} evaluasi magang sebelumnya`
        : n === 0
          ? 'Belum ada data, menunggu evaluasi magang pertama'
          : `Baru ${n} evaluasi magang, minimal 3 untuk dihitung`;
    }
    if (!b.available) return 'Data belum tersedia';
    if (b.key === 'skkni' && b.extra) {
      return b.extra.mode === 'fit'
        ? `Rata-rata skor siswa pada ${b.extra.n} unit yang dilatih`
        : `${b.extra.n} dari ${b.extra.m} unit lemah siswa dilatih`;
    }
    if (b.key === 'trackRecord' && b.extra) return `${b.extra.n} siswa profil serupa`;
    return null;
  };
  const urut = CRITERIA_KEYS.map((k) => item.breakdown.find((b) => b.key === k));
  const bobotTersedia = urut.filter((b) => b.available).reduce((a, b) => a + b.bobot, 0);

  return (
    <details className={styles.why}>
      <summary>Asal angka</summary>
      <div className={styles.tableWrap}>
        <table className={styles.whyTable}>
          <caption className={styles.srOnly}>Rincian perhitungan skor kecocokan</caption>
          <thead>
            <tr>
              <th scope="col">Kriteria</th>
              <th scope="col">Nilai</th>
              <th scope="col">Bobot profil</th>
              <th scope="col">Bobot dipakai</th>
              <th scope="col">Kontribusi</th>
            </tr>
          </thead>
          <tbody>
            {urut.map((b) => (
              <tr key={b.key}>
                <td>
                  {LABEL_KRITERIA[b.key]}
                  {catatan(b) && <span className={styles.unitCode}>{catatan(b)}</span>}
                </td>
                <td>{b.available ? fmt(b.value) : 'Tidak tersedia'}</td>
                <td>{Math.round(b.bobot * 100)}%</td>
                <td>{b.available ? `${fmt(b.bobot_normal * 100, 1)}%` : '-'}</td>
                <td>{b.available ? fmt(b.kontribusi, 1) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.formula}>
        Kriteria yang datanya kosong tidak dihitung nol. Bobotnya dibagi ulang ke kriteria yang ada, sehingga skor tidak
        dihukum karena data belum masuk. Skor dasar {item.skor_dasar}
        {item.bonus ? `, ditambah ${item.bonus} karena evaluator aktif` : ''}, menjadi {item.match_score}. Data tersedia
        untuk kriteria dengan total bobot {Math.round(bobotTersedia * 100)}% dari 100%.
      </p>
    </details>
  );
}

function KartuIndustri({ item, dipilih, onPilih }) {
  const { industri } = item;
  const sisa = industri.kapasitas - industri.terisi;
  return (
    <li className={`${styles.rankItem} ${item.rekomendasi ? styles.rankRec : ''}`}>
      <div className={styles.rankHead}>
        <AvatarLetter index={item.peringkat - 1} ariaLabel={`Peringkat ${item.peringkat}`} />
        <div>
          <div className={styles.rankName}>{namaIndustri(industri)}</div>
          <div className={styles.rankMeta}>
            {industri.bidang}, {LABEL_KEMATANGAN[industri.kematangan].toLowerCase()}, sisa {sisa} dari{' '}
            {industri.kapasitas} tempat
          </div>
        </div>
        <div className={styles.rankScore}>
          {item.match_score}
          <small>skor kecocokan</small>
        </div>
      </div>

      <div className={styles.flags}>
        <KeyakinanBadge level={item.confidence.level} persen={item.confidence.persen} />
        {item.flags.map((f) => (
          <span key={f.kode} className={styles.flag}>
            {f.teks}
          </span>
        ))}
      </div>

      <ul className={styles.reasons}>
        {item.reasons.map((r) => (
          <li
            key={r.text}
            className={r.tone === 'plus' ? styles.tonePlus : r.tone === 'minus' ? styles.toneMinus : styles.toneNetral}
          >
            <span className={styles.srOnly}>{r.tone === 'plus' ? 'Nilai plus: ' : r.tone === 'minus' ? 'Catatan: ' : ''}</span>
            <span style={{ gridColumn: 2 }}>{r.text}</span>
          </li>
        ))}
      </ul>

      <DetailKriteria item={item} />

      <div className={styles.rankActions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSm}`}
          aria-pressed={dipilih}
          onClick={onPilih}
        >
          {dipilih ? 'Terpilih' : 'Pilih industri ini'}
        </button>
      </div>
    </li>
  );
}

export default function PlacementPanel({ profil, siswa }) {
  const { lens, pilihan } = useDemoStore();
  const hasil = useMemo(
    () => cocokkanIndustri({ siswa, profil, daftarIndustri: INDUSTRI, lens }),
    [siswa, profil, lens],
  );

  if (hasil.status === 'BLOKIR') {
    return <div className={`${styles.notice} ${styles.noticeBad}`}>{hasil.kelayakan.pesan}</div>;
  }

  const lensAktif = lens || profil.statusProfil;
  const terpilihId = pilihan[siswa.id];
  const rekomendasi = hasil.urutan.filter((h) => h.rekomendasi);
  const lain = hasil.urutan.filter((h) => !h.rekomendasi);
  const pilih = (id) => demoStore.set((s) => ({ pilihan: { ...s.pilihan, [siswa.id]: id } }));

  return (
    <div>
      <div className={styles.funnel}>
        <span className={styles.funnelBig}>
          {hasil.jumlahIndustri} industri mitra, {hasil.urutan.length} lolos filter
        </span>
      </div>
      <div className={styles.outList}>
        {hasil.tersingkir.map((t) => (
          <span key={t.industri.id}>
            {namaIndustri(t.industri)}: {t.alasan.toLowerCase()}
          </span>
        ))}
      </div>

      <div className={styles.sectionLabel} style={{ marginTop: 0 }}>
        Lihat dari profil lain
      </div>
      <div className={styles.lensBar} role="group" aria-label="Bobot profil yang dipakai untuk menilai industri">
        {['SP', 'RB', 'RK', 'RG'].map((k) => (
          <button
            key={k}
            type="button"
            className={`${styles.btn} ${styles.btnSm}`}
            aria-pressed={lensAktif === k}
            onClick={() => demoStore.set({ lens: k === profil.statusProfil ? null : k })}
          >
            <Marker kode={k} size={12} /> {PROFIL_META[k].label}
            {k === profil.statusProfil ? ' (profil siswa)' : ''}
          </button>
        ))}
      </div>
      <p className={styles.lensNote} aria-live="polite">
        {lens
          ? `Simulasi bobot ${PROFIL_META[lens].label.toLowerCase()}. Siswanya sama, yang berganti hanya bobot kriteria dan track record yang dibaca. Dengan begitu terlihat mengapa peringkat berbeda untuk tiap profil.`
          : `Bobot yang dipakai adalah bobot profil ${PROFIL_META[profil.statusProfil].label.toLowerCase()}. Ganti untuk melihat peringkat berubah pada siswa yang sama.`}
      </p>

      <div className={styles.sectionLabel} style={{ marginTop: 0 }}>
        Rekomendasi teratas
      </div>
      <ol className={styles.rank}>
        {rekomendasi.map((h) => (
          <KartuIndustri
            key={h.industri.id}
            item={h}
            dipilih={terpilihId === h.industri.id}
            onPilih={() => pilih(h.industri.id)}
          />
        ))}
      </ol>

      {lain.length > 0 && (
        <>
          <div className={styles.sectionLabel}>Kandidat lain</div>
          <ol className={styles.rank} start={rekomendasi.length + 1}>
            {lain.map((h) => (
              <KartuIndustri
                key={h.industri.id}
                item={h}
                dipilih={terpilihId === h.industri.id}
                onPilih={() => pilih(h.industri.id)}
              />
            ))}
          </ol>
        </>
      )}

      <p className={styles.modeNote}>
        {hasil.mode === 'keyakinan-dulu'
          ? 'Urutan mengutamakan kelengkapan data. Kandidat yang datanya masih sedikit tidak bisa naik melewati kandidat yang datanya lebih lengkap, sebesar apa pun skornya.'
          : 'Urutan berdasarkan skor kecocokan saja. Tingkat keyakinan data ditampilkan sebagai lencana.'}{' '}
        Keputusan akhir ada pada Kepala Jurusan.
      </p>
    </div>
  );
}