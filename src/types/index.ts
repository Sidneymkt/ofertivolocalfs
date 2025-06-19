
export interface Badge {
  id: string;
  name: string;
  icon: React.ElementType; 
  description: string;
  unlockedDate?: Date;
  'data-ai-hint'?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  userAvatarHint?: string;
  rating: number; // 1-5
  text: string;
  timestamp: Date;
}

export interface Offer {
  id: string;
  title: string;
  merchantName: string;
  merchantId: string; 
  merchantIsVerified?: boolean;
  imageUrl: string; 
  galleryImages?: string[];
  galleryImageHints?: string[];
  originalPrice?: number;
  discountedPrice: number;
  distance: string; 
  category: string;
  rating?: number; 
  reviews?: number; 
  timeRemaining?: string; 
  tags?: string[];
  latitude?: number;
  longitude?: number;
  description?: string; 
  fullDescription?: string;
  validUntil?: string | Date; 
  usersUsedCount?: number;
  qrCodeValue?: string; 
  pointsAwarded?: number;
  comments?: Comment[];
  'data-ai-hint'?: string;
}

export interface CheckIn {
  id: string;
  offerId: string;
  offerTitle: string;
  merchantName: string;
  timestamp: Date;
  pointsEarned: number;
}

export interface SharedOffer {
  id: string;
  offerId: string;
  offerTitle: string;
  platform: string; // e.g., WhatsApp, Instagram
  timestamp: Date;
  pointsEarned?: number;
}

export interface SweepstakeParticipation {
  id: string;
  sweepstakeId: string;
  sweepstakeTitle: string;
  timestamp: Date;
  pointsSpent: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarHint?: string;
  points: number;
  level?: number;
  currentXp?: number;
  xpToNextLevel?: number;
  badges?: Badge[];
  favoriteOffers?: string[]; // Array of offer IDs
  followedMerchants?: string[]; // Array of merchant IDs
  checkInHistory?: CheckIn[];
  sharedOffersHistory?: SharedOffer[];
  sweepstakeParticipations?: SweepstakeParticipation[];
  commentsMade?: Comment[];
  isAdvertiser?: boolean; 
  advertiserProfileId?: string; 
  businessName?: string; 
  address?: string;
  city?: string;
  whatsapp?: string;
  isProfileComplete?: boolean;
}


export interface Sweepstake {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pointsToEnter: number;
  endDate: Date;
  'data-ai-hint'?: string;
}

// Types for Advertiser Dashboard
export interface AdvertiserMetricItem {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string; // e.g., '+10%', '-5%'
  description?: string;
}

export interface PublishedOfferSummary {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'expired' | 'draft';
  views: number;
  clicks: number;
  isFeatured: boolean;
  imageUrl?: string; // Optional image for the list
  dataAiHint?: string;
}


// MOCK DATA

import { Award, Coins, Gift, MessageSquare, Share2, ShoppingCart, Star, Users } from 'lucide-react';


export const mockBadges: Badge[] = [
    { id: 'badge1', name: 'Explorador Inicial', icon: Star, description: 'Fez seu primeiro check-in!', unlockedDate: new Date(), 'data-ai-hint': 'star badge' },
    { id: 'badge2', name: 'Amigo das Ofertas', icon: Users, description: 'Compartilhou 5 ofertas!', 'data-ai-hint': 'people badge' },
    { id: 'badge3', name: 'Super Points', icon: Award, description: 'Acumulou 1000 pontos!', 'data-ai-hint': 'award badge' },
];

