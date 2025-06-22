
'use client';

import React, { useCallback, useState, useMemo, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { calculateDistance } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { AlertTriangle } from 'lucide-react';

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
  apiKey: string; 
  mapCenter: { lat: number; lng: number };
  zoom?: number;
  markers: MapMarker[];
}

type GoogleMapDisplayHandle = {
  getCenter: () => { lat: number; lng: number } | null;
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const getMarkerIcon = (
  distance: number,
  isSelected: boolean,
  isMapsApiLoaded: boolean
): google.maps.Icon | undefined => {
  if (!isMapsApiLoaded || !window.google || !window.google.maps || !window.google.maps.Size || !window.google.maps.Point) {
    return undefined; 
  }

  const closeColor = '#28a745'; 
  const mediumColor = '#ffc107'; 
  const farColor = '#dc3545'; 
  const selectedColor = '#007bff'; 

  let fillColor = farColor;
  let animationClass = '';
  let scale = 1;

  if (distance < 1) { 
    fillColor = closeColor;
    animationClass = 'marker-pulse-animation';
    scale = 1.1;
  } else if (distance < 5) { 
    fillColor = mediumColor;
  }

  if (isSelected) {
    fillColor = selectedColor;
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


const GoogleMapDisplay = forwardRef<GoogleMapDisplayHandle, GoogleMapDisplayProps>(
  ({ apiKey, mapCenter, zoom = 12, markers: initialMarkers }, ref) => {
    const router = useRouter();
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
    const [currentVisualCenter, setCurrentVisualCenter] = useState(mapCenter); 
    const mapRef = React.useRef<google.maps.Map | null>(null);

    useImperativeHandle(ref, () => ({
      getCenter: () => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          return center ? { lat: center.lat(), lng: center.lng() } : null;
        }
        return null;
      },
    }));

    const { isLoaded, loadError } = useJsApiLoader({
      googleMapsApiKey: apiKey, 
    });
    
    useEffect(() => {
      setCurrentVisualCenter(mapCenter); 
    }, [mapCenter]);

    const onLoad = React.useCallback(function callback(mapInstance: google.maps.Map) {
      mapRef.current = mapInstance;
      const initialCenter = mapInstance.getCenter();
      if (initialCenter) {
          setCurrentVisualCenter({ lat: initialCenter.lat(), lng: initialCenter.lng() });
      }
    }, []);

    const onUnmount = React.useCallback(function callback() {
      mapRef.current = null;
    }, []);

    const onIdle = useCallback(() => {
      if (mapRef.current && typeof mapRef.current.getCenter === 'function') {
        const newCenter = mapRef.current.getCenter();
        if (newCenter) {
          setCurrentVisualCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
        }
      }
    }, []);

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
      if (!isLoaded || !currentVisualCenter) {
        return [];
      }
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
      const isInvalidKeyError = loadError.message.includes('InvalidKeyMapError') || loadError.message.toLowerCase().includes('api key not valid');
      const isBillingError = loadError.message.includes('BillingNotEnabledMapError');
      const isApiNotActivatedError = loadError.message.includes('ApiNotActivatedMapError');

      return (
        <Card className="w-full h-full flex flex-col items-center justify-center bg-muted border-destructive/50 rounded-md p-4 text-center">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold text-destructive">Erro ao Carregar o Google Maps</h2>
            <p className="text-destructive/90">Não foi possível exibir o mapa. Verifique os problemas comuns abaixo.</p>

            <div className="text-sm bg-destructive/10 p-3 rounded-md text-left space-y-2">
              {isInvalidKeyError && <p><strong>Causa provável:</strong> Chave de API inválida ou mal configurada.</p>}
              {isBillingError && <p><strong>Causa provável:</strong> O faturamento não está ativado para este projeto no Google Cloud.</p>}
              {isApiNotActivatedError && <p><strong>Causa provável:</strong> A API "Maps JavaScript API" não está habilitada para este projeto.</p>}
              <p className="text-xs">Mensagem do Google: <code className="bg-destructive/20 px-1 rounded">{loadError.message}</code></p>
            </div>

            <ul className="text-xs text-muted-foreground list-disc list-inside text-left mt-2 space-y-1 max-w-md mx-auto">
              <li><strong>Verifique seu arquivo `.env.local`</strong>: Garanta que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está correta e que o servidor foi reiniciado.</li>
              <li><strong>Verifique seu projeto no Google Cloud Console</strong>:
                <ul className="pl-4">
                    <li>A API "Maps JavaScript API" deve estar **ativada**.</li>
                    <li>Uma conta de **faturamento** válida deve estar associada ao projeto.</li>
                    <li>As **restrições da chave** (Referenciadores HTTP, etc.) devem permitir seu domínio de desenvolvimento.</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>
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
        onLoad={onLoad}
        onUnmount={onUnmount}
        onIdle={onIdle} 
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
            icon={marker.icon} 
            zIndex={marker.zIndex}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

        {selectedMarker && isLoaded && window.google && window.google.maps && window.google.maps.Size && (
          <InfoWindowF
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={handleInfoWindowClose}
            options={{ 
              pixelOffset: new window.google.maps.Size(0, -50), 
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
});
GoogleMapDisplay.displayName = 'GoogleMapDisplay';

export default GoogleMapDisplay;
