
'use client';

import React, { useState } from 'react';
import type { Offer } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Clock, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface OfferInfoSectionProps {
  offer: Offer;
}

const OfferInfoSection: React.FC<OfferInfoSectionProps> = ({ offer }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionWords = offer.fullDescription?.split(' ').length || 0;
  const shortDescription = offer.fullDescription?.split(' ').slice(0, 30).join(' ') + (descriptionWords > 30 ? '...' : '');
  
  // Example: if validUntil is a date string like "DD/MM/YYYY" or a Date object
  let validityDisplay = offer.validUntil instanceof Date ? 
    `Válido até ${offer.validUntil.toLocaleDateString('pt-BR')}` : 
    offer.validUntil || 'Validade não especificada';
  
  // Simple check for "expiring soon"
  const isExpiringSoon = offer.timeRemaining?.toLowerCase().includes('restante') || offer.timeRemaining?.toLowerCase().includes('encerra hoje');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl md:text-3xl font-headline">{offer.title}</CardTitle>
            {offer.merchantIsVerified && (
                <Badge variant="secondary" className="ml-2 shrink-0 bg-green-100 text-green-700 border-green-300">
                    <ShieldCheck size={14} className="mr-1" /> Verificado
                </Badge>
            )}
        </div>
        <CardDescription className="text-base">{offer.merchantName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isExpiringSoon && (
          <Badge variant="destructive" className="flex items-center gap-1.5 w-fit">
            <AlertTriangle size={14} /> OFERTA PRESTES A EXPIRAR!
          </Badge>
        )}

        <div className="flex flex-wrap gap-2">
          {offer.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-sm">
              <Tag size={12} className="mr-1 opacity-70" /> {tag}
            </Badge>
          ))}
        </div>

        <div>
          <p className="text-3xl font-semibold text-primary">
            R${offer.discountedPrice.toFixed(2)}
          </p>
          {offer.originalPrice && (
            <p className="text-lg text-muted-foreground line-through">
              R${offer.originalPrice.toFixed(2)}
            </p>
          )}
        </div>

        <div className="text-sm text-muted-foreground flex items-center">
          <Clock size={16} className="mr-2" />
          <span>{validityDisplay} {offer.timeRemaining && `(${offer.timeRemaining})`}</span>
        </div>
        
        {offer.fullDescription && (
          <div className="space-y-2 pt-2">
            <h3 className="font-semibold text-md">Descrição Completa</h3>
            <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
              {isDescriptionExpanded ? offer.fullDescription : shortDescription}
            </p>
            {descriptionWords > 30 && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {isDescriptionExpanded ? 'Ler menos' : 'Ler mais'}
                {isDescriptionExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OfferInfoSection;
