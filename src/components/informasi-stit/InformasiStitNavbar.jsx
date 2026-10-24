import { useEffect, useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import './InformasiStitNavbar.css';

const LOGO = siteConfig.images.logo;
const PMB_URL = 'https://siakad.alwafi.ac.id/register';

const NAV_ITEMS = [
  { label: 'Profil', href: '#stit-section-1' },
  { label: 'Visi & Misi', href: '#stit-section-2' },
  { label: 'Galeri Kampus', href: '#stit-section-3' },
  { label: 'Program Studi', href: '#stit-section-4' },
];

const CTA_ITEM = { label: 'Daftar Sekarang', href: PMB_URL, external: true };

export default function InformasiStitNavbar() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)');
    function onChange(event) {
      if (event.matches) setOpen(false);
    }
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="f1-header">
      <div className="container f1-header__inner">
        <a className="f1-brand" href="#stit-section-1" onClick={closeMenu}>
          <span className="f1-brand__logo">
            <img src={LOGO} alt={`Logo ${siteConfig.institution}`} width="230" height="84" />
          </span>
          <span className="f1-brand__text">
            <strong className="f1-brand__name">{siteConfig.institution}</strong>
            <span className="f1-brand__event">Sekolah Tinggi Ilmu Tarbiyah Al Wafi Bogor</span>
          </span>
        </a>

        <nav className="f1-header__nav" aria-label="Navigasi Informasi STIT">
          <div className="f1-header__desktop">
            <ul className="f1-nav" role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    className="f1-nav__link"
                    href={item.href}
                    onClick={closeMenu}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="f1-nav__cta-item">
                <a
                  className="f1-nav__cta"
                  href={CTA_ITEM.href}
                  onClick={closeMenu}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CTA_ITEM.label}
                </a>
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="f1-header__toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </nav>
      </div>

      <div id={menuId} className={`f1-mobile-menu ${open ? 'f1-mobile-menu--open' : ''}`} hidden={!open}>
        <div className="container">
          <ul className="f1-nav f1-nav--mobile" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  className="f1-nav__link"
                  href={item.href}
                  onClick={closeMenu}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="f1-nav__cta-item">
              <a
                className="f1-nav__cta f1-nav__cta--block"
                href={CTA_ITEM.href}
                onClick={closeMenu}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CTA_ITEM.label}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
