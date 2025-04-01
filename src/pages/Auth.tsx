
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import UserProfile from '@/components/auth/UserProfile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from 'lucide-react';

const Auth = () => {
  const { user, loading, supabaseReady } = useAuth();

  return (
    <div className="container-width py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-6">
          {user ? 'Your Account' : 'Sign In or Create Account'}
        </h2>
        <p className="text-lg text-muted-foreground">
          {user 
            ? 'View and manage your account information.' 
            : 'Sign in to access your booking history or create a new account to get started.'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {!supabaseReady && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            <AlertTitle>Supabase Configuration Missing</AlertTitle>
            <AlertDescription>
              The application cannot connect to Supabase. Please make sure the environment variables 
              VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center p-8">
            <p>Loading...</p>
          </div>
        ) : user ? (
          <UserProfile />
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  );
};

export default Auth;
