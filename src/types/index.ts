
import type React from 'react';
import {
  Activity, AlertTriangle, Award, BadgeCheck, BarChart3, BookOpen, Building, Building2, CalendarCheck2, CheckCircle, CheckCheck, Coins, CreditCard, DollarSign, Eye, FileText, Filter, Gift, HandCoins, HeartPulse, HelpCircle, Home, Image as ImageIconLucide, ListChecks, LocateFixed, MailQuestion, MapPin, MapPinned, Megaphone, MessageSquare, MousePointerClick, Package, PackageCheck, QrCode, Settings2, ShieldAlert, ShieldCheck, ShoppingCart, Smile, Smartphone, Sparkles, Star, ThumbsUp, Ticket, TrendingDown, TrendingUp, UserCheck, UserCog, UserPlus, Users, Utensils, Wrench, Zap
} from 'lucide-react';


export interface Badge {
  id: string;
  name: string;
  icon: 'Star' | 'Users' | 'Award' | 'MessageSquare' | 'Zap'; // Use string identifiers
  description: string;
  unlockedDate?: Date;
  'data-ai-hint'?: string;
}

export interface Category {
  name: string;
  icon: 'Utensils' | 'Wrench' | 'ShoppingCart' | 'Smile' | 'HeartPulse' | 'BookOpen' | string; // string for flexibility
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  userAvatarHint?: string;
  rating: number;
  text: string;
  timestamp: Date;
  offerId?: string;
  offerTitle?: string;
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
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  merchantName: string;
  merchantId: string;
  merchantIsVerified?: boolean;
  imageUrl: string;
  'data-ai-hint'?: string;
  galleryImages?: string[];
  galleryImageHints?: string[];

  offerType: OfferTypeId;
  category: string;

  originalPrice?: number;
  discountType?: "percentage" | "finalValue";
  discountPercentage?: number;
  discountedPrice: number;

  tags?: string[];
  validityStartDate: Date;
  validityEndDate: Date;
  timeRemaining?: string; // Calculated or static string for display

  quantity?: number;
  isUnlimited?: boolean;
  usersUsedCount?: number;

  terms?: string;
  visibility: "normal" | "destaque" | "sorteio";
  status: 'active' | 'pending' | 'expired' | 'draft' | 'awaiting_approval' | 'rejected';

  // Specific fields based on offerType
  timeLimit?: string; // HH:mm for Relâmpago
  isPresentialOnly?: boolean; // For Exclusiva App / Cupom QR - implies QR validation
  isForNewUsersOnly?: boolean; // For Primeiro Uso
  minCheckins?: number; // For Checkin Premiado
  checkinReward?: string; // For Checkin Premiado
  comboItem1?: string; // For Combo
  comboItem2?: string;
  comboItem3?: string;
  targetNeighborhood?: string; // For Bairro

  // Gamification
  pointsAwarded?: number;
  pointsForCheckin?: number;
  pointsForShare?: number;
  pointsForRating?: number;
  isRedeemableWithPoints?: boolean;

  // Location & Rating (optional on creation, might be auto-populated or admin-set)
  latitude?: number;
  longitude?: number;
  distance?: string; // Calculated for display
  rating?: number;
  reviews?: number;

  // Meta
  createdBy: string; // advertiserId (should match merchantId for advertiser-created offers)
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
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
  platform: string;
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
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarHint?: string;
  coverPhotoUrl?: string;
  coverPhotoHint?: string;
  points: number;
  level: string;
  currentXp: number;
  xpToNextLevel: number;
  badges?: Badge[];
  favoriteOffers?: string[];
  followedMerchants?: string[];
  checkInHistory?: CheckIn[];
  sharedOffersHistory?: SharedOffer[];
  sweepstakeParticipations?: SweepstakeParticipation[];
  commentsMade?: Comment[];
  joinDate?: Date; // Added for user lists
  status?: UserStatus; // Added for user lists

  isAdvertiser?: boolean;
  advertiserProfileId?: string; // ID of the advertiser's specific profile/business entity
  businessName?: string;
  businessLogoUrl?: string;
  businessLogoHint?: string;
  businessCoverPhotoUrl?: string;
  businessCoverPhotoHint?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessCity?: string;
  businessWhatsapp?: string;
  advertiserStatus?: UserStatus; // For advertiser account status
  advertiserPlan?: AdvertiserPlan; // For advertiser plan

  // Personal details (might be distinct from business details if user is also an advertiser)
  address?: string;
  city?: string;
  whatsapp?: string;
  isProfileComplete?: boolean;
  responsibleName?: string; // For advertiser context
}

export interface SweepstakeParticipant {
  id: string; // User ID
  name: string;
  avatarUrl?: string;
  avatarHint?: string;
  entryDate: Date;
}

export interface SweepstakeWinner {
  userId: string;
  userName: string;
  avatarUrl?: string;
  avatarHint?: string;
}

export interface Sweepstake {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  'data-ai-hint'?: string;
  prizeDetails: string;
  pointsToEnter: number;
  startDate: Date;
  endDate: Date;
  numberOfWinners: number;
  maxParticipants?: number;
  rules?: string;
  createdBy: string; // advertiserId
  status: 'upcoming' | 'active' | 'ended' | 'drawing_complete' | 'cancelled';
  
  // Gerenciamento
  isDrawn?: boolean;
  drawDate?: Date;
  winners?: SweepstakeWinner[];
  participants?: SweepstakeParticipant[];
}


export type AdvertiserMetricItem = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  description?: string;
};

// Summary for advertiser's list of their own offers
export type PublishedOfferSummary = Pick<
  Offer,
  'id' | 'title' | 'status' | 'imageUrl' | 'data-ai-hint' | 'visibility' | 'discountedPrice' | 'originalPrice' | 'usersUsedCount' | 'category'
> & {
  views?: number; // Example, would come from analytics
  clicks?: number; // Example
  isFeatured?: boolean; // Derived from visibility === 'destaque'
};


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