export const mockUser: User = {
  id: 'user123',
  name: 'Ana Clara Explorer',
  avatarUrl: 'https://placehold.co/100x100.png',
  avatarHint: 'person woman',
  points: 1250,
  level: 5,
  currentXp: 250,
  xpToNextLevel: 500,
  badges: mockBadges.slice(0,2),
  favoriteOffers: ['1', '3'],
  followedMerchants: ['pizzariaSaborosaMerchant', 'atletaShopMerchant', 'botecoMestreMerchant'],
  checkInHistory: [
    { id: 'chk1', offerId: '2', offerTitle: 'Corte de Cabelo + Barba', merchantName: 'Barbearia Premium', timestamp: new Date(Date.now() - 86400000 * 2), pointsEarned: 50 },
    { id: 'chk2', offerId: '4', offerTitle: 'Happy Hour Dose Dupla Chopp', merchantName: 'Boteco do Mestre', timestamp: new Date(Date.now() - 86400000 * 5), pointsEarned: 30 },
  ],
  sharedOffersHistory: [
      { id: 'share1', offerId: '1', offerTitle: '50% Off Pizza Gigante', platform: 'WhatsApp', timestamp: new Date(Date.now() - 86400000 * 1), pointsEarned: 10 },
  ],
  sweepstakeParticipations: [
      { id: 'swp1', sweepstakeId: 'sw1', sweepstakeTitle: 'Jantar Romântico', timestamp: new Date(Date.now() - 86400000 * 3), pointsSpent: 100 },
  ],
  commentsMade: [
      { id: 'cmt1', userId: 'user123', userName: 'Ana Clara Explorer', rating: 5, text: 'Adorei a pizza, super recomendo!', timestamp: new Date(Date.now() - 86400000), offerId: '1', offerTitle: '50% Off Pizza Gigante' } as any,
  ],
  isAdvertiser: false,
  address: 'Rua das Palmeiras, 123, Bairro Flores',
  city: 'Manaus, AM',
  whatsapp: '(92) 99999-8888',
  isProfileComplete: true,
  email: 'anaclara@exemplo.com',
};

export const mockAdvertiserUser: User = {
  id: 'advUserPizzariaSaborosa', 
  name: 'Carlos Pizzaiolo',
  businessName: 'Pizzaria Saborosa',
  avatarUrl: 'https://placehold.co/100x100.png',
  avatarHint: 'person chef',
  points: 0, 
  isAdvertiser: true,
  advertiserProfileId: 'pizzariaSaborosaMerchant', 
  email: 'carlos.pizza@saborosa.com',
};


