// PERINGATAN: ini rancangan lanjutan dari kerangka Anda, BUKAN kebijakan privasi
// yang berlaku. Nama dan alamat badan hukum sudah diisi dari SK Pengesahan
// Kemenkumham AHU-A123697.AH.01.30.Tahun 2026 tanggal 19 September 2026. Fakta
// lain yang belum ada (petugas pelindungan data, lokasi hosting, masa retensi,
// saluran kontak) TIDAK dikarang di sini, lihat belumDiisi tiap bagian.
// Sebelum ditayangkan, seluruh isi wajib ditinjau penasihat hukum dengan mengacu
// pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) dan
// peraturan pelaksananya. Nomor pasal dicantumkan di komentar supaya bisa
// diverifikasi langsung terhadap teks undang-undang, bukan dipercaya begitu saja.

const NAMA_BADAN_HUKUM = 'WIYATA KOMPETENSIA TEKNOLOGI (Perseroan Perorangan)';
// Alamat terdaftar di SK pendirian. Ini alamat rumah di Pringsewu, bukan kantor
// terpisah, karena badan hukumnya usaha mikro perorangan. Ganti ke alamat
// korespondensi lain kalau tidak ingin alamat ini tampil di halaman publik.
const ALAMAT_BADAN_HUKUM =
  'Jl. Pendidikan, Gang Makam, RT 007, RW 003, Wonodadi Utara, Gading Rejo, Kabupaten Pringsewu, Lampung 35372';

