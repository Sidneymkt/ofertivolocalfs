
'use client';

import type { Offer } from '@/types';
import FeaturedOfferCard from './FeaturedOfferCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface FeaturedOffersListProps {
  offers: Offer[];
}

const FeaturedOffersList: React.FC<FeaturedOffersListProps> = ({ offers }) => {
  if (!offers || offers.length === 0) {
    return null; 
  }

  return (
    <div className="relative">
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {offers.map((offer) => (
            <FeaturedOfferCard
              key={offer.id}
              offer={offer}
              className="w-[80vw] max-w-[320px] sm:w-[350px] sm:max-w-none md:w-[400px]" // Responsive widths
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default FeaturedOffersList;
