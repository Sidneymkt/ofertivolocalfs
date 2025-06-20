
'use client';

import type { FeaturedMerchant } from '@/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FeaturedMerchantCard from './FeaturedMerchantCard';

interface FeaturedMerchantsListProps {
  merchants: FeaturedMerchant[];
}

const FeaturedMerchantsList: React.FC<FeaturedMerchantsListProps> = ({ merchants }) => {
  if (merchants.length === 0) {
    return null; // Don't render the section if there are no merchants
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md px-4 md:px-0">
      <div className="flex space-x-4 pb-3">
        {merchants.map((merchant) => (
          <FeaturedMerchantCard key={merchant.id} merchant={merchant} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};

export default FeaturedMerchantsList;
