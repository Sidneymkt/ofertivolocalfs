
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Offer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Heart, Share2, Zap, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore'; 
import { offerTypes } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [formattedValidity, setFormattedValidity] = useState('Validade não definida');

  const offerTypeDetail = offerTypes.find(ot => ot.id === offer.offerType);
  const Icon = offerTypeDetail?.icon || ListChecks;

  useEffect(() => {
    const getJsDate = (dateInput: Date | Timestamp | undefined): Date | null => {
      if (!dateInput) return null;
      if (dateInput instanceof Timestamp) return dateInput.toDate();
      if (dateInput instanceof Date) return dateInput;
      const parsedDate = new Date(dateInput as any);
      return !isNaN(parsedDate.getTime()) ? parsedDate : null;
    };

    const endDateToFormat = getJsDate(offer.validityEndDate);
    if (endDateToFormat) {
      setFormattedValidity(`Válido até ${format(endDateToFormat, "dd 'de' MMMM", { locale: ptBR })}`);
    }
  }, [offer.validityEndDate]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // In a real app, you would also call a service to update the backend
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text: offer.description,
        url: window.location.origin + `/offer/${offer.id}`,
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.origin + `/offer/${offer.id}`);
      alert('Link da oferta copiado para a área de transferência!');
    }
  };

  return (
    <Link
      href={`/offer/${offer.id}`}
      className="block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none group/cardlink"
      aria-label={`Ver detalhes da oferta: ${offer.title}`}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg group-hover/cardlink:ring-1 group-hover/cardlink:ring-primary/30 transition-all duration-200 ease-in-out flex flex-col h-full bg-card">
        <div className="relative w-full aspect-[16/9] sm:aspect-video">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            layout="fill"
            objectFit="cover"
            className="bg-muted"
            data-ai-hint={offer['data-ai-hint'] as string || 'offer image'}
          />
          {offer.offerType === 'relampago' && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground py-1 px-2.5 shadow-md">
              <Zap size={14} className="mr-1.5 fill-current" />
              OFERTA RELÂMPAGO
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 flex flex-col flex-grow">
          <div className="flex-grow space-y-3">
              <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-1 text-primary shrink-0" />
                  <div className="flex-grow space-y-1">
                      <h3 className="font-semibold text-foreground group-hover/cardlink:text-primary transition-colors line-clamp-2 leading-tight">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {offer.description}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
                          <div className="flex items-center">
                              <Clock size={12} className="mr-1.5" />
                              <span>{formattedValidity}</span>
                          </div>
                          <div className="flex items-center">
                              <MapPin size={12} className="mr-1.5" />
                              <span className="font-medium">{offer.merchantName}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <div className="mt-auto pt-3 border-t flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "flex-1 bg-muted/60 hover:bg-muted/90 text-muted-foreground",
                isFavorited && "bg-destructive/10 text-destructive hover:bg-destructive/20"
              )}
              onClick={handleFavorite}
            >
              <Heart size={16} className={cn("mr-2", isFavorited && "fill-current")} />
              {isFavorited ? 'Favorito' : 'Favoritar'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 bg-muted/60 hover:bg-muted/90 text-muted-foreground"
              onClick={handleShare}
            >
              <Share2 size={16} className="mr-2" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OfferCard;
