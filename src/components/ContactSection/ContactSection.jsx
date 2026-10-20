import { MessageCircle, UserRound, Building2, MapPin, Phone } from 'lucide-react';
import siteConfig, { getWhatsAppUrl } from '../../config/siteConfig';
import SectionHeading from '../ui/SectionHeading';
import './ContactSection.css';

const { contact } = siteConfig;

const info = [
  { icon: UserRound, label: 'Kontak panitia', value: contact.person },
  {
    icon: Phone,
    label: 'Nomor WhatsApp',
    value: contact.phoneDisplay,
    href: getWhatsAppUrl(contact.whatsappMessages.default),
  },
  { icon: Building2, label: 'Institusi', value: contact.institution },
  { icon: MapPin, label: 'Lokasi kegiatan', value: contact.location },
];

export default function ContactSection() {
  return (
    <section className="section section--alt" id="kontak" aria-labelledby="kontak-title">
      <div className="container">
        <SectionHeading
          eyebrow="Butuh Bantuan?"
          title="Kontak Panitia"
          description="Hubungi panitia untuk informasi pendaftaran, kuota, dan pertanyaan lain seputar pelatihan."
          id="kontak-title"
        />

        <div className="contact">
          <ul className="contact__list" role="list">
            {info.map(({ icon: Icon, label, value, href }) => {
              const content = (
                <>
                  <span className="contact__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span className="contact__body">
                    <span className="contact__label">{label}</span>
                    <span className="contact__value">{value}</span>
                  </span>
                </>
              );

              return (
                <li className="contact__item" key={label}>
                  {href ? (
                    <a
                      className="contact__link"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="contact__link">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <aside className="contact__cta-card">
            <span className="contact__cta-icon" aria-hidden="true">
              <MessageCircle size={26} />
            </span>
            <h3 className="contact__cta-title">Ada pertanyaan sebelum mendaftar?</h3>
            <p className="contact__cta-desc">
              Kirim pesan langsung kepada panitia. Balasan mengikuti jam kerja panitia pelatihan.
            </p>
            <a
              className="btn btn--wa btn--block"
              href={getWhatsAppUrl(contact.whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Hubungi Panitia via WhatsApp
            </a>
            <p className="contact__cta-note">Nomor resmi panitia: {contact.phoneDisplay}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
