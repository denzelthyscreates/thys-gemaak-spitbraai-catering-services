
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
    };
  }
}

const FacebookGallery = () => {
  const [photos, setPhotos] = useState<FacebookPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectToFacebook = () => {
    setLoading(true);
    setError(null);
    
    // This would typically be implemented with the Facebook SDK
    // and authentication flow. For this example, we'll simulate it
    if (window.FB) {
      window.FB.login((response) => {
        if (response.authResponse) {
          setIsConnected(true);
          fetchPhotos(response.authResponse.accessToken);
        } else {
          setError('Facebook login was cancelled or failed');
          setLoading(false);
        }
      }, { scope: 'user_photos,pages_show_list' });
    } else {
      // If FB SDK isn't loaded, just simulate a successful connection for demo purposes
      setTimeout(() => {
        setIsConnected(true);
        fetchPhotos('mock-token');
      }, 1500);
    }
  };

  const fetchPhotos = (accessToken: string) => {
    // In a real implementation, we would use the accessToken to fetch photos
    // For now, we'll use a mock implementation
    setTimeout(() => {
      try {
        // Mock data - in a real implementation, this would come from the Facebook API
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
      } catch (err) {
        setError('Error fetching photos');
        setLoading(false);
      }
    }, 1500);
  };

  useEffect(() => {
    // Initialize Facebook SDK
    // This would typically be done in a more central location
    const initFacebookSDK = () => {
      if (window.FB) return;
      
      // This would be loaded from the Facebook SDK script
      console.log('Facebook SDK would be initialized here');
      // In a real implementation, we would check for an existing session
    };
    
    initFacebookSDK();
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
