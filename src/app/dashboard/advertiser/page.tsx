
'use client';

import React from 'react';
import AdvertiserMetricsGrid from '@/components/dashboard/advertiser/AdvertiserMetricsGrid';
import PerformanceChartPlaceholder from '@/components/dashboard/advertiser/PerformanceChartPlaceholder';
import QuickActionsCard from '@/components/dashboard/advertiser/QuickActionsCard';
import PublishedOffersSection from '@/components/dashboard/advertiser/PublishedOffersSection';
import GenericDashboardSection from '@/components/dashboard/advertiser/GenericDashboardSection';
import AdvertiserProfileSettingsCard from '@/components/dashboard/advertiser/AdvertiserProfileSettingsCard';
import { mockAdvertiserUser, type AdvertiserMetricItem, type PublishedOfferSummary } from '@/types'; 
import { BarChart2, Eye, MousePointerClick, CheckCircle, Users, Coins, TrendingUp, ShoppingBag, Settings, Bell, Gift, ListFilter, FileText, DollarSign, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const advertiserName = mockAdvertiserUser.businessName || "Meu Negócio"; 

const advertiserPlan = {
  name: "Plano Pro",
  monthlyPointsLimit: 1000,
  pointsDistributedThisMonth: 650, 
};

const pointsUsagePercentage = (advertiserPlan.pointsDistributedThisMonth / advertiserPlan.monthlyPointsLimit) * 100;


const metrics: AdvertiserMetricItem[] = [
  { title: 'Visualizações do Perfil', value: '1.2K', icon: Eye, trend: '+15%' },
  { title: 'Cliques em Ofertas', value: '850', icon: MousePointerClick, trend: '+8%' },
  { title: 'Check-ins Validados', value: '120', icon: CheckCircle, trend: '+5%' },
  { title: 'Seguidores', value: '350', icon: Users, trend: '+20' },
  { title: 'Pontos Distribuídos (Mês)', value: `${advertiserPlan.pointsDistributedThisMonth} / ${advertiserPlan.monthlyPointsLimit}`, icon: Coins, description: `Plano: ${advertiserPlan.name}` },
  { title: 'ROI Estimado (Mês)', value: 'R$ 1.500', icon: TrendingUp, trend: '+10%' },
];

const publishedOffers: PublishedOfferSummary[] = [
  { 
    id: 'offer-pizza-1', 
    title: '50% Off Pizza Gigante + Refri Grátis HOJE!', 
    status: 'active', 
    views: 1200, clicks: 300, 
    isFeatured: true, 
    dataAiHint: 'pizza food', 
    imageUrl: 'https://placehold.co/64x64.png?text=PZ',
    visibility: 'destaque',
    discountedPrice: 35.00,
    originalPrice: 70.00,
    category: 'Alimentação',
    usersUsedCount: 138,
  },
  { 
    id: 'offer-barber-2', 
    title: 'Corte Masculino + Barba Modelada', 
    status: 'active', 
    views: 800, clicks: 150, 
    isFeatured: false, 
    dataAiHint: 'barber shop',
    imageUrl: 'https://placehold.co/64x64.png?text=BB',
    visibility: 'normal',
    discountedPrice: 45.00,
    originalPrice: 70.00,
    category: 'Serviços',
    usersUsedCount: 72,
  },
  { 
    id: 'new-offer-pending', 
    title: 'Nova Super Oferta de Teste (Pendente)', 
    status: 'pending', 
    views: 0, clicks: 0, 
    isFeatured: false, 
    dataAiHint: 'generic offer',
    imageUrl: 'https://placehold.co/64x64.png?text=NO',
    visibility: 'normal',
    discountedPrice: 19.99,
    category: 'Outros',
  },
    { 
    id: 'expired-offer-sample', 
    title: 'Oferta Expirada Exemplo', 
    status: 'expired', 
    views: 500, clicks: 50, 
    isFeatured: false, 
    dataAiHint: 'old paper',
    imageUrl: 'https://placehold.co/64x64.png?text=EX',
    visibility: 'normal',
    discountedPrice: 10.00,
    category: 'Diversos',
  },
];

export default function AdvertiserDashboardPage() {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">
          Olá, {advertiserName}!
        </h1>
        <p className="text-muted-foreground">Bem-vindo(a) ao seu painel de controle Ofertivo.</p>
      </header>

      <AdvertiserMetricsGrid metrics={metrics} />

      <GenericDashboardSection 
        title="Uso de Pontos do Plano Mensal" 
        icon={Coins}
        description={`Você distribuiu ${advertiserPlan.pointsDistributedThisMonth} de ${advertiserPlan.monthlyPointsLimit} pontos este mês.`}
      >
        <Progress value={pointsUsagePercentage} className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-blue-400" />
        {pointsUsagePercentage > 85 && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="text-destructive h-5 w-5"/>
                <p className="text-destructive font-medium">Atenção: Seu limite de pontos do plano está prestes a acabar! Considere um upgrade para continuar recompensando seus clientes.</p>
            </div>
        )}
        <p className="text-xs text-muted-foreground mt-2 text-right">
            {advertiserPlan.monthlyPointsLimit - advertiserPlan.pointsDistributedThisMonth} pontos restantes.
        </p>
      </GenericDashboardSection>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChartPlaceholder />
        </div>
        <div>
          <QuickActionsCard />
        </div>
      </div>
      
      <PublishedOffersSection offers={publishedOffers} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenericDashboardSection title="CRM de Leads e Engajamento" icon={ListFilter} description="Acompanhe usuários que interagiram e ranking de seguidores.">
          <p className="text-muted-foreground text-center py-10">Funcionalidade de CRM de Leads e ranking em breve.</p>
        </GenericDashboardSection>
        <GenericDashboardSection title="CRM Financeiro e Planos" icon={DollarSign} description="Gerencie seu plano, créditos, pagamentos e ROI.">
           <p className="text-muted-foreground text-center py-10">Funcionalidade de CRM Financeiro em breve.</p>
        </GenericDashboardSection>
      </div>

      <GenericDashboardSection title="Sorteios" icon={Gift} description="Crie e gerencie sorteios para engajar seus clientes.">
         <p className="text-muted-foreground text-center py-10">Gerenciador de Sorteios em breve.</p>
      </GenericDashboardSection>

      <AdvertiserProfileSettingsCard advertiserUser={mockAdvertiserUser} />

       <GenericDashboardSection title="Notificações" icon={Bell} description="Fique por dentro das novidades e alertas.">
        <p className="text-muted-foreground text-center py-10">Central de notificações em breve.</p>
      </GenericDashboardSection>

      <GenericDashboardSection title="Dicas Inteligentes" icon={TrendingUp} description="Sugestões para otimizar suas ofertas e distribuição de pontos.">
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground p-4">
          <li>Experimente criar uma oferta "compre 1 leve 2" para atrair mais clientes.</li>
          <li>Adicione fotos de alta qualidade para aumentar o apelo visual das suas ofertas.</li>
          <li>Responda aos comentários dos usuários para construir um bom relacionamento.</li>
          <li>Considere aumentar o número de pontos para check-ins em ofertas de menor movimento para incentivar o uso.</li>
        </ul>
      </GenericDashboardSection>

    </div>
  );
}
