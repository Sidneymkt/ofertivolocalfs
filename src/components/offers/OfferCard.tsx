
'use client';

import Image from 'next/image';
import type { Offer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Navigation, Star } from 'lucide-react';
import Link from 'next/link';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <Link
      href={`/offer/${offer.id}`}
      className="block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none group/cardlink"
      aria-label={`Ver detalhes da oferta: ${offer.title}`}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg group-hover/cardlink:ring-1 group-hover/cardlink:ring-primary/30 transition-all duration-200 ease-in-out flex h-full">
        <div className="relative w-1/3 md:w-2/5 flex-shrink-0">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            layout="fill"
            objectFit="cover"
            className=""
            data-ai-hint={offer['data-ai-hint'] as string}
          />
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between w-2/3 md:w-3/5">
          <div>
            <h3 className="text-sm sm:text-base font-semibold font-headline mb-0.5 leading-tight group-hover/cardlink:text-primary transition-colors line-clamp-2">
              {offer.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1 sm:mb-1.5 line-clamp-1">{offer.merchantName}</p>
            
            <div className="flex items-center text-xs text-muted-foreground gap-1.5 mb-1 sm:mb-2">
              {offer.distance && (
                <div className="flex items-center gap-0.5">
                  <Navigation size={12} />
                  <span>{offer.distance}</span>
                </div>
              )}
              {offer.rating && (
                <div className="flex items-center gap-0.5">
                  <Star size={12} className="text-accent fill-accent" />
                  <span>{offer.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-baseline gap-1.5 mb-1.5 sm:mb-2">
              <p className="text-base sm:text-lg font-bold text-primary">
                R${offer.discountedPrice.toFixed(2)}
              </p>
              {offer.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  R${offer.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full h-8 text-xs border-primary text-primary hover:bg-primary/10">
              Guia
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default OfferCard;
