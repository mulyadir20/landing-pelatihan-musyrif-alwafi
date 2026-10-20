import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import EventInfo from './components/EventInfo/EventInfo';
import PricingSection from './components/PricingSection/PricingSection';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import RegistrationQR from './components/RegistrationQR/RegistrationQR';
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
        <EventInfo />
        <PricingSection />
        <BenefitsSection />
        <RegistrationQR />
        <ContactSection />
        <FeedbackForm />
      </main>

      <Footer />
    </>
  );
}
