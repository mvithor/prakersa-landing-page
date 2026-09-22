import { useEffect } from 'react';
import { site } from '@/data/site';

// Mengatur judul tab per halaman.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.defaultTitle;
  }, [title]);
}
