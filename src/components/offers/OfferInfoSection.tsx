'use client';

import React, { useState } from 'react';
import type { Offer, OfferTypeId } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Clock, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Info, Package, CheckCheck, LocateFixed, UserCheck, QrCode, Smartphone, Zap } from 'lucide-react';
import { offerTypes } from '@/types'; // Import offerTypes to get details
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

interface OfferInfoSectionProps {
  offer: Offer;
}

const getOfferTypeDetails = (typeId: OfferTypeId) => {
  return offerTypes.find(ot => ot.id === typeId);
};

const OfferInfoSection: React.FC<OfferInfoSectionProps> = ({ offer }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionWords = offer.fullDescription?.split(' ').length || offer.description.split(' ').length || 0;
  const displayDescription = offer.fullDescription || offer.description;
  const shortDescription = displayDescription.split(' ').slice(0, 30).join(' ') + (descriptionWords > 30 ? '...' : '');
  
  const getJsDate = (dateInput: Date | Timestamp | undefined): Date | null => {
      if (!dateInput) return null;
      if (dateInput instanceof Timestamp) return dateInput.toDate();
      // It might already be a Date object from a previous conversion
      if (dateInput instanceof Date) return dateInput; 
      // Fallback for string dates (less ideal)
      const parsedDate = new Date(dateInput as any);
      return !isNaN(parsedDate.getTime()) ? parsedDate : null;
  };

  const startDate = getJsDate(offer.validityStartDate);
  const endDate = getJsDate(offer.validityEndDate);

  const validityStartDisplay = startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : 'N/A';
  const validityEndDisplay = endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : 'N/A';
  const validityDisplay = `Válido de ${validityStartDisplay} a ${validityEndDisplay}`;
  
  const offerTypeDetail = getOfferTypeDetails(offer.offerType);

  const isExpiringSoon = offer.timeRemaining?.toLowerCase().includes('restante') || offer.timeRemaining?.toLowerCase().includes('encerra hoje');

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-2xl md:text-3xl font-headline">{offer.title}</CardTitle>
            {offer.merchantIsVerified && (
                <Badge variant="secondary" className="ml-2 shrink-0 bg-green-100 text-green-700 border-green-300 flex items-center gap-1 py-1 px-2">
                    <ShieldCheck size={14} /> Verificado
                </Badge>
            )}
        </div>
        <CardDescription className="text-base">{offer.merchantName}</CardDescription>
        {offerTypeDetail && (
          <div className="flex items-center gap-2 mt-1">
            {React.createElement(offerTypeDetail.icon, { className: "w-5 h-5 text-primary"})}
            <span className="text-sm font-medium text-primary">{offerTypeDetail.name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isExpiringSoon && (
          <Badge variant="destructive" className="flex items-center gap-1.5 w-fit">
            <AlertTriangle size={14} /> OFERTA PRESTES A EXPIRAR! {offer.timeRemaining}
          </Badge>
        )}

        <div className="flex flex-wrap gap-2">
          {offer.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-sm">
              <Tag size={12} className="mr-1 opacity-70" /> {tag.startsWith('#') ? tag.substring(1) : tag}
            </Badge>
          ))}
          <Badge variant="outline" className="text-sm bg-muted/50">
             <Info size={12} className="mr-1 opacity-70"/> {offer.category}
          </Badge>
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
           {offer.originalPrice && offer.discountedPrice < offer.originalPrice && (
            <Badge variant="destructive" className="ml-2 text-sm">
                {(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100).toFixed(0)}% OFF
            </Badge>
        )}
        </div>

        <div className="text-sm text-muted-foreground flex items-center">
          <Clock size={16} className="mr-2" />
          <span>{validityDisplay} {offer.timeRemaining && `(${offer.timeRemaining})`}</span>
        </div>
        
        {displayDescription && (
          <div className="space-y-2 pt-2">
            <h3 className="font-semibold text-md">Descrição Completa</h3>
            <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
              {isDescriptionExpanded ? displayDescription : shortDescription}
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

        {offer.terms && (
           <div className="space-y-2 pt-2 border-t">
            <h3 className="font-semibold text-md">Termos e Condições</h3>
            <p className="text-muted-foreground text-xs whitespace-pre-line leading-relaxed">{offer.terms}</p>
          </div>
        )}

        {/* Displaying specific offer type details */}
        {offer.offerType === 'combo' && (offer.comboItem1 || offer.comboItem2 || offer.comboItem3) && (
            <div className="space-y-2 pt-2 border-t">
                <h3 className="font-semibold text-md flex items-center gap-2"><Package size={18} className="text-primary"/> Itens do Combo</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground pl-4 space-y-1">
                    {offer.comboItem1 && <li>{offer.comboItem1}</li>}
                    {offer.comboItem2 && <li>{offer.comboItem2}</li>}
                    {offer.comboItem3 && <li>{offer.comboItem3}</li>}
                </ul>
            </div>
        )}
        {offer.offerType === 'checkin_premiado' && offer.minCheckins && offer.checkinReward && (
             <div className="space-y-2 pt-2 border-t">
                <h3 className="font-semibold text-md flex items-center gap-2"><CheckCheck size={18} className="text-primary"/> Check-in Premiado</h3>
                <p className="text-sm text-muted-foreground">Realize <span className="font-bold">{offer.minCheckins} check-ins</span> para ganhar: <span className="font-bold">{offer.checkinReward}</span>.</p>
            </div>
        )}
         {offer.offerType === 'bairro' && offer.targetNeighborhood && (
             <div className="space-y-2 pt-2 border-t">
                <h3 className="font-semibold text-md flex items-center gap-2"><LocateFixed size={18} className="text-primary"/> Oferta Direcionada</h3>
                <p className="text-sm text-muted-foreground">Esta oferta é especial para o bairro: <span className="font-bold">{offer.targetNeighborhood}</span>.</p>
            </div>
        )}
         {offer.offerType === 'primeiro_uso' && offer.isForNewUsersOnly && (
             <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-md text-sm flex items-center gap-2 text-purple-700">
                <UserCheck size={18}/>
                <p className="font-medium">Oferta especial para novos usuários do Ofertivo neste estabelecimento!</p>
            </div>
        )}

      </CardContent>
    </Card>
  );
};

export default OfferInfoSection;