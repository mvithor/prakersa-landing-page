// Engine profil siswa untuk demo. Logika mengikuti profile-generator-service
// (gerbang kecukupan data, skor kumulatif berbobot recency, gerbang unit inti),
// tetapi membaca data mentah dari fixture, bukan dari database.
//
// PERBEDAAN DENGAN BACKEND (sengaja):
//  - Override unit inti Kritis dihitung dari status TERBARU tiap kode unit.
//    Backend saat ini mengisi unitKritisIntiSet dari SEMUA baris semua semester,
//    sehingga siswa yang sudah remedial tetap tertahan. Perbaiki di backend
//    sebelum klaim "profil bergerak setelah remedial" dipakai di luar demo.

import {
  getStatusUnit,
  isOverrideTrigger,
  hitungCompetencyScoreKomposit,
} from './ambangStatusUnit';
import {
  SEMESTER_AKTIF,
  TOTAL_UNIT_JURUSAN,
  SEMESTER_AKTIF_KOMPETENSI,
  RASIO_TOLERANSI,
  JUMLAH_BULAN_TERKINI,
  BOBOT_BULAN_TERKINI,
  BOBOT_BULAN_LAMA,
  KOMPONEN_KEYS,
  LABEL_KOMPONEN,
  AMBANG_KRITIS_DEFAULT,
} from './konstanta';

export const KODE_KLASIFIKASI = ['SP', 'RB', 'RK', 'RG'];

export const PROFIL_META = {
  SP: { kode: 'SP', label: 'Siap penuh', kelompok: 'Siap penuh' },
  RB: { kode: 'RB', label: 'Risiko behavior', kelompok: 'Risiko behavior' },
  RK: { kode: 'RK', label: 'Risiko kompetensi', kelompok: 'Risiko kompetensi' },
  RG: { kode: 'RG', label: 'Risiko ganda', kelompok: 'Risiko ganda' },
  PARSIAL_KOMPETENSI_SAJA: { kode: 'DBC', label: 'Data belum cukup', kelompok: 'Data belum cukup' },
  PARSIAL_PERILAKU_SAJA: { kode: 'DBC', label: 'Data belum cukup', kelompok: 'Data belum cukup' },
  DATA_BELUM_CUKUP: { kode: 'DBC', label: 'Data belum cukup', kelompok: 'Data belum cukup' },
};

export const isKlasifikasi = (statusProfil) => KODE_KLASIFIKASI.includes(statusProfil);

const rata = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
const gabungDan = (arr) =>
  arr.length <= 1 ? arr.join('') : `${arr.slice(0, -1).join(', ')} dan ${arr[arr.length - 1]}`;
const fmt1 = (n) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);

// ---------------------------------------------------------------------------
// Perilaku (Stream A)
// ---------------------------------------------------------------------------
function hitungPerilaku(siswa, ambang) {
  const terbaruDulu = [...siswa.bulan].reverse();
  const akum = Object.fromEntries(KOMPONEN_KEYS.map((k) => [k, { b: 0, t: 0 }]));
  let totalBobot = 0;
  let totalTertimbang = 0;

  terbaruDulu.forEach((row, index) => {
    const bobot = index < JUMLAH_BULAN_TERKINI ? BOBOT_BULAN_TERKINI : BOBOT_BULAN_LAMA;
    totalBobot += bobot;
    totalTertimbang += bobot * row.skor;
    for (const k of KOMPONEN_KEYS) {
      const nilai = row.komponen[k];
      if (nilai === null || nilai === undefined) continue;
      akum[k].b += bobot;
      akum[k].t += bobot * nilai;
    }
  });

  const cumulative = totalBobot > 0 ? totalTertimbang / totalBobot : null;
  const perKomponen = Object.fromEntries(
    KOMPONEN_KEYS.map((k) => [k, akum[k].b > 0 ? akum[k].t / akum[k].b : null]),
  );

  const sufficient = siswa.mulaiPerilaku <= SEMESTER_AKTIF - 1;
  let alasan = null;
  if (!sufficient) {
    alasan =
      siswa.bulan.length === 0
        ? 'Siswa baru atau pindahan, belum ada riwayat kehadiran sama sekali'
        : 'Riwayat perilaku masih terlalu pendek untuk disimpulkan';
  }

  const status = sufficient ? (cumulative >= ambang.perilaku ? 'BAIK' : 'KURANG') : null;
  return { sufficient, alasan, cumulative, perKomponen, status };
}

