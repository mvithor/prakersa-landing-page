import { useCallback, useState } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

// Menyimpan status "sudah ditutup" per kunci. Dipakai bilah pengumuman.
// Status dibaca saat inisialisasi agar bilah tidak berkedip bagi pengunjung yang sudah menutupnya.
export function useDismissible(storageKey) {
  const [dismissed, setDismissed] = useState(() => readStorage(storageKey, false) === true);

  const dismiss = useCallback(() => {
    setDismissed(true);
    writeStorage(storageKey, true);
  }, [storageKey]);

  return [dismissed, dismiss];
}
