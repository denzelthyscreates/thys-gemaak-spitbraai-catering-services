
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getUserBookings } from '@/services/GoogleSheetsService';
import BookingCard from './BookingCard';

interface Booking {
  id?: string;
  eventType?: string;
  eventDate?: string;
  numberOfGuests?: number;
  eventLocation?: string;
  menuPackage?: string;
  submittedAt?: string;
}

const BookingsTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const userBookings = await getUserBookings();
        setBookings(userBookings || []);
        setBookingsError(null);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        setBookingsError(error.message || 'Failed to load bookings');
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Bookings</CardTitle>
        <CardDescription>
          View and manage your booking history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookingsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : bookingsError ? (
          <Alert variant="destructive">
            <AlertTitle>Error loading bookings</AlertTitle>
            <AlertDescription>{bookingsError}</AlertDescription>
          </Alert>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <ClipboardListIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-muted-foreground">
                You haven't made any bookings yet.
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link to="/" onClick={scrollToContact}>
                Make your first booking
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <BookingCard 
                key={booking.id || index} 
                booking={booking} 
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
        <Button asChild>
          <Link to="/" onClick={scrollToContact}>
            Book New Event
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingsTab;
