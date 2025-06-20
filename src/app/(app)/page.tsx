
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import OfferList from '@/components/offers/OfferList';
import { mockOffers, categories, mockFeaturedMerchants, type Offer } from '@/types';
import FeaturedOffersList from '@/components/offers/FeaturedOffersList';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, MapPin } from 'lucide-react';
import RecommendedOffersList from '@/components/offers/RecommendedOffersList';
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay'; // Import the map display

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  offerId: string;
  imageUrl?: string;
  'data-ai-hint'?: string;
}

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [mapCenter, setMapCenter] = useState({ lat: -3.0993, lng: -59.9839 }); // Default to Manaus center
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Set initial map center based on the first offer if available
    const firstOfferWithLocation = mockOffers.find(offer => offer.latitude && offer.longitude);
    if (firstOfferWithLocation?.latitude && firstOfferWithLocation?.longitude) {
      setMapCenter({ lat: firstOfferWithLocation.latitude, lng: firstOfferWithLocation.longitude });
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
        imageUrl: offer.galleryImages && offer.galleryImages.length > 0 ? offer.galleryImages[0] : offer.imageUrl,
        'data-ai-hint': offer.galleryImageHints && offer.galleryImageHints.length > 0 ? offer.galleryImageHints[0] : offer['data-ai-hint'] || 'offer location',
      }));
    setMapMarkers(markersData);
  }, []);


  const featuredOffers = useMemo(() => {
    return [
      mockOffers.find(offer => offer.id === 'offer-pizza-1'),
      mockOffers.find(offer => offer.id === 'offer-barber-2'),
      mockOffers.find(offer => offer.id === 'offer-sports-3'),
      mockOffers.find(offer => offer.id === 'offer-bar-4'),
    ].filter(Boolean) as typeof mockOffers;
  }, []);

  const filteredOffers = useMemo(() => {
    let offers = [...mockOffers];

    if (selectedCategory) {
      offers = offers.filter(offer => offer.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      offers = offers.filter(offer =>
        offer.title.toLowerCase().includes(lowerSearchTerm) ||
        offer.description.toLowerCase().includes(lowerSearchTerm) ||
        offer.merchantName.toLowerCase().includes(lowerSearchTerm) ||
        offer.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    const featuredOfferIds = featuredOffers.map(fo => fo.id);
    offers = offers.filter(offer => !featuredOfferIds.includes(offer.id));

    return offers;
  }, [searchTerm, selectedCategory, featuredOffers]);

  const recentOffers = useMemo(() => {
    return [...filteredOffers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [filteredOffers]);

  const recommendedOffers = useMemo(() => {
    const recentAndFeaturedIds = new Set([...recentOffers.map(ro => ro.id), ...featuredOffers.map(fo => fo.id)]);
    return mockOffers
      .filter(offer => !recentAndFeaturedIds.has(offer.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
  }, [recentOffers, featuredOffers]);


  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      {/* Map Section */}
      <section className="px-4 md:px-0">
        <h2 className="text-xl font-semibold font-headline mb-3 flex items-center gap-2">
          <MapPin className="text-primary" /> Encontre Ofertas no Mapa
        </h2>
        <div className="h-64 md:h-72 w-full rounded-lg overflow-hidden shadow-md border">
          <GoogleMapDisplay
            apiKey={googleMapsApiKey}
            mapCenter={mapCenter}
            zoom={12}
            markers={mapMarkers}
          />
        </div>
      </section>

      {featuredOffers.length > 0 && (
        <section className="space-y-3">
           <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Destaques Imperdíveis</h2>
          <FeaturedOffersList offers={featuredOffers} />
        </section>
      )}

      <div className="px-4 md:px-0 mt-6 mb-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ofertas, produtos, negócios..."
            className="pl-10 w-full h-11 rounded-lg bg-card shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {recommendedOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Recomendadas para Você</h2>
          <RecommendedOffersList offers={recommendedOffers} />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Comerciantes em Destaque</h2>
        <FeaturedMerchantsList merchants={mockFeaturedMerchants} />
      </section>

      {recentOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Ofertas Recentes</h2>
          <OfferList offers={recentOffers} />
        </section>
      )}
       {recentOffers.length === 0 && searchTerm && selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada para "{searchTerm}" na categoria "{selectedCategory}".</p>
       )}
       {recentOffers.length === 0 && searchTerm && !selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada para "{searchTerm}".</p>
       )}
       {recentOffers.length === 0 && !searchTerm && selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada na categoria "{selectedCategory}".</p>
       )}


       {/* This logic might need adjustment if recommendedOffers are always present */}
       {filteredOffers.length === 0 && !featuredOffers.some(fo => fo.category.toLowerCase() === selectedCategory.toLowerCase() || searchTerm.trim() === '') && (
        <p className="text-center text-muted-foreground py-10 px-4 md:px-0 text-lg">
            Nenhuma oferta encontrada com os filtros aplicados. <br/> Tente ajustar sua busca ou categoria.
        </p>
       )}
    </div>
  );
}
