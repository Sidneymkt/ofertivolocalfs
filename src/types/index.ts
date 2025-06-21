
import type React from 'react';
import { Timestamp, serverTimestamp as fsServerTimestamp } from 'firebase/firestore';

import {
  Activity, AlertTriangle, Award, BadgeCheck, BarChart3, BookOpen, Building, Building2, CalendarCheck2, CheckCircle, CheckCheck, Coins, CreditCard, DollarSign, Eye, FileText, Filter, Gift, HandCoins, HeartPulse, HelpCircle, Home, Image as ImageIconLucide, ListChecks, LocateFixed, MailQuestion, MapPin, MapPinned, Megaphone, MessageSquare, MousePointerClick, Package, PackageCheck, QrCode, Settings2, ShieldAlert, ShieldCheck, ShoppingCart, Smile, Smartphone, Sparkles, Star, ThumbsUp, Ticket, TrendingDown, TrendingUp, UserCheck, UserCog, UserPlus, Users, Utensils, Wrench, Zap
} from 'lucide-react';


export interface Badge {
  id: string;
  name: string;
  icon: 'Star' | 'Users' | 'Award' | 'MessageSquare' | 'Zap'; 
  description: string;
  unlockedDate?: Date | Timestamp;
  'data-ai-hint'?: string;
}

export interface Category {
  name: string;
  icon: 'Utensils' | 'Wrench' | 'ShoppingCart' | 'Smile' | 'HeartPulse' | 'BookOpen' | string; 
}

export interface Comment {
  id?: string; // ID será gerado pelo Firestore
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  userAvatarHint?: string;
  rating: number;
  text: string;
  timestamp: Date | Timestamp;
  offerId?: string;
  offerTitle?: string; // Denormalized for easier display
  pointsEarned?: number;
}

export const offerTypes = [
  { id: 'relampago', name: 'Oferta Relâmpago', icon: Zap, description: 'Duração curta, alto impacto. Ideal para promoções urgentes.', colorClass: 'border-orange-500' },
  { id: 'exclusiva_app', name: 'Oferta Exclusiva App', icon: Smartphone, description: 'Requer validação via QR Code no app. Incentiva o uso do aplicativo.', colorClass: 'border-blue-500'},
  { id: 'cupom_qr', name: 'Cupom Digital com QR Code', icon: QrCode, description: 'Cupom digital único validado por QR Code na loja.', colorClass: 'border-green-500' },
  { id: 'primeiro_uso', name: 'Oferta para Primeiro Uso', icon: UserCheck, description: 'Atraia novos clientes com um benefício especial na primeira compra/uso.', colorClass: 'border-purple-500' },
  { id: 'checkin_premiado', name: 'Check-in Premiado', icon: CheckCheck, description: 'Recompense clientes por check-ins múltiplos em suas ofertas ou estabelecimento.', colorClass: 'border-teal-500' },
  { id: 'combo', name: 'Combo Econômico', icon: Package, description: 'Agrupe produtos ou serviços por um preço especial.', colorClass: 'border-red-500' },
  { id: 'bairro', name: 'Oferta do Dia por Bairro', icon: LocateFixed, description: 'Foco em geolocalização específica para atingir clientes próximos.', colorClass: 'border-yellow-500' },
  { id: 'padrao', name: 'Oferta Padrão', icon: ListChecks, description: 'Oferta genérica com desconto ou benefício.', colorClass: 'border-gray-500'}
] as const;

export type OfferTypeId = typeof offerTypes[number]['id'];
export type OfferTypeDetails = typeof offerTypes[number];


export interface Offer {
  id?: string; // ID será gerado pelo Firestore
  title: string;
  description: string;
  fullDescription?: string;
  merchantName: string; // Denormalized
  merchantId: string; // Reference to User ID (advertiser)
  merchantIsVerified?: boolean; // Denormalized
  imageUrl: string; // URL from Firebase Storage
  'data-ai-hint'?: string;
  galleryImages?: string[]; // URLs from Firebase Storage
  galleryImageHints?: string[];

  offerType: OfferTypeId;
  category: string;

