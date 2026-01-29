import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Booking {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  event_date: string | null;
  event_type: string | null;
  number_of_guests: number;
  total_price: number;
  status: string;
  menu_package: string;
  created_at: string;
  venue_name: string | null;
  venue_city: string | null;
  additional_notes: string | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      );
      toast.success('Booking status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Manage all customer bookings</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchBookings} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No bookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.contact_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.event_date 
                        ? format(new Date(booking.event_date), 'PPP')
                        : 'TBD'}
                    </TableCell>
                    <TableCell>{booking.number_of_guests}</TableCell>
                    <TableCell>{booking.menu_package}</TableCell>
                    <TableCell>R{booking.total_price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onValueChange={(value) => updateStatus(booking.id, value)}
                        disabled={updating === booking.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge className={statusColors[booking.status] || ''}>
                              {booking.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Created: {selectedBooking && format(new Date(selectedBooking.created_at), 'PPP')}
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Info</h4>
                    <p>{selectedBooking.contact_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.contact_email}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.contact_phone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Event Details</h4>
                    <p>Type: {selectedBooking.event_type || 'N/A'}</p>
                    <p>Guests: {selectedBooking.number_of_guests}</p>
                    <p>Date: {selectedBooking.event_date 
                      ? format(new Date(selectedBooking.event_date), 'PPP')
                      : 'TBD'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Venue</h4>
                    <p>{selectedBooking.venue_name || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.venue_city || ''}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Package & Price</h4>
                    <p>{selectedBooking.menu_package}</p>
                    <p className="text-lg font-semibold">R{selectedBooking.total_price.toLocaleString()}</p>
                  </div>
                </div>
                {selectedBooking.additional_notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Additional Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedBooking.additional_notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
