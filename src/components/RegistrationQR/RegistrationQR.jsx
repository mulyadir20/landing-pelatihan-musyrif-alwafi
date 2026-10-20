import { QrCode, ShieldCheck } from 'lucide-react';
import siteConfig, { getPmbUrl } from '../../config/siteConfig';
import SmartImage from '../ui/SmartImage';
import SectionHeading from '../ui/SectionHeading';
import './RegistrationQR.css';

const { images } = siteConfig;

const slots = [
  {
    key: 'registration',
    label: 'Barcode Pendaftaran',
    hint: 'Pindai untuk membuka halaman atau formulir pendaftaran.',
    image: images.qrRegistration,
  },
  {
    key: 'information',
    label: 'Barcode Informasi',
    hint: 'Pindai untuk informasi tambahan terkait pelatihan.',
    image: images.qrInformation,
  },
];

export default function RegistrationQR() {
  const pmbUrl = getPmbUrl();

  return (
    <section className="section qr-section" id="daftar" aria-labelledby="daftar-title">
      <div className="container">
        <SectionHeading
          eyebrow="Ambil Bagian"
          title="Pendaftaran dan Informasi Pelatihan"
          description="Dua barcode tersedia untuk memudahkan pendaftaran dan akses informasi pelatihan."
          id="daftar-title"
          align="center"
        />

        <div className="qr-grid">
          {slots.map(({ key, label, hint, image }) => (
            <article className="qr-card" key={key}>
              <h3 className="qr-card__label">{label}</h3>
              <div className="qr-card__frame">
                <SmartImage
                  className="qr-card__image"
                  imgClassName="qr-card__img"
                  src={image.src}
                  alt={image.alt}
                  objectFit="contain"
                  width={640}
                  height={640}
                  loading="lazy"
                  fallbackLabel="Gambar QR belum tersedia"
                />
              </div>
              <p className="qr-card__hint">{hint}</p>
            </article>
          ))}
        </div>

        <div className="qr-section__cta">
          <a
            className="btn btn--gold"
            href={pmbUrl ?? '#kontak'}
            target={pmbUrl ? '_blank' : undefined}
            rel={pmbUrl ? 'noopener noreferrer' : undefined}
          >
            <QrCode size={18} aria-hidden="true" />
            {siteConfig.cta.label}
          </a>
          <p className="qr-section__note">
            <ShieldCheck size={15} aria-hidden="true" />
            <span>
              Gambar QR dapat diganti oleh panitia melalui berkas di folder <code>public/images</code>{' '}
              tanpa mengubah tata letak halaman.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
