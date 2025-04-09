import React, { useState, useEffect } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { FacebookPhoto, fetchFacebookPhotos } from '@/utils/facebookApi';

// Facebook page ID for Thys Gemaak Spitbraai
const FACEBOOK_PAGE_ID = '61559838444726';

const FacebookGallery = () => {
  const [photos, setPhotos] = useState<FacebookPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch photos from our server-side API
      const fetchedPhotos = await fetchFacebookPhotos();
      setPhotos(fetchedPhotos);
    } catch (err) {
      console.error('Error fetching Facebook photos:', err);
      setError('Failed to load photos. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load Facebook photos",
        variant: "destructive"
      });
      // Fall back to mock data if the API request fails
      const mockPhotos = getMockPhotos();
      setPhotos(mockPhotos);
    } finally {
      setLoading(false);
    }
  };

  const getMockPhotos = (): FacebookPhoto[] => {
    return [
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
  };

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
        
        {loading ? (
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
