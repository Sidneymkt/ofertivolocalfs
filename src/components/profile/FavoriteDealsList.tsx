
import type { Offer } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface FavoriteDealsListProps {
  favoriteOffers: Offer[];
}

const FavoriteDealsList: React.FC<FavoriteDealsListProps> = ({ favoriteOffers }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-destructive fill-destructive" /> Ofertas Favoritas
        </CardTitle>
        <CardDescription>Suas ofertas salvas para não perder nenhuma oportunidade.</CardDescription>
      </CardHeader>
      <CardContent>
        {favoriteOffers.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">Você ainda não favoritou nenhuma oferta.</p>
        ) : (
          <ul className="space-y-4">
            {favoriteOffers.map((offer) => (
              <li key={offer.id} className="group rounded-lg hover:bg-muted/60 transition-colors">
                <Link href={`/offer/${offer.id}`} className="flex items-center gap-4 p-3" aria-label={`Ver detalhes da oferta: ${offer.title}`}>
                  <Image 
                    src={offer.imageUrl} 
                    alt={offer.title} 
                    width={64} 
                    height={64} 
                    className="rounded-md object-cover w-16 h-16 shrink-0"
                    data-ai-hint={offer['data-ai-hint'] as string}
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-card-foreground leading-tight group-hover:text-primary transition-colors">{offer.title}</h4>
                    <p className="text-xs text-muted-foreground">{offer.merchantName}</p>
                    <p className="text-sm font-bold text-primary">R${offer.discountedPrice.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="ml-auto shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                    {/* This Link is technically redundant if the whole item is a link, but keeps the explicit "Ver" action clear */}
                    <span aria-hidden="true"> {/* Using span to avoid nested <a> if parent is already Link */}
                      Ver <ExternalLink size={14} className="ml-1.5" />
                    </span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteDealsList;
