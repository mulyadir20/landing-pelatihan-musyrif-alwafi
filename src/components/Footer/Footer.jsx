import { Phone, MapPin, Building2 } from 'lucide-react';
import siteConfig, { getNavHref, getWhatsAppUrl } from '../../config/siteConfig';
import './Footer.css';

const { contact, images } = siteConfig;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          {/* Identitas */}
          <div className="site-footer__brand">
            <img
              className="site-footer__logo"
              src={images.logo}
              alt={`Logo ${siteConfig.institution}`}
              width="230"
              height="84"
              loading="lazy"
            />
            <p className="site-footer__institution">{siteConfig.institution}</p>
            <p className="site-footer__tagline">
              {siteConfig.eventName} — Membentuk Murabbi, Pembina, dan Pemimpin Santri.
            </p>
          </div>

          {/* Kontak */}
          <div className="site-footer__col">
            <h2 className="site-footer__heading">Kontak</h2>
            <ul className="site-footer__list" role="list">
              <li>
                <Phone size={16} aria-hidden="true" />
                <span>
                  Kontak panitia:{' '}
                  <a
                    href={getWhatsAppUrl(contact.whatsappMessages.default)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.phoneDisplay}
                  </a>
                </span>
              </li>
              <li>
                <MapPin size={16} aria-hidden="true" />
                <span>{contact.location}</span>
              </li>
              <li>
                <Building2 size={16} aria-hidden="true" />
                <span>{contact.institution}</span>
              </li>
            </ul>
          </div>

          {/* Navigasi */}
          <div className="site-footer__col">
            <h2 className="site-footer__heading">Navigasi</h2>
            <ul className="site-footer__links" role="list">
              {siteConfig.navigation.map((item) => {
                const href = getNavHref(item.href);
                const external = href.startsWith('http');
                return (
                  <li key={item.label}>
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {siteConfig.institution}. Seluruh hak cipta dilindungi.
          </p>
          <p className="site-footer__note">Pelatihan Musyrif Profesional — {contact.location}</p>
        </div>
      </div>
    </footer>
  );
}
