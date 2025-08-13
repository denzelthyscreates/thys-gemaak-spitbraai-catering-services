import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function ZohoSetup() {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string>('');

  const handleGetOAuthUrl = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('zoho-books-integration', {
        body: { action: 'setup-oauth' }
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
      window.open(authUrl, '_blank');
    }
  };

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
          <Button 
            onClick={handleGetOAuthUrl} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Generating OAuth URL...' : 'Generate OAuth URL'}
          </Button>

          {authUrl && (
            <Alert>
              <AlertDescription>
                <div className="space-y-3">
                  <p>OAuth URL generated successfully:</p>
                  <div className="bg-muted p-3 rounded text-sm font-mono break-all">
                    {authUrl}
                  </div>
                  <Button onClick={handleOpenOAuth} className="w-full">
                    Open OAuth Authorization
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertDescription>
              <strong>Next Steps:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Click "Generate OAuth URL" to create the authorization link</li>
                <li>Click "Open OAuth Authorization" to authorize the application</li>
                <li>Complete the authorization process in Zoho</li>
                <li>You'll be redirected back to complete the setup</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}