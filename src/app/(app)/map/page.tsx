
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
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay';

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
  const nearbyOffers = useMemo(() => {
    return mockOffers
      .filter(offer => offer.latitude && offer.longitude)
      .slice(0, 5);
  }, []);
  
  const [mapCenter, setMapCenter] = useState({ lat: -3.0993, lng: -59.9839 }); // Default to Manaus center
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const firstOfferWithLocation = mockOffers.find(offer => offer.latitude && offer.longitude);
    if (firstOfferWithLocation?.latitude && firstOfferWithLocation?.longitude) {
      setMapCenter({ lat: firstOfferWithLocation.latitude, lng: firstOfferWithLocation.longitude });
    }

    const markersData = mockOffers
      .filter(offer => offer.latitude && offer.longitude)
      .map(offer => ({
        id: offer.id,
        lat: offer.latitude as number,
        lng: offer.longitude as number,
        title: offer.title,
        offerId: offer.id,
        imageUrl: offer.galleryImages && offer.galleryImages.length > 0 ? offer.galleryImages[0] : offer.imageUrl,
        'data-ai-hint': offer.galleryImageHints && offer.galleryImageHints.length > 0 ? offer.galleryImageHints[0] : offer['data-ai-hint'] || 'offer location',
      }));
    setMapMarkers(markersData);
  }, []);


  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // TODO: Filter mapMarkers or nearbyOffers here based on category
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying advanced filters:', filters);
    // TODO: Apply filter logic to mapMarkers and nearbyOffers
    setIsFiltersSheetOpen(false);
  };

  const handleClearFilters = () => {
    console.log('Clearing advanced filters');
    // TODO: Reset filter logic
    setIsFiltersSheetOpen(false);
  };

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="flex flex-col h-full"> {/* Ensures this div takes full height */}
      {/* Map Section - Takes up available space */}
      <div className="flex-1 relative shadow-lg rounded-lg overflow-hidden min-h-[300px] md:min-h-[400px]"> {/* Ensure this container has dimensions */}
        <GoogleMapDisplay 
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={12}
          markers={mapMarkers}
        />
      </div>

      {/* Filter Bar Section */}
      <div className="shrink-0 px-1 py-3 md:px-3 md:py-3 border-t bg-background">
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
            <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-2xl p-0">
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
        {nearbyOffers.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-3 px-4 pb-2.5">
              {nearbyOffers.map((offer) => (
                <div key={offer.id} className="w-72 shrink-0">
                  <RecommendedOfferCard offer={offer} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p className="px-4 text-sm text-muted-foreground">Nenhuma oferta próxima encontrada no momento.</p>
        )}
      </div>
    </div>
  );
}
