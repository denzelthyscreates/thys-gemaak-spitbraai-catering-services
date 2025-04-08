
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

// Gallery images - replace these URLs with your own
const galleryImages = [
  {
    id: '1',
    url: 'https://source.unsplash.com/random/800x600?spitbraai',
    caption: 'Spitbraai Event',
    date: '2025-03-15'
  },
  {
    id: '2',
    url: 'https://source.unsplash.com/random/800x600?catering',
    caption: 'Wedding Catering',
    date: '2025-02-20'
  },
  {
    id: '3',
    url: 'https://source.unsplash.com/random/800x600?bbq',
    caption: 'Corporate BBQ',
    date: '2025-01-10'
  },
  {
    id: '4',
    url: 'https://source.unsplash.com/random/800x600?event',
    caption: 'Birthday Party',
    date: '2025-04-05'
  },
  {
    id: '5',
    url: 'https://source.unsplash.com/random/800x600?food',
    caption: 'Gourmet Catering',
    date: '2025-03-28'
  },
  {
    id: '6',
    url: 'https://source.unsplash.com/random/800x600?celebration',
    caption: 'Anniversary Celebration',
    date: '2025-02-14'
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
