export const flowVisual = {
  panelLabel: 'Alur Sistem',
  statusLabel: 'Alur Hidup',

  stages: [
    { id: 'hulu', code: 'H1', title: 'Hulu', subtitle: 'Profil Terbentuk', status: 'Berjalan', tone: 'live' },
    { id: 'jembatan', code: 'H2', title: 'Jembatan', subtitle: 'Validasi Industri', status: 'Sedang dibangun', tone: 'building' },
    { id: 'hilir', code: 'H3', title: 'Hilir', subtitle: 'Penempatan Kerja', status: 'Visi', tone: 'vision' },
  ],

  ticker: [
    'Yang mengalir sekarang: skor perilaku & kompetensi harian',
    'Yang mengalir sekarang: evaluasi pembimbing industri selama PKL',
    'Yang mengalir sekarang: rekomendasi penempatan berbasis profil',
    'Sinyal balik: hasil penempatan mengkalibrasi ulang ambang di hulu',
  ],
};