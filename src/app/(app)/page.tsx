
import OfferList from '@/components/offers/OfferList';
import { mockOffers, categories, mockFeaturedMerchants } from '@/types'; // Using mock data
import FeaturedOfferCard from '@/components/offers/FeaturedOfferCard';
import CategoryPills from '@/components/offers/CategoryPills';
import FeaturedMerchantsList from '@/components/merchants/FeaturedMerchantsList'; // New import

export default function FeedPage() {
  const featuredOffer = mockOffers.find(offer => offer.id === 'offer-pizza-1') || mockOffers[0];
  
  // Sort offers by createdAt date to get recent ones, newest first
  const sortedOffers = [...mockOffers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentOffers = sortedOffers.slice(0, 4); // Take the first 4 recent offers

  // Filter out the featured offer and recent offers from the "recommended" list to avoid duplication
  const recommendedOffers = mockOffers.filter(
    offer => offer.id !== featuredOffer.id && !recentOffers.some(ro => ro.id === offer.id)
  ).slice(0, 6); // Limit recommended to 6 for example

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      {featuredOffer && <FeaturedOfferCard offer={featuredOffer} />}
      
      <CategoryPills categories={categories} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Comerciantes em Destaque</h2>
        <FeaturedMerchantsList merchants={mockFeaturedMerchants} />
      </section>

      {recentOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Ofertas Recentes</h2>
          <OfferList offers={recentOffers} />
        </section>
      )}

      {recommendedOffers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold font-headline px-4 md:px-0">Recomendadas para Você</h2>
          <OfferList offers={recommendedOffers} />
        </section>
      )}
    </div>
  );
}