// ---------------------------------------------------------------------------
// Kompetensi (Stream B)
// ---------------------------------------------------------------------------
function skorTerbaru(unit, sampaiSem = SEMESTER_AKTIF) {
  for (let s = sampaiSem; s >= 1; s -= 1) {
    if (unit.riwayat[s] !== undefined && unit.riwayat[s] !== null) return unit.riwayat[s];
  }
  return null;
}

function bangunStatusUnit(unit, sampaiSem, remedial) {
  let skor = skorTerbaru(unit, sampaiSem);
  let gagalK3 = unit.gagalK3;
  if (skor === null) return { kode: unit.kode, judul: unit.judul, kategori: unit.kategori, skor: null, status: null, sebab: null, gagalK3: false };

  let status = gagalK3 ? 'KRITIS' : getStatusUnit(unit.kategori, skor);
  // Simulasi remedial: unit Kritis, dan unit inti Lemah, dianggap sudah dinilai ulang lulus.
  if (remedial && (status === 'KRITIS' || (status === 'LEMAH' && unit.kategori === 'kompetensi_inti'))) {
    skor = Math.max(skor, 78);
    gagalK3 = false;
    status = getStatusUnit(unit.kategori, skor);
  }
  const sebab = status === 'KRITIS' ? (gagalK3 ? 'GAGAL_K3' : 'SKOR_RENDAH') : null;
  return { kode: unit.kode, judul: unit.judul, kategori: unit.kategori, skor, status, sebab, gagalK3 };
}

function komposit(units) {
  const per = (kat) => rata(units.filter((u) => u.kategori === kat && u.skor !== null).map((u) => u.skor));
  return hitungCompetencyScoreKomposit({
    kompetensi_inti: per('kompetensi_inti'),
    kompetensi_umum: per('kompetensi_umum'),
    kompetensi_pilihan: per('kompetensi_pilihan'),
  });
}

function hitungKompetensi(siswa, ambang, opsi) {
  const unit = siswa.unit.map((u) => bangunStatusUnit(u, SEMESTER_AKTIF, opsi.remedial));
  const dinilai = unit.filter((u) => u.skor !== null);
  const cumulative = komposit(unit);
  const unitKritisInti = unit.filter((u) => isOverrideTrigger(u.kategori, u.status)).map((u) => u.kode);
  const overridden = unitKritisInti.length > 0;

  let sufficient = false;
  let alasan = null;
  const selisih = SEMESTER_AKTIF - siswa.mulaiKompetensi;
  if (selisih < 1) {
    alasan = 'Penilaian kompetensi baru dimulai';
  } else {
    const n = selisih + 1;
    const laju = TOTAL_UNIT_JURUSAN / SEMESTER_AKTIF_KOMPETENSI;
    const minimum = laju * n * RASIO_TOLERANSI;
    if (dinilai.length < minimum) {
      alasan = `Baru ${dinilai.length} dari ${fmt1(minimum)} unit yang diharapkan pada semester ke-${n}. Input guru belum lengkap`;
    } else {
      sufficient = true;
    }
  }

  let status = null;
  if (sufficient) {
    status = overridden ? 'KURANG' : cumulative >= ambang.kompetensi ? 'BAIK' : 'KURANG';
  }

  return { sufficient, alasan, cumulative, status, overridden, unitKritisInti, unit };
}

