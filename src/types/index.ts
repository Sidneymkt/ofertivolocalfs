
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
  // checkInHistory?: CheckIn[]; 
  // sharedOffersHistory?: SharedOffer[];
  // sweepstakeParticipations?: SweepstakeParticipation[];
  // commentsMade?: Comment[]; 

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
    
    
    
    
