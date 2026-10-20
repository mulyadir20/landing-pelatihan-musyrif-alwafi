import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FacilitiesSection from './components/FacilitiesSection/FacilitiesSection';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import ContactSection from './components/ContactSection/ContactSection';
import FeedbackForm from './components/FeedbackForm/FeedbackForm';
import Footer from './components/Footer/Footer';

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
        <FeedbackForm />
      </main>

      <Footer />
    </>
  );
}
