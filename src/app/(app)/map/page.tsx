
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ListFilter, Loader2 } from 'lucide-react';
import RecommendedOfferCard from '@/components/offers/RecommendedOfferCard';
import { categories, type Offer } from '@/types';
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
import { getAllOffers } from '@/lib/firebase/services/offerService';

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
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mapCenter, setMapCenter] = useState({ lat: -3.0993, lng: -59.9839 }); // Default to Manaus center
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const offersData = await getAllOffers(); // Fetch all active offers
        setAllOffers(offersData);

        const firstOfferWithLocation = offersData.find(offer => offer.latitude && offer.longitude);
        if (firstOfferWithLocation?.latitude && firstOfferWithLocation?.longitude) {
          setMapCenter({ lat: firstOfferWithLocation.latitude, lng: firstOfferWithLocation.longitude });
        }

        const markersData = offersData
          .filter(offer => offer.latitude && offer.longitude)
          .map(offer => ({
            id: offer.id!,
            lat: offer.latitude as number,
            lng: offer.longitude as number,
            title: offer.title,
            offerId: offer.id!,
            imageUrl: offer.galleryImages && offer.galleryImages.length > 0 ? offer.galleryImages[0] : offer.imageUrl,
            'data-ai-hint': offer.galleryImageHints && offer.galleryImageHints.length > 0 ? offer.galleryImageHints[0] : offer['data-ai-hint'] || 'offer location',
          }));
        setMapMarkers(markersData);

      } catch (error) {
        console.error("Error fetching offers for map:", error);
      }
      setLoading(false);
    };
    fetchOffers();
  }, []);

  const nearbyOffers = useMemo(() => {
    // For now, just show a slice of all offers. Real "nearby" would need user location.
    return allOffers
      .filter(offer => offer.latitude && offer.longitude)
      .slice(0, 10);
  }, [allOffers]);


  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // Filter mapMarkers based on category
    const filtered = allOffers
      .filter(offer => offer.latitude && offer.longitude && (categoryName === '' || offer.category === categoryName))
      .map(offer => ({
        id: offer.id!, lat: offer.latitude as number, lng: offer.longitude as number, title: offer.title, offerId: offer.id!,
        imageUrl: offer.galleryImages?.[0] || offer.imageUrl, 'data-ai-hint': offer.galleryImageHints?.[0] || offer['data-ai-hint'] || 'offer location'
      }));
    setMapMarkers(filtered);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying advanced filters:', filters);
    // TODO: Apply advanced filter logic to mapMarkers and allOffers for the list
    setIsFiltersSheetOpen(false);
  };

  const handleClearFilters = () => {
    console.log('Clearing advanced filters');
    setSelectedCategory(''); // Reset category filter
    const allMarkers = allOffers
        .filter(offer => offer.latitude && offer.longitude)
        .map(offer => ({
            id: offer.id!, lat: offer.latitude as number, lng: offer.longitude as number, title: offer.title, offerId: offer.id!,
            imageUrl: offer.galleryImages?.[0] || offer.imageUrl, 'data-ai-hint': offer.galleryImageHints?.[0] || offer['data-ai-hint'] || 'offer location'
        }));
    setMapMarkers(allMarkers);
    setIsFiltersSheetOpen(false);
  };

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-[65vh] relative shadow-lg rounded-lg overflow-hidden">
        <GoogleMapDisplay 
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={12}
          markers={mapMarkers}
        />
      </div>

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
