// Store kecil bersama (tanpa library), lokal untuk panggung demo saja: ambang,
// siswa terpilih, dan hasil simulasi. Tidak dibaca atau ditulis oleh widget
// ReadinessMatrix situs.

import { useMemo, useSyncExternalStore } from 'react';
import { SISWA, AMBANG_DEFAULT, ARKETIPE } from './data/demoFixture';
import { hitungProfil } from './engine/profile';

const awal = () => ({
  ambang: { ...AMBANG_DEFAULT },
  selectedId: ARKETIPE.RG,
  remedial: {}, // { [siswaId]: true } simulasi nilai remedial masuk
  lens: null, // null = pakai profil siswa sendiri
  pilihan: {}, // { [siswaId]: industriId }
  keputusan: {}, // { [siswaId]: { jalur, industriId, alasan, waktu } }
  grup: {}, // { [statusProfil]: sesi } grup pembekalan tersimpan
});

let state = awal();
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const demoStore = {
  getState: () => state,
  set(patch) {
    state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
    emit();
  },
  reset() {
    state = awal();
    emit();
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const useDemoStore = () => useSyncExternalStore(demoStore.subscribe, demoStore.getState, demoStore.getState);

// Profil seluruh siswa untuk ambang dan simulasi remedial saat ini.
export function useProfiles() {
  const { ambang, remedial } = useDemoStore();
  return useMemo(
    () => SISWA.map((s) => hitungProfil(s, ambang, { remedial: Boolean(remedial[s.id]) })),
    [ambang, remedial],
  );
}