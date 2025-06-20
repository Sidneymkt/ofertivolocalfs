
'use client';

import Image from 'next/image';
import type { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Navigation, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedOfferCardProps {
  offer: Offer;
  className?: string; // Allow passing className for width control in lists
}

const FeaturedOfferCard: React.FC<FeaturedOfferCardProps> = ({ offer, className }) => {
  return (
    <Link href={`/offer/${offer.id}`} className={cn("block group", className)}>
      <div className="relative aspect-[16/9] sm:aspect-video md:aspect-[16/8] lg:aspect-[16/7] w-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 h-full">
        <Image
          src={offer.galleryImages && offer.galleryImages.length > 0 ? offer.galleryImages[0] : offer.imageUrl}
          alt={`Featured offer: ${offer.title}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={offer.galleryImageHints && offer.galleryImageHints.length > 0 ? offer.galleryImageHints[0] : offer['data-ai-hint'] as string || "featured food restaurant"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 md:p-4 flex flex-col justify-end">
          <h2 className="text-base sm:text-lg md:text-xl font-bold font-headline text-white leading-tight mb-1 line-clamp-2 group-hover:text-primary-foreground/90">
            {offer.title}
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-300 group-hover:text-neutral-100 line-clamp-1">{offer.merchantName}</p>
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
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs sm:text-sm h-8 px-3 shrink-0"
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation(); 
                // Navigation is handled by the parent Link
              }}
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
