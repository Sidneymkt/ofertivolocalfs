
'use client';

import React, { useState, useEffect }  from 'react';
import type { Offer } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Users, TrendingUp, KeyRound, QrCode as QrCodeIconLucide } from 'lucide-react'; // Changed QrCode to QrCodeIconLucide
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import dynamic from 'next/dynamic';

const DynamicClientQRCode = dynamic(() => import('@/components/common/ClientQRCode'), {
  ssr: false,
  loading: () => <p className="text-sm text-muted-foreground p-4 text-center">Carregando QR Code...</p>,
});


interface OfferValidationSectionProps {
  offer: Offer;
}

const OfferValidationSection: React.FC<OfferValidationSectionProps> = ({ offer }) => {
  const { toast } = useToast();
  const [numericCode, setNumericCode] = useState<string | null>(null);

  const handleSimulateCheckIn = () => {
    toast({
      title: "Check-in Simulado!",
      description: `Você ganhou +${offer.pointsAwarded || 0} pontos por validar a oferta "${offer.title}".`,
      duration: 5000,
    });
  };

  const handleGenerateNumericCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setNumericCode(code);
    toast({
      title: "Código Numérico Gerado!",
      description: "Use este código para validação manual no estabelecimento.",
    });
  };

  const qrCodeValue = `https://ofertivo.app/validate?offerId=${offer.id}`;

  return (
    <Card className="shadow-lg" id="qr-code-section">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <QrCodeIconLucide className="mr-2 text-primary" /> Valide sua Oferta
        </CardTitle>
        <CardDescription>
          Apresente o QR Code ou o código numérico no estabelecimento para validar e ganhar pontos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-white rounded-lg border shadow-md min-h-[204px] min-w-[204px] flex items-center justify-center">
            <DynamicClientQRCode value={qrCodeValue} size={180} />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Mostre este QR Code {numericCode ? 'ou informe o código abaixo ' : ''}
            ao atendente para aplicar o desconto e ganhar <span className="font-bold text-primary">{offer.pointsAwarded || 0} pontos</span>.
          </p>

          {numericCode && (
            <div className="text-center p-4 bg-muted/50 rounded-md w-full max-w-xs">
              <p className="text-sm text-muted-foreground">Código para validação manual:</p>
              <p className="text-4xl font-bold tracking-widest text-primary">{numericCode}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
            <Button onClick={handleSimulateCheckIn} variant="outline" size="sm" className="flex-grow">
              Simular Check-in
            </Button>
            <Button onClick={handleGenerateNumericCode} variant="secondary" size="sm" className="flex-grow">
              <KeyRound size={16} className="mr-2" />
              {numericCode ? 'Gerar Novo Código' : 'Gerar Código Numérico'}
            </Button>
          </div>
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

        <div className="text-center text-sm text-muted-foreground p-3 border rounded-md bg-background">
          <TrendingUp size={20} className="mx-auto mb-1 text-accent" />
          <p>Seu progresso no ranking e XP serão atualizados após o check-in!</p>
          <a href="/rewards" className="text-primary hover:underline text-xs font-medium">Ver sua Carteira de Pontos e Ranking</a>
        </div>

      </CardContent>
    </Card>
  );
};

export default OfferValidationSection;
