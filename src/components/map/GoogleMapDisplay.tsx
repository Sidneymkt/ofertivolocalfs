
'use client';

import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { calculateDistance } from '@/lib/utils'; // Import the utility

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
  borderRadius: '0.5rem', // Ensure this matches or is handled by parent if overflow-hidden
};

const getMarkerIcon = (
  distance: number,
  isSelected: boolean,
  isMapsApiLoaded: boolean
): google.maps.Icon | undefined => {
  if (!isMapsApiLoaded || !window.google || !window.google.maps || !window.google.maps.Size || !window.google.maps.Point) {
    // console.warn('[getMarkerIcon] Google Maps API objects (Size/Point) not ready.');
    return undefined; // Fallback to default marker
  }

  const closeColor = '#28a745'; // Green
  const mediumColor = '#ffc107'; // Yellow
  const farColor = '#dc3545'; // Red
  const selectedColor = '#007bff'; // Primary Blue for selected

  let fillColor = farColor;
  let animationClass = '';
  let zIndex = 1;
  let scale = 1;

  if (distance < 1) { // Less than 1km
    fillColor = closeColor;
    animationClass = 'marker-pulse-animation';
    zIndex = 3;
    scale = 1.1;
  } else if (distance < 5) { // 1km to 5km
    fillColor = mediumColor;
    zIndex = 2;
  }

  if (isSelected) {
    fillColor = selectedColor;
    zIndex = 10; // Ensure selected is on top
    scale = 1.2;
  }

  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" class="${animationClass}">
      <path d="M16 0C7.16344 0 0 7.16344 0 16C0 24.8366 16 42 16 42C16 42 32 24.8366 32 16C32 7.16344 24.8366 0 16 0Z" fill="${fillColor}" stroke="#FFFFFF" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
      ${isSelected ? '<circle cx="16" cy="16" r="3" fill="#000000"/>' : ''}
    </svg>
  `;

  try {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`,
      scaledSize: new window.google.maps.Size(32 * scale, 42 * scale),
      anchor: new window.google.maps.Point(16 * scale, 42 * scale),
    };
  } catch (e) {
    console.error("Error creating google.maps.Size/Point for marker icon:", e);
    return undefined; 
  }
};


const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ apiKey, mapCenter, zoom = 12, markers: initialMarkers }) => {
  const router = useRouter();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  // This state will hold the map's current visual center, updated onIdle
  const [currentVisualCenter, setCurrentVisualCenter] = useState(mapCenter); 
  const mapRef = React.useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: ['marker'], // Ensure marker library is loaded if using AdvancedMarkerView or complex markers later
  });
  
  // Effect to update currentVisualCenter when the mapCenter prop from parent changes
  useEffect(() => {
    // console.log('[GoogleMapDisplay] mapCenter prop changed:', mapCenter);
    setCurrentVisualCenter(mapCenter);
  }, [mapCenter]);

  const onLoad = React.useCallback(function callback(mapInstance: google.maps.Map) {
    // console.log('[GoogleMapDisplay] Map loaded.');
    mapRef.current = mapInstance;
    // Set initial visual center once map loads
    const initialCenter = mapInstance.getCenter();
    if (initialCenter) {
        setCurrentVisualCenter({ lat: initialCenter.lat(), lng: initialCenter.lng() });
    }
  }, []);

  const onUnmount = React.useCallback(function callback() {
    // console.log('[GoogleMapDisplay] Map unmounted.');
    mapRef.current = null;
  }, []);

  const onIdle = useCallback(() => {
    // console.log('[GoogleMapDisplay] Map idle.');
    if (mapRef.current && typeof mapRef.current.getCenter === 'function') {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        // console.log('[GoogleMapDisplay] Updating currentVisualCenter onIdle:', { lat: newCenter.lat(), lng: newCenter.lng() });
        setCurrentVisualCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
      }
    }
  }, []);


  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
    // Optionally, pan to the marker smoothly
    // if (mapRef.current) {
    //   mapRef.current.panTo({ lat: marker.lat, lng: marker.lng });
    // }
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleViewOffer = (offerId: string) => {
    router.push(`/offer/${offerId}`);
  };
  
  const memoizedMarkers = useMemo(() => {
    if (!isLoaded || !currentVisualCenter) {
      // console.log('[GoogleMapDisplay] memoizedMarkers: Not loaded or no currentVisualCenter');
      return [];
    }
    // console.log('[GoogleMapDisplay] memoizedMarkers: Recalculating for', initialMarkers.length, 'markers. currentVisualCenter:', currentVisualCenter);
    return initialMarkers.map(marker => {
      const distance = calculateDistance(currentVisualCenter.lat, currentVisualCenter.lng, marker.lat, marker.lng);
      const icon = getMarkerIcon(distance, selectedMarker?.id === marker.id, isLoaded);
      return {
        ...marker,
        icon,
        zIndex: selectedMarker?.id === marker.id ? 1000 : Math.round(100 - distance), 
      };
    });
  }, [initialMarkers, currentVisualCenter, selectedMarker, isLoaded]);


  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-destructive font-semibold text-lg mb-2">Erro ao carregar o Google Maps</p>
        <p className="text-destructive text-sm mb-1">{loadError.message}</p>
        <ul className="text-xs text-muted-foreground list-disc list-inside text-left mt-2 space-y-1">
          <li>Verifique sua chave da API (<code className="text-xs bg-gray-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>) no <code className="text-xs bg-gray-200 px-1 rounded">.env</code> ou <code className="text-xs bg-gray-200 px-1 rounded">.env.local</code>.</li>
          <li>Confirme que "Maps JavaScript API" está ativada no Google Cloud Console para sua chave.</li>
          <li>Verifique se há faturamento ativo e habilitado para o projeto no Google Cloud.</li>
          <li>Verifique se não há restrições de API (HTTP referrer, etc.) bloqueando o uso da chave.</li>
          <li>
            Consulte: <a href="https://developers.google.com/maps/documentation/javascript/error-messages#invalid-key-map-error" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Guia de Erros do Google Maps (InvalidKeyMapError)</a>
          </li>
        </ul>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-destructive font-semibold text-lg mb-2">Chave da API do Google Maps não configurada.</p>
        <p className="text-muted-foreground text-sm">
          Adicione <code className="bg-destructive/20 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"</code> ao seu arquivo <code className="bg-destructive/20 px-1 py-0.5 rounded">.env.local</code> e reinicie o servidor.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    // console.log('[GoogleMapDisplay] Rendering: API not loaded yet.');
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted border rounded-md p-4 text-center">
        <p className="text-muted-foreground">Carregando Mapa...</p>
      </div>
    );
  }
  
  // console.log('[GoogleMapDisplay] Rendering Map. mapCenter:', mapCenter, 'zoom:', zoom, '#markers:', memoizedMarkers.length);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter} // Controlled by parent
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onIdle={onIdle} // Use onIdle to update currentVisualCenter
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
          icon={marker.icon} // This can be undefined, MarkerF handles it
          zIndex={marker.zIndex}
          onClick={() => handleMarkerClick(marker)}
        />
      ))}

      {selectedMarker && isLoaded && window.google && window.google.maps && window.google.maps.Size && (
        <InfoWindowF
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={handleInfoWindowClose}
          options={{ 
            pixelOffset: new window.google.maps.Size(0, -42), 
            disableAutoPan: false,
          }}
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

