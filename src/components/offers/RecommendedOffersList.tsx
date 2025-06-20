
'use client';

import type { Offer } from '@/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import RecommendedOfferCard from './RecommendedOfferCard';

interface RecommendedOffersListProps {
  offers: Offer[];
}

const RecommendedOffersList: React.FC<RecommendedOffersListProps> = ({ offers }) => {
  if (!offers || offers.length === 0) {
    return null; 
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex space-x-3 px-4 md:px-0 pb-3">
        {offers.map((offer) => (
          <RecommendedOfferCard 
            key={offer.id} 
            offer={offer} 
            className="w-60 sm:w-64 md:w-72 shrink-0 h-full" // Adjust width as needed
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible md:visible" />
    </ScrollArea>
  );
};

export default RecommendedOffersList;
