
'use client';

import React, { useState, useMemo } from 'react'; // Added useMemo
import InteractiveMapPlaceholder from '@/components/map/InteractiveMapPlaceholder';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ListFilter } from 'lucide-react';
import OfferCard from '@/components/offers/OfferCard';
import RecommendedOffersList from '@/components/offers/RecommendedOffersList'; // Import RecommendedOffersList
import { mockOffers, categories } from '@/types';
import CategoryPills from '@/components/offers/CategoryPills';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdvancedFiltersSheet from '@/components/map/AdvancedFiltersSheet';

export default function MapPage() {
  const nearbyOffers = useMemo(() => mockOffers.slice(0, 5), []);
  // Create a distinct list for recommended offers on the map page
  const recommendedOffersOnMap = useMemo(() => {
    const nearbyOfferIds = new Set(nearbyOffers.map(o => o.id));
    return mockOffers.filter(offer => !nearbyOfferIds.has(offer.id)).slice(0, 8); // Get up to 8 distinct offers
  }, [nearbyOffers]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    console.log('MapPage - Selected Category:', categoryName);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying advanced filters:', filters);
    // Add logic to filter map markers or nearbyOffers based on advanced filters
    setIsFiltersSheetOpen(false); // Close sheet after applying
  };

  const handleClearFilters = () => {
    console.log('Clearing advanced filters');
    // Add logic to reset advanced filters
    setIsFiltersSheetOpen(false); // Close sheet after clearing
  };


  return (
    <div className="flex flex-col h-[calc(100vh_-_8rem)]"> {/* Adjust height considering header and bottom nav */}
      {/* Map Section */}
      <div className="flex-grow relative p-1 md:p-2"> {/* Added small padding for visual separation */}
        <InteractiveMapPlaceholder />
      </div>

      {/* Filter Bar Section */}
      <div className="shrink-0 p-3 border-t bg-background">
        <div className="flex items-center gap-2">
          <div className="flex-grow">
            <CategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
          <Sheet open={isFiltersSheetOpen} onOpenChange={setIsFiltersSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label="Abrir filtros avançados"
              >
                <ListFilter size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-2xl">
              <SheetHeader className="px-4 py-3 border-b">
                <SheetTitle className="text-lg">Filtros Avançados</SheetTitle>
                <SheetDescription>
                  Refine sua busca para encontrar as melhores ofertas.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto">
                <AdvancedFiltersSheet onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Horizontal Scrollable Nearby Offer List Section */}
      <div className="shrink-0 py-3 bg-background border-t">
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

      {/* New Recommended Offers Section */}
      {recommendedOffersOnMap.length > 0 && (
        <div className="shrink-0 py-3 bg-background border-t">
          <h3 className="text-md font-semibold px-4 mb-2">Mais Sugestões para Você</h3>
          <RecommendedOffersList offers={recommendedOffersOnMap} />
        </div>
      )}
    </div>
  );
}
