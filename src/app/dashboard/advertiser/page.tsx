
'use client';

import React from 'react';
import AdvertiserMetricsGrid, { type AdvertiserMetricItem } from '@/components/dashboard/advertiser/AdvertiserMetricsGrid';
import PerformanceChartPlaceholder from '@/components/dashboard/advertiser/PerformanceChartPlaceholder';
import QuickActionsCard from '@/components/dashboard/advertiser/QuickActionsCard';
import PublishedOffersSection, { type PublishedOfferSummary } from '@/components/dashboard/advertiser/PublishedOffersSection';
import GenericDashboardSection from '@/components/dashboard/advertiser/GenericDashboardSection';
import { mockAdvertiserUser } from '@/types'; // Assuming business name is part of user or a separate profile
import { BarChart2, Eye, MousePointerClick, CheckCircle, Users, Coins, TrendingUp, ShoppingBag, Settings, Bell, Gift, ListFilter, FileText, DollarSign } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const advertiserName = mockAdvertiserUser.businessName || "Meu Negócio"; // Fallback if businessName is not in mockUser

const metrics: AdvertiserMetricItem[] = [
  { title: 'Visualizações do Perfil', value: '1.2K', icon: Eye, trend: '+15%' },
  { title: 'Cliques em Ofertas', value: '850', icon: MousePointerClick, trend: '+8%' },
  { title: 'Check-ins Validados', value: '120', icon: CheckCircle, trend: '+5%' },
  { title: 'Seguidores', value: '350', icon: Users, trend: '+20' },
  { title: 'Pontos Distribuídos', value: '25K', icon: Coins, trend: '' },
  { title: 'ROI Estimado (Mês)', value: 'R$ 1.500', icon: TrendingUp, trend: '+10%' },
];

const publishedOffers: PublishedOfferSummary[] = [
  { id: 'offer1', title: '50% Off Pizza Gigante', status: 'active', views: 1200, clicks: 300, isFeatured: true, dataAiHint: 'pizza food' },
  { id: 'offer2', title: 'Corte de Cabelo + Barba', status: 'expired', views: 800, clicks: 150, isFeatured: false, dataAiHint: 'barber shop' },
  { id: 'offer3', title: 'Happy Hour Chopp Dobrado', status: 'pending', views: 0, clicks: 0, isFeatured: false, dataAiHint: 'beer glass' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChartPlaceholder />
        </div>
        <div>
          <QuickActionsCard />
        </div>
      </div>
      
      <PublishedOffersSection offers={publishedOffers} />

      <GenericDashboardSection title="Formulário de Nova Oferta" icon={ShoppingBag} description="Crie e configure suas próximas promoções aqui.">
        <p className="text-muted-foreground text-center py-10">Formulário de criação de oferta em breve.</p>
      </GenericDashboardSection>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenericDashboardSection title="CRM de Leads" icon={ListFilter} description="Acompanhe usuários que interagiram com suas ofertas.">
          <p className="text-muted-foreground text-center py-10">Funcionalidade de CRM de Leads em breve.</p>
        </GenericDashboardSection>
        <GenericDashboardSection title="CRM Financeiro" icon={DollarSign} description="Gerencie seu plano, créditos e pagamentos.">
           <p className="text-muted-foreground text-center py-10">Funcionalidade de CRM Financeiro em breve.</p>
        </GenericDashboardSection>
      </div>

      <GenericDashboardSection title="Sorteios" icon={Gift} description="Crie e gerencie sorteios para engajar seus clientes.">
         <p className="text-muted-foreground text-center py-10">Gerenciador de Sorteios em breve.</p>
      </GenericDashboardSection>

      <GenericDashboardSection title="Configurações do Perfil" icon={Settings} description="Atualize as informações do seu negócio.">
        <p className="text-muted-foreground text-center py-10">Configurações do Perfil do Negócio em breve.</p>
      </GenericDashboardSection>

       <GenericDashboardSection title="Notificações" icon={Bell} description="Fique por dentro das novidades e alertas.">
        <p className="text-muted-foreground text-center py-10">Central de notificações em breve.</p>
      </GenericDashboardSection>

      <GenericDashboardSection title="Dicas Inteligentes" icon={TrendingUp} description="Sugestões para otimizar suas ofertas.">
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground p-4">
          <li>Experimente criar uma oferta "compre 1 leve 2" para atrair mais clientes.</li>
          <li>Adicione fotos de alta qualidade para aumentar o apelo visual das suas ofertas.</li>
          <li>Responda aos comentários dos usuários para construir um bom relacionamento.</li>
        </ul>
      </GenericDashboardSection>

    </div>
  );
}
