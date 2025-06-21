
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, MapPinned } from 'lucide-react';
import { type Offer } from '@/types';
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MapOfferList from '@/components/offers/MapOfferList';

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
        if (fetchedOffers.length === 0) {
            setError("Nenhuma oferta encontrada na área. Tente explorar o mapa.");
        }
        setOffers(fetchedOffers);
      } catch (err: any) {
        console.error("Error fetching offers for map:", err);
        setError("Não foi possível carregar os dados das ofertas. Verifique sua conexão e tente novamente.");
        setOffers([]); // Ensure offers is empty on error
      }
      setLoading(false);
    };

    fetchOffers();
  }, []);

  if (!googleMapsApiKey) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="m-4 shadow-lg border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold text-destructive">Chave da API do Google Maps não configurada!</h2>
            <p className="text-destructive/90">
              Para que o mapa funcione, é essencial configurar a sua chave da API do Google Maps.
            </p>
            <div className="text-sm bg-destructive/10 p-3 rounded-md">
              Adicione a seguinte linha ao seu arquivo <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">.env.local</code> na raiz do projeto:
              <pre className="mt-2 text-left p-2 bg-background rounded-md text-card-foreground">
                <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"</code>
              </pre>
            </div>
            <p className="text-xs text-muted-foreground pt-4 border-t">
              Lembre-se de substituir "SUA_CHAVE_AQUI" pela sua chave real e de reiniciar o servidor de desenvolvimento após a alteração.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
     return (
      <div className="flex justify-center items-center flex-grow">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
    <div className="flex flex-col flex-grow">
      {/* Show a general error alert only if fetching failed, not if it's just empty */}
      {error && offers.length === 0 && !error.includes("Nenhuma oferta encontrada") && (
        <Alert variant="destructive" className="mx-4 my-2 flex-shrink-0">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Falha ao Carregar</AlertTitle>
            <AlertDescription>
                {error}
            </AlertDescription>
        </Alert>
      )}

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
                <p>{error || "Nenhuma oferta encontrada nesta área."}</p>
                <p className="text-xs">Tente navegar ou ampliar o mapa para buscar em outros locais.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