export const mockBadges: Badge[] = [
    { id: 'badge1', name: 'Explorador Inicial', icon: 'Star', description: `Fez seu primeiro check-in! +${POINTS_CHECKIN} XP`, unlockedDate: new Date(), 'data-ai-hint': 'star badge' },
    { id: 'badge2', name: 'Amigo das Ofertas', icon: 'Users', description: 'Compartilhou 5 ofertas! +15 XP', 'data-ai-hint': 'people group' },
    { id: 'badge3', name: 'Super Points', icon: 'Award', description: 'Acumulou 1000 pontos!', 'data-ai-hint': 'trophy award' },
    { id: 'badge4', name: 'Comentarista Ativo', icon: 'MessageSquare', description: 'Fez 10 comentários! +10 XP', 'data-ai-hint': 'speech bubble' },
    { id: 'badge5', name: 'Caçador de Ofertas Pro', icon: 'Zap', description: 'Realizou 10 check-ins! +50 XP', 'data-ai-hint': 'lightning zap' },
];

const now = new Date();
const oneDay = 86400000; // milliseconds in a day
const oneHour = 3600000; // milliseconds in an hour

export const mockUser: User = {
  id: 'user123',
  name: 'Ana Clara Explorer',
  email: 'anaclara@exemplo.com',
  avatarUrl: 'https://placehold.co/100x100.png?text=AE',
  avatarHint: 'person woman',
  coverPhotoUrl: 'https://placehold.co/1200x300.png?text=Capa+Perfil',
  coverPhotoHint: 'profile cover abstract',
  points: 1250,
  level: USER_LEVELS.PRATA.name,
  currentXp: 650,
  xpToNextLevel: USER_LEVELS.PRATA.nextLevelXp,
  badges: mockBadges.slice(0,3),
  favoriteOffers: ['offer-pizza-1', 'offer-sports-3'],
  followedMerchants: ['pizzariaSaborosaMerchant', 'atletaShopMerchant', 'botecoMestreMerchant'],
  checkInHistory: [
    { id: 'chk1', offerId: 'offer-barber-2', offerTitle: 'Corte Masculino + Barba Modelada', merchantName: 'Barbearia Premium', timestamp: new Date(now.getTime() - oneDay * 2), pointsEarned: POINTS_CHECKIN },
    { id: 'chk2', offerId: 'offer-bar-4', offerTitle: 'Happy Hour Dose Dupla Chopp', merchantName: 'Boteco do Mestre', timestamp: new Date(now.getTime() - oneDay * 5), pointsEarned: POINTS_CHECKIN },
    { id: 'chk3', offerId: 'offer-pizza-1', offerTitle: '50% Off Pizza Gigante', merchantName: 'Pizzaria Saborosa', timestamp: new Date(now.getTime() - oneDay * 10), pointsEarned: POINTS_CHECKIN },
  ],
  sharedOffersHistory: [
      { id: 'share1', offerId: 'offer-pizza-1', offerTitle: '50% Off Pizza Gigante', platform: 'WhatsApp', timestamp: new Date(now.getTime() - oneDay * 1), pointsEarned: POINTS_SHARE_OFFER },
      { id: 'share2', offerId: 'offer-sports-3', offerTitle: 'Tênis Corrida ProBoost X', platform: 'Instagram', timestamp: new Date(now.getTime() - oneDay * 4), pointsEarned: POINTS_SHARE_OFFER },
  ],
  sweepstakeParticipations: [
      { id: 'swpUser1', sweepstakeId: 'sw1', sweepstakeTitle: 'Ganhe um Jantar Romântico', timestamp: new Date(now.getTime() - oneDay * 3), pointsSpent: 100 },
      { id: 'swpUser2', sweepstakeId: 'sw2', sweepstakeTitle: 'Vale Compras de R$200', timestamp: new Date(now.getTime() - oneDay * 8), pointsSpent: 50 },
  ],
  commentsMade: [
      { id: 'cmtUser1', userId: 'user123', userName: 'Ana Clara Explorer', userAvatarUrl: 'https://placehold.co/40x40.png?text=AE', rating: 5, text: 'Adorei a pizza, super recomendo! Massa fininha e crocante.', timestamp: new Date(now.getTime() - oneDay), offerId: 'offer-pizza-1', offerTitle: '50% Off Pizza Gigante + Refri Grátis', pointsEarned: POINTS_RATE_OFFER_OR_MERCHANT },
      { id: 'cmtUser2', userId: 'user123', userName: 'Ana Clara Explorer', userAvatarUrl: 'https://placehold.co/40x40.png?text=AE', rating: 4, text: 'O corte ficou bom, mas o ambiente poderia ser mais silencioso.', timestamp: new Date(now.getTime() - oneDay * 3), offerId: 'offer-barber-2', offerTitle: 'Corte Masculino + Barba Modelada', pointsEarned: POINTS_RATE_OFFER_OR_MERCHANT },
  ],
  isAdvertiser: false,
  address: 'Rua das Palmeiras, 123, Bairro Flores',
  city: 'Manaus, AM',
  whatsapp: '(92) 99999-8888',
  isProfileComplete: true,
  joinDate: new Date(now.getTime() - oneDay * 90),
  status: 'active',
};

export const mockAdvertiserUser: User = {
  id: 'advUserPizzariaSaborosa',
  responsibleName: 'Carlos Pizzaiolo', // Personal name of the advertiser
  name: 'Carlos Pizzaiolo', // Fallback for user context
  email: 'carlos.pizza@saborosa.com', // Business contact email
  avatarUrl: 'https://placehold.co/100x100.png?text=CP', // Personal avatar
  avatarHint: 'person chef',
  coverPhotoUrl: 'https://placehold.co/1200x300.png?text=Capa+Negocio',
  coverPhotoHint: 'business cover abstract',
  
  isAdvertiser: true,
  advertiserProfileId: 'pizzariaSaborosaMerchant',
  businessName: 'Pizzaria Saborosa',
  businessLogoUrl: 'https://placehold.co/150x150.png?text=PS',
  businessLogoHint: 'pizza logo',
  businessCoverPhotoUrl: 'https://placehold.co/1200x400.png?text=Pizzaria+Capa',
  businessCoverPhotoHint: 'pizzeria banner',
  businessDescription: 'A melhor pizza da cidade, com ingredientes frescos e forno a lenha! Venha conferir nossas promoções.',
  businessAddress: 'Avenida Principal, 789, Centro, Manaus-AM',
  businessCity: 'Manaus, AM',
  businessWhatsapp: '(92) 98877-6655',
  
  points: 50, // Example points for the advertiser as a user
  level: USER_LEVELS.INICIANTE.name,
  currentXp: 10,
  xpToNextLevel: USER_LEVELS.INICIANTE.nextLevelXp,
  
  isProfileComplete: true, // Referring to business profile completion
  joinDate: new Date(now.getTime() - oneDay * 180),
  advertiserStatus: 'active',
  advertiserPlan: 'pro',
};


