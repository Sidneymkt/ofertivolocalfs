
'use client';

import type { Offer } from '@/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import OfferCard from './OfferCard'; // Usaremos o OfferCard existente

interface RecentOffersListProps {
  offers: Offer[];
}

const RecentOffersList: React.FC<RecentOffersListProps> = ({ offers }) => {
  if (!offers || offers.length === 0) {
    return null; 
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex space-x-4 px-4 md:px-0 pb-3">
        {offers.map((offer) => (
          <div key={offer.id} className="w-80 sm:w-[350px] md:w-[370px] shrink-0 h-full"> {/* Ajuste a largura conforme necessário */}
            <OfferCard offer={offer} />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible md:visible" />
    </ScrollArea>
  );
};

export default RecentOffersList;
