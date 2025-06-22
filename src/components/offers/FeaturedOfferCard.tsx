
'use client';

import Image from 'next/image';
import type { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FeaturedOfferCardProps {
  offer: Offer;
  className?: string;
}

const FeaturedOfferCard: React.FC<FeaturedOfferCardProps> = ({ offer, className }) => {
  return (
    <Link href={`/offer/${offer.id}`} className={cn("block group", className)}>
      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <Image
          src={offer.imageUrl}
          alt={`Featured offer: ${offer.title}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={offer['data-ai-hint'] as string || "promotional banner"}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-end">
          <h2 className="text-xl md:text-2xl font-bold font-headline text-white leading-tight mb-2 max-w-md line-clamp-2 shadow-text">
            {offer.title}
          </h2>
          <p className="text-sm text-neutral-200 mb-4 max-w-md line-clamp-2 shadow-text hidden sm:block">
            {offer.description}
          </p>
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Aproveitar Agora
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedOfferCard;
