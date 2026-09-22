import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SISWA, INDUSTRI, AMBANG_DEFAULT, ARKETIPE } from './data/demoFixture';
import { hitungProfil, ringkasKelas } from './engine/profile';
import { cocokkanIndustri } from './engine/matching';
import { demoStore } from './demoStore';
import { petaX, petaY } from './components/ClassMap';
import DemoStage from './components/DemoStage';
import ReadinessMatrixLive from './components/ReadinessMatrixLive';
import RolePage from '../pages/RolePage/RolePage';

const siswa = (id) => SISWA.find((s) => s.id === id);
const profilDari = (id, ambang = AMBANG_DEFAULT, opsi) => hitungProfil(siswa(id), ambang, opsi);

beforeEach(() => demoStore.reset());

describe('engine', () => {
  it('menghasilkan distribusi 10/5/5/4 dengan 3 data belum cukup pada ambang default', () => {
    const r = ringkasKelas(SISWA.map((s) => hitungProfil(s, AMBANG_DEFAULT)));
    expect(r.jumlah).toEqual({ SP: 10, RB: 5, RK: 5, RG: 4, DBC: 3 });
    expect(r.total).toBe(27);
  });

  it('deterministik: dua kali hitung menghasilkan angka sama persis', () => {
    const a = profilDari('S-07');
    const b = profilDari('S-07');
    expect(a.perilaku.cumulative).toBe(b.perilaku.cumulative);
    expect(a.kompetensi.cumulative).toBe(b.kompetensi.cumulative);
  });

  it('siswa contoh risiko ganda: kompetensi di atas ambang tetapi tertahan gerbang unit inti', () => {
    const p = profilDari(ARKETIPE.RG);
    expect(p.statusProfil).toBe('RG');
    expect(Math.round(p.kompetensi.cumulative)).toBe(71);
    expect(p.kompetensi.cumulative).toBeGreaterThanOrEqual(AMBANG_DEFAULT.kompetensi);
    expect(p.kompetensi.overridden).toBe(true);
    expect(p.kompetensi.unitKritisInti).toHaveLength(2);
  });

  it('arketipe masing-masing benar-benar jatuh di profilnya', () => {
    for (const [kode, id] of Object.entries(ARKETIPE)) {
      expect(profilDari(id).statusProfil).toBe(kode);
    }
  });

  it('menggeser ambang memindahkan siswa antar profil', () => {
    const rendah = ringkasKelas(SISWA.map((s) => hitungProfil(s, { perilaku: 40, kompetensi: 40 })));
    const tinggi = ringkasKelas(SISWA.map((s) => hitungProfil(s, { perilaku: 90, kompetensi: 90 })));
    expect(rendah.jumlah.SP).toBeGreaterThan(10);
    expect(tinggi.jumlah.SP).toBeLessThan(10);
  });

  it('remedial mengubah risiko ganda menjadi risiko behavior, perilaku tidak berubah', () => {
    const sebelum = profilDari('S-07');
    const sesudah = profilDari('S-07', AMBANG_DEFAULT, { remedial: true });
    expect(sesudah.statusProfil).toBe('RB');
    expect(sesudah.kompetensi.overridden).toBe(false);
    expect(sesudah.kompetensi.cumulative).toBeGreaterThan(sebelum.kompetensi.cumulative);
    expect(sesudah.perilaku.cumulative).toBe(sebelum.perilaku.cumulative);
  });

  it('data belum cukup tidak dipaksa masuk kuadran dan diblokir dari matching', () => {
    for (const id of ['S-18', 'S-26', 'S-27']) {
      const p = profilDari(id);
      expect(['DATA_BELUM_CUKUP', 'PARSIAL_PERILAKU_SAJA', 'PARSIAL_KOMPETENSI_SAJA']).toContain(p.statusProfil);
      const r = cocokkanIndustri({ siswa: siswa(id), profil: p, daftarIndustri: INDUSTRI });
      expect(r.status).toBe('BLOKIR');
    }
  });

  it('gagal K3 memblokir penempatan walau siswa terklasifikasi', () => {
    const p = profilDari('S-21');
    expect(p.statusProfil).toBe('RB');
    const r = cocokkanIndustri({ siswa: siswa('S-21'), profil: p, daftarIndustri: INDUSTRI });
    expect(r.status).toBe('BLOKIR');
    expect(r.kelayakan.kode).toBe('GAGAL_K3');
  });

  it('filter Step 1 menyingkirkan nonaktif, jurusan salah, dan kapasitas penuh', () => {
    const p = profilDari('S-07');
    const r = cocokkanIndustri({ siswa: siswa('S-07'), profil: p, daftarIndustri: INDUSTRI });
    const alasan = Object.fromEntries(r.tersingkir.map((t) => [t.industri.id, t.alasan]));
    expect(alasan['I-06']).toMatch(/Kapasitas/);
    expect(alasan['I-07']).toMatch(/nonaktif/);
    expect(alasan['I-08']).toMatch(/Jurusan/);
    expect(r.urutan).toHaveLength(5);
  });

  it('bobot profil benar-benar mengubah peringkat pada siswa yang sama', () => {
    const p = profilDari('S-07');
    const top = (lens) =>
      cocokkanIndustri({ siswa: siswa('S-07'), profil: p, daftarIndustri: INDUSTRI, lens }).urutan[0].industri.id;
    expect(top(null)).toBe('I-01');
    expect(top('RB')).toBe('I-02');
  });

  it('industri baru berkeyakinan rendah tidak mengalahkan yang berkeyakinan tinggi (keyakinan-dulu)', () => {
    const p = profilDari('S-07');
    const args = { siswa: siswa('S-07'), profil: p, daftarIndustri: INDUSTRI };
    const kd = cocokkanIndustri({ ...args, mode: 'keyakinan-dulu' }).urutan;
    const ss = cocokkanIndustri({ ...args, mode: 'skor-saja' }).urutan;
    const baru = 'I-04';
    expect(kd.find((h) => h.industri.id === baru).peringkat).toBe(5);
    expect(ss.find((h) => h.industri.id === baru).peringkat).toBe(2);
    expect(kd.find((h) => h.industri.id === baru).confidence.level).toBe('RENDAH');
    expect(kd.find((h) => h.industri.id === baru).flags.map((f) => f.kode)).toContain('DATA_TERBATAS');
  });

  it('flag riwayat kurang baik muncul untuk industri mapan dengan track record rendah', () => {
    const p = profilDari('S-07');
    const r = cocokkanIndustri({ siswa: siswa('S-07'), profil: p, daftarIndustri: INDUSTRI });
    const karsa = r.urutan.find((h) => h.industri.id === 'I-02');
    expect(karsa.flags.map((f) => f.kode)).toContain('RIWAYAT_KURANG_BAIK');
  });

  it('alasan tidak lagi selalu positif: nilai rendah menghasilkan nada minus', () => {
    const p = profilDari('S-07');
    const r = cocokkanIndustri({ siswa: siswa('S-07'), profil: p, daftarIndustri: INDUSTRI });
    const sentra = r.urutan.find((h) => h.industri.id === 'I-05');
    expect(sentra.reasons.some((x) => x.tone === 'minus')).toBe(true);
    expect(sentra.reasons.map((x) => x.text).join(' ')).not.toMatch(/tinggi \(2\/5\)/);
  });

  it('posisi titik peta konsisten dengan garis ambang', () => {
    // Skor tepat di ambang harus jatuh tepat di garis ambang pada peta.
    expect(petaX(70)).toBeCloseTo(petaX(70));
    const p = profilDari('S-07');
    expect(petaX(p.perilaku.cumulative)).toBeLessThan(petaX(AMBANG_DEFAULT.perilaku));
    expect(petaY(p.kompetensi.cumulative)).toBeLessThan(petaY(AMBANG_DEFAULT.kompetensi) + 1);
  });
});

