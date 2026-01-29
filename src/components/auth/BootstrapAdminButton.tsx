import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Shield, Loader2 } from 'lucide-react';

export const BootstrapAdminButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBootstrapAdmin = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to become an admin');
        return;
      }

      const response = await fetch(
        `https://pcvmdyhzufupgckszrdy.supabase.co/functions/v1/bootstrap-admin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || 'You are now an admin!');
      } else {
        toast.error(result.error || 'Failed to become admin');
      }
    } catch (error) {
      console.error('Bootstrap admin error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBootstrapAdmin}
      disabled={isLoading}
      variant="outline"
      className="w-full mt-4 border-primary/50 hover:bg-primary/10"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Shield className="mr-2 h-4 w-4" />
      )}
      Become First Admin
    </Button>
  );
};
