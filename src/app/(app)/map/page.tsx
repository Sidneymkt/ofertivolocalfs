
'use client';

import React, { useState } from 'react'; // Added useState
import InteractiveMapPlaceholder from '@/components/map/InteractiveMapPlaceholder';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ListFilter } from 'lucide-react'; // Removed Leaf, Coffee, Beef, CakeSlice, ChevronDown
import OfferCard from '@/components/offers/OfferCard'; 
import { mockOffers, categories } from '@/types'; // Import mockOffers and categories
import CategoryPills from '@/components/offers/CategoryPills'; // Import CategoryPills

export default function MapPage() {
  const nearbyOffers = mockOffers.slice(0, 5);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // State for selected category

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Placeholder: Add logic here to filter map markers or the nearbyOffers list based on categoryName
    console.log('MapPage - Selected Category:', categoryName);
  };

  return (
    <div className="flex flex-col h-[calc(100vh_-_8rem)]"> {/* Adjust height considering header and bottom nav */}
      {/* Map Section */}
      <div className="flex-grow relative">
        <InteractiveMapPlaceholder />
      </div>

      {/* Horizontal Scrollable Offer List Section */}
      <div className="shrink-0 py-3 bg-background border-t border-b">
        <h3 className="text-md font-semibold px-4 mb-2">Ofertas Próximas no Mapa</h3>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 px-4 pb-2.5">
            {nearbyOffers.map((offer) => (
              <div key={offer.id} className="w-72 shrink-0">
                <OfferCard offer={offer} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Bottom Sheet / Filter Section */}
      <div className="p-4 mt-auto shrink-0"> {/* Removed bg-accent, text-accent-foreground, shadow-t-xl, rounded-t-2xl */}
        {/* Removed "Manaus Offers" title and "De" button div */}

        {/* CategoryPills component replacing the old buttons */}
        <div className="mb-3"> {/* Add margin-bottom for spacing */}
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
        
        {/* "Todos Filtros" button can remain or be integrated elsewhere */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="flex items-center justify-center h-12 w-full rounded-lg bg-card hover:bg-muted border-border text-sm" // Adjusted styling for a more standard look
          >
            <ListFilter size={20} className="mr-2" />
            Ver Todos os Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