  originalPrice?: number;
  discountType?: "percentage" | "finalValue";
  discountPercentage?: number;
  discountedPrice: number;

  tags?: string[];
  validityStartDate: Date | Timestamp;
  validityEndDate: Date | Timestamp;
  timeRemaining?: string; // Primarily for client-side display calculation

  quantity?: number;
  isUnlimited?: boolean;
  usersUsedCount?: number; // Counter

  terms?: string;
  visibility: "normal" | "destaque" | "sorteio";
  status: 'active' | 'pending_approval' | 'expired' | 'draft' | 'rejected'; // pending_approval replacing awaiting_approval

  timeLimit?: string; 
  isPresentialOnly?: boolean; 
  isForNewUsersOnly?: boolean; 
  minCheckins?: number; 
  checkinReward?: string; 
  comboItem1?: string; 
  comboItem2?: string;
  comboItem3?: string;
  targetNeighborhood?: string; 

  pointsAwarded?: number;
  pointsForCheckin?: number;
  pointsForShare?: number;
  pointsForRating?: number;
  isRedeemableWithPoints?: boolean;

  latitude?: number;
  longitude?: number;
  // distance?: string; // Calculated client-side

  rating?: number; // Average rating
  reviews?: number; // Number of reviews/comments

  createdBy: string; // advertiserId, should match merchantId
  createdAt: Timestamp; // Use Firestore Timestamp
  updatedAt: Timestamp; // Use Firestore Timestamp
  // comments subcollection will be used instead of embedding
}


export interface CheckIn {
  id?: string; // ID do documento de check-in
  userId: string;
  offerId: string;
  offerTitle: string; // Denormalized
  merchantId: string;
  merchantName: string; // Denormalized
  timestamp: Timestamp;
  pointsEarned: number;
}

export interface SharedOffer {
  id?: string;
  userId: string;
  offerId: string;
  offerTitle: string; // Denormalized
  platform: string;
  timestamp: Timestamp;
  pointsEarned?: number;
}

export interface SweepstakeParticipation {
  id?: string; // ID do documento de participação
  userId: string;
  sweepstakeId: string;
  sweepstakeTitle: string; // Denormalized
  timestamp: Timestamp;
  pointsSpent: number;
}

export const USER_LEVELS = {
  INICIANTE: { name: 'Iniciante', minXp: 0, nextLevelXp: 100 },
  BRONZE: { name: 'Bronze', minXp: 100, nextLevelXp: 500 },
  PRATA: { name: 'Prata', minXp: 500, nextLevelXp: 1500 },
  OURO: { name: 'Ouro', minXp: 1500, nextLevelXp: 5000 },
  PLATINA: { name: 'Platina', minXp: 5000, nextLevelXp: Infinity },
};

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';
export type AdvertiserPlan = 'basic' | 'pro' | 'premium' | 'trial';

export const ADVERTISER_PLAN_DETAILS: Record<AdvertiserPlan, { name: string; pointValueInBRL: number; description: string }> = {
  trial: { name: 'Teste (Trial)', pointValueInBRL: 0.05, description: 'Plano de experimentação com funcionalidades básicas.' },
  basic: { name: 'Básico', pointValueInBRL: 0.04, description: 'Ideal para pequenos negócios começando.' },
  pro: { name: 'Pro', pointValueInBRL: 0.03, description: 'Mais recursos para negócios em crescimento.' },
  premium: { name: 'Premium', pointValueInBRL: 0.02, description: 'Todas as funcionalidades para grandes anunciantes.' },
};

export interface User {
  id: string; // Firebase Auth UID
  name: string;
  email?: string;
  avatarUrl?: string; // URL from Firebase Storage
  avatarHint?: string;
  coverPhotoUrl?: string; // URL from Firebase Storage
  coverPhotoHint?: string;
  points: number;
  level: string;
  currentXp: number;
  xpToNextLevel: number;
  badges?: Badge[]; // Array of badge objects or IDs
  favoriteOffers?: string[]; // Array of offer IDs
  followedMerchants?: string[]; // Array of merchant (User) IDs
  
