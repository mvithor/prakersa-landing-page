import { useEffect, useState } from 'react';

export function useRotatingIndex(length, intervalMs = 2200) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return undefined;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [length, intervalMs]);

  return index;
}