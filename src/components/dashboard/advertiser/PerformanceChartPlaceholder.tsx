
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, LineChart } from 'lucide-react';
import Image from 'next/image';

const PerformanceChartPlaceholder: React.FC = () => {
  return (
    <Card className="shadow-lg col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-6 w-6 text-primary" />
          Desempenho das Ofertas
        </CardTitle>
        <CardDescription>Visualizações, cliques e check-ins ao longo do tempo.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] md:h-[350px] flex items-center justify-center bg-muted/30 rounded-md border border-dashed">
        {/* Replace with actual chart component when ready */}
        <div className="text-center">
          <Image 
            src="https://placehold.co/600x300.png?text=Gráfico+de+Desempenho" 
            alt="Placeholder de Gráfico de Desempenho" 
            width={400}
            height={200}
            className="opacity-50 mx-auto"
            data-ai-hint="line chart graph"
          />
          <p className="mt-4 text-sm text-muted-foreground">Gráfico de desempenho em breve.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChartPlaceholder;