export const mockOffers: Offer[] = [
  {
    id: 'offer-pizza-1',
    offerType: 'relampago',
    title: '🍕 50% Off Pizza Gigante + Refri Grátis HOJE!',
    description: 'Deliciosa pizza gigante com 50% de desconto e refrigerante de 2L grátis! Sabores selecionados. Apenas hoje!',
    fullDescription: 'Aproveite nossa oferta relâmpago: pizza gigante (12 fatias, até 3 sabores selecionáveis) com 50% de desconto e leve um refrigerante de 2 litros totalmente grátis! Nossa massa é artesanal, com fermentação natural, e usamos apenas ingredientes frescos e de alta qualidade. Perfeito para compartilhar com a família e amigos. Válido para consumo no local, retirada ou delivery (taxa de entrega não inclusa). Promoção não acumulativa com outras ofertas. Corra, é só hoje!',
    merchantName: 'Pizzaria Saborosa',
    merchantId: 'pizzariaSaborosaMerchant',
    createdBy: 'pizzariaSaborosaMerchant',
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png?text=Pizza+Oferta',
    'data-ai-hint': 'pizza restaurant',
    galleryImages: [
      'https://placehold.co/800x450.png?text=Pizza+1',
      'https://placehold.co/800x450.png?text=Pizza+2',
      'https://placehold.co/800x450.png?text=Interior+Restaurante',
      'https://placehold.co/800x450.png?text=Clientes+Felizes',
    ],
    galleryImageHints: ['pizza variety', 'pizza slice', 'restaurant interior', 'happy customers'],
    originalPrice: 70.00,
    discountType: "finalValue",
    discountedPrice: 35.00,
    discountPercentage: 50,
    distance: '500m',
    category: 'Alimentação',
    rating: 4.8,
    reviews: 210,
    timeRemaining: 'Encerra Hoje!',
    timeLimit: '23:00',
    tags: ['#Relâmpago', '#PizzaLovers', '#Promoção', '#Comida'],
    latitude: -3.0912,
    longitude: -59.9734,
    validityStartDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
    validityEndDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
    usersUsedCount: 138,
    pointsAwarded: POINTS_CHECKIN + 2 + POINTS_SHARE_OFFER + POINTS_RATE_OFFER_OR_MERCHANT,
    pointsForCheckin: POINTS_CHECKIN + 2,
    pointsForShare: POINTS_SHARE_OFFER,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    comments: [
      { id: 'c1', userId: 'userX', userName: 'João Silva', userAvatarUrl: 'https://placehold.co/40x40.png?text=JS', userAvatarHint: 'person avatar', rating: 5, text: 'Pizza maravilhosa, atendimento top!', timestamp: new Date(now.getTime() - 3600000 * 5), pointsEarned: POINTS_RATE_OFFER_OR_MERCHANT },
      { id: 'c2', userId: 'userY', userName: 'Maria Oliveira', userAvatarUrl: 'https://placehold.co/40x40.png?text=MO', userAvatarHint: 'woman avatar', rating: 4, text: 'Gostei muito, ótimo custo-benefício.', timestamp: new Date(now.getTime() - 3600000 * 24), pointsEarned: POINTS_RATE_OFFER_OR_MERCHANT },
    ],
    status: 'active',
    visibility: 'destaque',
    createdAt: new Date(now.getTime() - oneDay * 5),
    updatedAt: new Date(now.getTime() - oneDay * 1),
    isPresentialOnly: false,
    isUnlimited: false,
    quantity: 50,
    terms: 'Válido apenas para sabores selecionados. Taxa de entrega não inclusa. Não cumulativo.'
  },
  {
    id: 'offer-barber-2',
    offerType: 'padrao',
    title: '💇‍♂️ Corte Masculino + Barba Modelada',
    description: 'Renove seu visual com corte de cabelo moderno e barba modelada por nossos especialistas.',
    fullDescription: 'Dê um trato completo no visual na Barbearia Premium. Nossos barbeiros são especialistas em cortes modernos e tradicionais, além de modelagem de barba com toalha quente e produtos de alta qualidade. Ambiente climatizado, som ambiente e um café expresso cortesia para você relaxar enquanto cuidamos do seu estilo.',
    merchantName: 'Barbearia Premium',
    merchantId: 'barbeariaPremiumMerchant',
    createdBy: 'barbeariaPremiumMerchant',
    merchantIsVerified: false,
    imageUrl: 'https://placehold.co/600x300.png?text=Barbearia',
    'data-ai-hint': 'barber shop',
    galleryImages: ['https://placehold.co/800x450.png?text=Corte+Estilo', 'https://placehold.co/800x450.png?text=Barbeiro+Trabalhando'],
    galleryImageHints: ['haircut style', 'barber working'],
    originalPrice: 70.00,
    discountedPrice: 45.00,
    discountType: 'finalValue',
    discountPercentage: Math.round(((70-45)/70)*100),
    distance: '1.2km',
    category: 'Serviços',
    rating: 4.9,
    reviews: 95,
    timeRemaining: 'Encerra em 2 dias',
    tags: ['#Barbearia', '#EstiloMasculino', '#Beleza'],
    latitude: -3.1022,
    longitude: -59.9810,
    validityStartDate: new Date(now.getTime() - oneDay * 2),
    validityEndDate: new Date(now.getTime() + oneDay * 2),
    usersUsedCount: 72,
    pointsAwarded: POINTS_CHECKIN,
    pointsForCheckin: POINTS_CHECKIN,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneDay * 10),
    updatedAt: new Date(now.getTime() - oneDay * 2),
    isPresentialOnly: true,
    terms: 'Agendamento recomendado. Tolerância de 10 minutos de atraso.'
  },
  {
    id: 'offer-sports-3',
    offerType: 'cupom_qr',
    title: '👟 Tênis Corrida ProBoost X - Cupom Exclusivo!',
    description: 'Performance e conforto com o ProBoost X. Cupom QR para desconto especial na loja!',
    fullDescription: 'Supere seus limites com o Tênis Corrida ProBoost X. Desenvolvido para corredores exigentes, oferece máximo amortecimento, responsividade e estabilidade. Cabedal em mesh respirável, solado de alta durabilidade e design moderno. Ideal para treinos diários e provas. Apresente o QR Code no caixa para validar seu desconto exclusivo.',
    merchantName: 'Atleta Shop',
    merchantId: 'atletaShopMerchant',
    createdBy: 'atletaShopMerchant',
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png?text=Tenis+Esportivo',
    'data-ai-hint': 'sport shoes',
    galleryImages: ['https://placehold.co/800x450.png?text=Tenis+Detalhe', 'https://placehold.co/800x450.png?text=Sola+Tenis', 'https://placehold.co/800x450.png?text=Pessoa+Correndo'],
    galleryImageHints: ['running shoe', 'shoe sole detail', 'person running'],
    originalPrice: 450.00,
    discountedPrice: 299.90,
    discountType: 'finalValue',
    discountPercentage: Math.round(((450-299.90)/450)*100),
    distance: '2.5km',
    category: 'Compras',
    rating: 4.5,
    reviews: 230,
    timeRemaining: 'Válido por 1 semana',
    tags: ['#Esporte', '#Corrida', '#CupomQR', '#Desconto'],
    latitude: -3.0850,
    longitude: -60.0170,
    validityStartDate: new Date(now.getTime() - oneDay * 1),
    validityEndDate: new Date(now.getTime() + oneDay * 7),
    usersUsedCount: 95,
    pointsAwarded: POINTS_CHECKIN,
    pointsForCheckin: POINTS_CHECKIN,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    isPresentialOnly: true,
    status: 'active',
    visibility: 'destaque',
    createdAt: new Date(now.getTime() - oneDay * 15),
    updatedAt: new Date(now.getTime() - oneDay * 1),
    terms: 'Válido para modelos selecionados. Apresentar QR Code no caixa.'
  },
  {
    id: 'offer-bar-4',
    offerType: 'combo',
    title: '🍻 Combo Happy Hour: 2 Chopps + Porção',
    description: 'Relaxe após o trabalho: 2 chopps artesanais (300ml) + porção de batata frita especial.',
    fullDescription: 'O Happy Hour perfeito te espera! Desfrute de 2 canecas de chopp artesanal (Pilsen ou IPA, 300ml cada) acompanhadas de uma generosa porção de batatas fritas crocantes com nosso molho especial da casa. Ideal para compartilhar e botar o papo em dia.',
    merchantName: 'Boteco do Mestre',
    merchantId: 'botecoMestreMerchant',
    createdBy: 'botecoMestreMerchant',
    merchantIsVerified: false,
    imageUrl: 'https://placehold.co/600x300.png?text=Happy+Hour',
    'data-ai-hint': 'beer bar food',
    galleryImages: ['https://placehold.co/800x450.png?text=Chopp+Duplo', 'https://placehold.co/800x450.png?text=Porcao+Batata'],
    galleryImageHints: ['draft beer glass', 'fries portion'],
    originalPrice: 55.00, // Estimativa do valor original dos itens separados
    discountedPrice: 39.90,
    discountType: 'finalValue',
    discountPercentage: Math.round(((55-39.90)/55)*100),
    comboItem1: "2 Chopps Artesanais (300ml cada)",
    comboItem2: "1 Porção de Batata Frita Especial",
    distance: '800m',
    category: 'Alimentação',
    rating: 4.3,
    reviews: 78,
    timeRemaining: 'Válido todos os dias 17h-20h',
    tags: ['#Bar', '#HappyHour', '#Combo', '#Petiscos'],
    latitude: -3.1105,
    longitude: -60.0056,
    validityStartDate: new Date(now.getFullYear(), now.getMonth(), 1),
    validityEndDate: new Date(now.getFullYear(), now.getMonth() + 1, 0), // Fim do mês corrente
    usersUsedCount: 150,
    pointsAwarded: POINTS_CHECKIN,
    pointsForCheckin: POINTS_CHECKIN,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneDay * 20),
    updatedAt: new Date(now.getTime() - oneDay * 3),
    terms: 'Válido de segunda a sexta, das 17h às 20h, exceto feriados. Consumo no local.'
  },
  {
    id: 'offer-checkin-5',
    offerType: 'checkin_premiado',
    title: '🌟 Check-in Premiado: Ganhe Sobremesa!',
    description: 'Faça 3 check-ins em nosso café e ganhe uma sobremesa especial na sua próxima visita.',
    fullDescription: 'Participe do nosso programa de fidelidade Check-in Premiado! Ao realizar 3 check-ins (em qualquer oferta ou visita normal) em nosso estabelecimento, você ganha um voucher para uma deliciosa sobremesa do dia na sua quarta visita. Acumule check-ins e saboreie!',
    merchantName: 'Café Aconchego',
    merchantId: 'cafeAconchegoMerchant',
    createdBy: 'cafeAconchegoMerchant',
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png?text=Cafe+Aconchego',
    'data-ai-hint': 'coffee shop dessert',
    category: 'Alimentação',
    discountedPrice: 0, // A "oferta" é a recompensa
    originalPrice: 20, // Valor estimado da recompensa
    minCheckins: 3,
    checkinReward: 'Uma Sobremesa Especial (do dia)',
    validityStartDate: new Date(now.getFullYear(), 0, 1), // Início do ano
    validityEndDate: new Date(now.getFullYear(), 11, 31), // Fim do ano
    tags: ['#Fidelidade', '#CheckinPremiado', '#SobremesaGratis'],
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneDay * 30),
    updatedAt: new Date(now.getTime() - oneDay * 5),
    pointsAwarded: 0, // Pontos são ganhos nos check-ins normais
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    distance: '1.5km',
    latitude: -3.0987,
    longitude: -60.0012,
    terms: 'Válido após 3 check-ins registrados no app. Recompensa sujeita à disponibilidade do dia.'
  },
  {
    id: 'offer-icecream-6',
    offerType: 'padrao',
    title: '🍦 Casquinha Dobrada esta Semana!',
    description: 'Peça uma casquinha e leve outra do mesmo sabor por nossa conta. Válido de Seg a Qui.',
    merchantName: 'Sorveteria Gostoso',
    merchantId: 'sorveteriaGostosoMerchant',
    createdBy: 'sorveteriaGostosoMerchant',
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png?text=Sorvete+Casquinha',
    'data-ai-hint': 'ice cream cone',
    originalPrice: 10.00,
    discountedPrice: 5.00, // Effective price per cone
    discountType: 'finalValue',
    discountPercentage: 50,
    category: 'Alimentação',
    tags: ['#Sorvete', '#Promo', '#Casquinha'],
    validityStartDate: new Date(now.getTime() - oneDay * (now.getDay() === 0 ? 6 : now.getDay() - 1)), // Start of current week (Mon)
    validityEndDate: new Date(now.getTime() - oneDay * (now.getDay() === 0 ? 6 : now.getDay() - 1) + oneDay * 3 + (23*oneHour)), // End of current week (Thu 23:00)
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneHour * 10), // Created recently
    updatedAt: new Date(now.getTime() - oneHour * 1),
    pointsAwarded: POINTS_CHECKIN,
    pointsForCheckin: POINTS_CHECKIN,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    terms: 'Válido para casquinhas simples. Sabores tradicionais. De Segunda a Quinta.',
    isPresentialOnly: true,
  },
  {
    id: 'offer-books-7',
    offerType: 'exclusiva_app',
    title: '📚 20% OFF em Livros de Ficção (App)',
    description: 'Use o app e ganhe 20% de desconto em qualquer livro de ficção. Exclusivo Ofertivo!',
    merchantName: 'Livraria Saber',
    merchantId: 'livrariaSaberMerchant',
    createdBy: 'livrariaSaberMerchant',
    merchantIsVerified: false,
    imageUrl: 'https://placehold.co/600x300.png?text=Livros+Oferta',
    'data-ai-hint': 'books fiction',
    discountedPrice: 0, // Price varies
    discountPercentage: 20,
    discountType: 'percentage',
    category: 'Educação',
    tags: ['#Leitura', '#Livros', '#DescontoExclusivo'],
    validityStartDate: new Date(now.getTime() - oneDay * 3),
    validityEndDate: new Date(now.getTime() + oneDay * 10),
    status: 'active',
    visibility: 'destaque',
    createdAt: new Date(now.getTime() - oneHour * 8), // Created recently
    updatedAt: new Date(now.getTime() - oneHour * 2),
    pointsAwarded: POINTS_CHECKIN + POINTS_RATE_OFFER_OR_MERCHANT,
    pointsForCheckin: POINTS_CHECKIN,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    terms: 'Desconto aplicado no caixa ao apresentar o QR Code da oferta no app. Não cumulativo.',
    isPresentialOnly: true,
  },
  {
    id: 'offer-pet-8',
    offerType: 'primeiro_uso',
    title: '🐾 Banho e Tosa com 15% OFF (1ª Vez)',
    description: 'Primeira visita do seu pet? Ganhe 15% de desconto no pacote completo de banho e tosa!',
    merchantName: 'PetShop Amigo Fiel',
    merchantId: 'petShopAmigoFielMerchant',
    createdBy: 'petShopAmigoFielMerchant',
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png?text=Pet+Shop',
    'data-ai-hint': 'dog grooming',
    originalPrice: 80.00,
    discountedPrice: 68.00,
    discountType: 'finalValue',
    discountPercentage: 15,
    isForNewUsersOnly: true,
    category: 'Serviços',
    tags: ['#PetShop', '#BanhoETosa', '#PrimeiraVez'],
    validityStartDate: new Date(now.getFullYear(), now.getMonth(), 1),
    validityEndDate: new Date(now.getFullYear(), now.getMonth() + 2, 0), // Valid for current and next month
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneHour * 6), // Created recently
    updatedAt: new Date(now.getTime() - oneHour * 3),
    pointsAwarded: POINTS_CHECKIN,
    pointsForCheckin: POINTS_CHECKIN,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    terms: 'Válido apenas para o primeiro serviço de banho e tosa do pet no estabelecimento. Agendamento necessário.',
    isPresentialOnly: true,
  },
  {
    id: 'offer-flowers-9',
    offerType: 'bairro',
    title: '💐 Buquê do Dia com Entrega Grátis (Bairro Flores)',
    description: 'Lindo buquê de flores da estação com entrega gratuita para o bairro Flores.',
    merchantName: 'Floricultura Bela Flor',
    merchantId: 'floriculturaBelaFlorMerchant',
    createdBy: 'floriculturaBelaFlorMerchant',
    merchantIsVerified: false,
    imageUrl: 'https://placehold.co/600x300.png?text=Flores+Buque',
    'data-ai-hint': 'flower bouquet',
    discountedPrice: 75.00, // Price includes free delivery
    targetNeighborhood: 'Flores',
    category: 'Compras',
    tags: ['#Flores', '#Presente', '#EntregaGratis', '#BairroFlores'],
    validityStartDate: new Date(now.getTime() - oneDay),
    validityEndDate: new Date(now.getTime() + oneDay * 5),
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneHour * 4), // Created recently
    updatedAt: new Date(now.getTime() - oneHour * 1),
    pointsAwarded: POINTS_CHECKIN + 1,
    pointsForCheckin: POINTS_CHECKIN + 1,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    terms: 'Entrega gratuita válida apenas para endereços no bairro Flores. Consulte flores da estação.',
  },
  {
    id: 'offer-cinema-10',
    offerType: 'padrao',
    title: '🎬 Ingresso Meia para Todos nas Terças!',
    description: 'Toda terça-feira, todos pagam meia entrada no Cinema Estrela! Aproveite.',
    merchantName: 'Cinema Estrela',
    merchantId: 'cinemaEstrelaMerchant',
    createdBy: 'cinemaEstrelaMerchant',
    merchantIsVerified: true,
    imageUrl: 'https://placehold.co/600x300.png?text=Cinema+Oferta',
    'data-ai-hint': 'cinema movie',
    originalPrice: 30.00,
    discountedPrice: 15.00,
    discountType: 'finalValue',
    discountPercentage: 50,
    category: 'Lazer',
    tags: ['#Cinema', '#MeiaEntrada', '#Filmes', '#TerçaFeira'],
    validityStartDate: new Date(now.getFullYear(), 0, 1),
    validityEndDate: new Date(now.getFullYear(), 11, 31), // Valid for the whole year
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneHour * 2), // Created very recently
    updatedAt: new Date(now.getTime()),
    pointsAwarded: POINTS_CHECKIN,
    pointsForCheckin: POINTS_CHECKIN,
    pointsForRating: POINTS_RATE_OFFER_OR_MERCHANT,
    terms: 'Válido todas as terças-feiras, exceto feriados e pré-estreias. Sujeito à lotação da sala.',
    isPresentialOnly: true,
  },
];


