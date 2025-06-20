
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import OfferList from '@/components/offers/OfferList';
import { categories } from '@/types'; // Keep static categories
import type { Offer, Category, User } from '@/types'; // Import User for featured merchants
import FeaturedOffersList from '@/components/offers/FeaturedOffersList';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, MapPin, Loader2 } from 'lucide-react';
import RecommendedOffersList from '@/components/offers/RecommendedOffersList';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { getAllMerchants } from '@/lib/firebase/services/userService'; // Assuming this service exists or will be created

export default function FeedPage() {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [featuredMerchants, setFeaturedMerchants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const offers = await getAllOffers();
        setAllOffers(offers);
        
        // Simulate fetching featured merchants (e.g., first 5 advertisers)
        // In a real app, this might be a specific query or curated list
        const merchants = await getAllMerchants();
        setFeaturedMerchants(merchants.slice(0,10).map(m => ({
          id: m.id,
          name: m.businessName || m.name,
          logoUrl: m.businessLogoUrl || 'https://placehold.co/100x100.png?text=Logo',
          'data-ai-hint': m.businessLogoHint || 'store logo',
          category: m.businessCategory
        })));

      } catch (error) {
        console.error("Error fetching data for feed:", error);
        // Handle error display if necessary
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const featuredOffers = useMemo(() => {
    // Simulate featured: e.g., offers with visibility 'destaque' or most recent with images
    return allOffers
      .filter(offer => offer.visibility === 'destaque' || (offer.galleryImages && offer.galleryImages.length > 0))
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [allOffers]);

  const filteredOffers = useMemo(() => {
    let offers = [...allOffers];

    if (selectedCategory) {
      offers = offers.filter(offer => offer.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      offers = offers.filter(offer =>
        offer.title.toLowerCase().includes(lowerSearchTerm) ||
        offer.description.toLowerCase().includes(lowerSearchTerm) ||
        (offer.merchantName && offer.merchantName.toLowerCase().includes(lowerSearchTerm)) ||
        offer.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    const featuredOfferIds = featuredOffers.map(fo => fo.id);
    offers = offers.filter(offer => !featuredOfferIds.includes(offer.id!));

    return offers;
  }, [searchTerm, selectedCategory, allOffers, featuredOffers]);

  const recentOffers = useMemo(() => {
    return [...filteredOffers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [filteredOffers]);

  const recommendedOffers = useMemo(() => {
    const recentAndFeaturedIds = new Set([...recentOffers.map(ro => ro.id), ...featuredOffers.map(fo => fo.id)]);
    return allOffers
      .filter(offer => !recentAndFeaturedIds.has(offer.id!))
      .sort(() => 0.5 - Math.random()) // Simple shuffle for recommendation
      .slice(0, 8);
  }, [allOffers, recentOffers, featuredOffers]);


  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
        categories={categories} // Static categories from types/index.ts
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {recommendedOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Recomendadas para Você</h2>
          <RecommendedOffersList offers={recommendedOffers} />
        </section>
      )}

      {featuredMerchants.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Comerciantes em Destaque</h2>
          <FeaturedMerchantsList merchants={featuredMerchants.map(m => ({
            id: m.id!,
            name: m.businessName || m.name,
            logoUrl: m.businessLogoUrl || `https://placehold.co/100x100.png?text=${(m.businessName || m.name).substring(0,1)}`,
            'data-ai-hint': m.businessLogoHint || 'store logo',
            category: m.businessCategory
           }))} />
        </section>
      )}


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
       {allOffers.length === 0 && !searchTerm && !selectedCategory && (
         <p className="text-center text-muted-foreground py-10 px-4 md:px-0 text-lg">
            Nenhuma oferta disponível no momento. <br/> Volte mais tarde!
        </p>
       )}
    </div>
  );
}
