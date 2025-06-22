
'use client';

import React, { useState, useEffect } from 'react';
import type { Offer, User, Comment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import FavoriteDealsList from './FavoriteDealsList';
import FollowedMerchantsList, { type FollowedMerchantDisplayItem } from './FollowedMerchantsList';
import { Heart, Building, MessageSquare, Star, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Timestamp } from 'firebase/firestore';


const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 12 }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className={i < Math.round(rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30'} />
      ))}
    </div>
  );
};

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
    const [formattedDate, setFormattedDate] = useState('...');

    useEffect(() => {
        if (comment.timestamp) {
            const date = comment.timestamp instanceof Timestamp ? comment.timestamp.toDate() : new Date(comment.timestamp);
            setFormattedDate(format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }));
        }
    }, [comment.timestamp]);

    return (
        <li key={comment.id} className="p-3 bg-muted/50 rounded-lg shadow-sm text-sm hover:bg-muted/70 transition-colors">
            <p className="text-xs text-muted-foreground mb-0.5">
                Você comentou em: 
                {comment.offerId && comment.offerTitle ? (
                    <Link href={`/offer/${comment.offerId}`} className="text-primary hover:underline font-semibold ml-1">
                        {comment.offerTitle}
                    </Link>
                ) : (
                    <span className="font-semibold ml-1">Oferta Desconhecida</span>
                )}
            </p>
            <StarRating rating={comment.rating} />
            <p className="italic text-card-foreground mt-1.5">"{comment.text}"</p>
            <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs text-muted-foreground">
                    {formattedDate}
                </span>
                {comment.offerId && (
                    <Button variant="outline" size="xs" asChild className="h-7 px-2 py-1 text-xs">
                    <Link href={`/offer/${comment.offerId}#comment-section`}>
                        Ver na oferta <ExternalLink size={12} className="ml-1"/>
                    </Link>
                </Button>
                )}
            </div>
        </li>
    );
};


const InteractionsCard: React.FC<InteractionsCardProps> = ({ favoriteOffers, followedMerchants, commentsMade }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M3 10h18M3 6h18M3 14h18M3 18h18"/></svg>
          Suas Interações
        </CardTitle>
        <CardDescription>Ofertas salvas, negócios seguidos e comentários.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-1 h-auto mb-4">
            <TabsTrigger value="favorites" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <Heart size={14} />Favoritas
            </TabsTrigger>
            <TabsTrigger value="following" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <Building size={14} />Seguindo
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <MessageSquare size={14} />Comentários
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-80 pr-3">
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
                    <CommentItem key={comment.id} comment={comment} />
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
