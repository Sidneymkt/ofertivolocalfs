
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Gift, Users, BarChartHorizontalBig } from 'lucide-react'; // Removed ShoppingBag
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const QuickActionsCard: React.FC = () => {
  const { toast } = useToast();

  // Placeholder for actions that don't have a page yet but might trigger a modal or specific logic
  const handleGenericActionClick = (actionName: string) => {
    toast({
      title: `Ação: ${actionName}`,
      description: "Funcionalidade em breve.",
    });
  };

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChartHorizontalBig className="h-6 w-6 text-primary" />
          Ações Rápidas
        </CardTitle>
        <CardDescription>Atalhos para as funcionalidades mais usadas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          asChild
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Link href="/dashboard/advertiser/create-offer">
            <PlusCircle className="mr-2 h-5 w-5" /> Criar Nova Oferta
          </Link>
        </Button>
        <Button 
          asChild
          variant="secondary" 
          className="w-full"
        >
          <Link href="/dashboard/advertiser/create-sweepstake">
            <Gift className="mr-2 h-5 w-5" /> Criar Sorteio
          </Link>
        </Button>
        {/* O botão "Gerenciar Ofertas" foi removido conforme solicitado */}
        <Button 
          asChild
          variant="outline" 
          className="w-full"
        >
          <Link href="/dashboard/advertiser/leads">
            <Users className="mr-2 h-5 w-5" /> Ver CRM de Leads
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
