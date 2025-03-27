
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';
import UserProfile from '@/components/auth/UserProfile';

const Auth = () => {
  const { user, loading } = useAuth();

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
