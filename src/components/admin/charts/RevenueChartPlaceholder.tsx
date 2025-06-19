
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, DollarSign } from 'lucide-react';
import Image from 'next/image';

const RevenueChartPlaceholder: React.FC = () => {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Receita por Planos
        </CardTitle>
        <CardDescription>Comparativo de receita gerada pelos planos Essencial, Pro e Premium.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] md:h-[400px] flex items-center justify-center bg-muted/30 rounded-md border border-dashed">
        <div className="text-center">
          <Image 
            src="https://placehold.co/600x350.png?text=Gráfico+de+Receita" 
            alt="Placeholder de Gráfico de Receita" 
            width={500}
            height={290}
            className="opacity-60 mx-auto rounded"
            data-ai-hint="bar chart graph"
          />
          <p className="mt-4 text-sm text-muted-foreground">Gráfico de receita detalhado em breve.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChartPlaceholder;