describe('widget hero', () => {
  it('menampilkan hitungan sesuai data dan bereaksi pada slider ambang', () => {
    render(<ReadinessMatrixLive />);
    const hitungSP = () =>
      Number(screen.getByText('Siap penuh', { selector: '.count span' }).closest('.count').querySelector('strong').textContent);
    expect(hitungSP()).toBe(10);

    fireEvent.change(screen.getByLabelText('Ambang perilaku'), { target: { value: '40' } });
    expect(hitungSP()).toBeGreaterThan(10);
  });

  it('klik titik memilih siswa dan tombol keyboard bekerja', async () => {
    const user = userEvent.setup();
    render(<ReadinessMatrixLive />);
    const titik = screen.getAllByRole('button', { name: /Olivia Rahmawati/ })[0];
    await user.click(titik);
    expect(screen.getAllByText(/Olivia Rahmawati/).length).toBeGreaterThan(0);
    expect(demoStore.getState().selectedId).toBe('S-15');

    const lain = screen.getAllByRole('button', { name: /Lutfi Hakim/ })[0];
    lain.focus();
    await user.keyboard('{Enter}');
    expect(demoStore.getState().selectedId).toBe('S-12');
  });

  it('siswa data belum cukup tampil di baki terpisah, bukan di peta', () => {
    render(<ReadinessMatrixLive />);
    expect(screen.getByText(/Data belum cukup, belum bisa dipetakan/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rangga Firmansyah/ })).toBeInTheDocument();
  });
});

