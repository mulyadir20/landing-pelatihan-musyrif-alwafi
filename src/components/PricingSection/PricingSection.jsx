import { BadgeCheck, BookOpen, Cookie, Coffee, UtensilsCrossed, Ticket } from 'lucide-react';
import siteConfig, { getPmbUrl } from '../../config/siteConfig';
import SectionHeading from '../ui/SectionHeading';
import './PricingSection.css';

const facilityIcons = [BadgeCheck, BookOpen, Cookie, Coffee, UtensilsCrossed];

export default function PricingSection() {
  const { pricing, facilities } = siteConfig;
  const pmbUrl = getPmbUrl();

  return (
    <>
      {/* Biaya Pendaftaran */}
      <section className="section" id="biaya" aria-labelledby="biaya-title">
        <div className="container">
          <SectionHeading
            eyebrow="Investasi Pelatihan"
            title="Biaya Pendaftaran"
            description="Dua pilihan paket yang bisa disesuaikan dengan kebutuhan peserta."
            id="biaya-title"
            align="center"
          />

          <div className="pricing">
            <article className="price-card price-card--featured">
              <p className="price-card__badge">Pilihan utama</p>
              <h3 className="price-card__title">Pendaftaran</h3>
              <p className="price-card__price">{pricing.registrationFee}</p>
              <p className="price-card__normal">
                <span className="price-card__normal-label">Harga normal</span>
                <s>{pricing.normalPrice}</s>
              </p>
              <ul className="price-card__points" role="list">
                <li>
                  <Ticket size={16} aria-hidden="true" /> Akses mengikuti seluruh sesi pelatihan
                </li>
                <li>
                  <Ticket size={16} aria-hidden="true" /> Fasilitas selama kegiatan berlangsung
                </li>
              </ul>
            </article>

            <article className="price-card">
              <p className="price-card__badge price-card__badge--soft">Paket lengkap</p>
              <h3 className="price-card__title">Pendaftaran + Buku</h3>
              <p className="price-card__price price-card__price--plain">{pricing.packageFee}</p>
              <ul className="price-card__points" role="list">
                <li>
                  <Ticket size={16} aria-hidden="true" /> Seluruh benefit paket pendaftaran
                </li>
                <li>
                  <Ticket size={16} aria-hidden="true" /> Termasuk buku pelatihan
                </li>
              </ul>
            </article>
          </div>

          <div className="pricing__footer">
            <p className="pricing__note">{pricing.note}</p>
            <a
              className="btn btn--navy"
              href={pmbUrl ?? '#kontak'}
              target={pmbUrl ? '_blank' : undefined}
              rel={pmbUrl ? 'noopener noreferrer' : undefined}
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section className="section section--muted" id="fasilitas" aria-labelledby="fasilitas-title">
        <div className="container">
          <SectionHeading
            eyebrow="Selama Kegiatan"
            title="Fasilitas yang Didapat"
            description="Fasilitas yang tersedia bagi peserta pelatihan sepanjang kegiatan."
            id="fasilitas-title"
            align="center"
          />

          <ul className="facilities" role="list">
            {facilities.map((facility, index) => {
              const Icon = facilityIcons[index] ?? BadgeCheck;
              return (
                <li className="facility" key={facility.name}>
                  <span className="facility__icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <h3 className="facility__name">{facility.name}</h3>
                  <p className="facility__desc">{facility.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
