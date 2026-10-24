import { useEffect, useState } from 'react';
import { getWhatsAppNumber, lessonPackages } from '../config/business';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { WhyUsSection } from '../components/WhyUsSection';
import { PricingSection } from '../components/PricingSection';
import { FleetSection } from '../components/FleetSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { BookingModal } from '../components/BookingModal';
import { WhatsAppFab } from '../components/WhatsAppButton';

export function HomePage() {
  const whatsappNumber = getWhatsAppNumber();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedLessonId, setPreselectedLessonId] = useState('');

  useEffect(() => {
    document.title = 'Ganpati Driving Training School — Sidhbari, Dharamshala';
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
        <PricingSection lessons={lessonPackages} onBookLesson={openBooking} />
        <FleetSection onBookClick={() => openBooking()} />
        <ReviewsSection />
        <ContactSection whatsappNumber={whatsappNumber} />
      </main>
      <Footer whatsappNumber={whatsappNumber} onBookClick={() => openBooking()} />
      <WhatsAppFab phoneNumber={whatsappNumber} />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        lessons={lessonPackages}
        whatsappNumber={whatsappNumber}
        preselectedLessonId={preselectedLessonId}
      />
    </>
  );
}