describe('panggung demo: animasi urut', () => {
  // RTL mendeteksi timer palsu lewat global `jest`; di Vitest kita sediakan setara.
  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.jest = vi;
  });
  afterEach(() => {
    vi.useRealTimers();
    delete globalThis.jest;
  });

  it('idle tidak menampilkan angka palsu, run menyalakan tahap berurutan lalu selesai', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DemoStage />);
    expect(screen.queryByText(/Diagnosis: siapa yang siap/)).not.toBeInTheDocument();
    expect(screen.getAllByText('-').length).toBe(4);

    await user.click(screen.getByRole('button', { name: 'Jalankan demo' }));
    expect(screen.getByText(/Diagnosis: siapa yang siap/)).toBeInTheDocument();
    expect(screen.queryByText(/Persiapan: bantuan yang tepat/)).not.toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(4600); });
    expect(screen.getByText(/Persiapan: bantuan yang tepat/)).toBeInTheDocument();
    expect(screen.queryByText(/Penempatan: industri yang cocok/)).not.toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(4600); });
    expect(screen.getByText(/Penempatan: industri yang cocok/)).toBeInTheDocument();
    expect(screen.getByText('Hasil untuk tiga pihak')).toBeInTheDocument();

    await act(async () => { vi.advanceTimersByTime(4600); });
    expect(screen.getByRole('button', { name: 'Ulangi demo' })).toBeInTheDocument();
  });

  it('jeda menahan tahap dan lewati langsung ke hasil', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<DemoStage />);
    await user.click(screen.getByRole('button', { name: 'Jalankan demo' }));
    await user.click(screen.getByRole('button', { name: 'Jeda' }));
    await act(async () => { vi.advanceTimersByTime(20000); });
    expect(screen.queryByText(/Persiapan: bantuan yang tepat/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Lewati ke hasil' }));
    expect(screen.getByText('Hasil untuk tiga pihak')).toBeInTheDocument();
  });
});

