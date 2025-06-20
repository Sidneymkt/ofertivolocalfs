
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { FeaturedMerchant } from '@/types';
import { Building } from 'lucide-react';

interface FeaturedMerchantCardProps {
  merchant: FeaturedMerchant;
}

const FeaturedMerchantCard: React.FC<FeaturedMerchantCardProps> = ({ merchant }) => {
  return (
    <Link href={`/merchant/${merchant.id}`} className="block group w-28 sm:w-32 shrink-0"> {/* Decreased width from w-36 */}
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 ease-in-out h-full flex flex-col">
        <div className="relative w-full aspect-square">
          <Image
            src={merchant.logoUrl}
            alt={`Logo de ${merchant.name}`}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={merchant['data-ai-hint']}
          />
        </div>
        <CardContent className="p-2 sm:p-3 flex-grow flex flex-col justify-between"> {/* Adjusted padding */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight"> {/* Adjusted text size */}
              {merchant.name}
            </h3>
            {merchant.category && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{merchant.category}</p>
            )}
          </div>
          {/* <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-1 self-start">
            Ver Loja
          </Button> */}
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedMerchantCard;
