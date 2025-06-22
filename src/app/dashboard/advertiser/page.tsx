
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { auth } from '@/lib/firebase/firebaseConfig';
import { getUserProfile } from '@/lib/firebase/services/userService';
import { getOffersByMerchant } from '@/lib/firebase/services/offerService';
import type { User, Offer, AdvertiserMetricItem, PublishedOfferSummary } from '@/types';
import { ADVERTISER_PLAN_DETAILS } from '@/types';

import AdvertiserMetricsGrid from '@/components/dashboard/advertiser/AdvertiserMetricsGrid';
import OfferPerformanceChart from '@/components/dashboard/advertiser/OfferPerformanceChart';
import QuickActionsCard from '@/components/dashboard/advertiser/QuickActionsCard';
import PublishedOffersSection from '@/components/dashboard/advertiser/PublishedOffersSection';
import GenericDashboardSection from '@/components/dashboard/advertiser/GenericDashboardSection';
import AdvertiserProfileSettingsCard from '@/components/dashboard/advertiser/AdvertiserProfileSettingsCard';
import { Eye, MousePointerClick, CheckCircle, Users, Coins, TrendingUp, Settings, Bell, Gift, ListFilter, FileText, DollarSign, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { FirestoreConnectionError } from '@/components/common/FirestoreConnectionError';

export default function AdvertiserDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [advertiser, setAdvertiser] = useState<User | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setLoading(true);
        setError(null);
        try {
          const userProfile = await getUserProfile(userAuth.uid);
          if (userProfile && userProfile.isAdvertiser) {
            setAdvertiser(userProfile);
            const merchantOffers = await getOffersByMerchant(userAuth.uid);
            setOffers(merchantOffers);
          } else {
            toast({ title: "Acesso Negado", description: "Você precisa ser um anunciante para acessar esta página.", variant: "destructive" });
            router.push('/');
          }
        } catch (err: any) {
          console.error("Error fetching advertiser dashboard data:", err);
          if (err.message.includes("offline") || err.message.includes("Failed to get document")) {
            setError("Não foi possível conectar ao banco de dados para carregar seu painel.");
          } else {
            setError(err.message || "Não foi possível buscar seus dados do painel.");
          }
          toast({ title: "Erro ao Carregar Painel", description: "Não foi possível buscar seus dados.", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router, toast]);

  const metrics = useMemo<AdvertiserMetricItem[]>(() => {
    if (!advertiser || !offers) return [];

    const checkInsValidated = offers.reduce((sum, offer) => sum + (offer.usersUsedCount || 0), 0);
    const clicksInOffers = offers.reduce((sum, offer) => sum + (offer.reviews || 0) * 3, 0); // Mocking clicks
    const totalPointsDistributed = offers.reduce((sum, offer) => {
      const uses = offer.usersUsedCount || 0;
      const pointsPerUse = (offer.pointsForCheckin || 0) + (offer.pointsForRating || 0) + (offer.pointsForShare || 0);
      return sum + (uses * pointsPerUse);
    }, 0);

    const currentPlan = advertiser.advertiserPlan || 'trial';
    const planDetails = ADVERTISER_PLAN_DETAILS[currentPlan];
    
    // Placeholder logic for ROI, should be replaced with real calculation
    const estimatedROI = checkInsValidated * (offers[0]?.discountedPrice || 20) * 0.2; 

    return [
      { title: 'Visualizações do Perfil', value: '1.2K', icon: Eye, trend: '+15%' }, // Placeholder
      { title: 'Cliques em Ofertas', value: clicksInOffers, icon: MousePointerClick, trend: '+8%' }, // Semi-real
      { title: 'Check-ins Validados', value: checkInsValidated, icon: CheckCircle, trend: '+5%' }, // Real
      { title: 'Seguidores', value: advertiser.followedMerchants?.length || '350', icon: Users, trend: '+20' }, // Placeholder
      { title: 'Pontos Distribuídos (Mês)', value: `${totalPointsDistributed} / 1000`, icon: Coins, description: `Plano: ${planDetails.name}` }, // Semi-real
      { title: 'ROI Estimado (Mês)', value: `R$ ${estimatedROI.toFixed(2)}`, icon: TrendingUp, trend: '+10%' }, // Placeholder
    ];
  }, [advertiser, offers]);

  if (error) {
    return <FirestoreConnectionError message={error} />;
  }

  if (loading || !advertiser) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const advertiserName = advertiser.businessName || "Meu Negócio";
  const currentPlan = advertiser.advertiserPlan || 'trial';
  const currentPlanDetails = ADVERTISER_PLAN_DETAILS[currentPlan];

  const publishedOffers: PublishedOfferSummary[] = offers.map(offer => ({
    id: offer.id!,
    title: offer.title,
    status: offer.status,
    imageUrl: offer.imageUrl,
    'data-ai-hint': offer['data-ai-hint'],
    visibility: offer.visibility,
    discountedPrice: offer.discountedPrice,
    originalPrice: offer.originalPrice,
    usersUsedCount: offer.usersUsedCount,
    category: offer.category,
  }));
  
  const pointsUsagePercentage = (650 / 1000) * 100; // Placeholder

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">
          Olá, {advertiserName}!
        </h1>
        <p className="text-muted-foreground">Bem-vindo(a) ao seu painel de controle Ofertivo.</p>
      </header>

      <AdvertiserMetricsGrid metrics={metrics} />

      {currentPlanDetails && (
        <GenericDashboardSection
          title="Economia e Valor dos Pontos"
          icon={DollarSign}
          description={`Informações sobre o valor dos pontos no seu plano atual: ${currentPlanDetails.name}.`}
        >
          <div className="text-center p-4 bg-muted/50 rounded-md border">
            <p className="text-lg">No seu plano <span className="font-semibold text-primary">{currentPlanDetails.name}</span>:</p>
            <p className="text-3xl font-bold text-primary mt-1">
              1 Ponto = R$ {currentPlanDetails.pointValueInBRL.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Este é o valor de "custo" estimado por ponto que você distribui para os usuários.
            </p>
          </div>
        </GenericDashboardSection>
      )}

      <GenericDashboardSection 
        title="Uso de Pontos do Plano Mensal" 
        icon={Coins}
        description={`Você distribuiu 650 de 1000 pontos este mês.`}
      >
        <Progress value={pointsUsagePercentage} className="h-4 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-blue-400" />
        {pointsUsagePercentage > 85 && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="text-destructive h-5 w-5"/>
                <p className="text-destructive font-medium">Atenção: Seu limite de pontos do plano está prestes a acabar! Considere um upgrade para continuar recompensando seus clientes.</p>
            </div>
        )}
        <p className="text-xs text-muted-foreground mt-2 text-right">
            350 pontos restantes.
        </p>
      </GenericDashboardSection>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OfferPerformanceChart />
        </div>
        <div>
          <QuickActionsCard />
        </div>
      </div>
      
      <PublishedOffersSection offers={publishedOffers} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GenericDashboardSection title="CRM de Leads e Engajamento" icon={ListFilter} description="Acompanhe usuários que interagiram e ranking de seguidores.">
          <Button asChild variant="outline" className="w-full mt-4">
            <Link href="/dashboard/advertiser/leads">
              Gerenciar Leads e Contatos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </GenericDashboardSection>
        <GenericDashboardSection title="CRM Financeiro e Planos" icon={DollarSign} description="Gerencie seu plano, créditos, pagamentos e ROI.">
           <p className="text-muted-foreground text-center py-10">Funcionalidade de CRM Financeiro em breve.</p>
        </GenericDashboardSection>
      </div>

      <GenericDashboardSection title="Sorteios" icon={Gift} description="Crie e gerencie sorteios para engajar seus clientes.">
         <Button asChild variant="outline" className="w-full mt-4">
            <Link href="/dashboard/advertiser/create-sweepstake">
              Criar Novo Sorteio <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
      </GenericDashboardSection>

      <AdvertiserProfileSettingsCard advertiserUser={advertiser} />

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
