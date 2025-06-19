
import type React from 'react'; 
import { 
  Activity, AlertTriangle, Award, BadgeCheck, BarChart3, BookOpen, Building, Building2, CalendarCheck2, CheckCircle, CheckCheck, Coins, CreditCard, DollarSign, Eye, FileText, Filter, Gift, HandCoins, HeartPulse, HelpCircle, ListChecks, LocateFixed, MailQuestion, MapPin, MapPinned, Megaphone, MessageSquare, MousePointerClick, Package, PackageCheck, QrCode, Settings2, ShieldAlert, ShoppingCart, Smile, Smartphone, Sparkles, Star, ThumbsUp, Ticket, TrendingDown, TrendingUp, UserCheck, UserCog, UserPlus, Users, Utensils, Wrench, Zap 
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
  pointsForComment?: number;
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

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  avatarHint?: string;
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
  
  isAdvertiser?: boolean; 
  advertiserProfileId?: string; 
  businessName?: string;
  businessLogoUrl?: string;
  businessLogoHint?: string;
  businessDescription?: string;
  
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
  'data-ai-hint'?: string;
  pointsToEnter: number;
  endDate: Date;
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
export const POINTS_COMMENT_OFFER = 1;
export const POINTS_PROFILE_COMPLETE = 50;
export const POINTS_SIGNUP_WELCOME = 100;


export const mockBadges: Badge[] = [
    { id: 'badge1', name: 'Explorador Inicial', icon: 'Star', description: `Fez seu primeiro check-in! +${POINTS_CHECKIN} XP`, unlockedDate: new Date(), 'data-ai-hint': 'star badge' },
    { id: 'badge2', name: 'Amigo das Ofertas', icon: 'Users', description: 'Compartilhou 5 ofertas! +15 XP', 'data-ai-hint': 'people group' },
    { id: 'badge3', name: 'Super Points', icon: 'Award', description: 'Acumulou 1000 pontos!', 'data-ai-hint': 'trophy award' },
    { id: 'badge4', name: 'Comentarista Ativo', icon: 'MessageSquare', description: 'Fez 10 comentários! +10 XP', 'data-ai-hint': 'speech bubble' },
    { id: 'badge5', name: 'Caçador de Ofertas Pro', icon: 'Zap', description: 'Realizou 10 check-ins! +50 XP', 'data-ai-hint': 'lightning zap' },
];

export const mockUser: User = {
  id: 'user123',
  name: 'Ana Clara Explorer',
  avatarUrl: 'https://placehold.co/100x100.png?text=AE',
  avatarHint: 'person woman',
  points: 1250,
  level: USER_LEVELS.PRATA.name,
  currentXp: 650, 
  xpToNextLevel: USER_LEVELS.PRATA.nextLevelXp,
  badges: mockBadges.slice(0,3),
  favoriteOffers: ['offer-pizza-1', 'offer-sports-3'],
  followedMerchants: ['pizzariaSaborosaMerchant', 'atletaShopMerchant', 'botecoMestreMerchant'],
  checkInHistory: [
    { id: 'chk1', offerId: 'offer-barber-2', offerTitle: 'Corte Masculino + Barba Modelada', merchantName: 'Barbearia Premium', timestamp: new Date(Date.now() - 86400000 * 2), pointsEarned: POINTS_CHECKIN },
    { id: 'chk2', offerId: 'offer-bar-4', offerTitle: 'Happy Hour Dose Dupla Chopp', merchantName: 'Boteco do Mestre', timestamp: new Date(Date.now() - 86400000 * 5), pointsEarned: POINTS_CHECKIN },
    { id: 'chk3', offerId: 'offer-pizza-1', offerTitle: '50% Off Pizza Gigante', merchantName: 'Pizzaria Saborosa', timestamp: new Date(Date.now() - 86400000 * 10), pointsEarned: POINTS_CHECKIN },
  ],
  sharedOffersHistory: [
      { id: 'share1', offerId: 'offer-pizza-1', offerTitle: '50% Off Pizza Gigante', platform: 'WhatsApp', timestamp: new Date(Date.now() - 86400000 * 1), pointsEarned: POINTS_SHARE_OFFER },
      { id: 'share2', offerId: 'offer-sports-3', offerTitle: 'Tênis Corrida ProBoost X', platform: 'Instagram', timestamp: new Date(Date.now() - 86400000 * 4), pointsEarned: POINTS_SHARE_OFFER },
  ],
  sweepstakeParticipations: [
      { id: 'swp1', sweepstakeId: 'sw1', sweepstakeTitle: 'Jantar Romântico Vale R$300', timestamp: new Date(Date.now() - 86400000 * 3), pointsSpent: 100 },
      { id: 'swp2', sweepstakeId: 'sw2', sweepstakeTitle: 'Vale Compras de R$200 Loja X', timestamp: new Date(Date.now() - 86400000 * 8), pointsSpent: 50 },
  ],
  commentsMade: [
      { id: 'cmtUser1', userId: 'user123', userName: 'Ana Clara Explorer', rating: 5, text: 'Adorei a pizza, super recomendo! Massa fininha e crocante.', timestamp: new Date(Date.now() - 86400000), offerId: 'offer-pizza-1', offerTitle: '50% Off Pizza Gigante + Refri Grátis', pointsEarned: POINTS_COMMENT_OFFER },
      { id: 'cmtUser2', userId: 'user123', userName: 'Ana Clara Explorer', rating: 4, text: 'O corte ficou bom, mas o ambiente poderia ser mais silencioso.', timestamp: new Date(Date.now() - 86400000 * 3), offerId: 'offer-barber-2', offerTitle: 'Corte Masculino + Barba Modelada', pointsEarned: POINTS_COMMENT_OFFER },
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
  businessLogoUrl: 'https://placehold.co/150x150.png?text=PS',
  businessLogoHint: 'pizza logo',
  businessDescription: 'A melhor pizza da cidade, com ingredientes frescos e forno a lenha! Venha conferir nossas promoções.',
  avatarUrl: 'https://placehold.co/100x100.png?text=CP',
  avatarHint: 'person chef',
  points: 0, 
  level: USER_LEVELS.INICIANTE.name, 
  currentXp: 0,
  xpToNextLevel: USER_LEVELS.INICIANTE.nextLevelXp,
  isAdvertiser: true,
  advertiserProfileId: 'pizzariaSaborosaMerchant', 
  email: 'carlos.pizza@saborosa.com',
  address: 'Avenida Principal, 789, Centro, Manaus-AM',
  city: 'Manaus, AM',
  whatsapp: '(92) 98877-6655',
  isProfileComplete: true,
};

const now = new Date();
const oneDay = 86400000;

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
    pointsAwarded: POINTS_CHECKIN + 2, 
    pointsForCheckin: POINTS_CHECKIN + 2,
    pointsForShare: POINTS_SHARE_OFFER,
    pointsForComment: POINTS_COMMENT_OFFER,
    comments: [
      { id: 'c1', userId: 'userX', userName: 'João Silva', userAvatarUrl: 'https://placehold.co/40x40.png?text=JS', userAvatarHint: 'person avatar', rating: 5, text: 'Pizza maravilhosa, atendimento top!', timestamp: new Date(now.getTime() - 3600000 * 5), pointsEarned: POINTS_COMMENT_OFFER },
      { id: 'c2', userId: 'userY', userName: 'Maria Oliveira', userAvatarUrl: 'https://placehold.co/40x40.png?text=MO', userAvatarHint: 'woman avatar', rating: 4, text: 'Gostei muito, ótimo custo-benefício.', timestamp: new Date(now.getTime() - 3600000 * 24), pointsEarned: POINTS_COMMENT_OFFER },
    ],
    status: 'active',
    visibility: 'destaque',
    createdAt: new Date(now.getTime() - oneDay * 5),
    updatedAt: new Date(now.getTime() - oneDay * 1),
    isPresentialOnly: false,
    isUnlimited: false,
    quantity: 50,
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
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneDay * 10),
    updatedAt: new Date(now.getTime() - oneDay * 2),
    isPresentialOnly: true,
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
    isPresentialOnly: true,
    status: 'active',
    visibility: 'destaque',
    createdAt: new Date(now.getTime() - oneDay * 15),
    updatedAt: new Date(now.getTime() - oneDay * 1),
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
    status: 'active',
    visibility: 'normal',
    createdAt: new Date(now.getTime() - oneDay * 20),
    updatedAt: new Date(now.getTime() - oneDay * 3),
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
    distance: '1.5km',
    latitude: -3.0987,
    longitude: -60.0012,
  },
];

