// Data simulasi demo. SEMUA nama siswa dan industri fiktif.
//
// Siswa dibangkitkan secara deterministik (tanpa Math.random) dari spesifikasi
// ringkas di SPEK: skor bulanan empat komponen perilaku selama 5 semester dan
// skor per unit SKKNI per semester. Semua angka yang tampil di layar (skor
// kumulatif, status unit, kuadran, tren) dihitung dari data mentah ini oleh
// engine/profile.js, tidak ditulis tangan.

import { BOBOT_KOMPONEN_PERILAKU, KOMPONEN_KEYS, SEMESTER_AKTIF } from '../engine/konstanta';

export const AMBANG_DEFAULT = { perilaku: 70, kompetensi: 70 };
export const AMBANG_MIN = 40;
export const AMBANG_MAX = 90;

export const KELAS_DEMO = {
  nama: 'XII TKJ',
  sekolah: 'SMK Contoh',
  jurusan: 'TKJ',
  program: 'Teknik Komputer dan Jaringan',
};

// Kode unit SKKNI mengikuti pemetaan jurusan TKJ pada prototipe.
export const U = {
  LAN: 'TIK.JK02.001.01',
  KEAMANAN: 'TIK.JK02.004.01',
  FIBER: 'TIK.JK02.006.01',
  WIRELESS: 'TIK.JK02.007.01',
  SWITCH: 'TIK.JK02.009.01',
  TCPIP: 'TIK.JK02.014.01',
  ADMIN: 'TIK.JK02.021.01',
  K3: 'TIK.JK01.006.01',
  TROUBLE: 'TIK.JK05.005.01',
};

// Urutan ini sama dengan urutan array `u` pada SPEK.
// intro = semester pertama unit ini dinilai.
export const UNIT_DEF = [
  { kode: U.LAN, judul: 'Membuat desain jaringan lokal (LAN)', kategori: 'kompetensi_inti', intro: 2 },
  { kode: U.KEAMANAN, judul: 'Mendesain sistem keamanan jaringan', kategori: 'kompetensi_inti', intro: 4 },
  { kode: U.FIBER, judul: 'Memasang kabel serat optik', kategori: 'kompetensi_inti', intro: 3 },
  { kode: U.WIRELESS, judul: 'Memasang jaringan nirkabel', kategori: 'kompetensi_inti', intro: 2 },
  { kode: U.SWITCH, judul: 'Install dan konfigurasi manageable switch', kategori: 'kompetensi_inti', intro: 3 },
  { kode: U.TCPIP, judul: 'Konfigurasi TCP/IP statis pada workstation', kategori: 'kompetensi_inti', intro: 1 },
  { kode: U.ADMIN, judul: 'Mengadministrasi perangkat jaringan', kategori: 'kompetensi_inti', intro: 4 },
  { kode: U.K3, judul: 'Menerapkan prosedur keselamatan dan kesehatan kerja (K3)', kategori: 'kompetensi_umum', intro: 1 },
  { kode: U.TROUBLE, judul: 'Deteksi dan atasi masalah jaringan', kategori: 'kompetensi_pilihan', intro: 3 },
];

