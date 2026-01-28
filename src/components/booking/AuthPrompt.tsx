
import React from 'react';
import { Shield, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthPromptProps {
  onBackToMenu?: () => void;
}

export const AuthPrompt = ({ onBackToMenu }: AuthPromptProps) => {
  return (
    <div className="max-w-lg mx-auto py-8">
      <Card className="border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Sign In Required</CardTitle>
          <CardDescription className="text-base mt-2">
            To protect your personal information and booking details, we require you to sign in or create an account before proceeding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-foreground">Why do we require an account?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Your personal details (name, phone, address) are protected</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Only you can view and manage your bookings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Access your complete booking history anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Receive booking confirmations and updates securely</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/auth" className="flex-1">
              <Button className="w-full gap-2">
                <UserPlus className="h-4 w-4" />
                Create Account
              </Button>
            </Link>
            <Link to="/auth" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>

          {onBackToMenu && (
            <div className="text-center pt-2">
              <button
                onClick={onBackToMenu}
                className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
              >
                ← Back to Menu Builder
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPrompt;
