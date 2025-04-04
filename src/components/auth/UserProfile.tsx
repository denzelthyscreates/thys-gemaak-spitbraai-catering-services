
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getUserBookings } from '@/services/GoogleSheetsService';
import { CalendarIcon, ClipboardListIcon, InfoIcon, Loader2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';

const UserProfile = () => {
  const { user, signOut, loading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setBookingsLoading(true);
        const userBookings = await getUserBookings();
        setBookings(userBookings || []);
        setBookingsError(null);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookingsError(error.message || 'Failed to load bookings');
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-2 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="bookings" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          My Bookings
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Account ID</p>
              <p className="text-sm text-muted-foreground truncate">{user.id}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Signing out..." : "Sign Out"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="bookings">
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
                  <Link to="/" onClick={(e) => {
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
                  }}>
                    Make your first booking
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <Card key={booking.id || index} className="overflow-hidden">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{booking.eventType || 'Event'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : 'Date not specified'}
                          </p>
                        </div>
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {booking.numberOfGuests} guests
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-muted-foreground">{booking.eventLocation || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="font-medium">Package</p>
                          <p className="text-muted-foreground">{booking.menuPackage || 'Custom'}</p>
                        </div>
                        {booking.submittedAt && (
                          <div className="col-span-2">
                            <p className="font-medium">Booked</p>
                            <p className="text-muted-foreground">
                              {formatDistance(new Date(booking.submittedAt), new Date(), { addSuffix: true })}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh
            </Button>
            <Button asChild>
              <Link to="/" onClick={(e) => {
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
              }}>
                Book New Event
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserProfile;
