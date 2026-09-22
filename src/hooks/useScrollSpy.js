import { useEffect, useRef, useState } from 'react';

// Melacak elemen mana dari sekumpulan ref yang sedang paling dekat ke tengah layar.
// Dipakai untuk menyorot node peta alur mengikuti kartu yang sedang dibaca saat scroll.
export function useScrollSpy(count) {
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);
  refs.current = Array.from({ length: count }, (_, i) => refs.current[i] ?? null);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const index = refs.current.indexOf(visible[0].target);
          if (index !== -1) setActiveIndex(index);
        }
      },
      // Pita tipis di sekitar tengah viewport: sebuah kartu dianggap "aktif"
      // saat dia melewati garis tengah layar, bukan saat cuma sedikit terlihat di tepi.
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const setRef = (index) => (node) => {
    refs.current[index] = node;
  };

  return { activeIndex, setRef };
}