const mockParticipants: SweepstakeParticipant[] = [
  { id: 'user123', name: 'Ana Clara Explorer', avatarUrl: 'https://placehold.co/40x40.png?text=AE', avatarHint: 'woman avatar', entryDate: new Date(now.getTime() - oneDay * 2) },
  { id: 'user002', name: 'Bruno Costa', avatarUrl: 'https://placehold.co/40x40.png?text=BC', avatarHint: 'man avatar', entryDate: new Date(now.getTime() - oneDay * 1) },
  { id: 'user003', name: 'Carla Dias', avatarUrl: 'https://placehold.co/40x40.png?text=CD', avatarHint: 'woman smiling', entryDate: new Date(now.getTime() - oneHour * 5) },
  { id: 'userTop4', name: 'Fernanda Fidelidade', avatarUrl: 'https://placehold.co/40x40.png?text=FF', avatarHint: 'woman glasses', entryDate: new Date(now.getTime() - oneDay * 3) },
  { id: 'userTop5', name: 'Rafael Checkin', avatarUrl: 'https://placehold.co/40x40.png?text=RC', avatarHint: 'man happy', entryDate: new Date(now.getTime() - oneHour * 10) },
  { id: 'userX', name: 'João Silva', avatarUrl: 'https://placehold.co/40x40.png?text=JS', avatarHint: 'person avatar', entryDate: new Date(now.getTime() - oneDay * 1.5) },
  { id: 'userY', name: 'Maria Oliveira', avatarUrl: 'https://placehold.co/40x40.png?text=MO', avatarHint: 'woman avatar', entryDate: new Date(now.getTime() - oneHour * 3) },
];

