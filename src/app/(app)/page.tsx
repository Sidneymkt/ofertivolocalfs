
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { categories } from '@/types'; 
import type { Offer, User, Category } from '@/types'; 
import FeaturedOffersList from '@/components/offers/FeaturedOffersList';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Loader2, AlertTriangle } from 'lucide-react';
import RecommendedOffersList from '@/components/offers/RecommendedOffersList';
import RecentOffersList from '@/components/offers/RecentOffersList';
import { getAllOffers } from '@/lib/firebase/services/offerService';
import { getAllMerchants } from '@/lib/firebase/services/userService';
import { Timestamp } from 'firebase/firestore'; 
import { Card, CardContent } from '@/components/ui/card';

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
        // Shuffle offers once on load for stable "recommended" list
        const shuffledOffers = [...offers].sort(() => 0.5 - Math.random());
        setAllOffers(shuffledOffers);
        
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
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 10); 
  }, [filteredOffers]);

  const recommendedOffers = useMemo(() => {
    const recentAndFeaturedIds = new Set([...recentOffers.map(ro => ro.id), ...featuredOffers.map(fo => fo.id)]);
    // Use the pre-shuffled allOffers list for stable recommendations
    return allOffers
      .filter(offer => !recentAndFeaturedIds.has(offer.id!))
      .slice(0, 8);
  }, [allOffers, recentOffers, featuredOffers]);


  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  if (loading) { 
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Carregando ofertas...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="container mx-auto px-4 py-6">
         <Card className="m-4 shadow-lg border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold text-destructive">Erro de Conexão com o Banco de Dados</h2>
            <p className="text-destructive/90 max-w-xl mx-auto">
              Não foi possível carregar os dados. Isso geralmente acontece por dois motivos:
            </p>
            <ol className="text-sm text-left list-decimal list-inside bg-destructive/10 p-3 rounded-md max-w-lg mx-auto">
              <li>O `projectId` no arquivo <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">.env.local</code> está incorreto.</li>
              <li>O banco de dados **Cloud Firestore** não foi criado ou ativado no seu projeto Firebase.</li>
            </ol>
             <p className="text-xs text-muted-foreground pt-4 border-t">
              Por favor, verifique essas configurações no Console do Firebase e no seu ambiente. Após corrigir, reinicie o servidor de desenvolvimento.
            </p>
          </CardContent>
        </Card>
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


      {recentOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Ofertas Recentes</h2>
          <RecentOffersList offers={recentOffers} />
        </section>
      )}
       {allOffers.length === 0 && !loading && !error && ( 
         <p className="text-center text-muted-foreground py-10 px-4 md:px-0 text-lg">
            Nenhuma oferta encontrada. <br/> Volte mais tarde ou publique a sua!
        </p>
       )}
    </div>
  );
}
