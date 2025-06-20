
'use client';

import React from 'react';
import InteractiveMapPlaceholder from '@/components/map/InteractiveMapPlaceholder';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Leaf, Coffee, Beef, CakeSlice, ListFilter, ChevronDown } from 'lucide-react';
import OfferCard from '@/components/offers/OfferCard'; // Import OfferCard
import { mockOffers } from '@/types'; // Import mockOffers

// Mock categories for the filter bar, similar to the prototype
const mapCategories = [
  { name: 'Natureza', icon: Leaf, 'data-ai-hint': 'leaf nature' },
  { name: 'Cafés', icon: Coffee, 'data-ai-hint': 'coffee bean' },
  { name: 'Carnes', icon: Beef, 'data-ai-hint': 'meat steak' },
  { name: 'Padarias', icon: CakeSlice, 'data-ai-hint': 'bread pastry' },
];

export default function MapPage() {
  // Take a few offers for the horizontal list, e.g., first 5
  const nearbyOffers = mockOffers.slice(0, 5);

  return (
    <div className="flex flex-col h-[calc(100vh_-_8rem)]"> {/* Adjust height considering header and bottom nav */}
      {/* Map Section */}
      <div className="flex-grow relative">
        <InteractiveMapPlaceholder />
        {/* Potentially add overlay buttons for map interaction here if needed */}
      </div>

      {/* Horizontal Scrollable Offer List Section */}
      <div className="shrink-0 py-3 bg-background border-t border-b">
        <h3 className="text-md font-semibold px-4 mb-2">Ofertas Próximas no Mapa</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 px-4 pb-2.5">
            {nearbyOffers.map((offer) => (
              <div key={offer.id} className="w-72 shrink-0"> {/* Fixed width for each card container */}
                <OfferCard offer={offer} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Bottom Sheet / Filter Section - Styled like the prototype */}
      <div className="bg-accent text-accent-foreground p-4 shadow-t-xl rounded-t-2xl mt-auto shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold font-headline">Manaus Offers</h3>
          <Button variant="ghost" size="sm" className="text-accent-foreground hover:bg-accent/80">
            De <ChevronDown size={16} className="ml-1" />
          </Button>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-2.5">
            {mapCategories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className="flex flex-col items-center justify-center h-20 w-20 rounded-lg bg-accent/20 hover:bg-accent/40 border-accent-foreground/30"
              >
                <category.icon size={28} className="mb-1" />
                <span className="text-xs text-center">{category.name}</span>
              </Button>
            ))}
             <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-20 w-20 rounded-lg bg-accent/20 hover:bg-accent/40 border-accent-foreground/30"
              >
                <ListFilter size={28} className="mb-1" />
                <span className="text-xs text-center">Todos Filtros</span>
              </Button>
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
}
