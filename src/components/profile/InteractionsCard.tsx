
'use client';

import type { Offer, User, Comment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import FavoriteDealsList from './FavoriteDealsList';
import FollowedMerchantsList, { type FollowedMerchantDisplayItem } from './FollowedMerchantsList';
import { Heart, Building, MessageSquare, Share } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '../ui/button';

interface InteractionsCardProps {
  favoriteOffers: Offer[];
  followedMerchants: FollowedMerchantDisplayItem[];
  commentsMade: Comment[];
}

const InteractionsCard: React.FC<InteractionsCardProps> = ({ favoriteOffers, followedMerchants, commentsMade }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M18 13a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/><path d="M10 2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"/><path d="M6 13a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/><path d="m3 12 3-3 3 3"/><path d="M15 12 12 9l-3 3"/><path d="M9 12v9"/><path d="M15 12v9"/></svg>
          Suas Interações
        </CardTitle>
        <CardDescription>Ofertas salvas, negócios seguidos e comentários.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-1 h-auto">
            <TabsTrigger value="favorites" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5">
              <Heart size={14} className="mr-1 md:mr-2" />Favoritas
            </TabsTrigger>
            <TabsTrigger value="following" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5">
              <Building size={14} className="mr-1 md:mr-2" />Seguindo
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5">
              <MessageSquare size={14} className="mr-1 md:mr-2" />Comentários
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-80 mt-4 pr-3">
            <TabsContent value="favorites">
              <FavoriteDealsList favoriteOffers={favoriteOffers} />
            </TabsContent>

            <TabsContent value="following">
              <FollowedMerchantsList merchants={followedMerchants} />
            </TabsContent>

            <TabsContent value="comments">
              {commentsMade && commentsMade.length > 0 ? (
                <ul className="space-y-3">
                  {commentsMade.map(comment => (
                    <li key={comment.id} className="p-3 bg-muted/50 rounded-md text-sm">
                      <p className="text-xs text-muted-foreground">
                        Você comentou em: <Link href={`/offer/${(comment as any).offerId}`} className="text-primary hover:underline font-semibold">{(comment as any).offerTitle || 'Oferta Desconhecida'}</Link>
                      </p>
                      <p className="italic text-card-foreground mt-1">"{comment.text}"</p>
                      <div className="flex justify-between items-center mt-1">
                         <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < comment.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'} />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(comment.timestamp, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-6">Você ainda não fez comentários.</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InteractionsCard;

    