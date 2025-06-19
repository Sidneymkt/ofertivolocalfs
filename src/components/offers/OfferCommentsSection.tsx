
'use client';

import React, { useState } from 'react';
import type { Offer, Comment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageCircle, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OfferCommentsSectionProps {
  offer: Offer;
}

const StarRating: React.FC<{ rating: number; size?: number; totalStars?: number }> = ({ rating, size = 16, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={index < Math.round(rating) ? 'text-accent fill-accent' : 'text-muted-foreground/50'}
        />
      ))}
    </div>
  );
};


const OfferCommentsSection: React.FC<OfferCommentsSectionProps> = ({ offer }) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0); // For new comment rating

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || userRating === 0) {
      toast({
        variant: "destructive",
        title: "Comentário Inválido",
        description: "Por favor, escreva um comentário e selecione uma avaliação.",
      });
      return;
    }
    // Placeholder for submission logic
    console.log({ comment: newComment, rating: userRating, offerId: offer.id });
    toast({
        title: "Comentário Enviado!",
        description: "Obrigado pela sua avaliação. Ela será publicada em breve.",
    });
    setNewComment('');
    setUserRating(0);
  };

  return (
    <Card className="shadow-lg" id="comment-section">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <MessageCircle className="mr-2 text-primary" /> Avaliações e Comentários
        </CardTitle>
        {offer.rating && offer.reviews ? (
          <div className="flex items-center gap-2">
            <StarRating rating={offer.rating} size={20}/>
            <span className="text-muted-foreground text-sm">
              {offer.rating.toFixed(1)} de 5 estrelas ({offer.reviews} avaliações)
            </span>
          </div>
        ) : (
          <CardDescription>Seja o primeiro a avaliar esta oferta!</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {offer.comments && offer.comments.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-muted/20">
            {offer.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.userAvatarUrl} alt={comment.userName} data-ai-hint={comment.userAvatarHint || 'person avatar'} />
                  <AvatarFallback>{comment.userName?.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">{comment.userName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <StarRating rating={comment.rating} size={14}/>
                  <p className="text-sm text-card-foreground mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">Ainda não há comentários para esta oferta.</p>
        )}

        {/* New Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4 pt-4 border-t">
          <div>
            <h4 className="font-medium mb-2 text-md">Deixe sua avaliação:</h4>
            <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 p-0 ${userRating >= star ? 'text-accent' : 'text-muted-foreground/60 hover:text-accent/80'}`}
                    onClick={() => setUserRating(star)}
                    aria-label={`Avaliar com ${star} estrela${star > 1 ? 's' : ''}`}
                    >
                    <Star size={24} fill={userRating >= star ? 'currentColor' : 'none'} />
                    </Button>
                ))}
            </div>
          </div>
          <Textarea
            placeholder="Escreva seu comentário aqui..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <Send size={16} className="mr-2" /> Enviar Comentário
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OfferCommentsSection;