// ---------------------------------------------------------------------------
// Spesifikasi siswa.
//   B     : target skor perilaku kumulatif (rata-rata tertimbang recency)
//   off   : selisih tiap komponen dari level umum [kehadiran, ketepatan, perizinan, sikap kerja]
//   gerak : kenaikan skor perilaku dari semester 1 ke semester 5
//   u     : skor akhir 9 unit (urutan UNIT_DEF); null = belum dinilai
//   gK    : kenaikan skor unit per semester (default 2,5)
//   mulaiPerilaku / mulaiKompetensi : semester pertama data ada (default 1)
//   gagalK3 : unit K3 gagal dan belum diremediasi
// ---------------------------------------------------------------------------
const SPEK = [
  // Siap penuh
  { id: 'S-01', nama: 'Alya Prameswari', B: 82, off: [8, -6, 4, 2], gerak: 6, u: [85, 88, 85, 82, 85, 87, 88, 86, 86] },
  { id: 'S-02', nama: 'Bima Saputra', B: 79, off: [16, -27, 8, 4], gerak: 14, u: [85, 88, 85, 82, 85, 87, 88, 86, 86] },
  { id: 'S-04', nama: 'Dimas Prakoso', B: 76, off: [4, -4, 6, -2], gerak: 10, u: [80, 78, 82, 79, 81, 84, 80, 85, 83] },
  { id: 'S-06', nama: 'Farel Ramadhan', B: 81, off: [6, -4, 2, 2], gerak: 8, u: [84, 80, 86, 83, 85, 82, 79, 88, 84] },
  { id: 'S-08', nama: 'Hendra Wijaya', B: 87, off: [4, 0, 4, -2], gerak: 5, u: [88, 90, 86, 87, 89, 88, 91, 90, 88] },
  { id: 'S-10', nama: 'Joko Santoso', B: 78, off: [6, -4, 4, -2], gerak: 8, u: [82, 79, 84, 80, 83, 81, 78, 86, 82] },
  { id: 'S-11', nama: 'Kirana Lestari', B: 85, off: [5, -3, 3, -1], gerak: 6, u: [90, 86, 88, 91, 87, 89, 85, 92, 90] },
  { id: 'S-13', nama: 'Maya Kusuma', B: 76, off: [5, -5, 5, -4], gerak: 10, u: [79, 81, 77, 80, 78, 83, 79, 84, 80] },
  { id: 'S-17', nama: 'Qonita Zahra', B: 90, off: [3, 0, 2, -2], gerak: 4, u: [92, 94, 90, 93, 91, 95, 92, 94, 93] },
  { id: 'S-22', nama: 'Vania Cahyani', B: 80, off: [6, -4, 4, -2], gerak: 7, u: [83, 81, 85, 82, 80, 84, 86, 87, 83] },

  // Risiko behavior
  { id: 'S-05', nama: 'Eka Wulandari', B: 56, off: [6, -8, 2, 0], gerak: 8, u: [82, 80, 84, 81, 79, 85, 83, 86, 82] },
  { id: 'S-12', nama: 'Lutfi Hakim', B: 42, off: [16, -19, 5, -14], gerak: 10, u: [85, 83, 84, 85, 86, 89, 87, 84, 88] },
  { id: 'S-16', nama: 'Putra Aditya', B: 63, off: [8, -10, 0, 2], gerak: 6, u: [78, 80, 76, 82, 79, 81, 77, 83, 80] },
  { id: 'S-21', nama: 'Umar Faruq', B: 48, off: [10, -15, 5, -5], gerak: 10, u: [80, 78, 84, 82, 80, 79, 81, 30, 80], gagalK3: true },
  { id: 'S-25', nama: 'Zaki Mubarok', B: 66, off: [4, -6, 2, 0], gerak: 5, u: [76, 79, 80, 77, 78, 82, 75, 81, 79] },

  // Risiko kompetensi
  { id: 'S-03', nama: 'Citra Anggraini', B: 82, off: [6, -4, 4, -2], gerak: 6, u: [62, 60, 58, 64, 55, 66, 61, 70, 65] },
  { id: 'S-09', nama: 'Intan Maharani', B: 76, off: [6, -6, 4, -2], gerak: 6, u: [82, 80, 84, 81, 83, 26, 85, 80, 82] },
  { id: 'S-15', nama: 'Olivia Rahmawati', B: 77, off: [14, -26, 8, 6], gerak: 8, u: [26, 81, 83, 79, 83, 82, 33, 81, 80], gK: 3 },
  { id: 'S-20', nama: 'Tegar Pratama', B: 85, off: [4, -2, 4, -2], gerak: 5, u: [58, 52, 60, 56, 62, 65, 54, 66, 60] },
  { id: 'S-24', nama: 'Yoga Permana', B: 76, off: [5, -5, 5, -3], gerak: 7, u: [64, 70, 62, 66, 60, 68, 65, 72, 66] },

  // Risiko ganda
  { id: 'S-07', nama: 'Gita Purnama', B: 40, off: [22, -16, 8, -14], gerak: 12, u: [29, 84, 81, 81, 85, 83, 31, 79, 79], gK: 3 },
  { id: 'S-14', nama: 'Naufal Hidayat', B: 55, off: [10, -12, 4, -6], gerak: 8, u: [50, 44, 52, 48, 55, 58, 46, 66, 60] },
  { id: 'S-19', nama: 'Salsabila Nur', B: 62, off: [6, -8, 2, 0], gerak: 6, u: [40, 55, 58, 52, 60, 57, 50, 70, 62] },
  { id: 'S-23', nama: 'Wahyu Nugroho', B: 32, off: [20, -12, 0, -10], gerak: 10, u: [60, 58, 64, 55, 52, 61, 57, 72, 63] },

  // Data belum cukup
  {
    id: 'S-18',
    nama: 'Rangga Firmansyah',
    B: 68,
    off: [4, -4, 2, 0],
    gerak: 0,
    u: [null, null, null, null, null, 70, null, 75, null],
    mulaiPerilaku: 5,
    mulaiKompetensi: 5,
  },
  {
    id: 'S-26',
    nama: 'Ayu Ningsih',
    B: 78,
    off: [5, -5, 3, -1],
    gerak: 6,
    u: [80, null, 82, null, null, 79, null, 84, null],
  },
  {
    id: 'S-27',
    nama: 'Bagas Setiawan',
    B: 74,
    off: [4, -4, 4, -2],
    gerak: 0,
    u: [78, 80, 79, 82, 77, 81, 79, 85, 80],
    mulaiPerilaku: 5,
  },
];

