
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, RotateCcw } from 'lucide-react';
import { offerTypes, categories } from '@/types'; // Assuming these are your filter options

interface AdvancedFiltersSheetProps {
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
}

const AdvancedFiltersSheet: React.FC<AdvancedFiltersSheetProps> = ({ onApplyFilters, onClearFilters }) => {
  // Placeholder states for filters
  const [distance, setDistance] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedOfferTypes, setSelectedOfferTypes] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const handleApply = () => {
    onApplyFilters({
      distance,
      priceRange,
      selectedOfferTypes,
      selectedSubCategories,
      minRating,
      sortBy,
    });
  };

  const handleClear = () => {
    setDistance(undefined);
    setPriceRange([0, 500]);
    setSelectedOfferTypes([]);
    setSelectedSubCategories([]);
    setMinRating(undefined);
    setSortBy(undefined);
    onClearFilters(); // Call the parent clear function which also closes the sheet
  };

  const handleOfferTypeChange = (offerTypeId: string) => {
    setSelectedOfferTypes(prev =>
      prev.includes(offerTypeId)
        ? prev.filter(id => id !== offerTypeId)
        : [...prev, offerTypeId]
    );
  };
  
  const handleSubCategoryChange = (categoryName: string) => {
    setSelectedSubCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4 space-y-6">
        {/* Distance Filter */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Distância</Label>
          <RadioGroup value={distance} onValueChange={setDistance} className="grid grid-cols-2 gap-2">
            {['< 1km', '< 5km', '< 10km', 'Qualquer'].map(d => (
              <Label
                key={d}
                htmlFor={`dist-${d}`}
                className={`flex items-center space-x-2 border rounded-md p-2.5 text-sm hover:bg-muted/50 cursor-pointer ${distance === d ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary' : 'bg-card'}`}
              >
                <RadioGroupItem value={d} id={`dist-${d}`} className="sr-only" />
                <span>{d}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label htmlFor="price-range" className="text-base font-semibold">
            Faixa de Preço (R$)
          </Label>
          <Slider
            id="price-range"
            min={0}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-3"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}{priceRange[1] === 500 && '+'}</span>
          </div>
        </div>
        
        <Separator />

        {/* Offer Type Filter */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Tipo de Oferta</Label>
          <div className="grid grid-cols-2 gap-2">
            {offerTypes.map(ot => (
              <Label 
                key={ot.id}
                htmlFor={`ot-${ot.id}`}
                className={`flex items-center space-x-2 border rounded-md p-2.5 text-sm hover:bg-muted/50 cursor-pointer ${selectedOfferTypes.includes(ot.id) ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary' : 'bg-card'}`}
               >
                <Checkbox 
                  id={`ot-${ot.id}`} 
                  checked={selectedOfferTypes.includes(ot.id)}
                  onCheckedChange={() => handleOfferTypeChange(ot.id)}
                  className="hidden" // Visually hide checkbox, label acts as control
                />
                 {React.createElement(ot.icon, { className: "h-4 w-4"})}
                <span>{ot.name}</span>
              </Label>
            ))}
          </div>
        </div>

        <Separator />
        
        {/* Sub-Category Filter (using general categories for now) */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Sub-Categorias</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <Label 
                key={cat.name}
                htmlFor={`cat-${cat.name}`}
                className={`flex items-center space-x-2 border rounded-md p-2.5 text-sm hover:bg-muted/50 cursor-pointer ${selectedSubCategories.includes(cat.name) ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary' : 'bg-card'}`}
              >
                <Checkbox 
                  id={`cat-${cat.name}`} 
                  checked={selectedSubCategories.includes(cat.name)}
                  onCheckedChange={() => handleSubCategoryChange(cat.name)}
                  className="hidden"
                />
                <span>{cat.name}</span>
              </Label>
            ))}
          </div>
        </div>


        <Separator />

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Avaliação Mínima</Label>
          <RadioGroup value={minRating?.toString()} onValueChange={(val) => setMinRating(Number(val))} className="flex gap-2 flex-wrap">
            {[5, 4, 3, 2, 1].map(r => (
              <Label 
                key={r} 
                htmlFor={`rating-${r}`}
                className={`flex items-center justify-center border rounded-md p-2 text-sm h-10 w-16 cursor-pointer hover:bg-muted/50 ${minRating === r ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary' : 'bg-card'}`}
              >
                <RadioGroupItem value={r.toString()} id={`rating-${r}`} className="sr-only"/>
                {r} ★
              </Label>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Sort By Filter */}
        <div className="space-y-2">
          <Label htmlFor="sort-by" className="text-base font-semibold">Ordenar Por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by" className="bg-card">
              <SelectValue placeholder="Selecione uma ordenação..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularidade</SelectItem>
              <SelectItem value="distance">Distância</SelectItem>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="price_asc">Preço: Menor para Maior</SelectItem>
              <SelectItem value="price_desc">Preço: Maior para Menor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto bg-background sticky bottom-0">
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            <RotateCcw size={16} className="mr-2" /> Limpar Filtros
          </Button>
          <Button onClick={handleApply} className="flex-1 bg-primary hover:bg-primary/90">
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersSheet;
