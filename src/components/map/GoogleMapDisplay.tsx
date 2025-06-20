
'use client';

import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import type { Offer } from '@/types'; // Assuming Offer type has id, title, latitude, longitude
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
  borderRadius: '0.5rem', // Added for slightly rounded corners
};

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ apiKey, mapCenter, zoom = 12, markers }) => {
  const router = useRouter();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleViewOffer = (offerId: string) => {
    router.push(`/offer/${offerId}`);
  };

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
    <LoadScript googleMapsApiKey={apiKey} libraries={['marker']}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'cooperative', // Improves user experience on mobile
        }}
      >
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => handleMarkerClick(marker)}
            title={marker.title}
          />
        ))}

        {selectedMarker && (
          <InfoWindowF
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={handleInfoWindowClose}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
          >
            <div className="p-1 w-56 sm:w-64"> {/* Responsive width */}
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
    </LoadScript>
  );
};

export default GoogleMapDisplay;
