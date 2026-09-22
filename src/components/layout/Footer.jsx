import { Link } from 'react-router-dom';
import { footerGroups } from '@/data/footer';
import { site } from '@/data/site';
import { PATHS } from '@/routes/paths';
import { buildWhatsAppUrl } from '@/utils/whatsapp';
import Container from '@/components/common/Container';
import Icon from '@/components/common/Icon';
import Logo from '@/components/common/Logo';
import googlePlayBadge from '@/assets/googleplay.png';
import styles from './Footer.module.css';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mobile_abseninaja&hl=en';

export default function Footer() {
  const { contact, legalEntity } = site;
  const socials = [
    contact.instagram && { label: 'Instagram', href: contact.instagram },
    contact.linkedin && { label: 'LinkedIn', href: contact.linkedin },
  ].filter(Boolean);

  const whatsappUrl = contact.whatsappNumber
    ? buildWhatsAppUrl(contact.whatsappNumber, 'Halo Tim Prakersa, saya ingin bertanya.')
    : null;

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo tone="dark" />
            <p className={styles.tagline}>{site.tagline}</p>
            <p className={styles.slogan}>{site.slogan}</p>
            <p className={styles.parent}>
              Modul di atas {site.parentPlatform}, dikembangkan oleh {site.team}.
            </p>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <ul className={styles.links}>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className={styles.groupTitle}>Hubungi kami</h2>
            <ul className={styles.links}>
              {contact.email ? (
                <li>
                  <a className={styles.contact} href={`mailto:${contact.email}`}>
                    <Icon name="mail" size={18} />
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {whatsappUrl ? (
                <li>
                  <a className={styles.contact} href={whatsappUrl} target="_blank" rel="noreferrer">
                    <Icon name="phone" size={18} />
                    WhatsApp {contact.whatsappDisplay}
                  </a>
                </li>
              ) : null}
              {socials.map((social) => (
                <li key={social.label}>
                  <a className={styles.link} href={social.href} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.groupTitle}>Aplikasi</h2>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noreferrer"
              className={styles.storeLink}
            >
              <img
                src={googlePlayBadge}
                alt="Aplikasi Abseninaja tersedia di Google Play"
                className={styles.storeBadge}
              />
            </a>
            <Link to={PATHS.privacy} className={styles.privacyLink}>
              Kebijakan privasi
            </Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {site.year} {legalEntity.name || site.team}. Hak cipta dilindungi.
          </p>
          {legalEntity.notes.length > 0 ? (
            <ul className={styles.legalNotes}>
              {legalEntity.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}