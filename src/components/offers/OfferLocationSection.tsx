
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
        {/* Placeholder for an interactive map component */}
        <div className="w-full h-60 bg-muted rounded-md flex items-center justify-center border border-dashed">
          <div className="text-center text-muted-foreground">
            <MapPin size={40} className="mx-auto mb-2" />
            <p className="font-medium">Mapa Interativo (Em Breve)</p>
            <p className="text-sm">Aqui você verá a localização exata do negócio.</p>
          </div>
        </div>
        <Button onClick={openGoogleMaps} className="w-full bg-secondary hover:bg-secondary/90">
          <Navigation className="mr-2" /> Ver Rotas no Google Maps
        </Button>
      </CardContent>
    </Card>
  );
};

export default OfferLocationSection;
