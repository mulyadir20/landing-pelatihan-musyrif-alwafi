import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import './FlyerProgramStudiSection.css';

const IMAGE = { src: '/images/informasi-stit/Flyer-6.png', alt: 'Program Studi STIT Al Wafi Bogor' };

export default function FlyerProgramStudiSection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="stit-section-4" className="fps-section">
      <div className="fps-section__header">
        <div className="container fps-section__header-inner">
          <p className="fps-section__eyebrow">PROGRAM STUDI</p>
          <h2 className="fps-section__title">PROGRAM STUDI</h2>
          <p className="fps-section__subtitle">Informasi program studi STIT Al Wafi Bogor.</p>
          <div className="fps-section__divider" />
        </div>
      </div>

      <div className="container fps-section__content">
        <div className="fps-frame" onClick={() => setOpen(true)}>
          <img
            src={IMAGE.src}
            alt={IMAGE.alt}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/images/flyer-musyrif.webp';
            }}
          />
          <div className="fps-frame__overlay">
            <span className="fps-frame__zoom">
              <ZoomIn size={22} aria-hidden="true" />
              Perbesar
            </span>
          </div>
        </div>
      </div>

      {open && (
        <div className="fps-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <button type="button" className="fps-lightbox__close" onClick={() => setOpen(false)} aria-label="Tutup">
            <X size={24} aria-hidden="true" />
          </button>
          <img
            src={IMAGE.src}
            alt={IMAGE.alt}
            className="fps-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
