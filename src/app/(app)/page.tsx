import OfferList from '@/components/offers/OfferList';
import { mockOffers, categories } from '@/types'; // Using mock data
import FeaturedOfferCard from '@/components/offers/FeaturedOfferCard';
import CategoryPills from '@/components/offers/CategoryPills';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FeedPage() {
  const featuredOffer = mockOffers.find(offer => offer.id === 'offer-pizza-1') || mockOffers[0];
  const otherOffers = mockOffers.filter(offer => offer.id !== featuredOffer.id);

  return (
    <div className="space-y-4 md:space-y-6 pb-4">
      {featuredOffer && <FeaturedOfferCard offer={featuredOffer} />}
      
      <CategoryPills categories={categories} />

      <div>
        <h2 className="text-xl font-semibold font-headline px-4 md:px-0 mb-3">Mais Ofertas</h2>
        <OfferList offers={otherOffers} />
      </div>
    </div>
  );
}