function tentukanProfil(perilaku, kompetensi) {
  if (perilaku.sufficient && kompetensi.sufficient) {
    const pb = perilaku.status === 'BAIK';
    const kb = kompetensi.status === 'BAIK';
    if (pb && kb) return 'SP';
    if (pb && !kb) return 'RK';
    if (!pb && kb) return 'RB';
    return 'RG';
  }
  if (kompetensi.sufficient && !perilaku.sufficient) return 'PARSIAL_KOMPETENSI_SAJA';
  if (perilaku.sufficient && !kompetensi.sufficient) return 'PARSIAL_PERILAKU_SAJA';
  return 'DATA_BELUM_CUKUP';
}

// ---------------------------------------------------------------------------
// Tren per semester selesai (Sem 1 sampai Sem 4)
// ---------------------------------------------------------------------------
function hitungTren(siswa) {
  const periods = [];
  for (let s = 1; s < SEMESTER_AKTIF; s += 1) {
    const baris = siswa.bulan.filter((b) => b.sem === s);
    const perilaku = baris.length ? rata(baris.map((b) => b.skor)) : null;
    const units = siswa.unit.map((u) => bangunStatusUnit(u, s, false));
    const ada = units.some((u) => u.skor !== null);
    periods.push({ label: `Sem ${s}`, perilaku, kompetensi: ada ? komposit(units) : null });
  }
  return periods;
}

// ---------------------------------------------------------------------------
// Entri utama
// ---------------------------------------------------------------------------
export function hitungProfil(siswa, ambang, opsi = {}) {
  const perilaku = hitungPerilaku(siswa, ambang);
  const kompetensi = hitungKompetensi(siswa, ambang, opsi);
  const statusProfil = tentukanProfil(perilaku, kompetensi);
  const unitLemahKode = kompetensi.unit
    .filter((u) => u.status === 'KRITIS' || u.status === 'LEMAH')
    .map((u) => u.kode);

  return {
    id: siswa.id,
    nama: siswa.nama,
    statusProfil,
    perilaku,
    kompetensi,
    unitLemahKode,
    tren: hitungTren(siswa),
    remedial: Boolean(opsi.remedial),
  };
}

export function ringkasKelas(profilList) {
  const jumlah = { SP: 0, RB: 0, RK: 0, RG: 0, DBC: 0 };
  for (const p of profilList) {
    if (isKlasifikasi(p.statusProfil)) jumlah[p.statusProfil] += 1;
    else jumlah.DBC += 1;
  }
  const terklasifikasi = jumlah.SP + jumlah.RB + jumlah.RK + jumlah.RG;
  return {
    total: profilList.length,
    terklasifikasi,
    jumlah,
    perluPendampingan: jumlah.RB + jumlah.RK + jumlah.RG,
    siapLangsung: jumlah.SP,
    dataBelumCukup: jumlah.DBC,
  };
}

// ---------------------------------------------------------------------------
// Rencana persiapan PKL: turunan dari profil, tanpa menghitung ulang skor.
// ---------------------------------------------------------------------------
const SARAN_KOMPONEN = {
  kehadiran: 'Pembinaan disiplin kehadiran diperlukan.',
  ketepatan: 'Pendampingan manajemen waktu pengerjaan tugas.',
  perizinan: 'Edukasi prosedur perizinan yang sah.',
  sikap_kerja: 'Pendampingan sikap kerja bersama guru produktif.',
};

const SARAN_UNIT = {
  GAGAL_K3: 'Wajib remedial praktik keselamatan kerja sebelum PKL.',
  KRITIS_INTI: 'Prioritas penguatan teknis segera. Unit ini kompetensi inti jurusan, jadi syarat utama kesiapan PKL.',
  KRITIS: 'Penguatan teknis tambahan pada unit ini sebelum PKL.',
  LEMAH_INTI: 'Penguatan lanjutan. Belum menahan kesiapan, tetapi perlu dikuatkan.',
};

