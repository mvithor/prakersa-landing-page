import { useEffect, useState } from 'react';

// True satu frame setelah komponen terpasang. Dipakai untuk memicu
// transisi masuk (misalnya titik siswa di matriks yang menyebar ke kuadrannya).
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let second;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, []);

  return mounted;
}