// Siswa contoh per profil untuk tombol "coba siswa lain".
export const ARKETIPE = { SP: 'S-02', RB: 'S-12', RK: 'S-15', RG: 'S-07' };

// ---------------------------------------------------------------------------
// Pembangkit deterministik
// ---------------------------------------------------------------------------
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const klem = (v, min = 5, max = 99) => Math.max(min, Math.min(max, v));
const bulat1 = (v) => Math.round(v * 10) / 10;

function bangunBulan(sp, rng) {
  const mulai = sp.mulaiPerilaku ?? 1;
  const total = (SEMESTER_AKTIF - mulai + 1) * 6;
  const off = Object.fromEntries(KOMPONEN_KEYS.map((k, i) => [k, sp.off[i]]));
  const geserBobot = KOMPONEN_KEYS.reduce((a, k) => a + BOBOT_KOMPONEN_PERILAKU[k] * off[k], 0);
  // Skor rata-rata tertimbang recency berada di bawah level akhir kira-kira 0,43 x gerak.
  const levelAkhir = sp.B + 0.43 * sp.gerak - geserBobot;

  const baris = [];
  for (let m = 0; m < total; m += 1) {
    const t = total > 1 ? m / (total - 1) : 1;
    const level = levelAkhir - sp.gerak * (1 - t);
    const komponen = {};
    for (const k of KOMPONEN_KEYS) {
      komponen[k] = bulat1(klem(level + off[k] + (rng() - 0.5) * 6));
    }
    // Sikap kerja hanya teramati saat entri praktik, jadi sebagian bulan kosong.
    if (rng() < 0.2) komponen.sikap_kerja = null;

    let bobot = 0;
    let tertimbang = 0;
    for (const k of KOMPONEN_KEYS) {
      if (komponen[k] === null) continue;
      bobot += BOBOT_KOMPONEN_PERILAKU[k];
      tertimbang += BOBOT_KOMPONEN_PERILAKU[k] * komponen[k];
    }
    baris.push({ sem: mulai + Math.floor(m / 6), komponen, skor: bulat1(tertimbang / bobot) });
  }
  return baris;
}

