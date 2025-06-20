
'use client';

import React from 'react';
import Image from 'next/image';
import type { Offer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface RecommendedOfferCardProps {
  offer: Offer;
  className?: string;
}

const RecommendedOfferCard: React.FC<RecommendedOfferCardProps> = ({ offer, className }) => {
  return (
    <Link
      href={`/offer/${offer.id}`}
      className={cn("block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none group/cardlink", className)}
      aria-label={`Ver detalhes da oferta: ${offer.title}`}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg group-hover/cardlink:ring-1 group-hover/cardlink:ring-primary/30 transition-all duration-200 ease-in-out flex flex-col h-full bg-card">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            layout="fill"
            objectFit="cover"
            className="bg-muted"
            data-ai-hint={offer['data-ai-hint'] as string || 'recommendation image'}
          />
          {offer.offerType === 'relampago' && (
            <Badge variant="destructive" className="absolute top-2 left-2 bg-accent text-accent-foreground py-0.5 px-1.5 text-xs shadow-md">
              <Zap size={12} className="mr-1 fill-current" />
              RELÂMPAGO
            </Badge>
          )}
        </div>
        
        <CardContent className="p-3 flex flex-col flex-grow space-y-1.5">
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover/cardlink:text-primary transition-colors line-clamp-2 leading-tight">
              {offer.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {offer.merchantName}
            </p>
          </div>
          
          <div className="mt-auto pt-1">
            <p className="text-base font-bold text-primary">
                R${offer.discountedPrice.toFixed(2)}
            </p>
            {offer.originalPrice && offer.discountedPrice < offer.originalPrice && (
                <span className="text-xs text-muted-foreground line-through ml-1.5">
                    R${offer.originalPrice.toFixed(2)}
                </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RecommendedOfferCard;
