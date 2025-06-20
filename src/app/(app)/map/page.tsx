
'use client';

import React, { useState } from 'react';
import InteractiveMapPlaceholder from '@/components/map/InteractiveMapPlaceholder';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ListFilter } from 'lucide-react';
import OfferCard from '@/components/offers/OfferCard';
import { mockOffers, categories } from '@/types';
import CategoryPills from '@/components/offers/CategoryPills';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import AdvancedFiltersSheet from '@/components/map/AdvancedFiltersSheet';

export default function MapPage() {
  const nearbyOffers = mockOffers.slice(0, 5);
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
      <div className="p-4 mt-auto shrink-0">
        <div className="mb-3">
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
        
        <div className="flex justify-center">
          <Sheet open={isFiltersSheetOpen} onOpenChange={setIsFiltersSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-center h-12 w-full rounded-lg bg-card hover:bg-muted border-border text-sm"
              >
                <ListFilter size={20} className="mr-2" />
                Ver Todos os Filtros
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
              {/* Footer is now inside AdvancedFiltersSheet */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
