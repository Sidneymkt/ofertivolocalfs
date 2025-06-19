import InteractiveMapPlaceholder from '@/components/map/InteractiveMapPlaceholder';
import OfferList from '@/components/offers/OfferList';
import { mockOffers } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import OfferCard from '@/components/offers/OfferCard';


export default function MapPage() {
  const nearbyOffers = mockOffers.slice(0, 2); // Show a couple of offers as "nearby"

  return (
    <div className="space-y-6">
      <InteractiveMapPlaceholder />
      
      <div className="mt-8">
        <h3 className="text-xl font-headline font-semibold mb-3">Ofertas Próximas de Você</h3>
        {nearbyOffers.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nearbyOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhuma oferta encontrada nas proximidades.</p>
        )}
      </div>
    </div>
  );
}
