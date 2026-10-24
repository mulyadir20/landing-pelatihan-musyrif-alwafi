import InformasiStitNavbar from '../../components/informasi-stit/InformasiStitNavbar';
import Flyer1Section from '../../components/informasi-stit/Flyer1Section';
import Flyer2Section from '../../components/informasi-stit/Flyer2Section';
import FlyerCarouselSection from '../../components/informasi-stit/FlyerCarouselSection';
import FlyerProgramStudiSection from '../../components/informasi-stit/FlyerProgramStudiSection';
import InformasiStitFooter from '../../components/informasi-stit/InformasiStitFooter';
import './InformasiStitPage.css';

export default function InformasiStitPage() {
  return (
    <>
      <a className="skip-link" href="#stit-section-1">
        Lompat ke konten utama
      </a>
      <InformasiStitNavbar />
      <main id="stit-main">
        <Flyer1Section />
        <Flyer2Section />
        <FlyerCarouselSection />
        <FlyerProgramStudiSection />
      </main>
      <InformasiStitFooter />
    </>
  );
}
