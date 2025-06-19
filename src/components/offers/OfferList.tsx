import type { Offer } from '@/types';
import OfferCard from './OfferCard';

interface OfferListProps {
  offers: Offer[];
}

const OfferList: React.FC<OfferListProps> = ({ offers }) => {
  if (offers.length === 0) {
    return <p className="text-center text-muted-foreground py-10">Nenhuma oferta encontrada.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
};

export default OfferList;
