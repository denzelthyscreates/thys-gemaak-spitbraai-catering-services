
import React from 'react';
import { formatDistance } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface Booking {
  id?: string;
  eventType?: string;
  eventDate?: string;
  numberOfGuests?: number;
  eventLocation?: string;
  menuPackage?: string;
  submittedAt?: string;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  return (
    <Card className="overflow-hidden">
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
  );
};

export default BookingCard;
