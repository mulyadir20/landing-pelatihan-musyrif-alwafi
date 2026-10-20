import { Compass, HandHeart, Crown } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import SectionHeading from '../ui/SectionHeading';
import './BenefitsSection.css';

const benefitIcons = [Compass, HandHeart, Crown];

export default function BenefitsSection() {
  return (
    <section className="section" id="manfaat" aria-labelledby="manfaat-title">
      <div className="container">
        <SectionHeading
          eyebrow="Untuk Peserta"
          title="Manfaat Pelatihan"
          description="Tiga peran utama yang dilatih agar musyrif mampu mendampingi santri secara utuh."
          id="manfaat-title"
          align="center"
        />

        <ul className="benefits card-grid card-grid--3" role="list">
          {siteConfig.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index] ?? Compass;
            return (
              <li className="benefit" key={benefit.title}>
                <span className="benefit__icon" aria-hidden="true">
                  <Icon size={24} />
                </span>
                <h3 className="benefit__title">{benefit.title}</h3>
                <p className="benefit__desc">{benefit.description}</p>
                <span className="benefit__index" aria-hidden="true">
                  0{index + 1}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
