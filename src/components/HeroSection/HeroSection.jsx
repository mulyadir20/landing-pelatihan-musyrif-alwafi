import { useCallback, useState } from 'react';
import { CalendarDays, Clock, MapPin, ArrowDown, ZoomIn, UserRound } from 'lucide-react';
import siteConfig, { getPmbUrl } from '../../config/siteConfig';
import SmartImage from '../ui/SmartImage';
import Lightbox from '../ui/Lightbox';
import './HeroSection.css';

const { images, event } = siteConfig;

export default function HeroSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const closePreview = useCallback(() => setPreviewOpen(false), []);
  const pmbUrl = getPmbUrl();

  const highlights = [
    { icon: CalendarDays, label: 'Tanggal', value: event.date },
    { icon: Clock, label: 'Waktu', value: event.time },
    { icon: MapPin, label: 'Tempat', value: event.venue },
  ];

  return (
    <section className="hero section" id="home" aria-labelledby="hero-title">
      <div className="container hero__grid">
        {/* Kolom kiri: informasi utama */}
        <div className="hero__content">
          <p className="hero__eyebrow">
            <UserRound size={16} aria-hidden="true" />
            {siteConfig.institution}
          </p>

          <h1 className="hero__title" id="hero-title">
            PELATIHAN MUSYRIF <span className="hero__title-accent">PROFESIONAL</span>
          </h1>

          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <p className="hero__desc">{siteConfig.shortDescription}</p>

          <ul className="hero__highlights" role="list">
            {highlights.map(({ icon: Icon, label, value }) => (
              <li className="hero__highlight" key={label}>
                <span className="hero__highlight-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="hero__highlight-text">
                  <span className="hero__highlight-label">{label}</span>
                  <span className="hero__highlight-value">{value}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <a
              className="btn btn--gold"
              href={pmbUrl ?? '#kontak'}
              target={pmbUrl ? '_blank' : undefined}
              rel={pmbUrl ? 'noopener noreferrer' : undefined}
            >
              {siteConfig.cta.label}
            </a>
            <a className="btn btn--ghost-light" href="#manfaat">
              <ArrowDown size={18} aria-hidden="true" />
              Lihat Detail
            </a>
          </div>
        </div>

        {/* Kolom kanan: flyer kegiatan */}
        <div className="hero__media">
          <figure className="hero__flyer">
            <SmartImage
              className="hero__flyer-frame"
              imgClassName="hero__flyer-img"
              src={images.flyer.src}
              srcSet={images.flyer.srcSet}
              sizes="(max-width: 900px) 88vw, 420px"
              alt={images.flyer.alt}
              width={images.flyer.width}
              height={images.flyer.height}
              objectFit="contain"
              loading="eager"
              decoding="async"
              fallbackLabel="Brosur belum tersedia"
              onClick={() => setPreviewOpen(true)}
            />
            <button
              type="button"
              className="hero__zoom"
              onClick={() => setPreviewOpen(true)}
              aria-label="Perbesar gambar brosur Pelatihan Musyrif Profesional"
            >
              <ZoomIn size={16} aria-hidden="true" />
              Klik untuk memperbesar
            </button>
            <figcaption className="hero__flyer-caption">
              Brosur resmi {siteConfig.eventName}
            </figcaption>
          </figure>
        </div>
      </div>

      <Lightbox
        open={previewOpen}
        onClose={closePreview}
        src={images.flyer.src}
        alt={images.flyer.alt}
        caption={`${siteConfig.eventName} — ${event.date}`}
      />
    </section>
  );
}
