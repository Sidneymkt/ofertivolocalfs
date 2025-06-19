import OfferFilters from '@/components/offers/OfferFilters';
import OfferList from '@/components/offers/OfferList';
import { mockOffers } from '@/types'; // Using mock data

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-headline font-semibold mb-1">Ofertas Próximas</h2>
        <p className="text-muted-foreground">Descubra promoções incríveis perto de você!</p>
      </div>
      <OfferFilters />
      <OfferList offers={mockOffers} />
    </div>
  );
}
