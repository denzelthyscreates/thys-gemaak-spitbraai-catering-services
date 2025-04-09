
import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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

// Extend Window interface to include FB property
declare global {
  interface Window {
    FB?: {
      login: (callback: (response: { authResponse?: { accessToken: string } }) => void, options: { scope: string }) => void;
    };
  }
}

const FacebookReviews = () => {
  const [reviews, setReviews] = useState<FacebookReview[]>([]);
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
          fetchReviews(response.authResponse.accessToken);
        } else {
          setError('Facebook login was cancelled or failed');
          setLoading(false);
        }
      }, { scope: 'pages_show_list,pages_read_engagement,pages_read_user_content' });
    } else {
      // If FB SDK isn't loaded, just simulate a successful connection for demo purposes
      setTimeout(() => {
        setIsConnected(true);
        fetchReviews('mock-token');
      }, 1500);
    }
  };

  const fetchReviews = (accessToken: string) => {
    // In a real implementation, we would use the accessToken to fetch reviews
    // For now, we'll use a mock implementation
    setTimeout(() => {
      try {
        // Mock data - in a real implementation, this would come from the Facebook API
        const mockReviews: FacebookReview[] = [
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
          },
        ];
        
        setReviews(mockReviews);
        setLoading(false);
      } catch (err) {
        setError('Error fetching reviews');
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
        
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Connect to Facebook</h3>
            <p className="text-muted-foreground mb-4">
              Connect your Facebook account to display client reviews
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