function bangunUnit(sp, rng) {
  const mulaiK = sp.mulaiKompetensi ?? 1;
  const gK = sp.gK ?? 2.5;
  return UNIT_DEF.map((d, i) => {
    const akhir = sp.u[i];
    const riwayat = {};
    if (akhir !== null && akhir !== undefined) {
      const intro = Math.max(d.intro, mulaiK);
      for (let s = intro; s <= SEMESTER_AKTIF; s += 1) {
        riwayat[s] =
          s === SEMESTER_AKTIF ? akhir : bulat1(klem(akhir - gK * (SEMESTER_AKTIF - s) + (rng() - 0.5) * 4));
      }
    }
    return {
      kode: d.kode,
      judul: d.judul,
      kategori: d.kategori,
      riwayat,
      gagalK3: Boolean(sp.gagalK3 && d.kode === U.K3),
    };
  });
}

function bangunSiswa(sp) {
  const rng = mulberry32(hashString(sp.id));
  return {
    id: sp.id,
    nama: sp.nama,
    kelas: KELAS_DEMO.nama,
    jurusan: KELAS_DEMO.jurusan,
    program: KELAS_DEMO.program,
    mulaiPerilaku: sp.mulaiPerilaku ?? 1,
    mulaiKompetensi: sp.mulaiKompetensi ?? 1,
    bulan: bangunBulan(sp, rng),
    unit: bangunUnit(sp, rng),
  };
}

export const SISWA = SPEK.map(bangunSiswa).sort((a, b) => a.id.localeCompare(b.id));