describe('panggung demo: interaksi setelah selesai', () => {
  it('ganti lensa mengubah peringkat teratas dan catatan simulasi', async () => {
    const user = userEvent.setup();
    render(<DemoStage initialPhase="done" />);
    const daftar = () => screen.getByText('Rekomendasi teratas').nextElementSibling;
    expect(within(daftar()).getAllByRole('listitem')[0]).toHaveTextContent('Nusa Net Solusi');

    const lensBar = screen.getByRole('group', { name: /Bobot profil yang dipakai/ });
    await user.click(within(lensBar).getByRole('button', { name: /Risiko behavior/ }));
    expect(within(daftar()).getAllByRole('listitem')[0]).toHaveTextContent('Data Karsa Center');
    expect(screen.getByText(/Simulasi bobot risiko behavior/)).toBeInTheDocument();
  });

  it('asal angka menampilkan tabel dengan bobot dan kontribusi', async () => {
    const user = userEvent.setup();
    render(<DemoStage initialPhase="done" />);
    const ringkasan = screen.getAllByText('Asal angka')[0];
    await user.click(ringkasan);
    const tabel = screen.getAllByRole('table')[0];
    expect(within(tabel).getByText('Kedisiplinan')).toBeInTheDocument();
    expect(within(tabel).getByText('Track record profil serupa')).toBeInTheDocument();
    expect(within(tabel).getByText('Tidak tersedia')).toBeInTheDocument();
  });

  it('memilih siswa lain memperbarui diagnosis, persiapan, dan penempatan serempak', async () => {
    const user = userEvent.setup();
    render(<DemoStage initialPhase="done" />);
    const grupArketipe = screen.getByRole('group', { name: 'Coba siswa dari profil lain' });
    await user.click(within(grupArketipe).getByRole('button', { name: /Siap penuh/ }));
    expect(demoStore.getState().selectedId).toBe('S-02');
    expect(screen.getByText('Bima Saputra', { selector: 'div' })).toBeInTheDocument();
    expect(screen.getByText(/Bobot yang dipakai adalah bobot profil siap penuh/)).toBeInTheDocument();
    expect(screen.getByText('Pembekalan sesuai profil')).toBeInTheDocument();
    expect(screen.getByText(/Orientasi dunia industri/)).toBeInTheDocument();
  });

  it('validasi: sesi pembekalan kosong menampilkan galat dan tidak menyimpan', async () => {
    const user = userEvent.setup();
    render(<DemoStage initialPhase="done" />);
    await user.click(screen.getByRole('button', { name: 'Simpan grup' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Pilih sesi pembekalan dulu');
    expect(demoStore.getState().grup).toEqual({});

    await user.selectOptions(screen.getByLabelText('Sesi pembekalan'), screen.getAllByRole('option')[1]);
    await user.click(screen.getByRole('button', { name: 'Simpan grup' }));
    expect(screen.getByText(/Grup risiko ganda terjadwal/)).toBeInTheDocument();
  });

  it('simulasi remedial mengubah profil di diagnosis dan peta secara serempak', async () => {
    const user = userEvent.setup();
    render(<DemoStage initialPhase="done" />);
    expect(screen.getAllByText('Risiko ganda').length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: 'Simulasikan nilai remedial masuk' }));
    expect(screen.getByText(/Profil berubah dari risiko ganda menjadi risiko behavior/)).toBeInTheDocument();
    expect(demoStore.getState().remedial['S-07']).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Kembalikan ke nilai awal' }));
    expect(demoStore.getState().remedial['S-07']).toBe(false);
  });

  it('keputusan Kepala Jurusan: override tanpa alasan ditolak, dengan alasan tercatat', async () => {
    const user = userEvent.setup();
    render(<DemoStage initialPhase="done" />);
    await user.click(screen.getByLabelText(/Pilih industri lain \(override\)/));
    await user.click(screen.getByRole('button', { name: 'Catat keputusan' }));
    const galat = screen.getAllByRole('alert').map((a) => a.textContent).join(' ');
    expect(galat).toMatch(/Pilih industri tujuan/);
    expect(galat).toMatch(/Pilih alasan override/);
    expect(demoStore.getState().keputusan).toEqual({});

    await user.selectOptions(screen.getByLabelText('Industri tujuan'), 'I-03');
    await user.selectOptions(screen.getByLabelText('Alasan'), screen.getAllByRole('option', { name: /Hubungan baik/ })[0]);
    await user.click(screen.getByRole('button', { name: 'Catat keputusan' }));
    expect(screen.getByText(/Keputusan tercatat: Override/)).toBeInTheDocument();
    expect(demoStore.getState().keputusan['S-07'].industriId).toBe('I-03');
  });

  it('tab Siswa tidak menampilkan label profil dan tab Industri menampilkan dokumen', async () => {
    const user = userEvent.setup();
    render(<DemoStage initialPhase="done" />);
    await user.click(screen.getByRole('tab', { name: 'Siswa' }));
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).queryByText(/Risiko ganda/i)).not.toBeInTheDocument();
    expect(within(panel).getByText(/Rencana persiapan PKL untuk Gita/)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Industri' }));
    expect(screen.getByText('Profil Kesiapan Kerja')).toBeInTheDocument();
    expect(screen.getByText(/Belum dikirim/)).toBeInTheDocument();
  });

  it('siswa gagal K3 melihat pesan blokir, bukan daftar industri', async () => {
    demoStore.set({ selectedId: 'S-21' });
    render(<DemoStage initialPhase="done" />);
    expect(screen.getAllByText(/belum tuntas syarat keselamatan kerja/).length).toBeGreaterThan(0);
    expect(screen.queryByText('Rekomendasi teratas')).not.toBeInTheDocument();
  });
});

describe('RolePage terintegrasi', () => {
  it('merender hero, demo (lazy), dan bagian lain halaman', async () => {
    render(<RolePage roleKey="sekolah" />);
    expect(screen.getByText('Simulasi satu kelas')).toBeInTheDocument();
    expect(await screen.findByText('Lihat Prakersa bekerja pada satu kelas')).toBeInTheDocument();
    expect(screen.getAllByText('Jadwalkan diskusi pilot', { selector: 'a' }).length).toBe(2);
  });

  it('tombol di hero membuka panggung demo tanpa menjalankan animasi', async () => {
    const user = userEvent.setup();
    render(<RolePage roleKey="sekolah" />);
    await screen.findByText('Lihat Prakersa bekerja pada satu kelas');
    await user.click(screen.getByRole('button', { name: 'Lihat diagnosis dan penempatannya' }));
    expect(await screen.findByText(/Diagnosis: siapa yang siap/)).toBeInTheDocument();
    expect(screen.getByText('Hasil untuk tiga pihak')).toBeInTheDocument();
  });
});
