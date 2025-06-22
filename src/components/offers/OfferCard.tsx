
'use client';

import React from 'react';
import Image from 'next/image';
import type { Offer } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <Link href={`/offer/${offer.id}`} className="block group">
      <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col h-full bg-card">
        <div className="relative w-full aspect-square">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            layout="fill"
            objectFit="cover"
            className="bg-muted group-hover:scale-105 transition-transform"
            data-ai-hint={offer['data-ai-hint'] as string || 'product image'}
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {offer.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {offer.merchantName}
          </p>
           {offer.discountedPrice && (
                <div className="font-bold text-lg text-foreground mt-2">
                    R${offer.discountedPrice.toFixed(2)}
                    {offer.originalPrice && <span className="text-sm text-muted-foreground line-through ml-2">R${offer.originalPrice.toFixed(2)}</span>}
                </div>
            )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button variant="outline" className="w-full text-primary border-primary/50 hover:bg-primary/10 hover:text-primary">
            Ver Oferta
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default OfferCard;
