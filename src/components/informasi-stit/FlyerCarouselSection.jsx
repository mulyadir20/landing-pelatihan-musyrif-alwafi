import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, UserPlus, FileText, ShieldCheck, PenTool, RotateCcw } from 'lucide-react';
import './FlyerCarouselSection.css';

const BIAYA_ITEMS = [
  { label: 'BIAYA REGISTRASI', price: 'Rp. 300.000' },
  { label: 'BIAYA PENGEMBANGAN INSTITUSI', price: 'Rp. 2.000.000' },
  { label: 'BIAYA UKT', price: 'Rp. 2.600.000' },
  { label: 'BIAYA PERALATAN MAHASISWA', price: 'Rp. 800.000' },
];

const ALUR_ITEMS = [
  { icon: UserPlus, label: 'Daftar online' },
  { icon: FileText, label: 'Pengisian data dan Dokumen' },
  { icon: ShieldCheck, label: 'Proses Verifikasi' },
  { icon: PenTool, label: 'Tes tulis dan wawancara' },
  { icon: RotateCcw, label: 'Daftar Ulang' },
];

const PHOTOS = [
  { src: '/images/informasi-stit/Korosel-1.png', alt: 'Galeri Kampus 1' },
  { src: '/images/informasi-stit/Korosel-2.png', alt: 'Galeri Kampus 2' },
  { src: '/images/informasi-stit/Korosel-3.png', alt: 'Galeri Kampus 3' },
  { src: '/images/informasi-stit/Korosel-4.png', alt: 'Galeri Kampus 4' },
];

export default function FlyerCarouselSection() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const go = (next) => {
    setIndex((prev) => (next + PHOTOS.length) % PHOTOS.length);
  };

  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  // Auto-play
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [isHovered]);

  return (
    <section id="stit-section-3" className="fc-section">
      <div className="fc-section__header">
        <div className="container fc-section__header-inner">
          <p className="fc-section__eyebrow">GALERI KAMPUS</p>
          <h2 className="fc-section__title">GALERI KAMPUS</h2>
          <p className="fc-section__subtitle">Suasana kampus STIT Al Wafi Bogor.</p>
          <div className="fc-section__divider" />
        </div>
      </div>

      <div className="container fc-section__content">
        <div
          className="fc-carousel"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="fc-carousel__viewport">
            <div
              className="fc-carousel__track"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {PHOTOS.map((photo, i) => (
                <div key={i} className="fc-carousel__slide">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      e.currentTarget.src = '/images/flyer-musyrif.webp';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="fc-carousel__nav fc-carousel__nav--prev" onClick={prev} aria-label="Sebelumnya">
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
          <button type="button" className="fc-carousel__nav fc-carousel__nav--next" onClick={next} aria-label="Berikutnya">
            <ChevronRight size={26} aria-hidden="true" />
          </button>

          <div className="fc-carousel__dots">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`fc-carousel__dot ${i === index ? 'fc-carousel__dot--active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container fc-biaya">
        <div className="fc-biaya__header">
          <h3 className="fc-biaya__title">BIAYA PENDIDIKAN</h3>
          <div className="fc-biaya__divider" />
        </div>
        <div className="fc-biaya__grid">
          {BIAYA_ITEMS.map((item, i) => (
            <article key={item.label} className="fc-biaya__card">
              <span className="fc-biaya__num">{i + 1}</span>
              <div className="fc-biaya__text">
                <p className="fc-biaya__label">{item.label}</p>
                <p className="fc-biaya__price">{item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="container fc-alur">
        <div className="fc-alur__header">
          <h3 className="fc-alur__title">ALUR PENDAFTARAN</h3>
          <div className="fc-alur__divider" />
        </div>
        <div className="fc-alur__steps">
          {ALUR_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="fc-alur__step-wrapper">
                <div className="fc-alur__step">
                  <div className="fc-alur__icon">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <p className="fc-alur__label">{item.label}</p>
                </div>
                {i < ALUR_ITEMS.length - 1 && <span className="fc-alur__arrow">→</span>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
