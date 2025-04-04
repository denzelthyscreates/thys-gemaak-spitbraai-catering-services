
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileTabProps {
  user: User;
  loading: boolean;
  signOut: () => Promise<void>;
}

const ProfileTab = ({ user, loading, signOut }: ProfileTabProps) => {
  return (
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
  );
};

export default ProfileTab;