export const mockOffers: Offer[] = [
  { 
    id: '1', 
    title: '50% Off Pizza Gigante + Refri Grátis', 
    merchantName: 'Pizzaria Saborosa', 
    merchantId: 'pizzariaSaborosaMerchant', 
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'pizza restaurant',
    galleryImages: [
      'https://placehold.co/800x500.png',
      'https://placehold.co/800x500.png',
      'https://placehold.co/800x500.png',
      'https://placehold.co/800x500.png',
    ],
    galleryImageHints: ['pizza variety', 'pizza slice', 'restaurant interior', 'happy customers'],
    originalPrice: 70.00, 
    discountedPrice: 35.00, 
    distance: '500m', 
    category: 'Alimentação', 
    rating: 4.8, 
    reviews: 210, 
    timeRemaining: '1h 30m restantes', 
    tags: ['#Relâmpago', '#Local', '#Popular', '#PizzaLovers'],
    latitude: -3.0912, 
    longitude: -59.9734,
    description: 'Deliciosa pizza gigante com 50% de desconto e refrigerante de 2L grátis! Sabores selecionados.',
    fullDescription: 'Aproveite nossa oferta especial: pizza gigante (12 fatias, até 3 sabores selecionáveis) com 50% de desconto e leve um refrigerante de 2 litros totalmente grátis! Nossa massa é artesanal, com fermentação natural, e usamos apenas ingredientes frescos e de alta qualidade. Perfeito para compartilhar com a família e amigos. Válido para consumo no local, retirada ou delivery (taxa de entrega não inclusa). Promoção não acumulativa com outras ofertas.',
    validUntil: new Date(Date.now() + 86400000 * 2).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric'}), 
    usersUsedCount: 138,
    qrCodeValue: 'OFERTA1-PIZZASABOROSA-12345', 
    pointsAwarded: 75,
    comments: [
      { id: 'c1', userId: 'userX', userName: 'João Silva', userAvatarUrl: 'https://placehold.co/40x40.png', userAvatarHint: 'man avatar', rating: 5, text: 'Pizza maravilhosa, atendimento top!', timestamp: new Date(Date.now() - 3600000 * 5) },
      { id: 'c2', userId: 'userY', userName: 'Maria Oliveira', userAvatarUrl: 'https://placehold.co/40x40.png', userAvatarHint: 'woman avatar', rating: 4, text: 'Gostei muito, ótimo custo-benefício.', timestamp: new Date(Date.now() - 3600000 * 24) },
      { id: 'c3', userId: 'userZ', userName: 'Pedro Costa', rating: 5, text: 'Sempre peço, a melhor da cidade!', timestamp: new Date(Date.now() - 3600000 * 48), userAvatarUrl: 'https://placehold.co/40x40.png', userAvatarHint: 'person smiling' },
    ],
  },
  { 
    id: '2', 
    title: 'Corte Masculino + Barba Modelada', 
    merchantName: 'Barbearia Premium', 
    merchantId: 'barbeariaPremiumMerchant',
    merchantIsVerified: false,
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'barber shop',
    originalPrice: 70.00, 
    discountedPrice: 45.00, 
    distance: '1.2km', 
    category: 'Serviços', 
    rating: 4.9, 
    reviews: 95, 
    timeRemaining: 'Encerra amanhã', 
    tags: ['cabelo', 'barba', 'beleza'],
    latitude: -3.1022,
    longitude: -59.9810,
    description: 'Renove seu visual com corte de cabelo moderno e barba modelada por nossos especialistas. Ambiente climatizado e café expresso cortesia.',
    fullDescription: 'Dê um trato completo no visual na Barbearia Premium. Nossos barbeiros são especialistas em cortes modernos e tradicionais, além de modelagem de barba com toalha quente e produtos de alta qualidade. Ambiente climatizado, som ambiente e um café expresso cortesia para você relaxar enquanto cuidamos do seu estilo.',
    validUntil: 'Amanhã',
    usersUsedCount: 72,
    pointsAwarded: 30,
    galleryImages: ['https://placehold.co/800x500.png', 'https://placehold.co/800x500.png'],
    galleryImageHints: ['haircut style', 'barber working'],
  },
  { 
    id: '3', 
    title: 'Tênis Corrida ProBoost X', 
    merchantName: 'Atleta Shop', 
    merchantId: 'atletaShopMerchant',
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'sport shoes',
    originalPrice: 450.00, 
    discountedPrice: 299.90, 
    distance: '2.5km', 
    category: 'Compras', 
    rating: 4.5, 
    reviews: 230, 
    timeRemaining: '3 dias restantes', 
    tags: ['tênis', 'esporte', 'corrida'],
    latitude: -3.0850,
    longitude: -60.0170,
    description: 'Performance e conforto para suas corridas com o Tênis ProBoost X. Tecnologia de amortecimento avançada e design arrojado.',
    fullDescription: 'Supere seus limites com o Tênis Corrida ProBoost X. Desenvolvido para corredores exigentes, oferece máximo amortecimento, responsividade e estabilidade. Cabedal em mesh respirável, solado de alta durabilidade e design moderno. Ideal para treinos diários e provas.',
    validUntil: new Date(Date.now() + 86400000 * 3).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric'}),
    usersUsedCount: 95,
    pointsAwarded: 100,
    galleryImages: ['https://placehold.co/800x500.png', 'https://placehold.co/800x500.png', 'https://placehold.co/800x500.png'],
    galleryImageHints: ['running shoe', 'shoe sole', 'person running'],
  },
  { 
    id: '4', 
    title: 'Happy Hour: Chopp Artesanal em Dobro', 
    merchantName: 'Boteco do Mestre', 
    merchantId: 'botecoMestreMerchant',
    imageUrl: 'https://placehold.co/600x300.png',
    'data-ai-hint': 'beer bar',
    originalPrice: 20.00, 
    discountedPrice: 10.00, 
    distance: '800m', 
    category: 'Alimentação', 
    rating: 4.3, 
    reviews: 78, 
    timeRemaining: 'Hoje 17h-20h', 
    tags: ['bar', 'bebidas', 'happy hour'],
    latitude: -3.1105,
    longitude: -60.0056,
    description: 'Todo dia das 17h às 20h, peça um chopp artesanal e ganhe outro! Perfeito para relaxar após o trabalho com amigos.',
    fullDescription: 'O melhor Happy Hour da cidade é no Boteco do Mestre! Das 17h às 20h, todos os dias, na compra de um chopp artesanal (Pilsen, IPA ou Weiss), o segundo é por nossa conta. Ambiente descontraído, petiscos deliciosos e música ambiente. Chame os amigos e venha aproveitar!',
    validUntil: 'Hoje até 20:00',
    usersUsedCount: 150,
    pointsAwarded: 20,
    galleryImages: ['https://placehold.co/800x500.png', 'https://placehold.co/800x500.png'],
    galleryImageHints: ['draft beer', 'bar snacks'],
  },
];

