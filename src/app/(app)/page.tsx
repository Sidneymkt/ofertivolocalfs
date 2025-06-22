
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { categories } from '@/types'; 
import type { Offer, User, Category } from '@/types'; 
import FeaturedOffersList from '@/components/offers/FeaturedOffersList';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Loader2, Megaphone } from 'lucide-react';
import OfferList from '@/components/offers/OfferList';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { getAllMerchants } from '@/lib/firebase/services/userService';
import { Timestamp } from 'firebase/firestore'; 
import { FirestoreConnectionError } from '@/components/common/FirestoreConnectionError';
import Link from 'next/link';

export default function FeedPage() {
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [featuredMerchants, setFeaturedMerchants] = useState<User[]>([]);
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
        
        const merchants = await getAllMerchants();
        setFeaturedMerchants(merchants.slice(0, 10).map(m => ({
          id: m.id,
          name: m.businessName || m.name,
          logoUrl: m.businessLogoUrl || 'https://placehold.co/100x100.png',
          'data-ai-hint': m.businessLogoHint || 'store logo',
          category: m.businessCategory
        })));

      } catch (err: any) {
        console.error("Error fetching data for feed:", err);
        if (err.message.includes("offline") || err.message.includes("Failed to get document")) {
            setError("Não foi possível conectar ao banco de dados. Verifique se o Firestore está habilitado e se o 'projectId' do Firebase está configurado corretamente no seu ambiente.");
        } else {
            setError("Ocorreu um erro ao carregar as ofertas. Tente novamente mais tarde.");
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const featuredOffers = useMemo(() => {
    return allOffers
      .filter(offer => offer.visibility === 'destaque' || (offer.galleryImages && offer.galleryImages.length > 0))
      .sort((a,b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 8);
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
    
    // Sort remaining offers by date
    return offers.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
    });
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
    return <FirestoreConnectionError />;
  }

  return (
    <div className="container mx-auto">
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

        {featuredMerchants.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Comerciantes em Destaque</h2>
            <FeaturedMerchantsList merchants={featuredMerchants.map(m => ({
              id: m.id!,
              name: m.businessName || m.name,
              logoUrl: m.businessLogoUrl || `https://placehold.co/100x100.png`,
              'data-ai-hint': m.businessLogoHint || 'store logo',
              category: m.businessCategory
            }))} />
          </section>
        )}

        {filteredOffers.length > 0 && (
          <section className="space-y-3 px-4 md:px-0">
            <h2 className="text-xl font-semibold font-headline">Ofertas Recentes</h2>
            <OfferList offers={filteredOffers} />
          </section>
        )}

        {allOffers.length === 0 && !loading && !error && ( 
          <div className="text-center text-muted-foreground py-10 px-4 md:px-0">
              <Megaphone className="mx-auto h-12 w-12 text-primary/30" />
              <p className="mt-4 text-lg font-semibold text-foreground">Nenhuma oferta por aqui... ainda!</p>
              <p className="mt-2 text-sm">Seja o primeiro a divulgar! Se você é um anunciante, <br />
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
