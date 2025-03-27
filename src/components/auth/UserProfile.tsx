
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const UserProfile = () => {
  const { user, signOut, loading } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
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

export default UserProfile;
