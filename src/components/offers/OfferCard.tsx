
'use client';

import Image from 'next/image';
import type { Offer } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Star, Tag, Navigation, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne a navegação do Link pai
    e.stopPropagation(); // Para a propagação do evento
    // Lógica de salvar (exemplo)
    console.log(`Salvar oferta: ${offer.id}`);
    alert(`Oferta "${offer.title}" salva (simulado)!`);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne a navegação do Link pai
    e.stopPropagation(); // Para a propagação do evento
    // Lógica de compartilhar (exemplo)
    console.log(`Compartilhar oferta: ${offer.id}`);
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text: `Confira esta oferta: ${offer.description}`,
        url: window.location.origin + `/offer/${offer.id}`,
      }).catch(console.error);
    } else {
      alert(`Compartilhar oferta: ${offer.title} (simulado)`);
    }
  };

  return (
    <Link
      href={`/offer/${offer.id}`}
      className="block rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none group/cardlink"
      aria-label={`Ver detalhes da oferta: ${offer.title}`}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl group-hover/cardlink:ring-2 group-hover/cardlink:ring-primary/50 transition-all duration-300 ease-in-out flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            width={600}
            height={300}
            className="object-cover w-full h-48"
            data-ai-hint={offer['data-ai-hint'] as string}
          />
          {offer.timeRemaining && (
            <Badge variant="destructive" className="absolute top-2 right-2 flex items-center gap-1">
              <Clock size={14} /> {offer.timeRemaining}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-1 leading-tight group-hover/cardlink:text-primary transition-colors">{offer.title}</CardTitle>
          <p className="text-sm text-muted-foreground mb-2">{offer.merchantName}</p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-primary">
                R${offer.discountedPrice.toFixed(2)}
              </p>
              {offer.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  R${offer.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            {offer.rating && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-accent fill-accent mr-1" />
                <span>{offer.rating.toFixed(1)} ({offer.reviews})</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2 mb-3">
            <Badge variant="secondary" className="flex items-center gap-1"><Tag size={12} />{offer.category}</Badge>
            <Badge variant="outline" className="flex items-center gap-1"><Navigation size={12} />{offer.distance}</Badge>
          </div>
          {offer.description && <p className="text-xs text-muted-foreground line-clamp-2">{offer.description}</p>}

        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 group/button" onClick={handleSaveClick}>
            <Bookmark className="w-4 h-4 mr-2 group-hover/button:fill-primary transition-colors" /> Salvar
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-primary hover:bg-primary/10" onClick={handleShareClick}>
            <Share2 className="w-4 h-4 mr-2" /> Compartilhar
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default OfferCard;
