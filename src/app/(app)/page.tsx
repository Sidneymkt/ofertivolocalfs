
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import OfferList from '@/components/offers/OfferList'; // Manter para outros usos, se houver, ou remover se não mais usado
import { categories } from '@/types'; // Keep static categories
import type { Offer, Category, User } from '@/types'; // Import User for featured merchants
import FeaturedOffersList from '@/components/offers/FeaturedOffersList';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, MapPin, Loader2 } from 'lucide-react';
import RecommendedOffersList from '@/components/offers/RecommendedOffersList';
import RecentOffersList from '@/components/offers/RecentOffersList'; // Importar o novo componente
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
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 1))), // Recent
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
    galleryImages: ['https://placehold.co/800x450.png', 'https://placehold.co/800x450.png'], 
    galleryImageHints: ['pizza restaurant', 'dinner food'],
    tags: ['#pizza', '#familia', '#promocao']
  },
  {
    id: 'mock-offer-2',
    title: 'Corte de Cabelo Moderno (Recente)',
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
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 2))), // Recent
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
    title: 'Combo Lanche da Tarde (Mais Recente)',
    description: 'Um delicioso sanduíche natural + suco de laranja 300ml.',
    merchantName: 'Cantina Sabor & Saúde',
    merchantId: 'mock-merchant-3',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'sandwich juice healthy',
    category: 'Alimentação',
    discountedPrice: 19.90,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 3))),
    createdAt: Timestamp.fromDate(new Date()), // Most recent
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
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 5))),
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
    galleryImages: ['https://placehold.co/800x450.png', 'https://placehold.co/800x450.png'], 
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
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 3))), // Recent
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
    galleryImages: ['https://placehold.co/800x450.png'], 
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
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 10))),
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
    galleryImages: ['https://placehold.co/800x450.png'],
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
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 4))), // Recent
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
    galleryImages: ['https://placehold.co/800x450.png'],
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
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 12))),
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
    galleryImages: ['https://placehold.co/800x450.png', 'https://placehold.co/800x450.png'],
    galleryImageHints: ['new smartphone', 'phone box'],
    tags: ['#smartphone', '#tecnologia', '#promocao']
  },
  {
    id: 'mock-offer-9',
    title: 'Manicure e Pedicure Completa',
    description: 'Unhas perfeitas com os melhores produtos e profissionais.',
    merchantName: 'Salão Bela Unha',
    merchantId: 'mock-merchant-9',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'manicure nails beauty',
    category: 'Serviços',
    discountedPrice: 50.00,
    originalPrice: 70.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 15))),
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 6))), // Recent
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 10,
    createdBy: 'mock-merchant-9',
    merchantIsVerified: true,
    usersUsedCount: 65,
    rating: 4.6,
    reviews: 18,
    tags: ['#unhas', '#belezafeminina']
  },
  {
    id: 'mock-offer-10',
    title: 'Rodízio Japonês para Casal (Destaque)',
    description: 'Delicie-se com nosso rodízio completo de sushi e sashimi.',
    merchantName: 'Restaurante Sakura',
    merchantId: 'mock-merchant-10',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'sushi japanese food',
    category: 'Alimentação',
    discountedPrice: 129.90,
    originalPrice: 159.90,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 20))),
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 7))), // Recent
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'destaque',
    status: 'active',
    pointsAwarded: 25,
    createdBy: 'mock-merchant-10',
    merchantIsVerified: true,
    usersUsedCount: 95,
    rating: 4.9,
    reviews: 40,
    galleryImages: ['https://placehold.co/800x450.png', 'https://placehold.co/800x450.png'],
    galleryImageHints: ['sushi combo', 'japanese temaki'],
    tags: ['#japa', '#rodizio', '#casal']
  },
  {
    id: 'mock-offer-11',
    title: 'Ingresso Cinema 2D (Filme Estreia)',
    description: 'Assista aos grandes lançamentos do cinema com desconto.',
    merchantName: 'Cinema Ofertivo',
    merchantId: 'mock-merchant-11',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'cinema movie ticket',
    category: 'Lazer',
    discountedPrice: 15.00,
    originalPrice: 30.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 30))),
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 8))),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'cupom_qr',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 5,
    createdBy: 'mock-merchant-11',
    merchantIsVerified: false,
    usersUsedCount: 350,
    rating: 4.2,
    reviews: 55,
    tags: ['#cinema', '#filme', '#estreia']
  },
  {
    id: 'mock-offer-12',
    title: 'Óculos de Sol da Nova Coleção',
    description: 'Proteja seus olhos com estilo. Diversos modelos com 30% OFF.',
    merchantName: 'Ótica Visão Clara',
    merchantId: 'mock-merchant-12',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'sunglasses fashion style',
    category: 'Compras',
    discountedPrice: 139.90, 
    originalPrice: 199.85,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 25))),
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 9))),
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 15,
    createdBy: 'mock-merchant-12',
    merchantIsVerified: true,
    usersUsedCount: 40,
    rating: 4.5,
    reviews: 10,
    galleryImages: ['https://placehold.co/800x450.png', 'https://placehold.co/800x450.png'],
    galleryImageHints: ['sunglasses model', 'fashion eyewear'],
    tags: ['#oculos', '#verao', '#estilo']
  },
  {
    id: 'mock-offer-13',
    title: 'Happy Hour Cerveja Artesanal (Destaque)',
    description: 'Chopp artesanal em dobro das 18h às 20h.',
    merchantName: 'Mestre Cervejeiro Pub',
    merchantId: 'mock-merchant-13',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'beer pub craft',
    category: 'Lazer',
    discountedPrice: 10.00, // Preço simbólico do chopp, benefício é o "em dobro"
    originalPrice: 20.00, 
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 14))),
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 1))), // Recente
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'relampago',
    visibility: 'destaque',
    status: 'active',
    pointsAwarded: 5,
    createdBy: 'mock-merchant-13',
    merchantIsVerified: true,
    usersUsedCount: 88,
    rating: 4.6,
    reviews: 20,
    galleryImages: ['https://placehold.co/800x450.png'],
    galleryImageHints: ['craft beer glass'],
    tags: ['#happyhour', '#cerveja', '#pub']
  },
  {
    id: 'mock-offer-14',
    title: 'Pacote de Lavagem Automotiva Completa',
    description: 'Lavagem, enceramento e aspiração para deixar seu carro brilhando.',
    merchantName: 'Auto Spa Premium',
    merchantId: 'mock-merchant-14',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'car wash service',
    category: 'Serviços',
    discountedPrice: 79.90,
    originalPrice: 100.00,
    validityStartDate: Timestamp.fromDate(new Date()),
    validityEndDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 30))),
    createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 2))), // Recente
    updatedAt: Timestamp.fromDate(new Date()),
    offerType: 'padrao',
    visibility: 'normal',
    status: 'active',
    pointsAwarded: 10,
    createdBy: 'mock-merchant-14',
    merchantIsVerified: false,
    usersUsedCount: 60,
    rating: 4.4,
    reviews: 15,
    tags: ['#carro', '#lavagem', '#automotivo']
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
        console.log("Usando dados mock para ofertas na home feed.");
        setAllOffers(mockPageOffers);
        
        const merchants = await getAllMerchants();
        setFeaturedMerchants(merchants.slice(0,10).map(m => ({
          id: m.id,
          name: m.businessName || m.name,
          logoUrl: m.businessLogoUrl || 'https://placehold.co/100x100.png',
          'data-ai-hint': m.businessLogoHint || 'store logo',
          category: m.businessCategory
        })));

      } catch (error) {
        console.error("Error fetching merchant data for feed:", error);
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
      .slice(0, 8); // Aumentado para 8
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
    return allOffers
      .filter(offer => !recentAndFeaturedIds.has(offer.id!))
      .sort(() => 0.5 - Math.random()) 
      .slice(0, 8);
  }, [allOffers, recentOffers, featuredOffers]);


  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  if (loading && allOffers.length === 0) { 
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
       {recentOffers.length === 0 && searchTerm && selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada para "{searchTerm}" na categoria "{selectedCategory}".</p>
       )}
       {recentOffers.length === 0 && searchTerm && !selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada para "{searchTerm}".</p>
       )}
       {recentOffers.length === 0 && !searchTerm && selectedCategory && (
         <p className="text-center text-muted-foreground py-6 px-4 md:px-0">Nenhuma oferta recente encontrada na categoria "{selectedCategory}".</p>
       )}
       {allOffers.length === 0 && !loading && !searchTerm && !selectedCategory && ( 
         <p className="text-center text-muted-foreground py-10 px-4 md:px-0 text-lg">
            Nenhuma oferta disponível no momento. <br/> Volte mais tarde!
        </p>
       )}
    </div>
  );
}
