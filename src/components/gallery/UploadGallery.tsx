
import React from 'react';
import { ImageIcon, Facebook } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

// Gallery images with the provided URLs
const galleryImages = [
  {
    id: '1',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788469/IMG-20241110-WA0010_umlczd.jpg'
  },
  {
    id: '2',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788468/IMG-20241110-WA0014_wfywk3.jpg'
  },
  {
    id: '3',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0015_xrads9.jpg'
  },
  {
    id: '4',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0012_k3zeob.jpg'
  },
  {
    id: '5',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0022_k5cdid.jpg'
  },
  {
    id: '6',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0033_vcwpvp.jpg'
  },
  {
    id: '7',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788465/IMG-20241110-WA0036_snwetl.jpg'
  },
  {
    id: '8',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0024_fasc43.jpg'
  },
  {
    id: '9',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0028_og9dmr.jpg'
  },
  {
    id: '10',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740791600/IMG-20240826-WA0043_zlnaci.jpg'
  }
];

const UploadGallery = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Event Gallery
        </CardTitle>
        <CardDescription>
          Photos from our recent catering events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="group relative rounded-lg overflow-hidden border">
              <AspectRatio ratio={4/3}>
                <img
                  src={image.url}
                  alt="Event photo"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
            </div>
          ))}
        </div>
        
        {galleryImages.length === 0 && (
          <div className="text-center py-8 border rounded-lg">
            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No images in the gallery</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-2 pb-6">
        <a 
          href="https://www.facebook.com/profile.php?id=61559838444726&sk=photos" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2">
            <Facebook className="h-4 w-4" />
            View More Photos on Facebook
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default UploadGallery;
