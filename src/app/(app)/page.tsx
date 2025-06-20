
'use client';

import React, { useState, useMemo } from 'react';
import OfferList from '@/components/offers/OfferList';
import { mockOffers, categories, mockFeaturedMerchants } from '@/types';
import FeaturedOfferCard from '@/components/offers/FeaturedOfferCard';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const featuredOffer = mockOffers.find(offer => offer.id === 'offer-pizza-1') || mockOffers[0];

  const filteredOffers = useMemo(() => {
    let offers = [...mockOffers];

    // Filter by category
    if (selectedCategory) {
      offers = offers.filter(offer => offer.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      offers = offers.filter(offer =>
        offer.title.toLowerCase().includes(lowerSearchTerm) ||
        offer.description.toLowerCase().includes(lowerSearchTerm) ||
        offer.merchantName.toLowerCase().includes(lowerSearchTerm) ||
        offer.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    return offers;
  }, [searchTerm, selectedCategory]);

  const recentOffers = useMemo(() => {
    return [...filteredOffers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [filteredOffers]);
  
  const recommendedOffers = useMemo(() => {
    return filteredOffers.filter(
      offer => offer.id !== featuredOffer?.id && !recentOffers.some(ro => ro.id === offer.id)
    ).slice(0, 6);
  }, [filteredOffers, featuredOffer, recentOffers]);


  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      {featuredOffer && <FeaturedOfferCard offer={featuredOffer} />}
      
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


      {recommendedOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Recomendadas para Você</h2>
          <OfferList offers={recommendedOffers} />
        </section>
      )}
       {recommendedOffers.length === 0 && filteredOffers.length > 0 && recentOffers.length > 0 && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Não há mais recomendações com os filtros atuais.</p>
       )}
       {filteredOffers.length === 0 && (
        <p className="text-center text-muted-foreground py-10 px-4 md:px-0 text-lg">
            Nenhuma oferta encontrada com os filtros aplicados. <br/> Tente ajustar sua busca ou categoria.
        </p>
       )}
    </div>
  );
}
