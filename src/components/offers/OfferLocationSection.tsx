
'use client';

import React from 'react';
import type { Offer } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import Image from 'next/image';

interface OfferLocationSectionProps {
  offer: Offer;
}

const OfferLocationSection: React.FC<OfferLocationSectionProps> = ({ offer }) => {
  const openGoogleMaps = () => {
    if (offer.latitude && offer.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${offer.latitude},${offer.longitude}`;
      window.open(url, '_blank');
    } else {
      // Fallback if no lat/lng, search by merchant name (less accurate)
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offer.merchantName)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="shadow-lg" id="location-section">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <MapPin className="mr-2 text-primary" /> Localização
        </CardTitle>
        <CardDescription>{offer.merchantName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-60 relative bg-muted rounded-md overflow-hidden border border-border">
          <Image
            src="https://placehold.co/600x300.png"
            alt={`Localização de ${offer.merchantName} placeholder`}
            layout="fill"
            objectFit="cover"
            data-ai-hint="street map"
          />
           {/* Você pode adicionar um ícone de marcador sobreposto aqui se desejar */}
           {/* Exemplo: <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500" size={24} /> */}
        </div>
        <Button onClick={openGoogleMaps} className="w-full bg-secondary hover:bg-secondary/90">
          <Navigation className="mr-2" /> Ver Rotas no Google Maps
        </Button>
      </CardContent>
    </Card>
  );
};

export default OfferLocationSection;