export function buatPersiapan(profil, ambang) {
  const perilakuKurang = profil.perilaku.sufficient && profil.perilaku.status === 'KURANG';
  const pembinaan = perilakuKurang
    ? KOMPONEN_KEYS.map((k) => ({
        key: k,
        label: LABEL_KOMPONEN[k],
        skor: profil.perilaku.perKomponen[k],
        kritis: profil.perilaku.perKomponen[k] !== null && profil.perilaku.perKomponen[k] < AMBANG_KRITIS_DEFAULT,
        saran: SARAN_KOMPONEN[k],
      }))
        .filter((c) => c.skor !== null && c.skor < ambang.perilaku)
        .sort((a, b) => a.skor - b.skor)
    : [];

  const prioritas = (u) => {
    if (u.sebab === 'GAGAL_K3') return 1;
    if (u.status === 'KRITIS' && u.kategori === 'kompetensi_inti') return 2;
    if (u.status === 'KRITIS') return 3;
    return 4;
  };
  const penguatan = profil.kompetensi.unit
    .filter((u) => u.status === 'KRITIS' || (u.status === 'LEMAH' && u.kategori === 'kompetensi_inti'))
    .map((u) => ({
      ...u,
      prioritas: prioritas(u),
      saran:
        u.sebab === 'GAGAL_K3'
          ? SARAN_UNIT.GAGAL_K3
          : u.status === 'KRITIS'
            ? u.kategori === 'kompetensi_inti'
              ? SARAN_UNIT.KRITIS_INTI
              : SARAN_UNIT.KRITIS
            : SARAN_UNIT.LEMAH_INTI,
    }))
    .sort((a, b) => a.prioritas - b.prioritas || a.skor - b.skor)
    .slice(0, 5);

  const unitKuat = profil.kompetensi.unit
    .filter((u) => u.status === 'MEMENUHI')
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 2);
  const komponenKuat = KOMPONEN_KEYS.map((k) => ({
    key: k,
    label: LABEL_KOMPONEN[k],
    skor: profil.perilaku.perKomponen[k],
  }))
    .filter((c) => c.skor !== null && c.skor >= ambang.perilaku)
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 2);

  return { pembinaan, penguatan, kekuatan: { unit: unitKuat, komponen: komponenKuat } };
}

// ---------------------------------------------------------------------------
// Narasi singkat untuk Profil Kesiapan Kerja yang diterima industri.
// ---------------------------------------------------------------------------
export function buatNarasiProfil(profil, siswa, ambang) {
  const unit = profil.kompetensi.unit.filter((u) => u.skor !== null);
  const memenuhi = unit.filter((u) => u.status === 'MEMENUHI').length;
  const label = PROFIL_META[profil.statusProfil].label;
  const kalimat = [];

  kalimat.push(
    `Siswa kelas ${siswa.kelas} program keahlian ${siswa.program} dengan status kesiapan kerja ${label.toLowerCase()}, berdasarkan dua dimensi terpisah: perilaku kerja dan kompetensi teknis.`,
  );
  if (unit.length) {
    kalimat.push(`${memenuhi} dari ${unit.length} unit kompetensi SKKNI yang dinilai berstatus memenuhi.`);
  }
  const catatan = [];
  if (profil.perilaku.sufficient) {
    const pk = KOMPONEN_KEYS.map((k) => ({ k, v: profil.perilaku.perKomponen[k] })).filter((c) => c.v !== null);
    const bawah = pk.filter((c) => c.v < ambang.perilaku).sort((a, b) => a.v - b.v);
    if (bawah.length) {
      catatan.push(
        `Perlu pendampingan pada ${gabungDan(bawah.map((c) => LABEL_KOMPONEN[c.k].toLowerCase()))} selama masa orientasi.`,
      );
    }
  } else {
    catatan.push('Data perilaku belum cukup untuk disimpulkan.');
  }
  for (const u of unit.filter((x) => x.status === 'KRITIS')) {
    catatan.push(
      u.sebab === 'GAGAL_K3'
        ? 'Unit K3 belum tuntas dan wajib diremediasi sebelum penempatan.'
        : `Unit "${u.judul}" perlu penguatan dan pendampingan teknis.`,
    );
  }
  if (!catatan.length) catatan.push('Tidak ada catatan pendampingan khusus.');
  return { ringkasan: kalimat.join(' '), catatan };
}