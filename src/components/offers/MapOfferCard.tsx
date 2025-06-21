
'use client';

import React from 'react';
import Image from 'next/image';
import type { Offer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MapOfferCardProps {
  offer: Offer;
  className?: string;
}

const MapOfferCard: React.FC<MapOfferCardProps> = ({ offer, className }) => {
  return (
    <div className={cn("w-60 sm:w-72 shrink-0", className)}>
        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col h-full bg-card group">
            <Link href={`/offer/${offer.id}`} className="block" tabIndex={-1}>
                <div className="relative w-full aspect-[4/3]">
                    <Image
                        src={offer.imageUrl}
                        alt={offer.title}
                        layout="fill"
                        objectFit="cover"
                        className="bg-muted group-hover:scale-105 transition-transform"
                        data-ai-hint={offer['data-ai-hint'] as string || 'offer image'}
                    />
                     {offer.originalPrice && (
                        <Badge variant="destructive" className="absolute top-2 right-2">
                            {(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100).toFixed(0)}% OFF
                        </Badge>
                     )}
                </div>
            </Link>
            <CardContent className="p-3 flex flex-col flex-grow">
                <div className="flex-grow">
                    <Link href={`/offer/${offer.id}`} className="block">
                        <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {offer.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {offer.merchantName}
                        </p>
                    </Link>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t">
                    <p className="text-lg font-bold text-primary">
                        R${offer.discountedPrice.toFixed(2).replace('.',',')}
                    </p>
                    <Button 
                        asChild
                        size="sm"
                        className="h-8 px-3"
                    >
                        <Link href={`/offer/${offer.id}`}>
                            <Tag size={14} className="mr-1.5"/>
                            Ver Mais
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export default MapOfferCard;
