
'use client';

import React from 'react';
import type { Offer } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay'; // Import the interactive map
import Image from 'next/image';

interface OfferLocationSectionProps {
  offer: Offer;
}

const OfferLocationSection: React.FC<OfferLocationSectionProps> = ({ offer }) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const openGoogleMapsExternal = () => {
    if (offer.latitude && offer.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${offer.latitude},${offer.longitude}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offer.merchantName + (offer.businessAddress ? ', ' + offer.businessAddress : ''))}`;
      window.open(url, '_blank');
    }
  };

  const mapCenter = offer.latitude && offer.longitude ? { lat: offer.latitude, lng: offer.longitude } : null;
  const markers = mapCenter ? [{
    id: offer.id,
    lat: offer.latitude as number,
    lng: offer.longitude as number,
    title: offer.title,
    offerId: offer.id,
    imageUrl: offer.imageUrl,
    'data-ai-hint': offer['data-ai-hint'] || 'offer location',
  }] : [];

  return (
    <Card className="shadow-lg" id="location-section">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <MapPin className="mr-2 text-primary" /> Localização
        </CardTitle>
        <CardDescription>{offer.merchantName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-60 md:h-72 relative bg-muted rounded-md overflow-hidden border border-border">
          {googleMapsApiKey && mapCenter ? (
            <GoogleMapDisplay
              apiKey={googleMapsApiKey}
              mapCenter={mapCenter}
              zoom={15}
              markers={markers}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center p-4 bg-muted relative">
              <Image 
                src="https://placehold.co/800x400.png" 
                alt="Placeholder de Mapa" 
                layout="fill"
                objectFit="cover"
                className="opacity-20"
                data-ai-hint="city map"
              />
              <div className="relative z-10">
                { !googleMapsApiKey && <p className="text-muted-foreground text-sm font-semibold">Mapa interativo indisponível.</p> }
                { googleMapsApiKey && !mapCenter && <p className="text-muted-foreground text-sm">Localização não fornecida.</p> }
              </div>
            </div>
          )}
        </div>
        <Button onClick={openGoogleMapsExternal} className="w-full bg-secondary hover:bg-secondary/90">
          <Navigation className="mr-2" /> Ver Rotas no Google Maps
        </Button>
      </CardContent>
    </Card>
  );
};

export default OfferLocationSection;
