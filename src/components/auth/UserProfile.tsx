
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, InfoIcon } from 'lucide-react';
import ProfileTab from './ProfileTab';
import BookingsTab from './BookingsTab';

const UserProfile = () => {
  const { user, signOut, loading } = useAuth();

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
        <ProfileTab 
          user={user} 
          loading={loading} 
          signOut={signOut} 
        />
      </TabsContent>
      
      <TabsContent value="bookings">
        <BookingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default UserProfile;
