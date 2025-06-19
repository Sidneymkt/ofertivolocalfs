export interface Offer {
  id: string;
  title: string;
  merchantName: string;
  imageUrl: string;
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
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  favoriteOffers?: string[]; // Array of offer IDs
  checkInHistory?: CheckIn[];
}

export interface CheckIn {
  id: string;
  offerId: string;
  offerTitle: string;
  timestamp: Date;
  pointsEarned: number;
}

export interface Sweepstake {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pointsToEnter: number;
  endDate: Date;
}

export const mockUser: User = {
  id: 'user123',
  name: 'Ana Clara',
  avatarUrl: 'https://placehold.co/100x100.png',
  points: 1250,
  favoriteOffers: ['1', '3'],
  checkInHistory: [
    { id: 'chk1', offerId: '2', offerTitle: 'Corte de Cabelo + Barba', timestamp: new Date(Date.now() - 86400000 * 2), pointsEarned: 50 },
    { id: 'chk2', offerId: '4', offerTitle: 'Happy Hour Dose Dupla Chopp', timestamp: new Date(Date.now() - 86400000 * 5), pointsEarned: 30 },
  ]
};

export const mockOffers: Offer[] = [
  { 
    id: '1', 
    title: '50% Off Pizza Gigante', 
    merchantName: 'Pizzaria Saborosa', 
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Deliciosa pizza gigante com 50% de desconto. Sabores selecionados. Válido para consumo no local ou retirada.',
    originalPrice: 50.00, 
    discountedPrice: 25.00, 
    distance: '500m', 
    category: 'Alimentação', 
    rating: 4.7, 
    reviews: 152, 
    timeRemaining: '2h 15m restantes', 
    tags: ['pizza', 'promoção', 'jantar'],
    latitude: -3.0912, 
    longitude: -59.9734,
    'data-ai-hint': 'pizza restaurant' as any 
  },
  { 
    id: '2', 
    title: 'Corte Masculino + Barba Modelada', 
    merchantName: 'Barbearia Premium', 
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Renove seu visual com corte de cabelo moderno e barba modelada por nossos especialistas. Ambiente climatizado e café expresso cortesia.',
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
    'data-ai-hint': 'barber shop' as any
  },
  { 
    id: '3', 
    title: 'Tênis Corrida ProBoost X', 
    merchantName: 'Atleta Shop', 
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Performance e conforto para suas corridas com o Tênis ProBoost X. Tecnologia de amortecimento avançada e design arrojado.',
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
    'data-ai-hint': 'sport shoes' as any
  },
  { 
    id: '4', 
    title: 'Happy Hour: Chopp Artesanal em Dobro', 
    merchantName: 'Boteco do Mestre', 
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Todo dia das 17h às 20h, peça um chopp artesanal e ganhe outro! Perfeito para relaxar após o trabalho com amigos.',
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
    'data-ai-hint': 'beer bar' as any
  },
];

export const mockSweepstakes: Sweepstake[] = [
  { id: 'sw1', title: 'Ganhe um Jantar Romântico', description: 'Concorra a um jantar especial para duas pessoas no Restaurante Aconchego.', imageUrl: 'https://placehold.co/600x400.png', pointsToEnter: 100, endDate: new Date(Date.now() + 86400000 * 7), 'data-ai-hint': 'romantic dinner' as any },
  { id: 'sw2', title: 'Vale Compras de R$200', description: 'Use seus pontos para concorrer a um vale compras de R$200 na Loja Estilo Total.', imageUrl: 'https://placehold.co/600x400.png', pointsToEnter: 50, endDate: new Date(Date.now() + 86400000 * 14), 'data-ai-hint': 'shopping giftcard' as any },
];

export const categories = [
  { name: 'Alimentação', icon: 'Utensils' },
  { name: 'Serviços', icon: 'Wrench' },
  { name: 'Compras', icon: 'ShoppingCart' },
  { name: 'Lazer', icon: 'Smile' },
  { name: 'Saúde', icon: 'HeartPulse' },
  { name: 'Educação', icon: 'BookOpen' },
];
