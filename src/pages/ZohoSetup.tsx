import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export default function ZohoSetup() {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    // Check if we have authorization code in URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      toast.error(`OAuth Error: ${error}`);
      return;
    }

    if (code && !setupComplete) {
      handleOAuthCallback(code);
    }
  }, [setupComplete]);

  const handleOAuthCallback = async (code: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('zoho-books-integration', {
        body: { 
          action: 'exchange-code',
          code: code,
          redirectUri: window.location.origin + '/auth/callback'
        }
      });

      if (error) throw error;

      if (data.success) {
        setSetupComplete(true);
        setIsConnected(true);
        toast.success('Zoho Books OAuth setup completed successfully!');
        
        // Clean up URL
        window.history.replaceState({}, document.title, '/zoho-setup');
      } else {
        throw new Error(data.error || 'Failed to complete OAuth setup');
      }
    } catch (error: any) {
      console.error('Error completing OAuth:', error);
      toast.error(error.message || 'Failed to complete OAuth setup');
    } finally {
      setLoading(false);
    }
  };

  const handleGetOAuthUrl = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('zoho-books-integration', {
        body: { 
          action: 'setup-oauth',
          redirectUri: window.location.origin + '/auth/callback'
        }
      });

      if (error) throw error;

      if (data.success) {
        setAuthUrl(data.authUrl);
        toast.success('OAuth URL generated successfully');
      } else {
        throw new Error(data.error || 'Failed to generate OAuth URL');
      }
    } catch (error: any) {
      console.error('Error getting OAuth URL:', error);
      toast.error(error.message || 'Failed to generate OAuth URL');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOAuth = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  if (setupComplete) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Zoho Books Integration Setup Complete
            </CardTitle>
            <CardDescription>
              Your Zoho Books OAuth connection has been successfully configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Setup Complete!</strong> You can now create estimates and invoices in Zoho Books directly from your booking system.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What's Next:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Navigate to your bookings to create estimates</li>
                <li>Use the booking management system to convert estimates to invoices</li>
                <li>Monitor your Zoho Books account for created documents</li>
              </ul>
            </div>

            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Zoho Books OAuth Setup</CardTitle>
          <CardDescription>
            Set up the OAuth connection to Zoho Books for creating estimates and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!authUrl ? (
            <Button 
              onClick={handleGetOAuthUrl} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Generating OAuth URL...' : 'Start OAuth Setup'}
            </Button>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p><strong>OAuth URL Generated Successfully!</strong></p>
                  <p>Click the button below to authorize your application with Zoho Books:</p>
                  <Button onClick={handleOpenOAuth} className="w-full" disabled={loading}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {loading ? 'Processing...' : 'Authorize with Zoho Books'}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription>
              <strong>Setup Instructions:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Click "Start OAuth Setup" to generate the authorization link</li>
                <li>Click "Authorize with Zoho Books" to open the Zoho authorization page</li>
                <li>Sign in to your Zoho account and authorize the application</li>
                <li>You'll be redirected back here to complete the setup automatically</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> Make sure you have the redirect URI 
              <code className="mx-1 px-1 bg-muted rounded text-sm">
                {window.location.origin}/auth/callback
              </code>
              configured in your Zoho app settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}