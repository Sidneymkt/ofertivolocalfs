
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ListFilter } from 'lucide-react';
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

// Para simplificar o teste, usamos um centro de mapa e marcadores fixos.
// Isso remove a dependência do carregamento de dados do Firebase.
const mapCenter = { lat: -3.0993, lng: -59.9839 }; // Centro de Manaus
const testMarkers = [
  {
    id: 'marker-1',
    lat: -3.1019,
    lng: -60.0228,
    title: 'Ponto de Teste 1 (Teatro Amazonas)',
    offerId: 'offer-1',
    imageUrl: 'https://placehold.co/100x100.png',
    'data-ai-hint': 'theater building',
  },
  {
    id: 'marker-2',
    lat: -3.1305,
    lng: -60.0217,
    title: 'Ponto de Teste 2 (Praça da Saudade)',
    offerId: 'offer-2',
    imageUrl: 'https://placehold.co/100x100.png',
    'data-ai-hint': 'square park',
  }
];

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Os manipuladores de filtro permanecem, mas não afetarão os marcadores do mapa neste modo de teste.
  const handleApplyFilters = (filters: any) => {
    console.log('Aplicando filtros avançados (sem efeito no teste):', filters);
    setIsFiltersSheetOpen(false);
  };
  
  const handleClearFilters = () => {
    console.log('Limpando filtros avançados (sem efeito no teste)');
    setSelectedCategory(''); 
    setIsFiltersSheetOpen(false);
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow relative shadow-lg rounded-lg overflow-hidden border">
        <GoogleMapDisplay 
          apiKey={googleMapsApiKey}
          mapCenter={mapCenter}
          zoom={13}
          markers={testMarkers}
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
          <h3 className="text-md font-semibold px-4 mb-2">Ofertas Próximas (Teste)</h3>
          <p className="px-4 text-sm text-muted-foreground">A lista de ofertas está desativada para focar na exibição do mapa.</p>
        </div>
      </div>
    </div>
  );
}
