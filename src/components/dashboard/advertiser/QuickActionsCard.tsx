
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Gift, ShoppingBag, Users, BarChartHorizontalBig } from 'lucide-react';

const QuickActionsCard: React.FC = () => {
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
        <Button className="w-full bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-5 w-5" /> Criar Nova Oferta
        </Button>
        <Button variant="secondary" className="w-full">
          <Gift className="mr-2 h-5 w-5" /> Criar Sorteio
        </Button>
        <Button variant="outline" className="w-full">
          <ShoppingBag className="mr-2 h-5 w-5" /> Gerenciar Ofertas
        </Button>
        <Button variant="outline" className="w-full">
          <Users className="mr-2 h-5 w-5" /> Ver CRM de Leads
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
