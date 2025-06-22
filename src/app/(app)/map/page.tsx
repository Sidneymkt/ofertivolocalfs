
'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, MapPinned, SlidersHorizontal } from 'lucide-react';
import { type Offer } from '@/types';
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MapOfferList from '@/components/offers/MapOfferList';
import { FirestoreConnectionError } from '@/components/common/FirestoreConnectionError';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AdvancedFiltersSheet from '@/components/map/AdvancedFiltersSheet';
import { calculateDistance } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';


export default function MapPage() {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const mapDisplayRef = useRef<{ getCenter: () => { lat: number; lng: number } | null }>(null);


  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedOffers = await getAllOffers();
        setAllOffers(fetchedOffers);
      } catch (err: any)
      {
        console.error("Error fetching offers for map:", err);
        setError(err.message || "Não foi possível carregar os dados das ofertas. Verifique sua conexão e tente novamente.");
        setAllOffers([]);
      }
      setLoading(false);
    };

    fetchOffers();
  }, []);

  const applyFilters = useCallback((newFilters: any) => {
    const currentCenter = mapDisplayRef.current?.getCenter();
    setFilters({ ...newFilters, centerForDistance: currentCenter });
    setIsFilterSheetOpen(false);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setIsFilterSheetOpen(false);
  }, []);
  
  const filteredOffers = useMemo(() => {
    if (!allOffers) {
      return [];
    }
    
    let tempOffers = [...allOffers];

    if (Object.keys(filters).length === 0) {
      return tempOffers;
    }

    // Filter by distance
    if (filters.distance && filters.distance !== 'Qualquer' && filters.centerForDistance) {
      const maxDistance = parseInt(filters.distance.replace(/[^0-9]/g, ''), 10);
      tempOffers = tempOffers.filter(offer => {
        if (!offer.latitude || !offer.longitude) return false;
        const dist = calculateDistance(filters.centerForDistance.lat, filters.centerForDistance.lng, offer.latitude, offer.longitude);
        return dist < maxDistance;
      });
    }

    // Filter by price range
    if (filters.priceRange) {
        tempOffers = tempOffers.filter(offer => 
            offer.discountedPrice >= filters.priceRange[0] && 
            (filters.priceRange[1] >= 500 ? true : offer.discountedPrice <= filters.priceRange[1])
        );
    }
    
    // Filter by offer type
    if (filters.selectedOfferTypes && filters.selectedOfferTypes.length > 0) {
        tempOffers = tempOffers.filter(offer => filters.selectedOfferTypes.includes(offer.offerType));
    }
    
    // Filter by category
    if (filters.selectedSubCategories && filters.selectedSubCategories.length > 0) {
        tempOffers = tempOffers.filter(offer => filters.selectedSubCategories.includes(offer.category));
    }

    // Filter by rating
    if (filters.minRating) {
        tempOffers = tempOffers.filter(offer => (offer.rating || 0) >= filters.minRating);
    }
    
    // Sorting
    if (filters.sortBy) {
        tempOffers.sort((a, b) => {
            switch (filters.sortBy) {
                case 'distance':
                    const distA = filters.centerForDistance ? calculateDistance(filters.centerForDistance.lat, filters.centerForDistance.lng, a.latitude || 0, a.longitude || 0) : Infinity;
                    const distB = filters.centerForDistance ? calculateDistance(filters.centerForDistance.lat, filters.centerForDistance.lng, b.latitude || 0, b.longitude || 0) : Infinity;
                    return distA - distB;
                case 'newest':
                    const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                    const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                case 'price_asc':
                    return a.discountedPrice - b.discountedPrice;
                case 'price_desc':
                    return b.discountedPrice - a.discountedPrice;
                default: // popularity (placeholder)
                    return (b.reviews || 0) - (a.reviews || 0);
            }
        });
    }

    return tempOffers;
  }, [allOffers, filters]);


  if (loading) {
     return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
     return <FirestoreConnectionError message={error} />;
  }

  if (!googleMapsApiKey) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center text-center h-full">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <MapPinned className="h-8 w-8 text-muted-foreground" />
              Mapa Interativo Indisponível
            </CardTitle>
            <CardDescription>
              Para ativar o mapa, a chave da API do Google Maps precisa ser configurada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src="https://placehold.co/800x400.png"
              alt="Placeholder de mapa"
              width={800}
              height={400}
              className="rounded-md opacity-50"
              data-ai-hint="world map"
            />
             <p className="text-sm text-muted-foreground mt-4">
                Esta funcionalidade requer uma chave de API do Google Maps. Por favor, adicione <code className="font-mono text-xs bg-muted p-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> ao seu ambiente para habilitá-la.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mapCenter = { lat: -3.0993, lng: -59.9839 }; // Default to Manaus center
  const markers = filteredOffers
    .filter(offer => offer.latitude && offer.longitude)
    .map(offer => ({
      id: offer.id!,
      lat: offer.latitude!,
      lng: offer.longitude!,
      title: offer.title,
      offerId: offer.id!,
      imageUrl: offer.imageUrl,
      'data-ai-hint': offer['data-ai-hint'],
    }));

  return (
    // This layout structure is the definitive fix.
    // 1. h-full: Makes the container take the full height provided by the parent layout.
    // 2. flex flex-col: Distributes the vertical space among its children.
    <div className="h-full flex flex-col">
      {/* 3. flex-grow: This div expands to take up all available vertical space, guaranteeing a height for the map. */}
      <div className="flex-grow">
        <GoogleMapDisplay
          ref={mapDisplayRef}
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={13}
          markers={markers}
        />
      </div>

      {/* 4. shrink-0: This div takes only the space it needs, it does not grow or shrink. */}
      <div className="shrink-0 bg-card/90 backdrop-blur-sm border-t shadow-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold font-headline">Ofertas Próximas</h2>
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <SlidersHorizontal size={16} />
                      Filtros
                  </Button>
              </SheetTrigger>
              <SheetContent className="p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b">
                      <SheetTitle>Filtros Avançados</SheetTitle>
                  </SheetHeader>
                  <AdvancedFiltersSheet onApplyFilters={applyFilters} onClearFilters={clearFilters} />
              </SheetContent>
          </Sheet>
        </div>
        {filteredOffers.length > 0 ? (
          <MapOfferList offers={filteredOffers} />
        ) : (
           <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-3">
              <MapPinned className="h-10 w-10 text-primary/50" />
              <p>Nenhuma oferta encontrada com os filtros atuais.</p>
              <p className="text-xs">Tente ajustar ou limpar os filtros para ver mais resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
