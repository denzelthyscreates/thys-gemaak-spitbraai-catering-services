
import React, { useState } from 'react';
import { ImageIcon, Upload, X, AlertCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Sample initial gallery images (you can replace these with your own)
const initialImages = [
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
  }
];

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}

const UploadGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    // Process each file
    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        setIsUploading(false);
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        setIsUploading(false);
        return;
      }
      
      // Create a URL for the file
      const imageUrl = URL.createObjectURL(file);
      
      // Add the new image to the gallery
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        url: imageUrl,
        caption: file.name.split('.')[0], // Use filename as caption
        date: new Date().toISOString().split('T')[0] // Today's date
      };
      
      setImages(prevImages => [...prevImages, newImage]);
    });
    
    setIsUploading(false);
    
    // Reset the input field
    event.target.value = '';
  };

  const removeImage = (id: string) => {
    setImages(images.filter(image => image.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Event Gallery
        </CardTitle>
        <CardDescription>
          View and upload photos from our catering events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Upload Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="h-4 w-4" />
            <h3 className="font-medium">Upload Images</h3>
          </div>
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">
                Drag and drop images here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <Button 
                variant="outline" 
                className="mt-4"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Select Images'}
              </Button>
            </div>
          </label>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative rounded-lg overflow-hidden border">
              <AspectRatio ratio={4/3}>
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
              <button
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="p-3">
                <h4 className="font-medium truncate">{image.caption}</h4>
                <p className="text-sm text-muted-foreground">{image.date}</p>
              </div>
            </div>
          ))}
        </div>
        
        {images.length === 0 && (
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