  // History might be better as subcollections for scalability
  checkInHistory?: CheckIn[]; 
  sharedOffersHistory?: SharedOffer[];
  sweepstakeParticipations?: SweepstakeParticipation[];
  commentsMade?: Comment[]; 

  joinDate: Timestamp; 
  status?: UserStatus; 

  isAdvertiser?: boolean;
  // Advertiser-specific fields (denormalized here or in a separate 'merchants' collection linked by id)
  advertiserProfileId?: string; // Could be same as user.id if structure is unified
  businessName?: string;
  businessLogoUrl?: string; // URL from Firebase Storage
  businessLogoHint?: string;
  businessCoverPhotoUrl?: string; // URL from Firebase Storage
  businessCoverPhotoHint?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessCity?: string;
  businessWhatsapp?: string;
  businessCategory?: string; // From the categories list
  advertiserStatus?: UserStatus; 
  advertiserPlan?: AdvertiserPlan; 

  // Personal details (might be distinct from business details if user is also an advertiser)
  address?: string;
  city?: string;
  whatsapp?: string;
  isProfileComplete?: boolean;
  responsibleName?: string; // For advertiser context if businessName is the primary display
}

export interface SweepstakeParticipant {
  id: string; // User ID
  name: string;
  avatarUrl?: string;
  avatarHint?: string;
  entryDate: Timestamp; // Date of entry
}

export interface SweepstakeWinner {
  userId: string;
  userName: string;
  avatarUrl?: string;
  avatarHint?: string;
}

export interface Sweepstake {
  id?: string; // Firestore document ID
  title: string;
  description: string;
  imageUrl: string; // URL from Firebase Storage
  'data-ai-hint'?: string;
  prizeDetails: string;
  pointsToEnter: number;
  startDate: Timestamp;
  endDate: Timestamp;
  numberOfWinners: number;
  maxParticipants?: number;
  rules?: string;
  createdBy: string; // advertiserId (User ID)
  status: 'upcoming' | 'active' | 'ended' | 'drawing_complete' | 'cancelled';
  
  isDrawn?: boolean;
  drawDate?: Timestamp;
  // winners and participants might be better as subcollections for scalability
  // winners?: SweepstakeWinner[];
  // participants?: SweepstakeParticipant[];
  participantCount?: number; // Counter
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  offerId: string;
  imageUrl?: string;
  'data-ai-hint'?: string;
}

export type AdvertiserMetricItem = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  description?: string;
};

export type PublishedOfferSummary = Pick<
  Offer,
  'id' | 'title' | 'status' | 'imageUrl' | 'data-ai-hint' | 'visibility' | 'discountedPrice' | 'originalPrice' | 'usersUsedCount' | 'category'
>;


export type AdminMetricItem = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  bgColorClass?: string;
};


export const POINTS_CHECKIN = 5;
export const POINTS_SHARE_OFFER = 3;
export const POINTS_FOLLOW_MERCHANT = 2;
export const POINTS_RATE_OFFER_OR_MERCHANT = 1;
export const POINTS_PROFILE_COMPLETE = 50;
export const POINTS_SIGNUP_WELCOME = 100;


export const categories: Category[] = [
  { name: 'Alimentação', icon: 'Utensils' },
  { name: 'Serviços', icon: 'Wrench' },
  { name: 'Compras', icon: 'ShoppingCart' },
  { name: 'Lazer', icon: 'Smile' },
  { name: 'Saúde', icon: 'HeartPulse' },
  { name: 'Educação', icon: 'BookOpen' },
  { name: 'Outros', icon: 'Package' },
];


