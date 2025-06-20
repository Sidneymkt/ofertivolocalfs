
'use client';

import Image from 'next/image';
import type { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Navigation, Star } from 'lucide-react';

interface FeaturedOfferCardProps {
  offer: Offer;
}

const FeaturedOfferCard: React.FC<FeaturedOfferCardProps> = ({ offer }) => {
  return (
    <Link href={`/offer/${offer.id}`} className="block group">
      <div className="relative aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] w-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
        <Image
          src={offer.galleryImages && offer.galleryImages.length > 0 ? offer.galleryImages[0] : offer.imageUrl}
          alt={`Featured offer: ${offer.title}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={offer.galleryImageHints && offer.galleryImageHints.length > 0 ? offer.galleryImageHints[0] : offer['data-ai-hint'] as string || "featured food restaurant"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 md:p-6 flex flex-col justify-end">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-headline text-white leading-tight mb-1 line-clamp-2 group-hover:text-primary-foreground/90">
            {offer.title}
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-neutral-300 group-hover:text-neutral-100 line-clamp-1">{offer.merchantName}</p>
              <div className="flex items-center text-xs text-neutral-300 gap-1.5">
                {offer.distance && (
                  <div className="flex items-center gap-0.5">
                    <Navigation size={12} />
                    <span>{offer.distance}</span>
                  </div>
                )}
                {offer.rating && (
                  <div className="flex items-center gap-0.5">
                    <Star size={12} className="text-accent fill-accent" />
                    <span>{offer.rating.toFixed(1)} ({offer.reviews})</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 shrink-0"
              onClick={(e) => e.stopPropagation()} // Prevent Link navigation if button itself is clicked, let Link handle outer click
            >
              Guia
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedOfferCard;
