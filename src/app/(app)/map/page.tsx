
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ListFilter } from 'lucide-react';
import RecommendedOfferCard from '@/components/offers/RecommendedOfferCard';
import { mockOffers, categories, type Offer } from '@/types';
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
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay'; // Import the new map component

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  offerId: string;
  imageUrl?: string;
  'data-ai-hint'?: string;
}

export default function MapPage() {
  const nearbyOffers = useMemo(() => mockOffers.slice(0, 5), []);
  
  const [mapCenter, setMapCenter] = useState({ lat: -3.0993, lng: -59.9839 }); // Default to Manaus center
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    // Set initial map center based on the first offer if available
    if (mockOffers.length > 0 && mockOffers[0].latitude && mockOffers[0].longitude) {
      setMapCenter({ lat: mockOffers[0].latitude, lng: mockOffers[0].longitude });
    }

    // Prepare markers from mockOffers
    const markersData = mockOffers
      .filter(offer => offer.latitude && offer.longitude)
      .map(offer => ({
        id: offer.id,
        lat: offer.latitude as number,
        lng: offer.longitude as number,
        title: offer.title,
        offerId: offer.id,
        imageUrl: offer.imageUrl,
        'data-ai-hint': offer['data-ai-hint'],
      }));
    setMapMarkers(markersData);
  }, []);


  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    console.log('MapPage - Selected Category:', categoryName);
    // Potentially filter mapMarkers or nearbyOffers here based on category
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying advanced filters:', filters);
    // Apply filter logic to mapMarkers and nearbyOffers
    setIsFiltersSheetOpen(false);
  };

  const handleClearFilters = () => {
    console.log('Clearing advanced filters');
    // Reset filter logic
    setIsFiltersSheetOpen(false);
  };

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="flex flex-col h-full">
      {/* Map Section - Moved to the top */}
      <div className="flex-1 relative p-1 md:p-2">
        <GoogleMapDisplay 
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={12}
          markers={mapMarkers}
        />
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
                <RecommendedOfferCard offer={offer} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
