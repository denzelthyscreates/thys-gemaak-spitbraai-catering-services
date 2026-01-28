
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingFlowContainer from '../components/booking/BookingFlowContainer';
import { Toaster } from '../components/ui/toaster';
import { MenuProvider } from '../contexts/menu';
import SecurityAnnouncementBanner from '../components/SecurityAnnouncementBanner';

const Booking = () => {
  const [searchParams] = useSearchParams();
  
  // Extract menu selection from URL parameters if present
  const getInitialMenuSelection = () => {
    const menuPackage = searchParams.get('menuPackage');
    const numberOfGuests = searchParams.get('numberOfGuests');
    const totalPrice = searchParams.get('totalPrice');
    
    if (menuPackage && numberOfGuests) {
      return {
        menuPackage,
        numberOfGuests: parseInt(numberOfGuests),
        season: searchParams.get('season'),
        starters: searchParams.get('starters') || '',
        sides: searchParams.get('sides') || '',
        desserts: searchParams.get('desserts') || '',
        extras: searchParams.get('extras') || '',
        totalPrice: totalPrice ? parseInt(totalPrice) : 0,
        postalCode: searchParams.get('postalCode') || '',
        areaName: searchParams.get('areaName') || '',
        travelFee: searchParams.get('travelFee') ? parseInt(searchParams.get('travelFee')!) : null,
        eventType: searchParams.get('eventType'),
        includeCutlery: searchParams.get('includeCutlery') === 'true',
        extraSaladType: '',
        discountApplied: false
      };
    }
    return null;
  };

  const initialMenuSelection = getInitialMenuSelection();

  return (
    <MenuProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <SecurityAnnouncementBanner />
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6">
                  Book Your Spitbraai Event
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Create your perfect spitbraai experience with our menu builder and complete your booking.
                </p>
              </div>
              
              <BookingFlowContainer initialMenuSelection={initialMenuSelection} />
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </MenuProvider>
  );
};

export default Booking;