export const adminModules = [
  { id: 'dashboard', title: 'Dashboard', icon: Home, description: 'Visão geral da plataforma Ofertivo.' },
  { id: 'users', title: 'Gestão de Usuários', icon: Users, description: 'Gerencie perfis, permissões e dados de usuários.' },
  { id: 'advertisers', title: 'Gestão de Anunciantes', icon: Building2, description: 'Monitore contas, planos e desempenho de anunciantes.' },
  { id: 'offers', title: 'Aprovação de Ofertas', icon: PackageCheck, description: 'Revise, aprove ou rejeite ofertas pendentes.' },
  { id: 'analytics', title: 'Analytics Global', icon: BarChart3, description: 'Visualize gráficos de desempenho e tendências da plataforma.' },
  { id: 'categories', title: 'Gestão de Categorias', icon: Filter, description: 'Crie, edite e organize categorias de ofertas.' },
  { id: 'media', title: 'Gestão de Mídia', icon: ImageIconLucide, description: 'Gerencie imagens e outros ativos de mídia da plataforma.' },
  { id: 'reports', title: 'Banco de Relatórios', icon: FileText, description: 'Gere e baixe relatórios detalhados.' },
  { id: 'settings', title: 'Configurações Gerais', icon: Settings2, description: 'Ajuste as configurações da plataforma Ofertivo.' },
  { id: 'sweepstakes', title: 'Gestão de Sorteios', icon: Gift, description: 'Monitore e crie sorteios para engajamento.' },
  { id: 'moderation', title: 'Moderação de Conteúdo', icon: ShieldAlert, description: 'Revise comentários e trate denúncias.' },
  { id: 'finance', title: 'Financeiro e Assinaturas', icon: CreditCard, description: 'Controle pagamentos, assinaturas e receita.' },
  { id: 'support', title: 'Central de Suporte', icon: HelpCircle, description: 'Gerencie tickets e forneça suporte aos usuários.' },
];

export const serverTimestamp = fsServerTimestamp;
    
// --- MOCK DATA ---

export const mockUser: User = {
  id: 'user-mock-123',
  name: 'Bruno Costa',
  email: 'bruno.costa@example.com',
  avatarUrl: 'https://placehold.co/100x100.png?text=BC',
  avatarHint: 'person avatar',
  points: 1250,
  level: 'Prata',
  currentXp: 750,
  xpToNextLevel: 1500,
  joinDate: new Timestamp(1672531200, 0), // Jan 1, 2023
  isAdvertiser: false,
  status: 'active',
  isProfileComplete: true,
  address: 'Rua das Flores, 123',
  city: 'Manaus',
  favoriteOffers: ['offer-pizza-1', 'offer-barber-2'],
  followedMerchants: ['advertiser-pizzaria-123'],
  badges: [
    { id: 'b1', name: 'Explorador', icon: 'Star', description: 'Realizou o primeiro check-in!', unlockedDate: new Date(), 'data-ai-hint': 'star badge' },
    { id: 'b2', name: 'Social', icon: 'Users', description: 'Compartilhou 5 ofertas!', unlockedDate: new Date(), 'data-ai-hint': 'people group' },
  ],
  checkInHistory: [
      { id: 'chk1', userId: 'user-mock-123', offerId: 'offer-barber-2', offerTitle: 'Corte + Barba por Preço Especial', merchantId: 'adv-mock-2', merchantName: 'Barbearia Navalha', timestamp: Timestamp.fromDate(new Date()), pointsEarned: 10 },
  ],
  sharedOffersHistory: [
      { id: 'shr1', userId: 'user-mock-123', offerId: 'offer-pizza-1', offerTitle: '🍕 Pizza Gigante 50% OFF + Refri Grátis!', platform: 'WhatsApp', timestamp: Timestamp.fromDate(new Date()), pointsEarned: 5 },
  ],
   sweepstakeParticipations: [
      { id: 'swp1', userId: 'user-mock-123', sweepstakeId: 'sweep-1', sweepstakeTitle: 'Sorteio de Verão', timestamp: Timestamp.fromDate(new Date()), pointsSpent: 50 }
  ],
  commentsMade: [
      { id: 'cmt1', userId: 'user-mock-123', offerId: 'offer-pizza-1', offerTitle: '🍕 Pizza Gigante 50% OFF + Refri Grátis!', rating: 5, text: 'Pizza maravilhosa, valeu muito a pena!', timestamp: Timestamp.fromDate(new Date()), pointsEarned: 2 }
  ]
};

