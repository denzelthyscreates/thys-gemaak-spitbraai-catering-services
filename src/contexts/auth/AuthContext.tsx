
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from './useAuthProvider';
import { createAuthMethods } from './authMethods';
import { AuthContextType } from './types';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const {
    user,
    loading,
    error,
    supabaseReady,
    setUser,
    setLoading
  } = useAuthProvider();

  const { handleSignIn, handleSignUp, handleSignOut } = createAuthMethods({
    setUser,
    setLoading,
    supabaseReady,
    toast
  });

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        supabaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
