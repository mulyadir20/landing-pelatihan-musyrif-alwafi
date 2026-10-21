import { Phone, MapPin, Building2, ExternalLink } from 'lucide-react';
import siteConfig, { getWhatsAppUrl } from '../../config/siteConfig';
import './Footer.css';

const { contact, images } = siteConfig;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          {/* Logo */}
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
                <span>
                  Alamat:{' '}
                  <a
                    href={contact.map.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contact.location}
                  </a>
                </span>
              </li>
              <li>
                <Building2 size={16} aria-hidden="true" />
                <span>{contact.institution}</span>
              </li>
            </ul>

            {/* Peta lokasi */}
            <div className="site-footer__map">
              <iframe
                className="site-footer__map-frame"
                src={contact.map.embedUrl}
                title={`Peta lokasi ${contact.institution} — ${contact.location}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                className="site-footer__map-link"
                href={contact.map.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={16} aria-hidden="true" />
                {contact.map.label}
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {siteConfig.institution}. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
