import { BadgeCheck, BookOpen, Cookie, Coffee, UtensilsCrossed } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import SectionHeading from '../ui/SectionHeading';
import './FacilitiesSection.css';

const facilityIcons = [BadgeCheck, BookOpen, Cookie, Coffee, UtensilsCrossed];

export default function FacilitiesSection() {
  const { facilities } = siteConfig;

  return (
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
  );
}
