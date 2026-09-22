import { Outlet } from 'react-router-dom';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import ScrollManager from '@/components/layout/ScrollManager';
import ScrollToTop from '@/components/layout/ScrollToTop';
import SkipLink from '@/components/layout/SkipLink';
import styles from './MainLayout.module.css';

const MAIN_ID = 'konten';

// Kerangka yang membungkus semua halaman: pengumuman, navigasi, konten, footer.
export default function MainLayout() {
  return (
    <>
      <SkipLink targetId={MAIN_ID} />
      <AnnouncementBar />
      <Navbar />
      <main id={MAIN_ID} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <ScrollManager mainId={MAIN_ID} />
    </>
  );
}
