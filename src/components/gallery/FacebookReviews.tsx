
import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';

interface FacebookReview {
  id: string;
  reviewer: {
    name: string;
    picture?: string;
  };
  rating: number;
  review_text: string;
  created_time: string;
}

// Facebook page ID for Thys Gemaak Spitbraai
const FACEBOOK_PAGE_ID = '61559838444726';

const FacebookReviews = () => {
  const [reviews, setReviews] = useState<FacebookReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a production app, you would make a server-side request to Facebook Graph API
      // using a long-lived access token stored securely on your server
      
      // For now, we'll use mock data since client-side API access requires user authentication
      // which is not what we want for automatic reviews
      const mockReviews = getMockReviews();
      setReviews(mockReviews);
    } catch (err) {
      console.error('Error fetching Facebook reviews:', err);
      setError('Failed to load reviews. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load Facebook reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMockReviews = (): FacebookReview[] => {
    return [
      {
        id: '1',
        reviewer: {
          name: 'James Wilson',
          picture: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        rating: 5,
        review_text: 'Absolute game-changer for our wedding! The spitbraai was the talk of the event - perfectly cooked meat and amazing service from the team.',
        created_time: '2025-03-01T12:00:00Z'
      },
      {
        id: '2',
        reviewer: {
          name: 'Lerato Ndlovu',
          picture: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        rating: 5,
        review_text: 'Hired Thys Gemaak for our company year-end function and they delivered beyond expectations. Professional service and the food was exceptional!',
        created_time: '2025-03-15T14:30:00Z'
      },
      {
        id: '3',
        reviewer: {
          name: 'Thomas Brown',
          picture: 'https://randomuser.me/api/portraits/men/3.jpg'
        },
        rating: 4,
        review_text: 'Great experience with this team. The booking process was simple and they were very accommodating with our special requests.',
        created_time: '2025-02-25T18:00:00Z'
      },
      {
        id: '4',
        reviewer: {
          name: 'Catherine van der Merwe',
          picture: 'https://randomuser.me/api/portraits/women/4.jpg'
        },
        rating: 5,
        review_text: "Best spitbraai in the Western Cape! We've used them for multiple family gatherings and they never disappoint.",
        created_time: '2025-02-10T11:00:00Z'
      }
    ];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Facebook Reviews
        </CardTitle>
        <CardDescription>
          See what our clients are saying about us
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
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="p-4 rounded-lg border border-border bg-card shadow-subtle"
              >
                <div className="flex items-center mb-3">
                  {review.reviewer.picture ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <AspectRatio ratio={1/1}>
                        <img 
                          src={review.reviewer.picture} 
                          alt={review.reviewer.name} 
                          className="object-cover w-full h-full" 
                        />
                      </AspectRatio>
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary font-medium">
                        {review.reviewer.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{review.reviewer.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.created_time)}
                    </p>
                  </div>
                </div>
                
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-sm">{review.review_text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FacebookReviews;
