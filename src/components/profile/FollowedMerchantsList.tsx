
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink, ShieldCheck, ShieldOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface FollowedMerchantDisplayItem {
  id: string;
  name: string;
  imageUrl?: string;
  'data-ai-hint'?: string;
  isVerified?: boolean;
}

interface FollowedMerchantsListProps {
  merchants: FollowedMerchantDisplayItem[];
}

const FollowedMerchantsList: React.FC<FollowedMerchantsListProps> = ({ merchants }) => {
  return (
    <div> {/* No Card wrapper here, meant to be used inside TabsContent */}
      {merchants.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">Você ainda não está seguindo nenhum negócio.</p>
      ) : (
        <ul className="space-y-4">
          {merchants.map((merchant) => (
            <li key={merchant.id} className="flex items-center gap-4 p-3 bg-muted/30 hover:bg-muted/60 rounded-lg transition-colors">
              <Image 
                src={merchant.imageUrl || `https://placehold.co/64x64.png?text=${merchant.name.substring(0,1)}`} 
                alt={merchant.name} 
                width={48} 
                height={48} 
                className="rounded-md object-cover w-12 h-12"
                data-ai-hint={merchant['data-ai-hint'] || "store logo"}
              />
              <div className="flex-grow">
                <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-card-foreground leading-tight">{merchant.name}</h4>
                    {merchant.isVerified ? (
                        <ShieldCheck size={14} className="text-secondary" title="Verificado"/>
                    ) : (
                        <ShieldOff size={14} className="text-muted-foreground opacity-70" title="Não verificado"/>
                    )}
                </div>
                {/* Placeholder for merchant category or last offer */}
                <p className="text-xs text-muted-foreground">Ver ofertas e novidades</p> 
              </div>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 ml-auto shrink-0">
                {/* In a real app, this would link to the merchant's profile page */}
                <Link href={`/merchant/${merchant.id}`}> 
                  Visitar <ExternalLink size={14} className="ml-1.5" />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowedMerchantsList;

    