
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
import { getAllMerchants } from '@/lib/firebase/services/userService';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

// Temporary mock data for offers
const mockPageOffers: Offer[] = [
  {
    id: 'mock-offer-1',
    title: 'Pizza Grande Especial (Destaque)',
    description: 'Deliciosa pizza grande com 3 ingredientes à sua escolha e borda recheada.',
    merchantName: 'Pizzaria Fantasia',
    merchantId: 'mock-merchant-1',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'pizza food delicious',
    category: 'Alimentação',
    discountedPrice: 39.90,
    originalPrice: 59.90,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 7))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'destaque', // DESTAQUE
    status: 'active',
    pointsAwarded: 10,
    createdBy: 'mock-merchant-1',
    merchantIsVerified: true,
    usersUsedCount: 155,
    rating: 4.7,
    reviews: 30,
    galleryImages: ['https://placehold.co/800x450.png?text=Pizza+1', 'https://placehold.co/800x450.png?text=Pizza+2'], // TEM GALLERYIMAGES
    galleryImageHints: ['pizza restaurant', 'dinner food'],
    tags: ['#pizza', '#familia', '#promocao']
  },
  {
    id: 'mock-offer-2',
    title: 'Corte de Cabelo Moderno (Exemplo)',
    description: 'Renove seu visual com um corte moderno e estiloso + lavagem especial.',
    merchantName: 'Barbearia Estilo Único',
    merchantId: 'mock-merchant-2',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'haircut barber salon',
    category: 'Serviços',
    discountedPrice: 45.00,
    originalPrice: 60.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 10))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'exclusiva_app',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 15,
    createdBy: 'mock-merchant-2',
    merchantIsVerified: false,
    usersUsedCount: 78,
    rating: 4.9,
    reviews: 22,
    tags: ['#beleza', '#masculino', '#corte']
  },
  {
    id: 'mock-offer-3',
    title: 'Combo Lanche da Tarde (Exemplo)',
    description: 'Um delicioso sanduíche natural + suco de laranja 300ml.',
    merchantName: 'Cantina Sabor & Saúde',
    merchantId: 'mock-merchant-3',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'sandwich juice healthy',
    category: 'Alimentação',
    discountedPrice: 19.90,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 3))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'combo',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 5,
    createdBy: 'mock-merchant-3',
    merchantIsVerified: true,
    usersUsedCount: 210,
    rating: 4.3,
    reviews: 15,
    tags: ['#lanche', '#saudavel']
  },
  {
    id: 'mock-offer-4',
    title: 'Super Destaque: Viagem Incrível',
    description: 'Pacote de viagem para o paraíso com tudo incluso.',
    merchantName: 'Agência Viajar Bem',
    merchantId: 'mock-merchant-4',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'travel beach journey',
    category: 'Lazer',
    discountedPrice: 1990.00,
    originalPrice: 2500.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 30))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'destaque', // DESTAQUE
    status: 'active',
    pointsAwarded: 100,
    createdBy: 'mock-merchant-4',
    merchantIsVerified: true,
    usersUsedCount: 20,
    rating: 4.9,
    reviews: 10,
    galleryImages: ['https://placehold.co/800x450.png?text=Praia', 'https://placehold.co/800x450.png?text=Resort'], // TEM GALLERYIMAGES
    galleryImageHints: ['beach resort', 'travel vacation'],
    tags: ['#viagem', '#ferias', '#destaque']
  },
  {
    id: 'mock-offer-5',
    title: 'Serviço de Limpeza Profissional (Com Galeria)',
    description: 'Limpeza residencial completa com equipe especializada.',
    merchantName: 'Limpa Tudo Ltda',
    merchantId: 'mock-merchant-5',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'cleaning service home',
    category: 'Serviços',
    discountedPrice: 150.00,
    originalPrice: 200.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 15))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 20,
    createdBy: 'mock-merchant-5',
    merchantIsVerified: false,
    usersUsedCount: 45,
    rating: 4.5,
    reviews: 12,
    galleryImages: ['https://placehold.co/800x450.png?text=Limpeza+Sala'], // TEM GALLERYIMAGES => será destaque também
    galleryImageHints: ['cleaning livingroom'],
    tags: ['#limpeza', '#casa']
  },
  {
    id: 'mock-offer-6',
    title: 'Curso de Culinária Online (Destaque)',
    description: 'Aprenda a cozinhar pratos incríveis com chefs renomados.',
    merchantName: 'Escola Gourmet Digital',
    merchantId: 'mock-merchant-6',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'cooking course online',
    category: 'Educação',
    discountedPrice: 99.90,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 60))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'exclusiva_app',
    visibility: 'destaque', // DESTAQUE
    status: 'active',
    pointsAwarded: 30,
    createdBy: 'mock-merchant-6',
    merchantIsVerified: true,
    usersUsedCount: 90,
    rating: 4.8,
    reviews: 25,
    galleryImages: ['https://placehold.co/800x450.png?text=Chef+Cozinha'],
    galleryImageHints: ['chef cooking'],
    tags: ['#curso', '#culinaria', '#online']
  },
  {
    id: 'mock-offer-7',
    title: 'Consultoria Fitness Personalizada (Com Galeria)',
    description: 'Alcance seus objetivos de fitness com um plano personalizado.',
    merchantName: 'Personal Trainer Pro',
    merchantId: 'mock-merchant-7',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'fitness workout gym',
    category: 'Saúde',
    discountedPrice: 250.00,
    originalPrice: 350.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 20))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 25,
    createdBy: 'mock-merchant-7',
    merchantIsVerified: true,
    usersUsedCount: 55,
    rating: 4.6,
    reviews: 18,
    galleryImages: ['https://placehold.co/800x450.png?text=Academia'], // TEM GALLERYIMAGES => será destaque
    galleryImageHints: ['gym workout'],
    tags: ['#fitness', '#saude', '#personal']
  },
    {
    id: 'mock-offer-8',
    title: 'Smartphone Última Geração (Destaque VIP)',
    description: 'Compre o novo smartphone com desconto exclusivo e capa grátis.',
    merchantName: 'Tech Store Manaus',
    merchantId: 'mock-merchant-8',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'smartphone tech gadget',
    category: 'Compras',
    discountedPrice: 2999.00,
    originalPrice: 3599.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 10))),
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'cupom_qr',
    visibility: 'destaque', // DESTAQUE
    status: 'active',
    pointsAwarded: 50,
    createdBy: 'mock-merchant-8',
    merchantIsVerified: true,
    usersUsedCount: 30,
    rating: 4.7,
    reviews: 15,
    galleryImages: ['https://placehold.co/800x450.png?text=Celular+Novo', 'https://placehold.co/800x450.png?text=Caixa+Celular'], // TEM GALLERYIMAGES
    galleryImageHints: ['new smartphone', 'phone box'],
    tags: ['#smartphone', '#tecnologia', '#promocao']
  }
];


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
        // Temporarily use mock offers
        console.log("Usando dados mock para ofertas na home feed.");
        setAllOffers(mockPageOffers);
        
        // Continue trying to fetch real merchants
        const merchants = await getAllMerchants();
        setFeaturedMerchants(merchants.slice(0,10).map(m => ({
          id: m.id,
          name: m.businessName || m.name,
          logoUrl: m.businessLogoUrl || 'https://placehold.co/100x100.png?text=Logo',
          'data-ai-hint': m.businessLogoHint || 'store logo',
          category: m.businessCategory
        })));

      } catch (error) {
        console.error("Error fetching merchant data for feed:", error);
        // If merchant fetch fails, featuredMerchants will remain empty, which is acceptable.
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const featuredOffers = useMemo(() => {
    // Simulate featured: e.g., offers with visibility 'destaque' or most recent with images
    return allOffers
      .filter(offer => offer.visibility === 'destaque' || (offer.galleryImages && offer.galleryImages.length > 0))
      .sort((a,b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 8); // Increased from 4 to 8
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

  if (loading && allOffers.length === 0) { // Show loader only if mock data hasn't been set yet or if allOffers is still genuinely empty from a fast mock set
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
       {allOffers.length === 0 && !loading && !searchTerm && !selectedCategory && ( // Check loading state here
         <p className="text-center text-muted-foreground py-10 px-4 md:px-0 text-lg">
            Nenhuma oferta disponível no momento. <br/> Volte mais tarde!
        </p>
       )}
    </div>
  );
}

    
