
'use client';

import React, { useState, useMemo } from 'react';
import OfferList from '@/components/offers/OfferList';
import { mockOffers, categories, mockFeaturedMerchants } from '@/types';
import FeaturedOffersList from '@/components/offers/FeaturedOffersList';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import RecommendedOffersList from '@/components/offers/RecommendedOffersList'; 

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const featuredOffers = useMemo(() => {
    return [
      mockOffers.find(offer => offer.id === 'offer-pizza-1'),
      mockOffers.find(offer => offer.id === 'offer-barber-2'),
      mockOffers.find(offer => offer.id === 'offer-sports-3'),
      mockOffers.find(offer => offer.id === 'offer-bar-4'),
    ].filter(Boolean) as typeof mockOffers; 
  }, []);

  const filteredOffers = useMemo(() => {
    let offers = [...mockOffers];

    if (selectedCategory) {
      offers = offers.filter(offer => offer.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      offers = offers.filter(offer =>
        offer.title.toLowerCase().includes(lowerSearchTerm) ||
        offer.description.toLowerCase().includes(lowerSearchTerm) ||
        offer.merchantName.toLowerCase().includes(lowerSearchTerm) ||
        offer.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    const featuredOfferIds = featuredOffers.map(fo => fo.id);
    offers = offers.filter(offer => !featuredOfferIds.includes(offer.id));

    return offers;
  }, [searchTerm, selectedCategory, featuredOffers]);

  const recentOffers = useMemo(() => {
    return [...filteredOffers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [filteredOffers]);
  
  const recommendedOffers = useMemo(() => {
    const recentAndFeaturedIds = new Set([...recentOffers.map(ro => ro.id), ...featuredOffers.map(fo => fo.id)]);
    return mockOffers
      .filter(offer => !recentAndFeaturedIds.has(offer.id))
      .sort(() => 0.5 - Math.random()) 
      .slice(0, 8); 
  }, [recentOffers, featuredOffers]);


  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      {featuredOffers.length > 0 && (
        <section className="space-y-3">
           <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Destaques Imperdíveis</h2>
          <FeaturedOffersList offers={featuredOffers} />
        </section>
      )}
      
      <div className="px-4 md:px-0 mt-6 mb-2">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ofertas, produtos, negócios..."
            className="pl-10 w-full h-11 rounded-lg bg-card shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <CategoryPills 
        categories={categories} 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory} 
      />

      {recommendedOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Recomendadas para Você</h2>
          <RecommendedOffersList offers={recommendedOffers} />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Comerciantes em Destaque</h2>
        <FeaturedMerchantsList merchants={mockFeaturedMerchants} />
      </section>

      {recentOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Ofertas Recentes</h2>
          <OfferList offers={recentOffers} />
        </section>
      )}
       {recentOffers.length === 0 && searchTerm && selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada para "{searchTerm}" na categoria "{selectedCategory}".</p>
       )}
       {recentOffers.length === 0 && searchTerm && !selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada para "{searchTerm}".</p>
       )}
       {recentOffers.length === 0 && !searchTerm && selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada na categoria "{selectedCategory}".</p>
       )}


       {/* This logic might need adjustment if recommendedOffers are always present */}
       {filteredOffers.length === 0 && !featuredOffers.some(fo => fo.category.toLowerCase() === selectedCategory.toLowerCase() || searchTerm.trim() === '') && (
        <p className="text-center text-muted-foreground py-10 px-4 md:px-0 text-lg">
            Nenhuma oferta encontrada com os filtros aplicados. <br/> Tente ajustar sua busca ou categoria.
        </p>
       )}
    </div>
  );
}