export const mockSweepstakes: Sweepstake[] = [
  { id: 'sw1', title: 'Ganhe um Jantar Romântico', description: 'Concorra a um jantar especial para duas pessoas no Restaurante Aconchego. Sorteio dia 30!', imageUrl: 'https://placehold.co/600x300.png?text=Jantar', 'data-ai-hint': 'romantic dinner', pointsToEnter: 100, endDate: new Date(now.getTime() + oneDay * 7) },
  { id: 'sw2', title: 'Vale Compras de R$200', description: 'Use seus pontos para concorrer a um vale compras de R$200 na Loja Estilo Total. O resultado sai em 2 semanas!', imageUrl: 'https://placehold.co/600x300.png?text=Vale+Compras', 'data-ai-hint': 'shopping giftcard', pointsToEnter: 50, endDate: new Date(now.getTime() + oneDay * 14) },
  { id: 'sw3', title: 'Um Ano de Pizza Grátis', description: 'Imagine: uma pizza grande por mês, por um ano inteiro! Participe com 200 pontos.', imageUrl: 'https://placehold.co/600x300.png?text=Pizza+Ano', 'data-ai-hint': 'pizza stack', pointsToEnter: 200, endDate: new Date(now.getTime() + oneDay * 30) },
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
  { id: 'users', title: 'Gestão de Usuários', icon: Users, description: 'Gerencie perfis, permissões e dados de usuários.' },
  { id: 'advertisers', title: 'Gestão de Anunciantes', icon: Building2, description: 'Monitore contas, planos e desempenho de anunciantes.' },
  { id: 'offers', title: 'Aprovação de Ofertas', icon: PackageCheck, description: 'Revise, aprove ou rejeite ofertas pendentes.' },
  { id: 'analytics', title: 'Analytics Global', icon: BarChart3, description: 'Visualize gráficos de desempenho e tendências da plataforma.' },
  { id: 'categories', title: 'Gestão de Categorias', icon: Filter, description: 'Crie, edite e organize categorias de ofertas.' },
  { id: 'reports', title: 'Banco de Relatórios', icon: FileText, description: 'Gere e baixe relatórios detalhados.' },
  { id: 'settings', title: 'Configurações Gerais', icon: Settings2, description: 'Ajuste as configurações da plataforma Ofertivo.' },
  { id: 'sweepstakes', title: 'Gestão de Sorteios', icon: Gift, description: 'Monitore e crie sorteios para engajamento.' },
  { id: 'moderation', title: 'Moderação de Conteúdo', icon: ShieldAlert, description: 'Revise comentários e trate denúncias.' },
  { id: 'finance', title: 'Financeiro e Assinaturas', icon: CreditCard, description: 'Controle pagamentos, assinaturas e receita.' },
  { id: 'support', title: 'Central de Suporte', icon: HelpCircle, description: 'Gerencie tickets e forneça suporte aos usuários.' },
];