// ---------------------------------------------------------------------------
// Industri mitra (fiktif). Kedisiplinan, supervisor, dan mentoring TIDAK diisi
// mandiri oleh industri, itu sumber bias yang ditandai juri (semua industri
// cenderung menilai dirinya tinggi). Sumbernya evaluasiMagang, rata-rata dari
// evaluasi siswa yang pernah magang di situ, dikunci gerbang jumlah sampel.
// ---------------------------------------------------------------------------
// evaluasiMagang: rata-rata kedisiplinan/supervisor/mentoring dari evaluasi siswa
// yang pernah magang di industri ini, BUKAN isian mandiri industri saat onboarding.
// n = jumlah evaluasi magang total, lintas semua profil siswa (bukan per kuadran,
// karena tiga hal ini sifat tempat kerja itu sendiri, bukan sifat yang beda per
// profil siswa seperti trackRecord). Di bawah MIN_SAMPEL_TRACK (3), mesin membaca
// ketiganya sebagai tidak tersedia, apa pun angka yang tersimpan di sini.
export const INDUSTRI = [
  {
    id: 'I-01',
    nama: 'Nusa Net Solusi',
    bidang: 'Penyedia layanan internet lokal',
    kematangan: 'BERKEMBANG',
    jurusan: ['TKJ'],
    kapasitas: 4,
    terisi: 1,
    aktif: true,
    unitDilatih: [U.LAN, U.ADMIN, U.WIRELESS, U.SWITCH],
    evaluasiMagang: { n: 2, kedisiplinan: 4, supervisor: 4, mentoring: 4 },
    evaluatorAktif: true,
    trackRecord: null,
  },
  {
    id: 'I-02',
    nama: 'Data Karsa Center',
    bidang: 'Pusat data dan hosting',
    kematangan: 'MAPAN',
    jurusan: ['TKJ'],
    kapasitas: 3,
    terisi: 1,
    aktif: true,
    unitDilatih: [U.KEAMANAN, U.SWITCH, U.ADMIN, U.TROUBLE],
    evaluasiMagang: { n: 20, kedisiplinan: 5, supervisor: 5, mentoring: 3 },
    evaluatorAktif: false,
    trackRecord: {
      nilai: { SP: 90, RB: 78, RK: 70, RG: 45 },
      n: { SP: 8, RB: 5, RK: 4, RG: 3 },
    },
  },
  {
    id: 'I-03',
    nama: 'Siaran Lintas Daerah',
    bidang: 'Penyiaran dan jaringan studio',
    kematangan: 'BERKEMBANG',
    jurusan: ['TKJ'],
    kapasitas: 2,
    terisi: 0,
    aktif: true,
    unitDilatih: [U.FIBER, U.WIRELESS, U.LAN],
    evaluasiMagang: { n: 1, kedisiplinan: 3, supervisor: 4, mentoring: 5 },
    evaluatorAktif: false,
    trackRecord: null,
  },
  {
    id: 'I-04',
    nama: 'Layanan Digital Kota',
    bidang: 'Teknologi informasi pemerintah daerah',
    kematangan: 'BARU',
    jurusan: ['TKJ'],
    kapasitas: 3,
    terisi: 0,
    aktif: true,
    unitDilatih: [U.LAN, U.ADMIN, U.TCPIP, U.KEAMANAN],
    // Belum pernah menerima siswa PKL sama sekali, jadi n = 0 dan ketiganya null,
    // bukan angka default yang menyamar sebagai data.
    evaluasiMagang: { n: 0, kedisiplinan: null, supervisor: null, mentoring: null },
    evaluatorAktif: false,
    trackRecord: null,
  },
  {
    id: 'I-05',
    nama: 'Sentra Komputer Mandiri',
    bidang: 'Reparasi dan ritel komputer',
    kematangan: 'MAPAN',
    jurusan: ['TKJ'],
    kapasitas: 5,
    terisi: 2,
    aktif: true,
    unitDilatih: [U.TCPIP, U.TROUBLE, U.K3],
    evaluasiMagang: { n: 18, kedisiplinan: 2, supervisor: 3, mentoring: 2 },
    evaluatorAktif: false,
    trackRecord: {
      nilai: { SP: 75, RB: 40, RK: 65, RG: 35 },
      n: { SP: 6, RB: 4, RK: 5, RG: 3 },
    },
  },
  {
    id: 'I-06',
    nama: 'Instalasi Bahari',
    bidang: 'Jasa instalasi jaringan',
    kematangan: 'BERKEMBANG',
    jurusan: ['TKJ'],
    kapasitas: 2,
    terisi: 2,
    aktif: true,
    unitDilatih: [U.FIBER, U.LAN],
    evaluasiMagang: { n: 2, kedisiplinan: 4, supervisor: 3, mentoring: 4 },
    evaluatorAktif: false,
    trackRecord: null,
  },
  {
    id: 'I-07',
    nama: 'Kabel Optik Utama',
    bidang: 'Infrastruktur serat optik',
    kematangan: 'MAPAN',
    jurusan: ['TKJ'],
    kapasitas: 4,
    terisi: 0,
    aktif: false,
    unitDilatih: [U.FIBER],
    evaluasiMagang: { n: 6, kedisiplinan: 4, supervisor: 4, mentoring: 4 },
    evaluatorAktif: false,
    trackRecord: null,
  },
  {
    id: 'I-08',
    nama: 'Otomasi Pabrik',
    bidang: 'Otomasi dan perawatan mesin',
    kematangan: 'MAPAN',
    jurusan: ['TPM'],
    kapasitas: 3,
    terisi: 0,
    aktif: true,
    unitDilatih: [],
    evaluasiMagang: { n: 6, kedisiplinan: 4, supervisor: 4, mentoring: 4 },
    evaluatorAktif: false,
    trackRecord: null,
  },
];

// Tiga arketipe kematangan mitra untuk demo sisi industri, dipilih pengunjung
// (bukan diisi sendiri), supaya angka yang tampil selalu berasal dari riwayat
// magang yang sudah tercatat pada contoh itu.
export const ARKETIPE_MITRA = { BARU: 'I-04', BERKEMBANG: 'I-01', MAPAN: 'I-02' };

export const namaIndustri = (i) => `${i.nama} (Contoh)`;