export const mockSweepstakes: Sweepstake[] = [
  { 
    id: 'sw1', 
    title: 'Sorteio: Jantar Romântico Vale R$300', 
    description: 'Concorra a um jantar especial para duas pessoas no Restaurante Aconchego. Demonstre seu amor!', 
    imageUrl: 'https://placehold.co/600x300.png?text=Jantar', 
    'data-ai-hint': 'romantic dinner couple', 
    prizeDetails: 'Um voucher de R$300 para usar no Restaurante Aconchego.',
    pointsToEnter: 100, 
    startDate: new Date(now.getTime() - oneDay * 5), // Started 5 days ago
    endDate: new Date(now.getTime() + oneDay * 2), // Ends in 2 days
    numberOfWinners: 1,
    createdBy: 'advUserPizzariaSaborosa', // Example creator
    status: 'active',
    isDrawn: false,
    participants: mockParticipants.slice(0, 5).map(p => ({...p, entryDate: new Date(now.getTime() - (Math.random()*5*oneDay))})), // 5 random participants
    rules: 'O ganhador será notificado por email. Prêmio intransferível. Validade do voucher: 30 dias após o sorteio.'
  },
  { 
    id: 'sw2', 
    title: 'Vale Compras de R$200 Loja X', 
    description: 'Use seus pontos para concorrer a um vale compras de R$200 na Loja Estilo Total. Renove seu guarda-roupa!', 
    imageUrl: 'https://placehold.co/600x300.png?text=Vale+Compras', 
    'data-ai-hint': 'shopping giftcard fashion', 
    prizeDetails: 'Um vale compras de R$200 para a Loja Estilo Total.',
    pointsToEnter: 50, 
    startDate: new Date(now.getTime() - oneDay * 10), // Started 10 days ago
    endDate: new Date(now.getTime() + oneDay * 4), // Ends in 4 days
    numberOfWinners: 3,
    createdBy: 'advUserAtletaShop',
    status: 'active',
    isDrawn: false,
    participants: mockParticipants.slice(2, 7).map(p => ({...p, entryDate: new Date(now.getTime() - (Math.random()*10*oneDay))})), // 5 different random participants
  },
  { 
    id: 'sw3', 
    title: 'Sorteio Finalizado: Um Ano de Pizza Grátis', 
    description: 'Imagine: uma pizza grande por mês, por um ano inteiro! Este sorteio já foi encerrado.', 
    imageUrl: 'https://placehold.co/600x300.png?text=Pizza+Ano', 
    'data-ai-hint': 'pizza stack award', 
    prizeDetails: '12 Vouchers, cada um para uma pizza grande. Um por mês.',
    pointsToEnter: 200, 
    startDate: new Date(now.getTime() - oneDay * 60), // Started 60 days ago
    endDate: new Date(now.getTime() - oneDay * 30), // Ended 30 days ago
    numberOfWinners: 1,
    createdBy: 'advUserPizzariaSaborosa',
    status: 'drawing_complete',
    isDrawn: true,
    drawDate: new Date(now.getTime() - oneDay * 29),
    winners: [{ userId: mockParticipants[0].id, userName: mockParticipants[0].name, avatarUrl: mockParticipants[0].avatarUrl, avatarHint: mockParticipants[0].avatarHint }],
    participants: mockParticipants.map(p => ({...p, entryDate: new Date(now.getTime() - (Math.random()*50*oneDay) - (oneDay * 30) )})), // All participants, entries before end date
  },
  {
    id: 'sw4',
    title: 'Sorteio Próximo: Kit Gamer Completo',
    description: 'Prepare-se! Em breve um sorteio incrível de um Kit Gamer com teclado, mouse, headset e mousepad RGB.',
    imageUrl: 'https://placehold.co/600x300.png?text=Kit+Gamer',
    'data-ai-hint': 'gaming setup pc',
    prizeDetails: '1x Teclado Mecânico Gamer RGB, 1x Mouse Gamer 16000DPI, 1x Headset Gamer 7.1 Surround, 1x Mousepad Gamer Extra Grande',
    pointsToEnter: 150,
    startDate: new Date(now.getTime() + oneDay * 7), // Starts in 1 week
    endDate: new Date(now.getTime() + oneDay * 21), // Ends in 3 weeks
    numberOfWinners: 1,
    createdBy: 'advUserAtletaShop',
    status: 'upcoming',
    isDrawn: false,
  }
];

