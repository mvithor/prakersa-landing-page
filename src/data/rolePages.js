import { PATHS } from '@/routes/paths';

// Halaman peran memakai satu templat (pages/RolePage). Menambah peran baru
// cukup dengan menambah entri di sini dan satu rute di routes/AppRoutes.jsx.
// Field statusBar, differentiator, showMatrix, showDemo, showIndustryDemo, metrics,
// metricsLabel itu opsional, RolePage cuma merender bagian itu kalau field-nya ada
// di data peran ini.
export const rolePages = {
  school: {
    key: 'school',
    documentTitle: 'Untuk sekolah',

    statusBar: {
      jalur: 'Jalur · Sekolah',
      // TODO Vithor: isi cuma kalau memang ada batasan kapasitas pilot nyata,
      // misalnya "Pilot tahap 1, 5 sekolah". Jangan diisi klaim urgensi kalau
      // tidak ada dasarnya, biarkan undefined sampai dikonfirmasi.
      note: undefined,
    },

    title: 'Penempatan PKL yang bisa di pertanggungjawabkan.',
    lead: 'Untuk Kepala Sekolah, Kepala Jurusan, dan guru produktif yang ingin keputusan penempatan berdiri di atas data dua tahun, bukan kesan beberapa minggu terakhir.',

    // Diringkas dari differentiators.js, bukan klaim baru, supaya hero langsung
    // menjawab "kenapa ini beda" seperti pola paragraf pembeda di SMKarier.
    differentiator:
      'Bukan skor gabungan yang sulit dijelaskan. Perilaku kerja dan kompetensi dinilai terpisah, rule-based bukan machine learning, dan keputusan akhir tetap di tangan Kepala Jurusan, bukan diserahkan penuh ke sistem.',

    showMatrix: true,
    // Panggung demo tiga tahap (Diagnosis, Persiapan, Penempatan) dari data
    // simulasi sendiri, ditaruh RolePage setelah bagian manfaat, sebelum CTA
    // penutup. Tidak terhubung ke widget ReadinessMatrix di atas.
    showDemo: true,

    metricsLabel: 'Bukti eksekusi, bukan janji',
    metrics: [
      { value: '2.000+', label: 'pengguna aktif Abseninaja sejak Januari 2026' },
      { value: '3 SMK', label: 'berjalan penuh dengan Abseninaja sejak Mei-Agustus 2026' },
      { value: '3 sekolah', label: 'di tahap Commitment/Implementation, business matching capstone PIDI' },
    ],

    painsTitle: 'Yang terjadi hari ini',
    pains: [
      'Kesiapan siswa dinilai dari pengamatan pribadi, sehingga sulit dijelaskan kepada orang tua maupun industri.',
      'Pembekalan PKL diberikan seragam, padahal kesenjangan tiap siswa berbeda.',
      'Masalah di tempat PKL baru diketahui setelah industri mengeluh atau siswa dipulangkan.',
      'Pemetaan SKKNI dibuat bersama ahli, lalu tidak pernah masuk ke penilaian harian.',
    ],
    gainsTitle: 'Yang berubah dengan Prakersa',
    gains: [
      {
        title: 'Profil per siswa sejak kelas sepuluh',
        text: 'Perilaku kerja dan kompetensi terekam terpisah dan terus diperbarui sampai masa penempatan tiba.',
      },
      {
        title: 'Ambang yang Anda tentukan sendiri',
        text: 'Kepala Jurusan mengatur ambang tiap unit kompetensi sesuai sarana, jam pelajaran, dan kebutuhan industri setempat.',
      },
      {
        title: 'Intervensi sebelum berangkat',
        text: 'Guru melihat siswa mana yang butuh materi tambahan atau pembinaan sikap kerja, selagi masih ada waktu.',
      },
      {
        title: 'Keputusan yang terdokumentasi',
        text: 'Setiap penempatan, termasuk yang menyimpang dari usulan sistem, tercatat beserta alasannya.',
      },
    ],
    stepsTitle: 'Cara memulai',
    steps: [
      {
        title: 'Ajukan demo',
        text: 'Kami menunjukkan alur lengkap memakai data contoh satu jurusan.',
      },
      {
        title: 'Petakan mata pelajaran ke SKKNI',
        text: 'Kepala Jurusan memilih unit kompetensi yang relevan, dibantu tim kami.',
      },
      {
        title: 'Guru mulai menandai penilaian',
        text: 'Penandaan unit dilakukan saat guru memasukkan nilai, tanpa formulir terpisah.',
      },
      {
        title: 'Profil terbentuk dan dipakai',
        text: 'Begitu data mencukupi, profil muncul di dasbor dan siap menjadi dasar penempatan.',
      },
    ],
    cta: {
      title: 'Bawa satu jurusan ke sesi demo.',
      text: 'Sesi berlangsung daring dan tidak mengikat.',
      action: { label: 'Ajukan demo sekolah', to: PATHS.demo },
    },
  },

  industry: {
    key: 'industry',
    documentTitle: 'Untuk industri mitra',
    title: 'Kenali siswa PKL sebelum hari pertama.',
    lead: 'Industri mitra menerima ringkasan profil kesiapan siswa yang akan datang, atas izin sekolah. Tanpa biaya.',

    // Demo sisi industri: pilih satu contoh mitra, lihat kecocokannya terhadap
    // empat profil siswa. Arah baliknya panggung demo sekolah, mesin sama, fixture
    // sama, tapi halaman ini tidak punya widget hero (tidak ada showMatrix),
    // jadi demo ini satu-satunya bagian interaktif di halaman.
    showIndustryDemo: true,

    painsTitle: 'Yang terjadi hari ini',
    pains: [
      'Siswa datang tanpa keterangan apa pun tentang kekuatan dan kelemahannya.',
      'Dua sampai enam minggu pertama habis untuk mengenali siswa, bukan melatihnya.',
      'Pembimbing lapangan menerima siswa yang kebutuhannya tidak cocok dengan cara membimbingnya.',
    ],
    gainsTitle: 'Yang Anda dapatkan',
    gains: [
      {
        title: 'Profil sebelum hari pertama',
        text: 'Ringkasan perilaku kerja dan kompetensi tiap siswa, cukup untuk menyiapkan pembagian tugas awal.',
      },
      {
        title: 'Penempatan yang memperhitungkan cara Anda membimbing',
        text: 'Siswa yang butuh pengawasan ketat diarahkan ke tempat yang memang mampu memberikannya.',
      },
      {
        title: 'Evaluasi berkala yang ringkas',
        text: 'Formulir evaluasi singkat untuk pembimbing industri sedang kami kembangkan bersama mitra pertama.',
      },
    ],
    stepsTitle: 'Cara bergabung',
    steps: [
      {
        title: 'Sampaikan minat',
        text: 'Isi formulir dan pilih peran industri. Kami menghubungkan Anda dengan sekolah mitra terdekat.',
      },
      {
        title: 'Lengkapi profil industri',
        text: 'Jurusan yang diterima, kapasitas, dan gaya supervisi di tempat Anda.',
      },
      {
        title: 'Terima profil siswa',
        text: 'Sekolah mengirim ringkasan profil sebelum siswa mulai PKL.',
      },
    ],
    cta: {
      title: 'Jadi industri mitra.',
      text: 'Tidak ada biaya untuk industri.',
      action: { label: 'Sampaikan minat', to: PATHS.demo },
    },
  },
};