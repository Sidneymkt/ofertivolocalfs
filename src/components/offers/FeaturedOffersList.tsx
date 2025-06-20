
'use client';

import type { Offer } from '@/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FeaturedOfferCard from './FeaturedOfferCard';

interface FeaturedOffersListProps {
  offers: Offer[];
}

const FeaturedOffersList: React.FC<FeaturedOffersListProps> = ({ offers }) => {
  if (!offers || offers.length === 0) {
    return null; 
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex space-x-4 px-4 md:px-0 pb-3">
        {offers.map((offer) => (
          // Adjust width here for cards in the horizontal list
          // Example: w-80 (320px), w-96 (384px)
          // The card itself might also need internal adjustments if it's not responsive enough
          <FeaturedOfferCard 
            key={offer.id} 
            offer={offer} 
            className="w-80 sm:w-96 md:w-[400px] shrink-0 h-full" // Ensure cards don't shrink and maintain height
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible md:visible" />
    </ScrollArea>
  );
};

export default FeaturedOffersList;
