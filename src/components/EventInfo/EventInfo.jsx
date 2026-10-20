import { CalendarDays, Clock, MapPin, Navigation, Phone, Info } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import SmartImage from '../ui/SmartImage';
import SectionHeading from '../ui/SectionHeading';
import './EventInfo.css';

const { event, contact, images } = siteConfig;

const items = [
  { icon: CalendarDays, label: 'Tanggal', value: event.date },
  { icon: Clock, label: 'Waktu', value: event.time },
  { icon: MapPin, label: 'Tempat', value: event.venue },
  { icon: Navigation, label: 'Alamat', value: event.address },
  { icon: Phone, label: 'Kontak panitia', value: `${contact.person} - ${contact.phoneDisplay}` },
];

export default function EventInfo() {
  return (
    <section className="section section--alt" id="informasi" aria-labelledby="informasi-title">
      <div className="container">
        <SectionHeading
          eyebrow="Detail Kegiatan"
          title="Informasi Pelatihan"
          description="Rangkuman waktu, tempat, dan kontak pelatihan. Informasi disusun dari brosur resmi dan dapat diperbarui melalui satu berkas konfigurasi."
          id="informasi-title"
        />

        <div className="event-info">
          <ul className="event-info__list" role="list">
            {items.map(({ icon: Icon, label, value }) => (
              <li className="event-card" key={label}>
                <span className="event-card__icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <div className="event-card__body">
                  <p className="event-card__label">{label}</p>
                  <p className="event-card__value">{value}</p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="event-info__photo">
            <figure className="photo-card">
              <SmartImage
                className="photo-card__frame"
                imgClassName="photo-card__img"
                src={images.speakerPhoto.src}
                alt={images.speakerPhoto.alt}
                width={images.speakerPhoto.width}
                height={images.speakerPhoto.height}
                objectFit="cover"
                ratio="4 / 5"
                loading="lazy"
                fallbackLabel="Foto belum tersedia"
              />
              <figcaption className="photo-card__caption">
                <Info size={15} aria-hidden="true" />
                <span>
                  Foto representatif — siap diganti dengan foto pembicara, musyrif, atau peserta
                  kegiatan melalui berkas konfigurasi.
                </span>
              </figcaption>
            </figure>
          </aside>
        </div>

        <p className="event-info__note">{event.note}</p>
      </div>
    </section>
  );
}
