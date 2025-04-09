import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';

interface FacebookPhoto {
  id: string;
  source: string;
  name?: string;
  created_time: string;
}

// Extend Window interface to include FB property
declare global {
  interface Window {
    FB?: {
      login: (callback: (response: { authResponse?: { accessToken: string } }) => void, options: { scope: string }) => void;
      api: (path: string, method: string, params: any, callback: (response: any) => void) => void;
    };
  }
}

const FacebookGallery = () => {
  const [photos, setPhotos] = useState<FacebookPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const connectToFacebook = () => {
    setLoading(true);
    setError(null);
    
    if (window.FB) {
      window.FB.login((response) => {
        if (response.authResponse) {
          setIsConnected(true);
          fetchPhotos(response.authResponse.accessToken);
          toast({
            title: "Success",
            description: "Successfully connected to Facebook",
          });
        } else {
          setError('Facebook login was cancelled or failed');
          setLoading(false);
          toast({
            title: "Login Failed",
            description: "Facebook login was cancelled or failed",
            variant: "destructive",
          });
        }
      }, { scope: 'user_photos,pages_show_list' });
    } else {
      setError('Facebook SDK not loaded. Please reload the page and try again.');
      setLoading(false);
      toast({
        title: "SDK Not Loaded",
        description: "Facebook SDK not loaded. Please reload the page and try again.",
        variant: "destructive",
      });
    }
  };

  const fetchPhotos = (accessToken: string) => {
    if (!window.FB) {
      setError('Facebook SDK not loaded');
      setLoading(false);
      return;
    }

    // First, get the pages the user has access to
    window.FB.api(
      '/me/accounts',
      'GET',
      {},
      (response) => {
        if (response.error) {
          setError(response.error.message || 'Error fetching Facebook pages');
          setLoading(false);
          return;
        }

        if (!response.data || response.data.length === 0) {
          setError('No Facebook pages found or no access to pages');
          setLoading(false);
          return;
        }

        // Use the first page ID to fetch photos
        const pageId = response.data[0].id;
        
        window.FB.api(
          `/${pageId}/photos`,
          'GET',
          { fields: 'source,name,created_time' },
          (photosResponse) => {
            if (photosResponse.error) {
              setError(photosResponse.error.message || 'Error fetching Facebook photos');
              setLoading(false);
              return;
            }

            if (!photosResponse.data || photosResponse.data.length === 0) {
              // If no actual photos are found, we'll use the mock data for demonstration
              useMockPhotos();
              return;
            }

            // Format the response to match our interface
            const formattedPhotos: FacebookPhoto[] = photosResponse.data.map((item: any) => ({
              id: item.id,
              source: item.source,
              name: item.name || 'Untitled',
              created_time: item.created_time
            }));

            setPhotos(formattedPhotos);
            setLoading(false);
          }
        );
      }
    );
  };

  const useMockPhotos = () => {
    // Fallback to mock data if no photos are found or for demo purposes
    const mockPhotos: FacebookPhoto[] = [
      {
        id: '1',
        source: 'https://source.unsplash.com/random/800x600?food',
        name: 'Catering Event 1',
        created_time: '2025-03-01T12:00:00Z'
      },
      {
        id: '2',
        source: 'https://source.unsplash.com/random/800x600?dinner',
        name: 'Wedding Reception',
        created_time: '2025-03-15T14:30:00Z'
      },
      {
        id: '3',
        source: 'https://source.unsplash.com/random/800x600?party',
        name: 'Corporate Event',
        created_time: '2025-02-25T18:00:00Z'
      },
      {
        id: '4',
        source: 'https://source.unsplash.com/random/800x600?buffet',
        name: 'Buffet Setup',
        created_time: '2025-02-10T11:00:00Z'
      },
    ];
    
    setPhotos(mockPhotos);
    setLoading(false);
    toast({
      title: "Using Demo Data",
      description: "No Facebook photos found. Showing demonstration data instead.",
    });
  };

  useEffect(() => {
    // Check if the Facebook SDK is loaded
    const checkFBSDK = () => {
      if (window.FB) {
        console.log('Facebook SDK loaded');
        // Check if the user is already logged in
        window.FB.api('/me', 'GET', {}, (response: any) => {
          if (response && !response.error) {
            setIsConnected(true);
            // You might want to fetch photos here if the user is already connected
          }
        });
      } else {
        // If the SDK isn't loaded yet, wait a bit and try again
        setTimeout(checkFBSDK, 1000);
      }
    };
    
    checkFBSDK();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Facebook Gallery
        </CardTitle>
        <CardDescription>
          View photos from our Facebook page
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Connect to Facebook</h3>
            <p className="text-muted-foreground mb-4">
              Connect your Facebook account to display your photos
            </p>
            <Button 
              onClick={connectToFacebook} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Connecting...' : 'Connect to Facebook'}
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No photos found</p>
          </div>
        ) : (
          <Carousel className="w-full max-w-md mx-auto">
            <CarouselContent>
              {photos.map((photo) => (
                <CarouselItem key={photo.id}>
                  <div className="p-1">
                    <div className="overflow-hidden rounded-lg">
                      <AspectRatio ratio={4/3}>
                        <img
                          src={photo.source}
                          alt={photo.name || 'Facebook photo'}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div className="mt-2">
                      <h4 className="font-medium">{photo.name || 'Untitled'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(photo.created_time)}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
};

export default FacebookGallery;
