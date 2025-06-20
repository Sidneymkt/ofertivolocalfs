'use client';

import PointsDisplay from '@/components/rewards/PointsDisplay';
import Leaderboard from '@/components/rewards/Leaderboard';
import SweepstakesList from '@/components/rewards/SweepstakesList';
import { mockUser, mockSweepstakes, POINTS_SIGNUP_WELCOME, POINTS_PROFILE_COMPLETE, POINTS_CHECKIN, POINTS_RATE_OFFER_OR_MERCHANT, POINTS_SHARE_OFFER, POINTS_FOLLOW_MERCHANT } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Gift, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function RewardsPage() {
  // Mostra apenas os sorteios ativos e futuros na página principal de recompensas
  const activeAndUpcomingSweepstakes = mockSweepstakes.filter(s => s.status === 'active' || s.status === 'upcoming');

  return (
    <div className="space-y-8">
      <PointsDisplay points={mockUser.points} />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Gift size={24} className="text-primary"/> Como Ganhar Pontos?
            </CardTitle>
          <CardDescription>Realize ações no app e acumule pontos para trocar por benefícios e participar de sorteios!</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Cadastro inicial: <span className="font-semibold text-primary">+{POINTS_SIGNUP_WELCOME} pontos</span></li>
            <li>Completar perfil: <span className="font-semibold text-primary">+{POINTS_PROFILE_COMPLETE} pontos</span></li>
            <li>Check-in em ofertas: <span className="font-semibold text-primary">+{POINTS_CHECKIN} pontos</span></li>
            <li>Avaliar ofertas e comerciantes: <span className="font-semibold text-primary">+{POINTS_RATE_OFFER_OR_MERCHANT} ponto(s)</span></li>
            <li>Compartilhar ofertas: <span className="font-semibold text-primary">+{POINTS_SHARE_OFFER} pontos</span></li>
            <li>Seguir um negócio: <span className="font-semibold text-primary">+{POINTS_FOLLOW_MERCHANT} pontos</span></li>
          </ul>
        </CardContent>
      </Card>

      <Leaderboard />
      <SweepstakesList sweepstakes={activeAndUpcomingSweepstakes.slice(0, 2)} /> {/* Mostra no máximo 2 sorteios aqui */}

      <div className="text-center mt-8">
        <Link href="/sweepstakes" passHref>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Ticket className="mr-2 h-4 w-4" /> Ver todos os Sorteios
          </Button>
        </Link>
      </div>
    </div>
  );
}
