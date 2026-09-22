import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Mengatur posisi gulir saat berpindah rute:
// ada jangkar (#) -> gulir ke elemen tujuan, tanpa jangkar -> kembali ke atas.
// Fokus dipindah ke konten utama agar pembaca layar tahu halaman berganti.
export default function ScrollManager({ mainId }) {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      const frame = requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView();
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);

    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      document.getElementById(mainId)?.focus({ preventScroll: true });
    }
    return undefined;
  }, [pathname, hash, mainId]);

  return null;
}
