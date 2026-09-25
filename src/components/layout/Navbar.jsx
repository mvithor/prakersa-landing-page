import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { mainNav, navCta } from '@/data/navigation';
import { PATHS } from '@/routes/paths';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import Icon from '@/components/common/Icon';
import Logo from '@/components/common/Logo';
import styles from './Navbar.module.css';

// Tautan ke jangkar (#) memakai Link biasa. Tautan ke halaman memakai NavLink
// agar halaman aktif mendapat aria-current dan gaya aktif.
function NavItem({ item, className, activeClassName }) {
  if (item.to.includes('#')) {
    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    );
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => cn(className, isActive && activeClassName)}
    >
      {item.label}
    </NavLink>
  );
}

export default function Navbar() {
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const menuId = useId();

  // Tutup menu seluler setiap kali pengguna berpindah halaman atau jangkar.
  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  // Tombol Escape menutup menu seluler.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <Container className={styles.inner}>
        <Link to={PATHS.home} className={styles.brand} aria-label="Skill Gap Advisor, ke beranda">
          <Logo showWordmark={false} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navigasi utama">
          <ul className={styles.list}>
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavItem item={item} className={styles.link} activeClassName={styles.active} />
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button to={navCta.to} className={styles.cta}>
            {navCta.label}
          </Button>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((current) => !current)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
            <span className={styles.toggleLabel}>{open ? 'Tutup menu' : 'Buka menu'}</span>
          </button>
        </div>
      </Container>

      <div id={menuId} className={styles.mobilePanel} hidden={!open}>
        <Container>
          <nav aria-label="Navigasi seluler">
            <ul className={styles.mobileList}>
              {mainNav.map((item) => (
                <li key={item.to}>
                  <NavItem
                    item={item}
                    className={styles.mobileLink}
                    activeClassName={styles.active}
                  />
                </li>
              ))}
            </ul>
          </nav>
          <Button to={navCta.to} size="lg" fullWidth>
            {navCta.label}
          </Button>
        </Container>
      </div>
    </header>
  );
}