'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ListFilter, AlertTriangle, Loader2 } from 'lucide-react';
import { categories, type Offer } from '@/types';
import CategoryPills from '@/components/offers/CategoryPills';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AdvancedFiltersSheet from '@/components/map/AdvancedFiltersSheet';
import GoogleMapDisplay from '@/components/map/GoogleMapDisplay';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { Card, CardContent } from '@/components/ui/card';

export default function MapPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  
  // Directly read the environment variable here to decide rendering logic
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
        setError("Não foi possível carregar os dados das ofertas.");
      }
      setLoading(false);
    };

    fetchOffers();
  }, []);

  const handleApplyFilters = (filters: any) => {
    console.log('Aplicando filtros avançados:', filters);
    // TODO: Implement actual filtering logic
    setIsFiltersSheetOpen(false);
  };
  
  const handleClearFilters = () => {
    console.log('Limpando filtros avançados');
    setSelectedCategory(''); 
    // TODO: Clear other filters
    setIsFiltersSheetOpen(false);
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // TODO: Implement filtering by category
  };
  
  if (!googleMapsApiKey) {
    return (
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
    );
  }

  if (loading) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
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
    <div className="flex flex-col h-full">
      <div className="flex-grow relative shadow-lg rounded-lg overflow-hidden border">
        <GoogleMapDisplay 
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={13}
          markers={markers}
        />
      </div>

      <div className="flex-shrink-0 bg-background border-t">
        <div className="px-1 py-3 md:px-3 md:py-3">
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <CategoryPills
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />
            </div>
            <Sheet open={isFiltersSheetOpen} onOpenChange={setIsFiltersSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label="Abrir filtros avançados"
                >
                  <ListFilter size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] flex flex-col rounded-t-2xl p-0">
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle className="text-lg">Filtros Avançados</SheetTitle>
                  <SheetDescription>
                    Refine sua busca para encontrar as melhores ofertas.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto">
                  <AdvancedFiltersSheet onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="py-3 border-t">
          <h3 className="text-md font-semibold px-4 mb-2">Ofertas Próximas</h3>
          {error ? (
             <p className="px-4 text-sm text-destructive">{error}</p>
          ) : offers.length > 0 ? (
             <p className="px-4 text-sm text-muted-foreground">{offers.length} ofertas encontradas.</p>
          ) : (
             <p className="px-4 text-sm text-muted-foreground">Nenhuma oferta encontrada na área.</p>
          )}
        </div>
      </div>
    </div>
  );
}