
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { categories } from '@/types'; 
import type { Offer } from '@/types'; 
import FeaturedOffersList from '@/components/offers/FeaturedOffersList';
import CategoryPills from '@/components/offers/CategoryPills';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Loader2, Megaphone } from 'lucide-react';
import OfferList from '@/components/offers/OfferList';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { Timestamp } from 'firebase/firestore'; 
import { FirestoreConnectionError } from '@/components/common/FirestoreConnectionError';
import Link from 'next/link';

export default function FeedPage() {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const offers = await getAllOffers();
        setAllOffers(offers);

      } catch (err: any) {
        console.error("Error fetching data for feed:", err);
        setError(err.message || "Ocorreu um erro ao carregar as ofertas. Tente novamente mais tarde.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getSortableDate = (dateInput: Date | Timestamp): number => {
    if (dateInput instanceof Timestamp) {
      return dateInput.toMillis();
    }
    // Handles cases where the date might already be a JS Date object
    return new Date(dateInput).getTime();
  };


  const featuredOffers = useMemo(() => {
    return allOffers
      .filter(offer => offer.visibility === 'destaque')
      .sort((a,b) => getSortableDate(b.createdAt) - getSortableDate(a.createdAt))
      .slice(0, 5); // Show up to 5 featured offers
  }, [allOffers]);

  const filteredOffers = useMemo(() => {
    const featuredOfferIds = new Set(featuredOffers.map(fo => fo.id));
    
    let offers = allOffers.filter(offer => !featuredOfferIds.has(offer.id!));

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
    
    return offers.sort((a, b) => getSortableDate(b.createdAt) - getSortableDate(a.createdAt));
  }, [searchTerm, selectedCategory, allOffers, featuredOffers]);


  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  if (loading) { 
    return (
      <div className="flex justify-center items-center flex-grow">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Carregando ofertas...</p>
      </div>
    );
  }

  if (error) {
    return <FirestoreConnectionError message={error} />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 py-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por produtos, lojas ou serviços..."
              className="pl-12 w-full h-12 rounded-full bg-card shadow-md border-transparent focus-visible:ring-primary focus-visible:ring-2"
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

        {featuredOffers.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold font-headline mb-4">Ofertas em Destaque</h2>
            <FeaturedOffersList offers={featuredOffers} />
          </section>
        )}

        {filteredOffers.length > 0 && (
          <section>
             <h2 className="text-2xl font-semibold font-headline mb-4">Mais Ofertas</h2>
            <OfferList offers={filteredOffers} />
          </section>
        )}

        {allOffers.length === 0 && !loading && !error && ( 
          <div className="text-center text-muted-foreground py-16 px-4">
              <Megaphone className="mx-auto h-16 w-16 text-primary/30" />
              <p className="mt-6 text-xl font-semibold text-foreground">Nenhuma oferta por aqui... ainda!</p>
              <p className="mt-2 text-base">Seja o primeiro a divulgar! Se você é um anunciante, <br />
                <Link href="/dashboard/advertiser/create-offer" className="font-bold text-primary hover:underline">
                  crie uma nova oferta agora mesmo.
                </Link>
              </p>
          </div>
        )}
      </div>
    </div>
  );
}
