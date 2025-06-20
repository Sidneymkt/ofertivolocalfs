
'use client';

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  offerId: string;
  imageUrl?: string;
  'data-ai-hint'?: string;
}

interface GoogleMapDisplayProps {
  apiKey: string | undefined;
  mapCenter: { lat: number; lng: number };
  zoom?: number;
  markers: MapMarker[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem', // Keep existing style if any
};

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ apiKey, mapCenter, zoom = 12, markers }) => {
  const router = useRouter();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    // libraries: ['marker'], // Not strictly needed for basic MarkerF
  });

  useEffect(() => {
    console.log('[GoogleMapDisplay] Hook re-ran. isLoaded:', isLoaded, 'loadError:', loadError, 'apiKey set:', !!apiKey);
    console.log('[GoogleMapDisplay] mapCenter:', mapCenter);
    console.log('[GoogleMapDisplay] markers count:', markers.length);
    if (loadError) {
      console.error('[GoogleMapDisplay] Google Maps API load error:', loadError.message, loadError.name, loadError.stack);
    }
    if (isLoaded && !apiKey) {
        console.warn('[GoogleMapDisplay] API is loaded but API key is missing or invalid!');
    }
  }, [isLoaded, loadError, apiKey, mapCenter, markers]);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleViewOffer = (offerId: string) => {
    router.push(`/offer/${offerId}`);
  };

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-destructive font-semibold text-lg mb-2">Erro ao carregar o Google Maps</p>
        <p className="text-destructive text-sm mb-1">{loadError.message}</p>
        <p className="text-muted-foreground text-xs mt-2">
          Por favor, verifique os seguintes pontos:
        </p>
        <ul className="text-xs text-muted-foreground list-disc list-inside text-left mt-1">
          <li>Sua chave da API (<code className="text-xs bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>) está correta no arquivo <code className="text-xs bg-gray-200 px-1 rounded">.env</code>.</li>
          <li>A API "Maps JavaScript API" está ativada no Google Cloud Console para esta chave.</li>
          <li>Seu projeto no Google Cloud Console tem uma conta de faturamento ativa e habilitada.</li>
          <li>Não há restrições (de HTTP referrer, API, etc.) impedindo o uso da chave neste domínio/localhost.</li>
          <li>Verifique o console do navegador (F12) para mais mensagens de erro do Google.</li>
        </ul>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-destructive font-semibold text-lg mb-2">Chave da API do Google Maps não configurada.</p>
        <p className="text-muted-foreground text-sm">
          Adicione <code className="bg-destructive/20 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> ao seu arquivo <code className="bg-destructive/20 px-1 py-0.5 rounded">.env</code> local e reinicie o servidor de desenvolvimento.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-muted-foreground">Carregando Mapa...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={zoom}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'cooperative', // Allows pinch zoom on mobile and scroll zoom on desktop
      }}
    >
      {markers.map((marker) => (
        <MarkerF
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.title}
          onClick={() => handleMarkerClick(marker)}
          // Using default Google Maps marker for simplicity now
        />
      ))}

      {selectedMarker && isLoaded && window.google && window.google.maps && (
        <InfoWindowF
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={handleInfoWindowClose}
          options={{ 
            pixelOffset: new window.google.maps.Size(0, -38), // Position slightly above marker tip
            disableAutoPan: false,
          }}
        >
          <div className="p-1 w-56 sm:w-64"> {/* InfoWindow content */}
            <h3 className="text-sm font-semibold mb-1 truncate">{selectedMarker.title}</h3>
            {selectedMarker.imageUrl && (
              <div className="relative w-full h-24 mb-2 rounded overflow-hidden bg-muted">
                <Image
                  src={selectedMarker.imageUrl}
                  alt={selectedMarker.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={selectedMarker['data-ai-hint'] || 'offer location'}
                />
              </div>
            )}
            <Button size="sm" className="w-full text-xs" onClick={() => handleViewOffer(selectedMarker.offerId)}>
              Ver Oferta
            </Button>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

export default GoogleMapDisplay;