// ---------------------------------------------------------------------------
// Konten pendukung
// ---------------------------------------------------------------------------
export const MATERI_PEMBEKALAN = {
  SP: [
    { judul: 'Orientasi dunia industri', teks: 'Mengenal alur kerja, peran, dan ekspektasi di tempat PKL.' },
    { judul: 'Etika profesi', teks: 'Komunikasi dengan pembimbing industri dan rekan kerja.' },
  ],
  RB: [
    { judul: 'Etika dan disiplin kerja', teks: 'Membangun sikap disiplin, kehadiran, dan tanggung jawab.' },
    { judul: 'Manajemen waktu dan tugas', teks: 'Menyusun jadwal kerja dan menepati tenggat.' },
  ],
  RK: [
    { judul: 'Penguatan kompetensi inti SKKNI', teks: 'Pendalaman unit kompetensi inti yang masih lemah atau kritis.' },
    { judul: 'Praktik terarah', teks: 'Latihan terjadwal bersama guru produktif pengampu unit.' },
  ],
  RG: [
    { judul: 'Pendampingan intensif dua sisi', teks: 'Pembinaan perilaku sekaligus penguatan kompetensi secara terjadwal.' },
    { judul: 'Etika dan disiplin kerja', teks: 'Membangun sikap disiplin, kehadiran, dan tanggung jawab.' },
    { judul: 'Penguatan kompetensi inti SKKNI', teks: 'Pendalaman unit kompetensi inti yang masih lemah atau kritis.' },
  ],
};

export const SESI_OPSI = [
  'Sesi 1 (Senin, 07.30 sampai 09.30)',
  'Sesi 2 (Rabu, 07.30 sampai 09.30)',
  'Sesi 3 (Jumat, 13.00 sampai 15.00)',
];

export const ALASAN_OVERRIDE = [
  'Kedekatan lokasi dengan tempat tinggal siswa',
  'Hubungan baik sekolah dengan industri',
  'Kondisi terkini siswa yang belum tercatat sistem',
  'Kondisi terkini industri yang belum tercatat sistem',
];

export const ALASAN_TUNDA = [
  'Menunggu remedial unit kompetensi',
  'Menunggu data tambahan',
  'Kapasitas mitra belum pasti',
];

// Batas untuk demo sisi industri. Terpisah dari BATAS_DEMO (sisi sekolah) karena
// batasnya memang berbeda: penempatan PKL sudah dirancang penuh (Layer 2), rekrut
// pasca-PKL dan bursa profil untuk industri non-mitra belum (Layer 3, proposal
// menyebutnya eksplisit sebagai fitur yang ditunda).
export const BATAS_DEMO_MITRA = {
  sudah: [
    'Pencocokan penempatan PKL berdasarkan riwayat magang dan evaluasi siswa sebelumnya, dengan tingkat keyakinan data eksplisit',
    'Kedisiplinan, pengalaman supervisor, dan kemauan membimbing dihitung dari evaluasi magang, bukan isian mandiri industri',
    'Keputusan akhir penempatan tetap di tangan Kepala Jurusan, termasuk override manual dengan alasan tercatat',
  ],
  belum: [
    'Keputusan rekrut menjadi karyawan pasca-PKL, berbasis Verified Profile dari tiga sumber (data sekolah, evaluasi industri, hasil UKK)',
    'Bursa profil untuk industri yang tidak bermitra dengan sekolah manapun',
    'Keduanya diaktifkan setelah akumulasi 50 profil terverifikasi, diproyeksikan pertengahan tahun kedua',
  ],
};

export const BATAS_DEMO = {
  sudah: [
    'Mesin skor perilaku dan kompetensi berbasis aturan, dengan gerbang unit inti dan gerbang kecukupan data',
    'Input penilaian kompetensi per unit SKKNI oleh guru produktif',
    'Pengaturan ambang per jurusan oleh Kepala Jurusan',
    'Dashboard profil empat klasifikasi',
    'Mesin pencocokan industri berbasis aturan, dengan keyakinan data dan flag riwayat',
  ],
  belum: [
    'Monitoring PKL dan peringatan dini selama penempatan',
    'Verified Profile dari tiga sumber (sekolah, industri, UKK)',
    'Dashboard lintas sekolah untuk Dinas',
    'Pemakaian di SMK dengan data satu siklus penuh; data awal masih dari pilot di sekolah non-SMK',
    'Kepatuhan formal UU PDP (dasar pemrosesan dan persetujuan wali) sedang disiapkan',
  ],
};