
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, MapPinned } from 'lucide-react';
import { type Offer } from '@/types';
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MapOfferList from '@/components/offers/MapOfferList';
import { FirestoreConnectionError } from '@/components/common/FirestoreConnectionError';
import Image from 'next/image';

export default function MapPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedOffers = await getAllOffers();
        setOffers(fetchedOffers);
      } catch (err: any) {
        console.error("Error fetching offers for map:", err);
        setError(err.message || "Não foi possível carregar os dados das ofertas. Verifique sua conexão e tente novamente.");
        setOffers([]);
      }
      setLoading(false);
    };

    fetchOffers();
  }, []);

  if (error) {
     return <FirestoreConnectionError message={error} />;
  }

  if (loading) {
     return (
      <div className="flex justify-center items-center flex-grow">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!googleMapsApiKey) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center text-center flex-grow">
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
  const markers = offers
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
    <div className="flex flex-col h-full">
      {/* Map Section */}
      <div className="flex-grow relative">
        <GoogleMapDisplay
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={13}
          markers={markers}
        />
      </div>
      
      {/* Listings Section */}
      <div className="flex-shrink-0 bg-card border-t shadow-lg rounded-t-2xl -mt-4 z-10">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold font-headline">Ofertas Próximas</h2>
          </div>
          {offers.length > 0 ? (
            <MapOfferList offers={offers} />
          ) : (
             <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-3">
                <MapPinned className="h-10 w-10 text-primary/50" />
                <p>Nenhuma oferta encontrada nesta área.</p>
                <p className="text-xs">Tente navegar ou ampliar o mapa para buscar em outros locais.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