export const mockSweepstakes: Sweepstake[] = [
  { id: 'sw1', title: 'Ganhe um Jantar Romântico', description: 'Concorra a um jantar especial para duas pessoas no Restaurante Aconchego.', imageUrl: 'https://placehold.co/600x300.png', pointsToEnter: 100, endDate: new Date(Date.now() + 86400000 * 7), 'data-ai-hint': 'romantic dinner' },
  { id: 'sw2', title: 'Vale Compras de R$200', description: 'Use seus pontos para concorrer a um vale compras de R$200 na Loja Estilo Total.', imageUrl: 'https://placehold.co/600x300.png', pointsToEnter: 50, endDate: new Date(Date.now() + 86400000 * 14), 'data-ai-hint': 'shopping giftcard' },
];

export const categories = [
  { name: 'Alimentação', icon: 'Utensils' },
  { name: 'Serviços', icon: 'Wrench' },
  { name: 'Compras', icon: 'ShoppingCart' },
  { name: 'Lazer', icon: 'Smile' },
  { name: 'Saúde', icon: 'HeartPulse' },
  { name: 'Educação', icon: 'BookOpen' },
];

// Helper function to get a mock offer by ID
export const getMockOfferById = (id: string): Offer | undefined => {
  return mockOffers.find(offer => offer.id === id);
};

// Helper function to get a mock merchant by ID (simplified)
export const getMockMerchantById = (id: string): { id: string, name: string, imageUrl?: string, 'data-ai-hint'?: string, isVerified?: boolean } | undefined => {
    const offerFromMerchant = mockOffers.find(offer => offer.merchantId === id);
    if (offerFromMerchant) {
        return {
            id: offerFromMerchant.merchantId,
            name: offerFromMerchant.merchantName,
            imageUrl: `https://placehold.co/64x64.png?text=${offerFromMerchant.merchantName.substring(0,1)}`, // Placeholder image
            'data-ai-hint': 'store logo',
            isVerified: offerFromMerchant.merchantIsVerified
        };
    }
    // Fallback for merchants that might not have offers listed in mockOffers but are followed
    if (id === 'pizzariaSaborosaMerchant') return {id, name: 'Pizzaria Saborosa', isVerified: true, 'data-ai-hint': 'pizza place'};
    if (id === 'atletaShopMerchant') return {id, name: 'Atleta Shop', isVerified: true, 'data-ai-hint': 'sport store'};
    if (id === 'botecoMestreMerchant') return {id, name: 'Boteco do Mestre', isVerified: false, 'data-ai-hint': 'bar restaurant'};

    return undefined;
}

    