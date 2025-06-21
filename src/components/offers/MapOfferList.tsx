
'use client';

import type { Offer } from '@/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import MapOfferCard from './MapOfferCard';

interface MapOfferListProps {
  offers: Offer[];
}

const MapOfferList: React.FC<MapOfferListProps> = ({ offers }) => {
  if (offers.length === 0) {
    return <p className="text-center text-muted-foreground py-10">Nenhuma oferta encontrada na área.</p>;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap -mx-4 px-4">
      <div className="flex space-x-4 pb-4">
        {offers.map((offer) => (
          <MapOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default MapOfferList;
