import Image from 'next/image';
import type { Offer } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Star, Tag, Navigation, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={offer.imageUrl}
          alt={offer.title}
          width={600}
          height={300} // Adjusted height for a better aspect ratio
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
        <CardTitle className="text-lg font-headline mb-1 leading-tight">{offer.title}</CardTitle>
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
        <Button variant="outline" size="sm" className="flex-1 group">
          <Bookmark className="w-4 h-4 mr-2 group-hover:fill-primary transition-colors" /> Salvar
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 text-primary hover:bg-primary/10">
          <Share2 className="w-4 h-4 mr-2" /> Compartilhar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
