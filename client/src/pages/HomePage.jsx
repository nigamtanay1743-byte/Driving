import { useEffect, useState } from 'react';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { WhyUsSection } from '../components/WhyUsSection';
import { PricingSection } from '../components/PricingSection';
import { FleetSection } from '../components/FleetSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';
import { BookingLookup } from '../components/BookingLookup';
import { WhatsAppFab } from '../components/WhatsAppButton';

export function HomePage() {
  const [lessons, setLessons] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedLessonId, setPreselectedLessonId] = useState('');

  useEffect(() => {
    document.title = 'Ganpati Driving Training School — Sidhbari, Dharamshala';
    async function load() {
      try {
        const [lessonsRes, configRes] = await Promise.all([
          api.get('/lessons'),
          api.get('/config'),
        ]);
        setLessons(lessonsRes.data.lessons || []);
        setWhatsappNumber(configRes.data.whatsappNumber || '');
      } catch {
        setLessons([]);
      }
    }
    load();
  }, []);

  function openBooking(lessonId = '') {
    setPreselectedLessonId(lessonId);
    setBookingOpen(true);
  }

  return (
    <>
      <Navbar onBookClick={() => openBooking()} />
      <main>
        <Hero onBookClick={() => openBooking()} whatsappNumber={whatsappNumber} />
        <WhyUsSection />
        <PricingSection lessons={lessons} onBookLesson={openBooking} />
        <FleetSection />
        <ReviewsSection />
        <ContactSection whatsappNumber={whatsappNumber} />
        <BookingLookup />
      </main>
      <Footer whatsappNumber={whatsappNumber} onBookClick={() => openBooking()} />
      <WhatsAppFab phoneNumber={whatsappNumber} />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        lessons={lessons}
        whatsappNumber={whatsappNumber}
        preselectedLessonId={preselectedLessonId}
      />
    </>
  );
}
