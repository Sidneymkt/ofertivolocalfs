
'use client';

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api'; // Removed InfoWindowF for now
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { calculateDistance } from '@/lib/utils';

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
  borderRadius: '0.5rem', // Keep existing style
};

// Temporarily removed getMarkerIcon for simplification

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ apiKey, mapCenter, zoom = 12, markers }) => {
  const router = useRouter();
  // const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null); // Temporarily removed

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: ['marker'],
  });

  useEffect(() => {
    console.log('[GoogleMapDisplay] isLoaded:', isLoaded);
    console.log('[GoogleMapDisplay] loadError:', loadError);
    console.log('[GoogleMapDisplay] apiKey:', apiKey ? 'API Key Present' : 'API Key MISSING');
    console.log('[GoogleMapDisplay] mapCenter:', mapCenter);
    console.log('[GoogleMapDisplay] markers count:', markers.length);
  }, [isLoaded, loadError, apiKey, mapCenter, markers]);


  // const handleMarkerClick = useCallback((marker: MapMarker) => { // Temporarily removed
  //   setSelectedMarker(marker);
  // }, []);

  // const handleInfoWindowClose = useCallback(() => { // Temporarily removed
  //   setSelectedMarker(null);
  // }, []);

  const handleViewOffer = (offerId: string) => {
    router.push(`/offer/${offerId}`);
  };

  const memoizedMarkers = useMemo(() => {
    if (!isLoaded) return [];
    // Using default markers, so no need for complex icon generation for now
    return markers.map(marker => ({ ...marker, zIndex: 1 }));
  }, [markers, isLoaded]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-destructive">Error loading Google Maps: {loadError.message}. Verifique a chave da API e as configurações no Google Cloud Console.</p>
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

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-destructive">
          Chave da API do Google Maps não configurada.
          <br />
          Adicione NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ao seu arquivo .env.
        </p>
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
        gestureHandling: 'cooperative',
      }}
    >
      {memoizedMarkers.map((marker) => (
        <MarkerF
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.title}
          // onClick={() => handleMarkerClick(marker)} // Temporarily removed
          // No custom icon for now, using default
          zIndex={marker.zIndex}
        />
      ))}

      {/* Temporarily removed InfoWindowF logic
      {selectedMarker && (
        <InfoWindowF
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={handleInfoWindowClose}
          options={{ pixelOffset: new window.google.maps.Size(0, -42) }} // This might error if window.google.maps is not ready
        >
          <div className="p-1 w-56 sm:w-64">
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
      */}
    </GoogleMap>
  );
};

export default GoogleMapDisplay;
    