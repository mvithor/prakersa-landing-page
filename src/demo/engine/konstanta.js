// Konstanta mesin penilaian untuk demo. Nilai bertanda ASUMSI belum bisa
// dipastikan dari berkas yang tersedia (behavior-score-service.js belum
// dilampirkan) dan harus disamakan dengan backend sebelum demo dipublikasikan.

export const SEMESTER_AKTIF = 5; // demo: data terkumpul sampai Sem 5, PKL di Sem 6
export const TOTAL_UNIT_JURUSAN = 9; // jumlah unit SKKNI pada konfigurasi jurusan demo
export const SEMESTER_AKTIF_KOMPETENSI = 5; // pembagi laju unit per semester (sama dengan backend)
export const RASIO_TOLERANSI = 0.65; // sama dengan profile-generator-service

// ASUMSI: cermin behavior-score-service (komentar backend: bobot 2:1, 6 bulan terkini).
export const JUMLAH_BULAN_TERKINI = 6;
export const BOBOT_BULAN_TERKINI = 2;
export const BOBOT_BULAN_LAMA = 1;

// ASUMSI: bobot komponen skor bulanan. Ganti dengan nilai asli dari backend.
export const BOBOT_KOMPONEN_PERILAKU = {
  kehadiran: 0.3,
  ketepatan: 0.2,
  perizinan: 0.2,
  sikap_kerja: 0.3,
};

export const KOMPONEN_KEYS = ['kehadiran', 'ketepatan', 'perizinan', 'sikap_kerja'];

export const LABEL_KOMPONEN = {
  kehadiran: 'Kehadiran',
  ketepatan: 'Ketepatan tugas',
  perizinan: 'Perizinan',
  sikap_kerja: 'Sikap kerja',
};

export const AMBANG_KRITIS_DEFAULT = 60; // indikator perilaku di bawah ini selalu diberi catatan
export const AMBANG_PERINGATAN_TRACK = 60; // track record di bawah ini memicu flag riwayat kurang baik
export const MIN_SAMPEL_TRACK = 3; // sama dengan pkl-scoring-service

// DEVIASI DEMO dari backend: bila siswa tidak punya unit lemah, backend menandai
// relevansi SKKNI "tidak tersedia". Di demo, relevansi dihitung dari kekuatan
// siswa pada unit yang dilatih industri. Set false untuk meniru backend persis.
export const SKKNI_FALLBACK_FIT = true;

// 'keyakinan-dulu' = urutan diagram (tingkat keyakinan, lalu skor).
// 'skor-saja'      = perilaku pkl-placement-service saat ini (satu kunci).
export const RANK_MODE = 'keyakinan-dulu';