export const mockAdvertiserUser: User = {
  id: 'advertiser-pizzaria-123',
  name: 'Roberto Silva',
  email: 'contato@pizzariadivina.com',
  isAdvertiser: true,
  businessName: 'Pizzaria Divina',
  businessAddress: 'Av. Djalma Batista, 500, Manaus',
  businessLogoUrl: 'https://placehold.co/100x100.png?text=PD',
  businessLogoHint: 'pizza restaurant',
  advertiserStatus: 'active',
  advertiserPlan: 'pro',
  points: 0, // Advertisers don't usually have points
  level: '',
  currentXp: 0,
  xpToNextLevel: 0,
  joinDate: new Timestamp(1675209600, 0), // Feb 1, 2023
};

export const mockOffers: Offer[] = [
    {
      id: 'offer-pizza-1',
      title: '🍕 Pizza Gigante 50% OFF + Refri Grátis!',
      description: 'Aproveite nossa pizza gigante de qualquer sabor com 50% de desconto e leve um refrigerante de 2L na faixa. Perfeito para a galera!',
      merchantName: 'Pizzaria Divina',
      merchantId: 'advertiser-pizzaria-123',
      merchantIsVerified: true,
      imageUrl: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'gourmet pizza',
      galleryImages: ['https://placehold.co/800x450.png', 'https://placehold.co/800x450.png'],
      galleryImageHints: ['pizza slice', 'restaurant interior'],
      offerType: 'combo',
      category: 'Alimentação',
      originalPrice: 70.00,
      discountedPrice: 35.00,
      tags: ['#pizza', '#promocao', '#combo'],
      validityStartDate: new Date(),
      validityEndDate: new Date(new Date().setDate(new Date().getDate() + 15)),
      status: 'active',
      visibility: 'destaque',
      latitude: -3.0901,
      longitude: -60.0182,
      rating: 4.8,
      reviews: 125,
      usersUsedCount: 310,
      pointsAwarded: 15,
      createdBy: 'advertiser-pizzaria-123',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      id: 'offer-barber-2',
      title: '💇‍♂️ Corte + Barba por Preço Especial',
      description: 'Dê um tapa no visual! Corte de cabelo moderno e barba modelada com nossos melhores profissionais. Agende seu horário!',
      merchantName: 'Barbearia Navalha',
      merchantId: 'advertiser-barber-456',
      merchantIsVerified: true,
      imageUrl: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'barber shop',
      offerType: 'padrao',
      category: 'Serviços',
      originalPrice: 70.00,
      discountedPrice: 45.00,
      tags: ['#barbearia', '#visual', '#corte'],
      validityStartDate: new Date(),
      validityEndDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'active',
      visibility: 'normal',
      latitude: -3.1019,
      longitude: -60.025,
      rating: 4.9,
      reviews: 98,
      usersUsedCount: 150,
      pointsAwarded: 10,
      createdBy: 'advertiser-barber-456',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      id: 'offer-acai-3',
      title: '⚡ Açaí 500ml em Dobro!',
      description: 'Compre um açaí de 500ml turbinado com seus acompanhamentos favoritos e ganhe outro totalmente grátis. Oferta relâmpago, válida somente hoje!',
      merchantName: 'Point do Açaí',
      merchantId: 'advertiser-acai-789',
      merchantIsVerified: false,
      imageUrl: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'acai bowl',
      offerType: 'relampago',
      category: 'Alimentação',
      originalPrice: 20.00,
      discountedPrice: 10.00, // Effective price per unit
      tags: ['#acai', '#relampago', '#dobro'],
      validityStartDate: new Date(),
      validityEndDate: new Date(),
      status: 'active',
      visibility: 'destaque',
      latitude: -3.0955,
      longitude: -60.0221,
      rating: 4.7,
      reviews: 210,
      usersUsedCount: 450,
      pointsAwarded: 5,
      createdBy: 'advertiser-acai-789',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      id: 'offer-sushi-4',
      title: '🍣 Festival de Sushi Exclusivo no App',
      description: 'Apresente o QR Code no app e participe do nosso festival de sushi com preço fixo. Rodízio completo com peças especiais!',
      merchantName: 'Sushi House',
      merchantId: 'advertiser-sushi-101',
      merchantIsVerified: true,
      imageUrl: 'https://placehold.co/600x400.png',
      'data-ai-hint': 'sushi platter',
      offerType: 'exclusiva_app',
      category: 'Alimentação',
      originalPrice: 120.00,
      discountedPrice: 89.90,
      tags: ['#sushi', '#rodizio', '#japa'],
      validityStartDate: new Date(),
      validityEndDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      status: 'active',
      visibility: 'normal',
      latitude: -3.119,
      longitude: -60.0211,
      rating: 4.8,
      reviews: 150,
      usersUsedCount: 200,
      pointsAwarded: 20,
      createdBy: 'advertiser-sushi-101',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
];

export const mockUserList: User[] = [
    { ...mockUser, id: 'user-mock-1', name: 'Ana Clara Explorer', email: 'anaclara@exemplo.com', avatarUrl: 'https://placehold.co/100x100.png?text=AE', points: 2500, level: 'Ouro', status: 'active', joinDate: new Timestamp(1672531200, 0)},
    { ...mockUser, id: 'user-mock-2', name: 'Daniela Silva', email: 'daniela.s@test.dev', avatarUrl: 'https://placehold.co/100x100.png?text=DS', points: 800, level: 'Prata', status: 'active', joinDate: new Timestamp(1675209600, 0)},
    { ...mockUser, id: 'user-mock-3', name: 'Fernando Lima', email: 'fernando.lima@email.com', avatarUrl: 'https://placehold.co/100x100.png?text=FL', points: 150, level: 'Bronze', status: 'suspended', joinDate: new Timestamp(1677628800, 0)},
    { ...mockUser, id: 'user-mock-4', name: 'Gabriela Souza', email: 'gabriela.s@provider.com', avatarUrl: 'https://placehold.co/100x100.png?text=GS', points: 4500, level: 'Ouro', status: 'active', joinDate: new Timestamp(1680307200, 0) },
];

export const mockAdvertiserList: User[] = [
    { ...mockAdvertiserUser, id: 'adv-mock-1', businessName: 'Pizzaria Divina', responsibleName: 'Roberto Silva', advertiserStatus: 'active', advertiserPlan: 'pro', joinDate: new Timestamp(1672531200, 0) },
    { ...mockAdvertiserUser, id: 'adv-mock-2', businessName: 'Barbearia Navalha', responsibleName: 'Marcos Andrade', advertiserStatus: 'pending_verification', advertiserPlan: 'trial', joinDate: new Timestamp(1675209600, 0) },
    { ...mockAdvertiserUser, id: 'adv-mock-3', businessName: 'Sushi House', responsibleName: 'Juliana Tanaka', advertiserStatus: 'active', advertiserPlan: 'premium', joinDate: new Timestamp(1677628800, 0) },
    { ...mockAdvertiserUser, id: 'adv-mock-4', businessName: 'Point do Açaí', responsibleName: 'Lucas Ferreira', advertiserStatus: 'suspended', advertiserPlan: 'basic', joinDate: new Timestamp(1680307200, 0) },
];

export const mockAdminMetrics: AdminMetricItem[] = [
    { title: "Usuários Ativos (Mês)", value: "1,254", icon: Users, change: "+12.5%", bgColorClass: 'bg-blue-500/10' },
    { title: "Novos Anunciantes", value: "28", icon: Building2, change: "+5", bgColorClass: 'bg-green-500/10' },
    { title: "Ofertas Criadas (Hoje)", value: "72", icon: Package, change: "-3.2%", bgColorClass: 'bg-orange-500/10' },
    { title: "Check-ins (Hoje)", value: "1,489", icon: CheckCircle, change: "+21%", bgColorClass: 'bg-teal-500/10' },
    { title: "Receita (Mês)", value: "R$ 4,520", icon: DollarSign, change: "+8%", bgColorClass: 'bg-indigo-500/10' },
    { title: "Tickets de Suporte", value: "12", icon: HelpCircle, change: "2 Abertos", bgColorClass: 'bg-red-500/10' },
];
    