export const categories: Category[] = [
  { name: 'Alimentação', icon: 'Utensils' },
  { name: 'Serviços', icon: 'Wrench' },
  { name: 'Compras', icon: 'ShoppingCart' },
  { name: 'Lazer', icon: 'Smile' },
  { name: 'Saúde', icon: 'HeartPulse' },
  { name: 'Educação', icon: 'BookOpen' },
  { name: 'Outros', icon: 'Package' },
];


export const getMockOfferById = (id: string): Offer | undefined => {
  return mockOffers.find(offer => offer.id === id);
};

export const getMockSweepstakeById = (id: string): Sweepstake | undefined => {
  return mockSweepstakes.find(sweepstake => sweepstake.id === id);
}


export const getMockMerchantById = (id: string): { id: string, name: string, imageUrl?: string, 'data-ai-hint'?: string, isVerified?: boolean } | undefined => {
    const offerFromMerchant = mockOffers.find(offer => offer.merchantId === id);
    if (offerFromMerchant) {
        return {
            id: offerFromMerchant.merchantId,
            name: offerFromMerchant.merchantName,
            imageUrl: `https://placehold.co/64x64.png?text=${offerFromMerchant.merchantName.substring(0,1)}`,
            'data-ai-hint': 'store logo',
            isVerified: offerFromMerchant.merchantIsVerified
        };
    }

    // Fallback for specific known merchants not in current mockOffers for some reason
    if (id === 'pizzariaSaborosaMerchant') return {id, name: 'Pizzaria Saborosa', isVerified: true, 'data-ai-hint': 'pizza place', imageUrl: 'https://placehold.co/64x64.png?text=PS'};
    if (id === 'atletaShopMerchant') return {id, name: 'Atleta Shop', isVerified: true, 'data-ai-hint': 'sport store', imageUrl: 'https://placehold.co/64x64.png?text=AS'};
    if (id === 'botecoMestreMerchant') return {id, name: 'Boteco do Mestre', isVerified: false, 'data-ai-hint': 'bar restaurant', imageUrl: 'https://placehold.co/64x64.png?text=BM'};
    if (id === 'cafeAconchegoMerchant') return {id, name: 'Café Aconchego', isVerified: true, 'data-ai-hint': 'coffee shop', imageUrl: 'https://placehold.co/64x64.png?text=CA'};
    if (id === 'sorveteriaGostosoMerchant') return {id, name: 'Sorveteria Gostoso', isVerified: true, 'data-ai-hint': 'ice cream shop', imageUrl: 'https://placehold.co/64x64.png?text=SG'};
    if (id === 'livrariaSaberMerchant') return {id, name: 'Livraria Saber', isVerified: false, 'data-ai-hint': 'bookstore shop', imageUrl: 'https://placehold.co/64x64.png?text=LS'};
    if (id === 'petShopAmigoFielMerchant') return {id, name: 'PetShop Amigo Fiel', isVerified: true, 'data-ai-hint': 'pet store', imageUrl: 'https://placehold.co/64x64.png?text=AF'};
    if (id === 'floriculturaBelaFlorMerchant') return {id, name: 'Floricultura Bela Flor', isVerified: false, 'data-ai-hint': 'flower shop', imageUrl: 'https://placehold.co/64x64.png?text=FB'};
    if (id === 'cinemaEstrelaMerchant') return {id, name: 'Cinema Estrela', isVerified: true, 'data-ai-hint': 'cinema theater', imageUrl: 'https://placehold.co/64x64.png?text=CE'};


    return undefined;
};


