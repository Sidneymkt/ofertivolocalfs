
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
// For a real carousel, you might use ShadCN's Carousel or a library like 'embla-carousel-react'
// For simplicity in this step, we'll display images in a scrollable row or grid.

interface OfferImageGalleryProps {
  images: string[];
  imageHints?: string[];
  offerTitle: string;
}

const OfferImageGallery: React.FC<OfferImageGalleryProps> = ({ images, imageHints, offerTitle }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardContent className="p-0">
        {images.length === 1 ? (
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1]">
            <Image
              src={images[0]}
              alt={`${offerTitle} - Imagem Principal`}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg md:rounded-lg"
              data-ai-hint={imageHints?.[0] || "offer image"}
            />
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-muted/30">
            {images.map((src, index) => (
              <div key={index} className="relative w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-2/5 flex-shrink-0 snap-center aspect-[16/10] sm:aspect-video">
                 <Image
                  src={src}
                  alt={`${offerTitle} - Imagem ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className={images.length > 1 ? "" : "rounded-t-lg md:rounded-lg"} // No rounding for individual scroll items unless it's the only one
                  data-ai-hint={imageHints?.[index] || "offer detail"}
                />
              </div>
            ))}
          </div>
        )}
        {/* Placeholder for zoom, navigation arrows, active image indicator if using a proper carousel */}
      </CardContent>
    </Card>
  );
};

export default OfferImageGallery;
