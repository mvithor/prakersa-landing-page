import { useMemo, useState } from 'react';
import styles from './Demo.module.css';
import { ProfilBadge, StatusUnitBadge, fmt } from './shared';
import { demoStore, useDemoStore } from '../demoStore';
import { buatPersiapan, hitungProfil, isKlasifikasi, PROFIL_META } from '../engine/profile';
import { MATERI_PEMBEKALAN, SESI_OPSI } from '../data/demoFixture';

function TombolTugas({ id, ditugaskan, setDitugaskan, label }) {
  const aktif = Boolean(ditugaskan[id]);
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnSm}`}
      aria-pressed={aktif}
      onClick={() => setDitugaskan((d) => ({ ...d, [id]: !d[id] }))}
      style={{ marginTop: '0.75rem' }}
    >
      {aktif ? 'Ditugaskan' : label}
    </button>
  );
}

export default function PreparationPanel({ profil, siswa, profilList, ambang }) {
  const { grup, remedial } = useDemoStore();
  const [ditugaskan, setDitugaskan] = useState({});
  const [sesiPilih, setSesiPilih] = useState('');
  const [galat, setGalat] = useState('');

  const persiapan = useMemo(() => buatPersiapan(profil, ambang), [profil, ambang]);
  const sebelum = useMemo(() => hitungProfil(siswa, ambang, { remedial: false }), [siswa, ambang]);
  const sedangSimulasi = Boolean(remedial[siswa.id]);

  if (!isKlasifikasi(profil.statusProfil)) {
    return (
      <div className={styles.notice}>
        Rencana persiapan belum bisa disusun untuk {siswa.nama}.{' '}
        {profil.perilaku.alasan || profil.kompetensi.alasan}. Sistem menandai data belum cukup, bukan memaksa siswa
        masuk salah satu profil.
      </div>
    );
  }

  const status = profil.statusProfil;
  const anggota = profilList.filter((p) => p.statusProfil === status);
  const tersimpan = grup[status];
  const punyaUnitDikuatkan = sebelum.kompetensi.unit.some(
    (u) => u.status === 'KRITIS' || (u.status === 'LEMAH' && u.kategori === 'kompetensi_inti'),
  );

  const simpanGrup = () => {
    if (!sesiPilih) {
      setGalat('Pilih sesi pembekalan dulu.');
      return;
    }
    setGalat('');
    demoStore.set((s) => ({ grup: { ...s.grup, [status]: sesiPilih } }));
  };

  // Nilai berubah, jadi peringkat industri dan keputusan lama tidak berlaku lagi.
  const ubahRemedial = () =>
    demoStore.set((s) => {
      const { [siswa.id]: _p, ...pilihan } = s.pilihan;
      const { [siswa.id]: _k, ...keputusan } = s.keputusan;
      return { remedial: { ...s.remedial, [siswa.id]: !s.remedial[siswa.id] }, pilihan, keputusan };
    });

  return (
    <div>
      <div className={styles.prepGrid}>
        <div>
          <div className={styles.prepTitle}>Pembinaan perilaku</div>
          <div className={styles.prepWho}>Ditujukan ke Wali Kelas dan Guru BK</div>
          {persiapan.pembinaan.length === 0 ? (
            <p className={styles.emptyLine}>Perilaku kerja sudah memenuhi ambang. Tidak ada pembinaan khusus.</p>
          ) : (
            <>
              <div className={styles.prepList}>
                {persiapan.pembinaan.map((c) => (
                  <div key={c.key} className={styles.prepItem}>
                    <div className={styles.prepItemHead}>
                      <span>{c.label}</span>
                      <span className={c.kritis ? styles.prepCrit : ''}>{fmt(c.skor)}</span>
                    </div>
                    <div className={styles.muted}>{c.saran}</div>
                  </div>
                ))}
              </div>
              <TombolTugas
                id={`${siswa.id}-perilaku`}
                ditugaskan={ditugaskan}
                setDitugaskan={setDitugaskan}
                label="Tindak lanjut ke Wali Kelas dan BK"
              />
            </>
          )}
        </div>

        <div>
          <div className={styles.prepTitle}>Penguatan kompetensi</div>
          <div className={styles.prepWho}>Ditujukan ke guru produktif pengampu unit</div>
          {persiapan.penguatan.length === 0 ? (
            <p className={styles.emptyLine}>Semua unit yang dinilai sudah memenuhi. Tidak ada penguatan mendesak.</p>
          ) : (
            <>
              <div className={styles.prepList}>
                {persiapan.penguatan.map((u) => (
                  <div key={u.kode} className={styles.prepItem}>
                    <div className={styles.prepItemHead}>
                      <span>{u.judul}</span>
                      <StatusUnitBadge status={u.status} />
                    </div>
                    <div className={styles.unitCode}>
                      {u.kode}, skor {fmt(u.skor)}
                    </div>
                    <div className={styles.muted}>{u.saran}</div>
                  </div>
                ))}
              </div>
              <TombolTugas
                id={`${siswa.id}-kompetensi`}
                ditugaskan={ditugaskan}
                setDitugaskan={setDitugaskan}
                label="Tindak lanjut ke guru produktif"
              />
            </>
          )}
        </div>
      </div>

      <div className={styles.sectionLabel}>Pembekalan sesuai profil</div>
      <p className={`${styles.small} ${styles.muted}`}>
        Sistem mengelompokkan siswa dengan profil yang sama supaya pembekalan tidak seragam untuk semua.
      </p>
      <div className={styles.groupHead} style={{ marginTop: '0.75rem' }}>
        <ProfilBadge statusProfil={status} />
        <span className={styles.groupCount}>{anggota.length} siswa dalam kelompok ini</span>
      </div>
      <div className={styles.chips}>
        {anggota.map((p) => (
          <span key={p.id} className={styles.chip} style={{ cursor: 'default' }}>
            {p.nama}
          </span>
        ))}
      </div>
      <div className={styles.materi}>
        {MATERI_PEMBEKALAN[status].map((m) => (
          <div key={m.judul} className={styles.materiItem}>
            <strong>{m.judul}</strong>
            {m.teks}
          </div>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="sesi-pembekalan">Sesi pembekalan</label>
        <select
          id="sesi-pembekalan"
          className={styles.select}
          value={tersimpan || sesiPilih}
          disabled={Boolean(tersimpan)}
          aria-invalid={galat ? 'true' : 'false'}
          aria-describedby={galat ? 'sesi-galat' : undefined}
          onChange={(e) => {
            setSesiPilih(e.target.value);
            setGalat('');
          }}
        >
          <option value="">Pilih sesi</option>
          {SESI_OPSI.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {galat && (
          <span id="sesi-galat" className={styles.error} role="alert">
            {galat}
          </span>
        )}
      </div>
      {tersimpan ? (
        <p className={styles.saved} role="status">
          Grup {PROFIL_META[status].label.toLowerCase()} terjadwal: {tersimpan}.
        </p>
      ) : (
        <button type="button" className={`${styles.btn} ${styles.btnSm}`} style={{ marginTop: '0.75rem' }} onClick={simpanGrup}>
          Simpan grup
        </button>
      )}

      {(punyaUnitDikuatkan || sedangSimulasi) && (
        <div className={styles.simBox}>
          <span className={styles.simTag}>Simulasi</span>
          <p className={styles.small}>
            Pembekalan tidak mengubah skor. Profil hanya berubah jika guru menginput nilai baru. Coba lihat apa yang
            terjadi jika nilai remedial untuk unit yang lemah dan kritis sudah masuk.
          </p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSm}`}
            aria-pressed={sedangSimulasi}
            onClick={ubahRemedial}
            style={{ marginTop: '0.5rem' }}
          >
            {sedangSimulasi ? 'Kembalikan ke nilai awal' : 'Simulasikan nilai remedial masuk'}
          </button>
          {sedangSimulasi && (
            <p className={styles.notice} role="status">
              {sebelum.statusProfil === profil.statusProfil
                ? `Profil tetap ${PROFIL_META[profil.statusProfil].label.toLowerCase()}.`
                : `Profil berubah dari ${PROFIL_META[sebelum.statusProfil].label.toLowerCase()} menjadi ${PROFIL_META[profil.statusProfil].label.toLowerCase()}.`}{' '}
              Kompetensi naik dari {fmt(sebelum.kompetensi.cumulative)} ke {fmt(profil.kompetensi.cumulative)}. Perilaku
              tetap {fmt(profil.perilaku.cumulative)} karena tidak ada data perilaku baru.
            </p>
          )}
        </div>
      )}
    </div>
  );
}