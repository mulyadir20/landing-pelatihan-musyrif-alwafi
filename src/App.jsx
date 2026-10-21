import { lazy, Suspense } from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FacilitiesSection from './components/FacilitiesSection/FacilitiesSection';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import ContactSection from './components/ContactSection/ContactSection';
import Footer from './components/Footer/Footer';

/**
 * Section Saran & Masukan memuat iframe Google Form yang berat, jadi komponennya
 * dipisah dari bundel utama dan baru diunduh saat section-nya didekati pengunjung.
 * Dengan begitu gambar & teks di atas tetap tampil cepat.
 */
const FeedbackForm = lazy(() => import('./components/FeedbackForm/FeedbackForm'));

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Lompat ke konten utama
      </a>

      <Header />

      <main id="main-content">
        <HeroSection />
        <FacilitiesSection />
        <BenefitsSection />
        <ContactSection />
        <Suspense fallback={<div className="section section--loading" aria-busy="true" />}>
          <FeedbackForm />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
