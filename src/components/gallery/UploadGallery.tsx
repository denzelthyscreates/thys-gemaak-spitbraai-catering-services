
import React from 'react';
import { ImageIcon } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Gallery images with the provided URLs
const galleryImages = [
  {
    id: '1',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788469/IMG-20241110-WA0010_umlczd.jpg',
    caption: 'Spitbraai Event',
    date: '2025-03-15'
  },
  {
    id: '2',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788468/IMG-20241110-WA0014_wfywk3.jpg',
    caption: 'Wedding Catering',
    date: '2025-02-20'
  },
  {
    id: '3',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0015_xrads9.jpg',
    caption: 'Corporate BBQ',
    date: '2025-01-10'
  },
  {
    id: '4',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788467/IMG-20241110-WA0012_k3zeob.jpg',
    caption: 'Birthday Party',
    date: '2025-04-05'
  },
  {
    id: '5',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0022_k5cdid.jpg',
    caption: 'Gourmet Catering',
    date: '2025-03-28'
  },
  {
    id: '6',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788466/IMG-20241110-WA0033_vcwpvp.jpg',
    caption: 'Anniversary Celebration',
    date: '2025-02-14'
  },
  {
    id: '7',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788465/IMG-20241110-WA0036_snwetl.jpg',
    caption: 'Family Gathering',
    date: '2025-01-05'
  },
  {
    id: '8',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0024_fasc43.jpg',
    caption: 'Corporate Event',
    date: '2025-05-22'
  },
  {
    id: '9',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740788463/IMG-20241110-WA0028_og9dmr.jpg',
    caption: 'Outdoor Catering',
    date: '2025-06-10'
  },
  {
    id: '10',
    url: 'https://res.cloudinary.com/dlsjdyti8/image/upload/v1740791600/IMG-20240826-WA0043_zlnaci.jpg',
    caption: 'Special Occasion',
    date: '2025-07-15'
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
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
              <div className="p-3">
                <h4 className="font-medium truncate">{image.caption}</h4>
                <p className="text-sm text-muted-foreground">{image.date}</p>
              </div>
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
    </Card>
  );
};

export default UploadGallery;