export const mockAdminMetrics: AdminMetricItem[] = [
  { title: 'Usuários Ativos', value: '12.580', icon: Users, change: '+150 esta semana', bgColorClass: 'bg-blue-500/10 text-blue-600' },
  { title: 'Anunciantes Ativos', value: '450', icon: Building2, change: '+5 esta semana', bgColorClass: 'bg-green-500/10 text-green-600' },
  { title: 'Ofertas Ativas', value: '1.230', icon: ListChecks, change: '-20 vs ontem', bgColorClass: 'bg-sky-500/10 text-sky-600' },
  { title: 'Check-ins (Hoje)', value: '85', icon: CalendarCheck2, change: '+10% vs ontem', bgColorClass: 'bg-orange-500/10 text-orange-600' },
  { title: 'Sorteios Ativos', value: '15', icon: Gift, change: '+2 novos', bgColorClass: 'bg-purple-500/10 text-purple-600' },
  { title: 'Pontos Dist. (Mês)', value: '1.250.000', icon: HandCoins, change: '+5% vs mês ant.', bgColorClass: 'bg-yellow-500/10 text-yellow-600' },
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

// Mock data for user lists
export const mockUserList: User[] = [
  mockUser,
  {
    id: 'user002',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    avatarUrl: 'https://placehold.co/40x40.png?text=BC',
    avatarHint: 'man office',
    points: 750,
    level: USER_LEVELS.BRONZE.name,
    currentXp: 250,
    xpToNextLevel: USER_LEVELS.BRONZE.nextLevelXp,
    joinDate: new Date(now.getTime() - oneDay * 60),
    status: 'active',
    isAdvertiser: false,
  },
  {
    id: 'user003',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    avatarUrl: 'https://placehold.co/40x40.png?text=CD',
    avatarHint: 'woman smiling',
    points: 2500,
    level: USER_LEVELS.PRATA.name,
    currentXp: 1200,
    xpToNextLevel: USER_LEVELS.PRATA.nextLevelXp,
    joinDate: new Date(now.getTime() - oneDay * 120),
    status: 'active',
    isAdvertiser: false,
  },
  {
    id: 'user004',
    name: 'Daniel Evans (Suspenso)',
    email: 'daniel.evans@example.com',
    avatarUrl: 'https://placehold.co/40x40.png?text=DE',
    avatarHint: 'person serious',
    points: 100,
    level: USER_LEVELS.INICIANTE.name,
    currentXp: 50,
    xpToNextLevel: USER_LEVELS.INICIANTE.nextLevelXp,
    joinDate: new Date(now.getTime() - oneDay * 30),
    status: 'suspended',
    isAdvertiser: false,
  },
  {
    id: 'user005',
    name: 'Empresa Exemplo (Pendente)',
    email: 'contato@empresaexemplo.com',
    avatarUrl: 'https://placehold.co/40x40.png?text=EE',
    avatarHint: 'company building',
    points: 0,
    level: USER_LEVELS.INICIANTE.name,
    currentXp: 0,
    xpToNextLevel: USER_LEVELS.INICIANTE.nextLevelXp,
    joinDate: new Date(now.getTime() - oneDay * 2),
    status: 'pending_verification',
    isAdvertiser: true, // This user is also an advertiser but listed here as a general user.
    responsibleName: 'Felipe Alves',
    businessName: 'Empresa Exemplo Ltda',
    businessLogoUrl: 'https://placehold.co/40x40.png?text=EE',
    advertiserStatus: 'pending_verification',
    advertiserPlan: 'trial',
  },
];

// Mock data for advertiser lists (can reuse parts of User type)
export const mockAdvertiserList: User[] = [
  mockAdvertiserUser,
  {
    id: 'advUserBarbearia',
    responsibleName: 'João Barbeiro',
    name: 'João Barbeiro',
    email: 'contato@barbeariapremium.com',
    isAdvertiser: true,
    advertiserProfileId: 'barbeariaPremiumMerchant',
    businessName: 'Barbearia Premium',
    businessLogoUrl: 'https://placehold.co/40x40.png?text=BP',
    businessLogoHint: 'barber pole',
    joinDate: new Date(now.getTime() - oneDay * 200),
    advertiserStatus: 'active',
    advertiserPlan: 'basic',
    points: 20, level: 'Iniciante', currentXp: 5, xpToNextLevel: 100, // Basic user stats for advertiser
  },
  {
    id: 'advUserAtletaShop',
    responsibleName: 'Mariana Esportista',
    name: 'Mariana Esportista',
    email: 'vendas@atletashop.com',
    isAdvertiser: true,
    advertiserProfileId: 'atletaShopMerchant',
    businessName: 'Atleta Shop',
    businessLogoUrl: 'https://placehold.co/40x40.png?text=AS',
    businessLogoHint: 'sports store',
    joinDate: new Date(now.getTime() - oneDay * 90),
    advertiserStatus: 'active',
    advertiserPlan: 'pro',
    points: 30, level: 'Iniciante', currentXp: 10, xpToNextLevel: 100,
  },
  {
    id: 'advUserBoteco',
    responsibleName: 'Pedro Mestre Cervejeiro',
    name: 'Pedro Mestre Cervejeiro',
    email: 'reservas@botecodomestre.com',
    isAdvertiser: true,
    advertiserProfileId: 'botecoMestreMerchant',
    businessName: 'Boteco do Mestre',
    businessLogoUrl: 'https://placehold.co/40x40.png?text=BM',
    businessLogoHint: 'beer mug',
    joinDate: new Date(now.getTime() - oneDay * 30),
    advertiserStatus: 'pending_verification',
    advertiserPlan: 'trial',
    points: 0, level: 'Iniciante', currentXp: 0, xpToNextLevel: 100,
  },
  {
    id: 'advUserCafe',
    responsibleName: 'Sofia Doceira',
    name: 'Sofia Doceira',
    email: 'cafe@aconchego.com',
    isAdvertiser: true,
    advertiserProfileId: 'cafeAconchegoMerchant',
    businessName: 'Café Aconchego',
    businessLogoUrl: 'https://placehold.co/40x40.png?text=CA',
    businessLogoHint: 'coffee cup',
    joinDate: new Date(now.getTime() - oneDay * 400),
    advertiserStatus: 'suspended',
    advertiserPlan: 'basic',
    points: 10, level: 'Iniciante', currentXp: 2, xpToNextLevel: 100,
  },
];

export interface FeaturedMerchant {
  id: string;
  name: string;
  logoUrl: string;
  'data-ai-hint': string;
  category?: string;
  tagline?: string;
}

export const mockFeaturedMerchants: FeaturedMerchant[] = [
  {
    id: 'pizzariaSaborosaMerchant',
    name: 'Pizzaria Saborosa',
    logoUrl: 'https://placehold.co/100x100.png?text=PS',
    'data-ai-hint': 'pizza logo',
    category: 'Alimentação',
  },
  {
    id: 'barbeariaPremiumMerchant',
    name: 'Barbearia Premium',
    logoUrl: 'https://placehold.co/100x100.png?text=BP',
    'data-ai-hint': 'barber logo',
    category: 'Serviços',
  },
  {
    id: 'atletaShopMerchant',
    name: 'Atleta Shop',
    logoUrl: 'https://placehold.co/100x100.png?text=AS',
    'data-ai-hint': 'sport store logo',
    category: 'Compras',
  },
  {
    id: 'botecoMestreMerchant',
    name: 'Boteco do Mestre',
    logoUrl: 'https://placehold.co/100x100.png?text=BM',
    'data-ai-hint': 'bar logo',
    category: 'Alimentação',
  },
  {
    id: 'cafeAconchegoMerchant',
    name: 'Café Aconchego',
    logoUrl: 'https://placehold.co/100x100.png?text=CA',
    'data-ai-hint': 'coffee shop logo',
    category: 'Alimentação',
  },
  {
    id: 'sorveteriaGostosoMerchant',
    name: 'Sorveteria Gostoso',
    logoUrl: 'https://placehold.co/100x100.png?text=SG',
    'data-ai-hint': 'ice cream logo',
    category: 'Alimentação',
  },
  {
    id: 'livrariaSaberMerchant',
    name: 'Livraria Saber',
    logoUrl: 'https://placehold.co/100x100.png?text=LS',
    'data-ai-hint': 'bookstore logo',
    category: 'Educação',
  },
  {
    id: 'petShopAmigoFielMerchant',
    name: 'PetShop Amigo Fiel',
    logoUrl: 'https://placehold.co/100x100.png?text=AF',
    'data-ai-hint': 'pet shop logo',
    category: 'Serviços',
  },
  {
    id: 'floriculturaBelaFlorMerchant',
    name: 'Floricultura Bela Flor',
    logoUrl: 'https://placehold.co/100x100.png?text=FB',
    'data-ai-hint': 'flower shop logo',
    category: 'Compras',
  },
  {
    id: 'cinemaEstrelaMerchant',
    name: 'Cinema Estrela',
    logoUrl: 'https://placehold.co/100x100.png?text=CE',
    'data-ai-hint': 'cinema logo',
    category: 'Lazer',
  },
];
    

    