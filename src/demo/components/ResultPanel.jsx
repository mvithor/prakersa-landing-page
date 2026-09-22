import { useMemo, useState } from 'react';
import styles from './Demo.module.css';
import { ProfilBadge, fmt } from './shared';
import { demoStore, useDemoStore } from '../demoStore';
import { cocokkanIndustri } from '../engine/matching';
import { buatNarasiProfil, buatPersiapan, isKlasifikasi, PROFIL_META } from '../engine/profile';
import { ALASAN_OVERRIDE, ALASAN_TUNDA, INDUSTRI, namaIndustri } from '../data/demoFixture';

const TABS = [
  { id: 'kajur', label: 'Kepala Jurusan' },
  { id: 'siswa', label: 'Siswa' },
  { id: 'industri', label: 'Industri' },
];

const JALUR_LABEL = { terima: 'Diterima', override: 'Override', tunda: 'Ditunda' };
const indeksIndustri = Object.fromEntries(INDUSTRI.map((i) => [i.id, i]));

// ---------------------------------------------------------------------------
function PerspektifKajur({ profil, siswa, hasil }) {
  const { pilihan, keputusan } = useDemoStore();
  const [jalur, setJalur] = useState('terima');
  const [industriLain, setIndustriLain] = useState('');
  const [alasan, setAlasan] = useState('');
  const [galat, setGalat] = useState({});

  const tercatat = keputusan[siswa.id];

  if (hasil.status === 'BLOKIR') {
    return (
      <div className={`${styles.notice} ${styles.noticeBad}`}>
        Belum ada rekomendasi penempatan. {hasil.kelayakan.pesan}
      </div>
    );
  }

  const teratas = hasil.urutan[0];
  const dipilih = hasil.urutan.find((h) => h.industri.id === pilihan[siswa.id]) || teratas;

  const catat = () => {
    const e = {};
    if (jalur === 'terima' && !dipilih.rekomendasi) {
      e.jalur = 'Industri di luar tiga rekomendasi teratas dicatat sebagai override. Pilih Override dan isi alasannya.';
    }
    if (jalur === 'override') {
      if (!industriLain) e.industri = 'Pilih industri tujuan.';
      if (!alasan) e.alasan = 'Pilih alasan override.';
    }
    if (jalur === 'tunda' && !alasan) e.alasan = 'Pilih alasan penundaan.';
    setGalat(e);
    if (Object.keys(e).length) return;

    const industriId = jalur === 'terima' ? dipilih.industri.id : jalur === 'override' ? industriLain : null;
    demoStore.set((s) => ({
      keputusan: {
        ...s.keputusan,
        [siswa.id]: { jalur, industriId, alasan: jalur === 'terima' ? null : alasan, waktu: new Date().toLocaleString('id-ID') },
      },
    }));
  };

  const ulang = () => {
    demoStore.set((s) => {
      const { [siswa.id]: _hapus, ...sisa } = s.keputusan;
      return { keputusan: sisa };
    });
    setAlasan('');
    setIndustriLain('');
    setGalat({});
  };

  if (tercatat) {
    const tujuan = tercatat.industriId ? namaIndustri(indeksIndustri[tercatat.industriId]) : null;
    return (
      <div>
        <div className={styles.audit} role="status">
          <strong>Keputusan tercatat: {JALUR_LABEL[tercatat.jalur]}.</strong>{' '}
          {tujuan ? `Penempatan ke ${tujuan}. ` : 'Penempatan belum ditentukan. '}
          {tercatat.alasan ? `Alasan: ${tercatat.alasan}. ` : ''}
          Tercatat pada {tercatat.waktu} dalam jejak audit.
        </div>
        <button type="button" className={`${styles.btn} ${styles.btnSm}`} style={{ marginTop: '0.75rem' }} onClick={ulang}>
          Ubah keputusan
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>
        <strong>{siswa.nama}</strong> <ProfilBadge statusProfil={profil.statusProfil} />
      </p>
      <p className={styles.muted} style={{ marginTop: '0.5rem' }}>
        Rekomendasi teratas sistem: <strong>{namaIndustri(teratas.industri)}</strong>, skor {teratas.match_score}.
        {dipilih !== teratas && (
          <>
            {' '}
            Anda sedang memilih <strong>{namaIndustri(dipilih.industri)}</strong>.
          </>
        )}
      </p>

      <fieldset className={styles.decision}>
        <legend>Keputusan penempatan</legend>
        <label className={styles.radio}>
          <input type="radio" name="jalur" checked={jalur === 'terima'} onChange={() => setJalur('terima')} />
          Terima {namaIndustri(dipilih.industri)}
        </label>
        <label className={styles.radio}>
          <input type="radio" name="jalur" checked={jalur === 'override'} onChange={() => setJalur('override')} />
          Pilih industri lain (override), wajib beralasan
        </label>
        <label className={styles.radio}>
          <input type="radio" name="jalur" checked={jalur === 'tunda'} onChange={() => setJalur('tunda')} />
          Tunda penempatan, wajib beralasan
        </label>
      </fieldset>
      {galat.jalur && (
        <p className={styles.error} role="alert">
          {galat.jalur}
        </p>
      )}

      {jalur === 'override' && (
        <div className={styles.field}>
          <label htmlFor="override-industri">Industri tujuan</label>
          <select
            id="override-industri"
            className={styles.select}
            value={industriLain}
            aria-invalid={galat.industri ? 'true' : 'false'}
            onChange={(e) => setIndustriLain(e.target.value)}
          >
            <option value="">Pilih industri</option>
            {hasil.urutan.map((h) => (
              <option key={h.industri.id} value={h.industri.id}>
                {namaIndustri(h.industri)}
              </option>
            ))}
          </select>
          {galat.industri && (
            <span className={styles.error} role="alert">
              {galat.industri}
            </span>
          )}
        </div>
      )}

      {jalur !== 'terima' && (
        <div className={styles.field}>
          <label htmlFor="alasan-keputusan">Alasan</label>
          <select
            id="alasan-keputusan"
            className={styles.select}
            value={alasan}
            aria-invalid={galat.alasan ? 'true' : 'false'}
            onChange={(e) => setAlasan(e.target.value)}
          >
            <option value="">Pilih alasan</option>
            {(jalur === 'override' ? ALASAN_OVERRIDE : ALASAN_TUNDA).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {galat.alasan && (
            <span className={styles.error} role="alert">
              {galat.alasan}
            </span>
          )}
        </div>
      )}

      <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: '1rem' }} onClick={catat}>
        Catat keputusan
      </button>
      <p className={styles.modeNote}>
        Sistem memberi rekomendasi, Kepala Jurusan yang memutuskan. Setiap override dan penundaan dicatat beserta alasannya.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
function PerspektifSiswa({ profil, siswa, ambang }) {
  const { grup } = useDemoStore();
  const rencana = useMemo(() => buatPersiapan(profil, ambang), [profil, ambang]);
  const namaDepan = siswa.nama.split(' ')[0];

  if (!isKlasifikasi(profil.statusProfil)) {
    return (
      <div className={styles.notice}>
        Data {namaDepan} masih dilengkapi oleh sekolah. Rencana persiapan akan muncul setelah datanya cukup.
      </div>
    );
  }

  const sesi = grup[profil.statusProfil];
  const adaKuat = rencana.kekuatan.unit.length + rencana.kekuatan.komponen.length > 0;
  const adaDikuatkan = rencana.pembinaan.length + rencana.penguatan.length > 0;

  return (
    <div>
      <p className={styles.panelTitle}>Rencana persiapan PKL untuk {namaDepan}</p>
      <p className={`${styles.small} ${styles.muted}`}>
        Tampilan siswa hanya berisi kekuatan dan langkah berikutnya. Label kategori dan skor perbandingan hanya terlihat
        oleh guru dan Kepala Jurusan.
      </p>

      <div className={styles.twoLists} style={{ marginTop: '1rem' }}>
        <div>
          <div className={styles.prepTitle}>Yang sudah kuat</div>
          {adaKuat ? (
            <ul className={styles.bullets}>
              {rencana.kekuatan.unit.map((u) => (
                <li key={u.kode}>{u.judul}</li>
              ))}
              {rencana.kekuatan.komponen.map((c) => (
                <li key={c.key}>{c.label} terjaga baik</li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyLine}>Kekuatanmu akan terlihat seiring bertambahnya nilai.</p>
          )}
        </div>
        <div>
          <div className={styles.prepTitle}>Yang akan dikuatkan bersama guru</div>
          {adaDikuatkan ? (
            <ul className={styles.bullets}>
              {rencana.pembinaan.map((c) => (
                <li key={c.key}>{c.label}, bersama Wali Kelas dan Guru BK</li>
              ))}
              {rencana.penguatan.map((u) => (
                <li key={u.kode}>{u.judul}, bersama guru produktif</li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyLine}>Tidak ada yang mendesak. Fokusmu adalah mengenal dunia kerja.</p>
          )}
        </div>
      </div>

      <div className={styles.sectionLabel}>Langkah berikutnya</div>
      <ol className={styles.bullets} style={{ listStyle: 'decimal' }}>
        <li>{sesi ? `Ikuti sesi pembekalan: ${sesi}.` : 'Ikuti sesi pembekalan yang dijadwalkan sekolah.'}</li>
        <li>{adaDikuatkan ? 'Selesaikan penguatan bersama guru sebelum berangkat PKL.' : 'Pelajari alur kerja di industri tujuan.'}</li>
        <li>Kepala Jurusan menentukan industri tujuan setelah nilai terbaru masuk.</li>
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
function PerspektifIndustri({ profil, siswa, ambang }) {
  const { keputusan, pilihan } = useDemoStore();
  const tercatat = keputusan[siswa.id];

  if (!isKlasifikasi(profil.statusProfil)) {
    return <div className={styles.notice}>Profil kesiapan belum bisa dibuat karena data siswa belum cukup.</div>;
  }

  const narasi = buatNarasiProfil(profil, siswa, ambang);
  const unit = profil.kompetensi.unit.filter((u) => u.skor !== null);
  const memenuhi = unit.filter((u) => u.status === 'MEMENUHI');
  const perluKuat = unit.filter((u) => u.status !== 'MEMENUHI');
  const tujuanId = tercatat?.industriId || pilihan[siswa.id];
  const tujuan = tujuanId ? namaIndustri(indeksIndustri[tujuanId]) : null;

  let statusKirim = 'Belum dikirim, menunggu keputusan Kepala Jurusan.';
  if (tercatat && tercatat.jalur !== 'tunda') statusKirim = `Siap dikirim ke ${tujuan}.`;
  if (tercatat && tercatat.jalur === 'tunda') statusKirim = 'Penempatan ditunda, profil belum dikirim.';

  return (
    <div>
      <div className={styles.doc}>
        <div className={styles.docHead}>
          <div className={styles.docTitle}>Profil Kesiapan Kerja</div>
          <div className={`${styles.small} ${styles.muted}`}>
            {tujuan ? `Untuk ${tujuan}` : 'Untuk industri mitra'}
          </div>
        </div>
        <dl className={styles.docGrid}>
          <div>
            <dt>Siswa</dt>
            <dd>{siswa.nama}</dd>
          </div>
          <div>
            <dt>Kelas</dt>
            <dd>{siswa.kelas}</dd>
          </div>
          <div>
            <dt>Status kesiapan</dt>
            <dd>{PROFIL_META[profil.statusProfil].label}</dd>
          </div>
          <div>
            <dt>Program keahlian</dt>
            <dd>{siswa.program}</dd>
          </div>
          <div>
            <dt>Perilaku kerja</dt>
            <dd>{fmt(profil.perilaku.cumulative)} dari 100</dd>
          </div>
          <div>
            <dt>Kompetensi</dt>
            <dd>{fmt(profil.kompetensi.cumulative)} dari 100</dd>
          </div>
        </dl>
        <p>{narasi.ringkasan}</p>

        <div className={styles.twoLists} style={{ marginTop: '1rem' }}>
          <div>
            <div className={styles.prepTitle}>Unit yang memenuhi</div>
            <ul className={styles.bullets}>
              {memenuhi.map((u) => (
                <li key={u.kode}>{u.judul}</li>
              ))}
              {memenuhi.length === 0 && <li>Belum ada</li>}
            </ul>
          </div>
          <div>
            <div className={styles.prepTitle}>Perlu pendampingan</div>
            <ul className={styles.bullets}>
              {narasi.catatan.map((c) => (
                <li key={c}>{c}</li>
              ))}
              {perluKuat.length === 0 && narasi.catatan.length === 0 && <li>Tidak ada</li>}
            </ul>
          </div>
        </div>
        <p className={styles.docFoot}>
          Contoh dokumen dengan data simulasi. Pada penggunaan sebenarnya, dokumen dikirim setelah Kepala Jurusan
          menyetujui penempatan.
        </p>
      </div>
      <p className={styles.modeNote} role="status">
        {statusKirim}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function ResultPanel({ profil, siswa, ambang }) {
  const [tab, setTab] = useState('kajur');
  const hasil = useMemo(
    () => cocokkanIndustri({ siswa, profil, daftarIndustri: INDUSTRI, lens: null }),
    [siswa, profil],
  );

  const onKey = (e) => {
    const i = TABS.findIndex((t) => t.id === tab);
    if (e.key === 'ArrowRight') setTab(TABS[(i + 1) % TABS.length].id);
    if (e.key === 'ArrowLeft') setTab(TABS[(i - 1 + TABS.length) % TABS.length].id);
  };

  return (
    <div>
      <div className={styles.tablist} role="tablist" aria-label="Perspektif pengguna" onKeyDown={onKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className={`${styles.tab} ${tab === t.id ? styles.tabOn : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'kajur' && <PerspektifKajur profil={profil} siswa={siswa} hasil={hasil} />}
        {tab === 'siswa' && <PerspektifSiswa profil={profil} siswa={siswa} ambang={ambang} />}
        {tab === 'industri' && <PerspektifIndustri profil={profil} siswa={siswa} ambang={ambang} />}
      </div>
    </div>
  );
}