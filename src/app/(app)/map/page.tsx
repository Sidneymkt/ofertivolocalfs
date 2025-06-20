
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
// import { getAllOffers } from '@/lib/firebase/services/offerService'; // Comentado para usar mock
import { Timestamp } from 'firebase/firestore';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  offerId: string;
  imageUrl?: string;
  'data-ai-hint'?: string;
}

// Mock data para ofertas no mapa
const mockMapOffers: Offer[] = [
  {
    id: 'map-offer-1',
    title: 'Café Aconchegante no Centro',
    description: 'Cafés especiais e bolos caseiros.',
    merchantName: 'Cafeteria Central',
    merchantId: 'merchant-map-1',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'cafe coffee shop',
    category: 'Alimentação',
    discountedPrice: 15.00,
    originalPrice: 20.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 7))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'normal',
    status: 'active',
    latitude: -3.1019, // Perto do Teatro Amazonas
    longitude: -60.0228,
    usersUsedCount: 10,
    rating: 4.5,
    reviews: 5,
  },
  {
    id: 'map-offer-2',
    title: 'Livraria Charme da Praça',
    description: 'Livros raros e novidades.',
    merchantName: 'Livraria da Praça',
    merchantId: 'merchant-map-2',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'bookstore books library',
    category: 'Compras',
    discountedPrice: 50.00, // Preço simbólico
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 30))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'normal',
    status: 'active',
    latitude: -3.1305, // Perto da Praça da Saudade
    longitude: -60.0217,
    usersUsedCount: 5,
    rating: 4.8,
    reviews: 3,
  },
  {
    id: 'map-offer-3',
    title: 'Restaurante Regional Saboroso',
    description: 'Pratos típicos da Amazônia.',
    merchantName: 'Sabor da Terra',
    merchantId: 'merchant-map-3',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'restaurant regional food',
    category: 'Alimentação',
    discountedPrice: 45.00,
    originalPrice: 60.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 15))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'destaque',
    status: 'active',
    latitude: -3.0900, // Adrianópolis
    longitude: -59.9990,
    usersUsedCount: 25,
    rating: 4.7,
    reviews: 12,
  }
];


export default function MapPage() {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mapCenter, setMapCenter] = useState({ lat: -3.0993, lng: -59.9839 }); // Default to Manaus center
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        // const offersData = await getAllOffers(); // Fetch all active offers
        const offersData = mockMapOffers; // Usando mock data
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
        // Em um cenário real, você poderia exibir um toast ou mensagem de erro aqui
      }
      setLoading(false);
    };
    fetchOffers();
  }, []);

  const nearbyOffers = useMemo(() => {
    // Com mock data, apenas pegamos uma fatia. Com dados reais, a lógica de proximidade seria mais complexa.
    return allOffers
      .filter(offer => offer.latitude && offer.longitude)
      .slice(0, 10);
  }, [allOffers]);


  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
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
    // TODO: Aplicar lógica de filtro avançado aos mapMarkers e allOffers para a lista
    // Por enquanto, apenas filtra por categoria se uma estiver selecionada nos filtros avançados
    let filteredByAdvanced = [...allOffers];
    if (filters.selectedSubCategories && filters.selectedSubCategories.length > 0) {
        const lowerSelectedSubCategories = filters.selectedSubCategories.map((sc: string) => sc.toLowerCase());
        filteredByAdvanced = filteredByAdvanced.filter(offer => 
            offer.category && lowerSelectedSubCategories.includes(offer.category.toLowerCase())
        );
    }
    // Aqui você adicionaria mais lógicas de filtro baseadas em 'filters'

    const newMarkers = filteredByAdvanced
        .filter(offer => offer.latitude && offer.longitude)
        .map(offer => ({
            id: offer.id!, lat: offer.latitude as number, lng: offer.longitude as number, title: offer.title, offerId: offer.id!,
            imageUrl: offer.galleryImages?.[0] || offer.imageUrl, 'data-ai-hint': offer.galleryImageHints?.[0] || offer['data-ai-hint'] || 'offer location'
        }));
    setMapMarkers(newMarkers);
    setAllOffers(filteredByAdvanced); // Atualiza a lista de ofertas próximas também

    setIsFiltersSheetOpen(false);
};


  const handleClearFilters = () => {
    console.log('Clearing advanced filters');
    setSelectedCategory(''); 
    setAllOffers(mockMapOffers); // Reset to mock data
    const allMarkers = mockMapOffers // Reset markers from mock data
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
      <div className="flex-grow relative shadow-lg rounded-lg overflow-hidden border">
        <GoogleMapDisplay 
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={13} // Ajuste o zoom inicial se necessário
          markers={mapMarkers}
        />
      </div>

      <div className="flex-shrink-0 bg-background border-t">
        <div className="px-1 py-3 md:px-3 md:py-3">
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

        <div className="py-3 border-t">
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
            <p className="px-4 text-sm text-muted-foreground">Nenhuma oferta próxima encontrada com os filtros atuais.</p>
          )}
        </div>
      </div>
    </div>
  );
}

