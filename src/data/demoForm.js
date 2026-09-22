import { PATHS } from '@/routes/paths';

export const demoPage = {
  documentTitle: 'Ajukan demo',
  title: 'Ajukan demo',
  lead: 'Isi data di bawah. Kami menghubungi Anda lewat WhatsApp atau email untuk menentukan jadwal.',
  asideTitle: 'Yang terjadi setelah Anda mengirim',
  asideSteps: [
    'Kami menghubungi Anda untuk menyepakati jadwal.',
    'Sesi demo daring memakai data contoh satu jurusan.',
    'Bila cocok, kita bahas langkah pilot untuk sekolah Anda.',
  ],
  submitLabel: 'Kirim permintaan demo',
  submittingLabel: 'Membuka WhatsApp',
  successTitle: 'WhatsApp sudah terbuka',
  successText: 'Tekan kirim di WhatsApp untuk menyelesaikan permintaan demo Anda.',
  successAction: { label: 'Kembali ke beranda', to: PATHS.home },
  errorText:
    'WhatsApp tidak bisa dibuka otomatis. Periksa apakah browser Anda memblokir jendela pop-up, lalu coba lagi.',
  consentLabel:
    'Saya setuju data di formulir ini dipakai untuk menghubungi saya terkait demo SGA.',
  consentError: 'Centang persetujuan agar kami boleh menghubungi Anda.',
  privacyLink: { label: 'Kebijakan privasi', to: PATHS.privacy },
  // TODO Vithor: ganti dengan nomor WhatsApp tujuan. Format kode negara,
  // tanpa tanda + dan tanpa angka 0 di depan, misalnya '6281234567890'.
  whatsappNumber: '6289506310124',
};

export const roleOptions = [
  'Kepala Sekolah',
  'Wakil Kepala Sekolah',
  'Kepala Jurusan',
  'Guru Produktif',
  'Perwakilan Industri',
  'Lainnya',
];

// Urutan di sini menentukan urutan kolom di formulir.
export const demoFields = [
  { name: 'fullName', label: 'Nama lengkap', type: 'text', autoComplete: 'name', required: true },
  { name: 'role', label: 'Peran', type: 'select', options: roleOptions, required: true },
  {
    name: 'organization',
    label: 'Nama sekolah atau perusahaan',
    type: 'text',
    autoComplete: 'organization',
    required: true,
  },
  { name: 'city', label: 'Kota atau kabupaten', type: 'text', autoComplete: 'address-level2', required: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  {
    name: 'whatsapp',
    label: 'Nomor WhatsApp',
    type: 'tel',
    autoComplete: 'tel',
    required: true,
    hint: 'Contoh: 081234567890',
  },
  {
    name: 'message',
    label: 'Hal yang ingin dibahas',
    type: 'textarea',
    required: false,
    hint: 'Opsional. Misalnya jurusan yang ingin didahulukan.',
  },
];