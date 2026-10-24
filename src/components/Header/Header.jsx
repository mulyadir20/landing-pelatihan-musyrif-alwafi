import { useEffect, useId, useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import siteConfig, { getNavHref, getWhatsAppUrl } from '../../config/siteConfig';
import './Header.css';

const LOGO = siteConfig.images.logo;

function NavLinks({ onNavigate, variant = 'desktop' }) {
  return (
    <ul className={`nav nav--${variant}`} role="list">
      {siteConfig.navigation.map((item) => {
        const href = getNavHref(item.href);
        const external = href.startsWith('http');

        return (
          <li key={item.label}>
            <a
              className="nav__link"
              href={href}
              onClick={onNavigate}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
            >
              {item.label}
              {item.badge && <span className="nav__link-note">{item.badge}</span>}
            </a>
          </li>
        );
      })}
      <li className="nav__cta-item">
        <a
          className="btn btn--gold nav__cta nav__cta--info"
          href="/informasi-stit"
          onClick={onNavigate}
        >
          INFORMASI STIT
          <ChevronRight size={18} aria-hidden="true" />
        </a>
      </li>
    </ul>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Tutup menu mobile saat berpindah ke ukuran desktop
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)');
    function onChange(event) {
      if (event.matches) setOpen(false);
    }
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Kunci scroll halaman saat menu terbuka
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Tutup menu dengan tombol Escape
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand__logo">
            <img src={LOGO} alt={`Logo ${siteConfig.institution}`} width="230" height="84" />
          </span>
          <span className="brand__text">
            <strong className="brand__name">{siteConfig.institution}</strong>
            <span className="brand__event">{siteConfig.eventName}</span>
          </span>
        </a>

        <nav className="site-header__nav" aria-label="Navigasi utama">
          <div className="site-header__desktop">
            <NavLinks />
          </div>

          <button
            type="button"
            className="site-header__toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </nav>
      </div>

      {/* Menu mobile */}
      <div id={menuId} className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`} hidden={!open}>
        <div className="container">
          <NavLinks variant="mobile" onNavigate={closeMenu} />
          <a
            className="btn btn--wa mobile-menu__wa"
            href={getWhatsAppUrl(siteConfig.contact.whatsappMessages.register)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Daftar via WhatsApp Panitia
          </a>
        </div>
      </div>
    </header>
  );
}
