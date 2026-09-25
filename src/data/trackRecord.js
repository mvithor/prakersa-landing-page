import bukti1Img from '@/assets/bukti1.jpg';
import bukti2Img from '@/assets/bukti2.jpg';
import bukti3Img from '@/assets/bukti3.jpg';
import mouGowataImg from '@/assets/mougowata.jpeg';
import mouSungguminasaImg from '@/assets/mousungguminasa.jpeg';
import riset1Img from '@/assets/riset1.jpeg';
import riset2Img from '@/assets/riset2.jpeg';
import riset3Img from '@/assets/riset3.jpeg';

export const trackRecord = {
  title: 'Sejauh mana ini sudah nyata',
  lead: 'Yang sudah terjadi, kami tunjukkan. Yang belum, kami akui juga.',

  items: [
    {
      key: 'abseninaja-platform',
      kind: 'Platform · Berjalan',
      name: 'Abseninaja di 3 SMK Sulawesi Selatan',
      description:
        'Tiga SMK menjalankan Abseninaja penuh sejak Mei-Agustus 2026. Prakersa dibangun sebagai modul tambahan di atas platform yang sudah berjalan ini, bukan produk baru dari nol.',
      facts: [
        { label: 'Sejak', value: 'Mei-Agustus 2026' },
        { label: 'Sekolah', value: '3 SMK' },
        { label: 'Wilayah', value: 'Sulawesi Selatan' },
      ],
      figures: [
        { src: bukti1Img, alt: 'Tangkapan layar dashboard sekolah' },
        { src: bukti2Img, alt: 'Tangkapan layar input guru' },
        { src: bukti3Img, alt: 'Dokumentasi penggunaan di sekolah' },
      ],
    },
    {
      key: 'sga-capstone-commitment',
      kind: 'Komitmen Prakersa · Business Matching',
      name: 'SMK Hasanuddin & SMK Handayani',
      description:
        'Satu SMK Hasanuddin Makassar dan dua SMK Handayani tercatat di tahap Commitment/Implementation pada business matching capstone PIDI Digdaya.',
      facts: [
        { label: 'Tahap', value: 'Commitment/Implementation' },
        { label: 'Sekolah', value: '3 sekolah' },
        // { label: 'Sumber', value: 'Business matching capstone PIDI' },
        // { label: 'Skala kompetisi', value: '80 tim/kategori nasional' },
      ],
      // Ikuti instruksi kamu sendiri: cuma tulis "surat dukungan diterima" kalau memang sudah ada.
      // note: 'Surat dukungan formal belum kami terima, akan ditambahkan begitu ada.',
      figures: [
        { src: mouGowataImg, alt: 'Dokumentasi komitmen dengan SMK Handayani Gowata' },
        { src: mouSungguminasaImg, alt: 'Dokumentasi komitmen dengan SMK Handayani Sungguminasa' },
      ],
    },
    {
      key: 'industry-need',
      kind: 'Kebutuhan Industri · Riset',
      name: '5 dari 5 industri siap uji coba',
      description:
        'Dari 14 wawancara sekolah dan industri, lima dari lima industri usaha komputer/TI Makassar menerima siswa PKL tanpa profil sama sekali, dan bersedia mengisi evaluasi singkat di bawah 5 menit.',
      facts: [
        { label: 'Wawancara', value: '14 sekolah & industri' },
        { label: 'Industri siap uji coba', value: '5 dari 5' },
      ],
      figures: [
        { src: riset1Img, alt: 'Sesi wawancara riset kebutuhan industri secara daring' },
        { src: riset2Img, alt: 'Wawancara tatap muka dengan mitra industri' },
        { src: riset3Img, alt: 'Dokumentasi bersama staf industri mitra' },
      ],
    },
    {
      key: 'pr-coverage-abseninaja',
      kind: 'Liputan Media · Platform Abseninaja',
      name: 'MTsN 2 Pesawaran terapkan absensi online lewat Abseninaja',
      description:
        'Liputan independen Saungberita.com soal MTsN 2 Pesawaran membagikan kartu absen online AlBayan Mandawa (Abseninaja) ke siswa kelas VIII, Agustus 2026.',
      facts: [
        { label: 'Sumber', value: 'Saungberita.com' },
        { label: 'Terbit', value: '22 Agustus 2026' },
      ],
      note: 'Ini liputan soal platform Abseninaja di jenjang MTs, bukan bukti pasar Prakersa di SMK.',
      figures: [],
      externalLink: {
        label: 'Baca liputan di Saungberita.com',
        url: 'https://saungberita.com/langkah-menuju-madrasah-modern-mtsn-2-pesawaran-terapkan-absensi-online/',
        image: 'https://saungberita.com/wp-content/uploads/2026/08/1003302669_11zon-800x533.jpg',
        imageAlt: 'Pembagian kartu absen online Abseninaja di MTsN 2 Pesawaran',
        imageCredit: 'Foto: Saungberita.com',
      },
    },
    {
      key: 'not-yet',
      kind: 'Belum Ada',
      name: 'Data hasil siswa Prakersa',
      description:
        'Belum ada data penggunaan dan hasil penempatan siswa lewat Prakersa. Siklus PKL pertama, dimulai dari pilot SMK Al-Huda, akan menghasilkannya.',
      facts: [],
      figures: [],
      statusFigure: true,
    },
  ],
};