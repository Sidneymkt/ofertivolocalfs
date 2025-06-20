
'use client';

import React, { useCallback, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
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
  borderRadius: '0.5rem', // Kept for consistency if map is in a rounded container
};

const getMarkerIcon = (distance: number | null): google.maps.Icon => {
  let color = 'hsl(211, 100%, 50%)'; // Default: Primary Blue
  let animationClass = '';
  // let zIndex = 1; // zIndex will be managed in memoizedMarkers directly

  if (distance !== null) {
    if (distance < 1) { // Very close: < 1km
      color = 'hsl(130, 65%, 50%)'; // Vibrant Green
      animationClass = 'marker-pulse-animation';
      // zIndex = 3; 
    } else if (distance < 5) { // Close: 1km - 5km
      color = 'hsl(45, 100%, 51%)'; // Accent Yellow/Orange
      // zIndex = 2;
    } else { // Far: > 5km
      color = 'hsl(0, 84%, 60%)'; // Destructive Red
      // zIndex = 1;
    }
  }

  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="${animationClass}" d="M16 0.5C9.09644 0.5 3.5 6.09644 3.5 13C3.5 22.25 16 32.5 16 32.5C16 32.5 28.5 22.25 28.5 13C28.5 6.09644 22.9036 0.5 16 0.5Z" fill="${color}" stroke="white" stroke-width="1"/>
      <circle cx="16" cy="13" r="5" fill="white" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `;
  
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`,
    scaledSize: new window.google.maps.Size(32, 42),
    anchor: new window.google.maps.Point(16, 42),
  };
};


const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ apiKey, mapCenter, zoom = 12, markers }) => {
  const router = useRouter();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "", // API key must be a string
    libraries: ['marker'], // Specify libraries needed
  });

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleViewOffer = (offerId: string) => {
    router.push(`/offer/${offerId}`);
  };
  
  const memoizedMarkers = useMemo(() => {
    if (!isLoaded) return []; // Don't compute markers if API not loaded

    return markers.map(marker => {
      const distance = mapCenter ? calculateDistance(mapCenter.lat, mapCenter.lng, marker.lat, marker.lng) : null;
      const icon = getMarkerIcon(distance); // Safe to call now
      let zIndex = 1;
       if (distance !== null) {
        if (distance < 1) zIndex = 1003; 
        else if (distance < 5) zIndex = 1002;
        else zIndex = 1001;
      }
      if (selectedMarker && selectedMarker.id === marker.id) {
        zIndex = 1005; 
      }
      return { ...marker, icon, zIndex };
    });
  }, [markers, mapCenter, selectedMarker, isLoaded]); // Added isLoaded

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-destructive">Error loading Google Maps: {loadError.message}</p>
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
              onClick={() => handleMarkerClick(marker)}
              title={marker.title}
              icon={marker.icon} // Icon is now safely created
              zIndex={marker.zIndex}
            />
          )
        )}

        {selectedMarker && (
          <InfoWindowF
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={handleInfoWindowClose}
            options={{ pixelOffset: new window.google.maps.Size(0, -42) }}
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
      </GoogleMap>
  );
};

export default GoogleMapDisplay;
