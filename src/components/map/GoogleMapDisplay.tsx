
'use client';

import React, { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
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
  borderRadius: '0.5rem',
};

const getMarkerIcon = (distance: number | null): google.maps.Icon => {
  let color = 'hsl(211, 100%, 50%)'; // Default: Primary Blue
  let animationClass = '';
  let zIndex = 1; // Default z-index

  if (distance !== null) {
    if (distance < 1) { // Very close: < 1km
      color = 'hsl(130, 65%, 50%)'; // Vibrant Green
      animationClass = 'marker-pulse-animation';
      zIndex = 3; // Bring pulsing markers to the front
    } else if (distance < 5) { // Close: 1km - 5km
      color = 'hsl(45, 100%, 51%)'; // Accent Yellow/Orange
      zIndex = 2;
    } else { // Far: > 5km
      color = 'hsl(0, 84%, 60%)'; // Destructive Red
      zIndex = 1;
    }
  }

  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="${animationClass}" d="M16 0.5C9.09644 0.5 3.5 6.09644 3.5 13C3.5 22.25 16 32.5 16 32.5C16 32.5 28.5 22.25 28.5 13C28.5 6.09644 22.9036 0.5 16 0.5Z" fill="${color}" stroke="white" stroke-width="1"/>
      <circle cx="16" cy="13" r="5" fill="white" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `;
  // Note: For CSS animation to work directly on SVG elements via class, the SVG usually needs to be inline in HTML or styled via <style> tags
  // that can target its classes. For data URI SVGs, direct CSS class animation might not apply from global CSS.
  // The animation class is added here for potential future enhancements (e.g., if switching to OverlayView or if browser support changes).
  // A true pulsing animation on data URI SVG might require JS to alter the SVG data itself, or using an animated GIF/APNG.
  // For this iteration, the color change is the primary dynamic feature. The pulse animation is aspirational for data-uri.
  // A simpler "pulse" might be achieved by just slightly changing scale in the SVG itself if the animation is triggered, though less smooth.

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`,
    scaledSize: new window.google.maps.Size(32, 42),
    anchor: new window.google.maps.Point(16, 42), // Anchor at the tip of the pin
  };
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
  
  // Memoize markers with their icons to prevent re-computation on every render if mapCenter/markers don't change
  const memoizedMarkers = React.useMemo(() => {
    return markers.map(marker => {
      const distance = mapCenter ? calculateDistance(mapCenter.lat, mapCenter.lng, marker.lat, marker.lng) : null;
      const icon = getMarkerIcon(distance);
      let zIndex = 1;
       if (distance !== null) {
        if (distance < 1) zIndex = 1003; // Highest for pulsing
        else if (distance < 5) zIndex = 1002;
        else zIndex = 1001;
      }
      if (selectedMarker && selectedMarker.id === marker.id) {
        zIndex = 1005; // Ensure selected marker is on top
      }
      return { ...marker, icon, zIndex };
    });
  }, [markers, mapCenter, selectedMarker]);


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
          gestureHandling: 'cooperative',
        }}
      >
        {memoizedMarkers.map((marker) => {          
          return (
            <MarkerF
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(marker)}
              title={marker.title}
              icon={marker.icon}
              zIndex={marker.zIndex} // Apply dynamic zIndex
            />
          );
        })}

        {selectedMarker && (
          <InfoWindowF
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={handleInfoWindowClose}
            options={{ pixelOffset: new window.google.maps.Size(0, -42) }} // Adjusted for new icon size
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
    </LoadScript>
  );
};

export default GoogleMapDisplay;

