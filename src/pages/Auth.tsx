import React from 'react';
import { useAuth } from '@/contexts/auth';
import AuthForm from '@/components/auth/AuthForm';
import UserProfile from '@/components/auth/UserProfile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Auth = () => {
  const { user, loading, supabaseReady } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container-width py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6">
            {user ? 'Your Account' : 'Sign In or Create Account'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {user 
              ? 'View and manage your account information and bookings.' 
              : 'Sign in to access your booking history or create a new account to get started.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!supabaseReady && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertTitle>Supabase Configuration Missing</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  The application cannot connect to Supabase. Authentication features are disabled.
                </p>
                <p className="font-medium">
                  To enable authentication, connect your project to Supabase through the Lovable interface.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center p-16 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Loading your account information...</p>
            </div>
          ) : user ? (
            <UserProfile />
          ) : (
            <div className="max-w-md mx-auto">
              <AuthForm />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Auth;
