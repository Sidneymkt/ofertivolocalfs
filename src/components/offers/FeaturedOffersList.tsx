
'use client';

import type { Offer } from '@/types';
import FeaturedOfferCard from './FeaturedOfferCard';

interface FeaturedOffersListProps {
  offers: Offer[];
}

const FeaturedOffersList: React.FC<FeaturedOffersListProps> = ({ offers }) => {
  if (!offers || offers.length === 0) {
    return null; 
  }

  // To match the new design, we'll render just the first featured offer as a large banner.
  const mainBannerOffer = offers[0];

  return (
    <div className="space-y-4">
        <FeaturedOfferCard 
            key={mainBannerOffer.id} 
            offer={mainBannerOffer}
        />
    </div>
  );
};

export default FeaturedOffersList;
