
import React, { useState } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventImageGalleryProps {
  images: string[];
  eventTitle: string;
  className?: string;
}

const EventImageGallery = ({ 
  images, 
  eventTitle, 
  className = "" 
}: EventImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main image */}
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <OptimizedImage
            src={images[0]}
            alt={`${eventTitle} - Imagem principal`}
            className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => openLightbox(0)}
          />
        </div>

        {/* Thumbnail grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                className="aspect-square overflow-hidden rounded-md cursor-pointer group"
                onClick={() => openLightbox(index + 1)}
              >
                <OptimizedImage
                  src={image}
                  alt={`${eventTitle} - Imagem ${index + 2}`}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-medium">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded">
            <DialogTitle className="text-sm">
              {eventTitle} - {currentImageIndex + 1} de {images.length}
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <OptimizedImage
              src={images[currentImageIndex]}
              alt={`${eventTitle} - Imagem ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventImageGallery;