export const privacyPage = {
  documentTitle: 'Kebijakan privasi',
  title: 'Kebijakan privasi',
  lastReviewed: null, // [ISI] tanggal terakhir ditinjau penasihat hukum, isi setelah tinjauan pertama selesai
  draftNotice:
    'Draf. Halaman ini belum berlaku sebagai kebijakan privasi dan belum ditinjau penasihat hukum. Jangan ditayangkan, jangan dijadikan dasar persetujuan wali atau pengguna, sampai statusnya diubah setelah tinjauan hukum selesai.',

  sections: [
    {
      id: 'pengendali',
      heading: 'Siapa pengendali data',
      body: [
        // Pasal 1 angka 4: Pengendali Data Pribadi adalah pihak yang menentukan
        // tujuan dan melakukan kendali pemrosesan Data Pribadi.
        `${NAMA_BADAN_HUKUM}, beralamat di ${ALAMAT_BADAN_HUKUM}, adalah Prosesor Data Pribadi yang menyediakan dan mengoperasikan sistem Prakersa/Skill Gap Advisor (SGA) atas instruksi sekolah.`,
        // Relasi sekolah-platform ini asumsi kerja (pola paling umum dipakai
        // penyedia sistem informasi sekolah), bukan kesimpulan hukum final.
        // Statusnya dilacak di belumDiisi, bukan dihedge kalimat per kalimat.
        'Sekolah pengguna Prakersa berperan sebagai Pengendali Data Pribadi untuk data siswa, guru, dan orang tua/wali di sekolah tersebut, karena sekolah menentukan tujuan pengumpulan data ini (penilaian kesiapan PKL) dan punya hubungan langsung dengan siswa serta wali.',
        // Pasal 53 ayat (1): Pengendali dan Prosesor Data Pribadi WAJIB menunjuk
        // pejabat atau petugas yang melaksanakan fungsi pelindungan data pribadi.
        'Sesuai kewajiban penunjukan petugas pelindungan data (Pasal 53 UU PDP), pertanyaan dan permohonan terkait data pribadi pada sistem ini dapat diajukan kepada petugas pelindungan data pribadi kami. Nama dan saluran kontaknya dicantumkan di halaman ini sebelum kebijakan ini berlaku.',
      ],
      belumDiisi: [
        'Konfirmasi model pengendali/prosesor dengan penasihat hukum (kalau ternyata pengendali bersama, bagian ini perlu ditulis ulang, bukan sekadar diedit sebagiannya)',
        'Nama, jabatan, dan kontak petugas pelindungan data pribadi',
      ],
    },

    {
      id: 'data-dikumpulkan',
      heading: 'Data yang dikumpulkan',
      body: [
        // Pasal 4: Data Pribadi Umum vs Data Pribadi Spesifik. Karena mayoritas
        // siswa SMK berusia di bawah 18 tahun, seluruh data mereka masuk kategori
        // spesifik lewat status "data anak", terlepas dari jenis datanya.
        'Karena sebagian besar siswa pengguna sistem ini berusia di bawah 18 tahun, SELURUH data yang berkaitan dengan siswa diperlakukan sebagai Data Pribadi Spesifik (Pasal 4 UU PDP) karena statusnya sebagai data anak, bukan karena jenis datanya. Ini menentukan seluruh bagian kebijakan ini, bukan cuma bagian ini.',
        'Data perilaku kerja: rekaman bulanan kehadiran, ketepatan pengerjaan tugas, kepatuhan prosedur perizinan, dan catatan sikap kerja dari guru atau wali kelas, dihimpun menjadi skor perilaku kumulatif.',
        'Data kompetensi: nilai per unit kompetensi SKKNI yang diinput guru produktif, termasuk status setiap unit (memenuhi, lemah, atau kritis) dan riwayatnya antar semester.',
        'Data evaluasi magang: penilaian dari pembimbing industri terhadap siswa yang sedang atau pernah PKL di tempat itu. Rincian pertanyaan pada formulir evaluasi ini dijelaskan terpisah saat formulirnya aktif digunakan.',
        'Data akun staf: nama, peran (guru, Kepala Jurusan, kepala sekolah), dan aktivitas login guru, Kepala Jurusan, dan kepala sekolah pengguna sistem. Ini bukan data anak, tapi tetap Data Pribadi Umum yang dilindungi UU PDP.',
        'Data mitra industri: nama penanggung jawab, kontak, kapasitas magang, unit SKKNI yang bisa dilatih di tempat itu, dan riwayat evaluasi magang yang terkumpul dari waktu ke waktu.',
        'Data formulir situs: nama, email, nomor WhatsApp, nama sekolah atau industri, dan peran yang dipilih, dari siapa pun yang mengisi formulir ajukan demo atau sampaikan minat di situs ini. Ini data pengunjung situs, bukan data siswa.',
      ],
      belumDiisi: [
        'Status aktif/belum aktif formulir evaluasi magang dari pembimbing industri, dan field persisnya',
        'Apakah ada data lain yang terkumpul otomatis dari situs (cookie, analitik) yang belum tercantum di sini',
      ],
    },

    {
      id: 'tujuan-dasar',
      heading: 'Tujuan dan dasar pemrosesan',
      body: [
        // Pasal 25: pemrosesan data anak WAJIB persetujuan orang tua/wali, di luar
        // dan di atas enam dasar pemrosesan umum di Pasal 20.
        'Untuk seluruh data siswa, dasar pemrosesannya adalah persetujuan tertulis atau terekam dari orang tua atau wali sah (Pasal 25 UU PDP), diberikan sebelum data mulai dikumpulkan, bukan setelahnya, dan dapat ditarik kapan pun oleh orang tua/wali. Mekanisme perolehan persetujuan ini dijelaskan terpisah oleh masing-masing sekolah sesuai prosedur pendaftarannya.',
        'Tujuan pemrosesan data siswa terbatas pada: menyusun profil kesiapan kerja dua dimensi (perilaku dan kompetensi), merekomendasikan pembinaan atau penguatan sebelum PKL, dan mencocokkan penempatan PKL dengan industri mitra. Data tidak diproses untuk tujuan lain di luar ini tanpa persetujuan baru (prinsip pembatasan tujuan, Pasal 20).',
        'Untuk data akun staf dan data mitra industri, dasar pemrosesannya adalah pelaksanaan kontrak atau hubungan kerja sama dengan sekolah/institusi, sesuai Pasal 20 ayat (2).',
        'Untuk data formulir situs, dasar pemrosesannya adalah persetujuan eksplisit saat formulir dikirim, semata untuk menindaklanjuti permintaan demo atau minat kemitraan.',
        // Fitur rekrut pasca-PKL dan bursa profil untuk industri non-mitra (Layer 3
        // di roadmap) BELUM aktif. Kalau diaktifkan nanti, itu tujuan pemrosesan
        // BARU, bukan perluasan diam-diam dari tujuan yang sudah disetujui.
        'Sistem ini BELUM memakai data siswa untuk keputusan rekrut pasca-PKL atau untuk dicocokkan dengan industri yang tidak bermitra dengan sekolah (talent discovery). Kalau fitur ini diaktifkan di masa depan, itu tujuan pemrosesan baru dan akan memerlukan persetujuan terpisah dari orang tua/wali serta siswa yang sudah cukup umur, bukan otomatis berlaku dari persetujuan yang sudah ada.',
      ],
      belumDiisi: [
        'Mekanisme dan bukti perolehan persetujuan wali (formulir cetak, digital, atau keduanya) per sekolah',
        'Dasar pemrosesan spesifik untuk data staf dan mitra industri, dikonfirmasi penasihat hukum',
      ],
    },

    {
      id: 'akses',
      heading: 'Siapa yang dapat mengakses',
      body: [
        'Akses ke data siswa dibatasi berdasarkan peran, mengikuti struktur yang sama seperti sistem penilaiannya sendiri, bukan akses terbuka lintas peran.',
        'Guru produktif melihat nilai unit SKKNI yang mereka ampu untuk siswa di kelas yang mereka ajar.',
        'Kepala Jurusan melihat profil lengkap seluruh siswa di jurusannya, termasuk hasil pencocokan industri, dan berwenang membuat atau mengubah keputusan penempatan.',
        'Kepala sekolah melihat ringkasan agregat tingkat jurusan atau kelas, bukan data individual tiap siswa, kecuali diperlukan untuk keperluan administratif tertentu.',
        'Industri mitra menerima ringkasan profil kesiapan HANYA untuk siswa yang ditempatkan di tempat mereka, dan hanya setelah Kepala Jurusan menyetujui penempatan itu. Industri tidak pernah melihat data siswa lain di luar yang ditempatkan padanya.',
        `${NAMA_BADAN_HUKUM} memiliki akses teknis terbatas untuk pemeliharaan dan perbaikan sistem, diatur lewat kontrol akses internal.`,
      ],
      belumDiisi: [
        'Cakupan pasti akses kepala sekolah',
        'Kebijakan akses internal staf teknis penyedia sistem (siapa punya akses apa, dan bagaimana dicatat)',
      ],
    },

    {
      id: 'simpan-keamanan',
      heading: 'Penyimpanan dan keamanan',
      body: [
        'Data disimpan pada penyedia hosting yang dipilih berdasarkan standar keamanan yang berlaku. Lokasi hosting dicantumkan di halaman ini sebelum kebijakan ini berlaku; kalau lokasinya di luar Indonesia, ketentuan transfer data lintas batas di Pasal 44 UU PDP berlaku dan ditinjau tersendiri.',
        'Data siswa disimpan selama siswa aktif terdaftar di sekolah, dan dihapus atau dimusnahkan setelah masa retensi berakhir, kecuali ada permintaan penghapusan lebih awal dari wali atau ketentuan hukum lain yang mewajibkan penyimpanan lebih lama. Jangka waktu pasti masa retensi dicantumkan di halaman ini sebelum kebijakan ini berlaku.',
        'Akses ke data dikontrol berdasarkan peran seperti diuraikan di bagian sebelumnya. Mekanisme keamanan teknis lain (enkripsi, kebijakan kata sandi, log akses) dicantumkan di halaman ini sesuai yang benar-benar diterapkan, bukan ditulis sebagai daftar standar industri secara umum.',
        // Pasal 46: kewajiban notifikasi 3x24 jam, ke SUBJEK DATA dan ke LEMBAGA
        // PDP, bukan cuma salah satu.
        'Kalau terjadi kegagalan pelindungan data (data bocor, diakses pihak tak berwenang, atau hilang), kami wajib memberitahukan secara tertulis paling lambat 3x24 jam kepada subjek data yang terdampak (untuk siswa, kepada orang tua/wali) dan kepada Lembaga Pelindungan Data Pribadi (Pasal 46 UU PDP), disertai langkah mitigasi yang diambil.',
      ],
      belumDiisi: [
        'Lokasi dan penyedia hosting',
        'Masa retensi data per kategori (siswa aktif, siswa lulus, staf, mitra industri)',
        'Daftar mekanisme keamanan teknis yang benar-benar diterapkan (jangan diisi kalau belum benar-benar diterapkan)',
      ],
    },

    {
      id: 'hak-subjek',
      heading: 'Hak subjek data',
      body: [
        // Tujuh hak eksplisit di UU PDP. Untuk anak, hak ini dijalankan oleh wali,
        // bukan siswa sendiri, mengikuti logika Pasal 25 bahwa persetujuannya pun
        // ada di wali.
        'Sesuai UU PDP, setiap subjek data punya tujuh hak: hak atas informasi pemrosesan, hak akses, hak perbaikan, hak penghapusan, hak pembatasan pemrosesan, hak keberatan, hak portabilitas data, dan hak menarik persetujuan. Untuk siswa di bawah umur, hak-hak ini diajukan dan dijalankan oleh orang tua atau wali sah, bukan oleh siswa secara langsung.',
        'Setiap permohonan menjalankan hak ini kami tanggapi paling lambat 3x24 jam sejak diterima, sesuai ketentuan UU PDP. Untuk permintaan yang kompleks, kami akan memberi tahu perkiraan waktu penyelesaian dalam jangka waktu yang sama.',
        'Permohonan diajukan melalui petugas pelindungan data pribadi kami, dengan saluran kontaknya dicantumkan di halaman ini sebelum kebijakan ini berlaku. Tidak ada biaya untuk permohonan yang wajar; kami berhak mengenakan biaya wajar untuk permohonan yang berulang atau jelas tidak berdasar.',
        'Penarikan persetujuan tidak menghentikan pemrosesan yang sudah sah dilakukan sebelum penarikan, tapi menghentikan pemrosesan lebih lanjut paling lambat 3x24 jam sejak permintaan diterima.',
      ],
      belumDiisi: ['Saluran resmi untuk mengajukan permohonan hak subjek data'],
    },

    {
      id: 'perubahan-kontak',
      heading: 'Perubahan kebijakan dan kontak',
      body: [
        'Kalau ada perubahan pada informasi yang sebelumnya disampaikan saat persetujuan diperoleh (jenis data, tujuan, atau pihak yang mengakses), kami memberitahukan perubahan itu SEBELUM perubahan berlaku, bukan sesudahnya, dan meminta persetujuan baru bila perubahan itu memperluas tujuan pemrosesan.',
        'Pertanyaan, keluhan, atau permohonan terkait data pribadi dapat diajukan melalui saluran kontak resmi yang dicantumkan di halaman ini sebelum kebijakan ini berlaku. Kalau keluhan tidak terselesaikan, subjek data berhak mengajukannya ke Lembaga Pelindungan Data Pribadi sesuai mekanisme yang berlaku.',
      ],
      belumDiisi: ['Alamat email atau kontak resmi untuk pertanyaan dan keluhan'],
    },
  ],

  footerNotice:
    'Kebijakan ini dirancang mengacu pada UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, tapi belum ditinjau penasihat hukum dan belum berlaku.',
};