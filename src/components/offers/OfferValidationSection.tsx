
'use client';

import React from 'react';
import type { Offer } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Gift, Users, TrendingUp } from 'lucide-react';
import Image from 'next/image'; // For placeholder QR

interface OfferValidationSectionProps {
  offer: Offer;
}

const OfferValidationSection: React.FC<OfferValidationSectionProps> = ({ offer }) => {
  return (
    <Card className="shadow-lg" id="qr-code-section">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <QrCode className="mr-2 text-primary" /> Valide sua Oferta
        </CardTitle>
        <CardDescription>Apresente este QR Code no estabelecimento para validar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          {/* Placeholder for actual QR Code */}
          <div className="p-3 bg-white rounded-lg border shadow-md">
            <Image 
              src={`https://placehold.co/200x200.png?text=QR+CODE`} // Placeholder QR
              alt="QR Code da Oferta" 
              width={180} 
              height={180}
              data-ai-hint="qr code" 
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Mostre este código ao atendente para aplicar o desconto e ganhar seus pontos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center text-primary">
                        <Gift size={18} className="mr-2"/> Pontos por esta oferta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-primary">{offer.pointsAwarded || 0}</p>
                    <p className="text-xs text-muted-foreground">Serão adicionados à sua conta após o check-in.</p>
                </CardContent>
            </Card>
            <Card className="bg-muted/50">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center text-secondary">
                       <Users size={18} className="mr-2"/> Já aproveitaram
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-secondary">💥 {offer.usersUsedCount || 0}</p>
                     <p className="text-xs text-muted-foreground">Pessoas usaram esta oferta.</p>
                </CardContent>
            </Card>
        </div>
        
        {/* Placeholder for Gamification Progress/Ranking */}
        <div className="text-center text-sm text-muted-foreground p-3 border rounded-md">
          <TrendingUp size={20} className="mx-auto mb-1 text-accent" />
          <p>Seu progresso no ranking será atualizado após o check-in!</p>
          <a href="/rewards" className="text-primary hover:underline text-xs">Ver sua Carteira de Pontos</a>
        </div>

      </CardContent>
    </Card>
  );
};

export default OfferValidationSection;
