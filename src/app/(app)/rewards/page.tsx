import PointsDisplay from '@/components/rewards/PointsDisplay';
import Leaderboard from '@/components/rewards/Leaderboard';
import SweepstakesList from '@/components/rewards/SweepstakesList';
import { mockUser, mockSweepstakes } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Gift } from 'lucide-react';

export default function RewardsPage() {
  return (
    <div className="space-y-8">
      <PointsDisplay points={mockUser.points} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Gift size={20}/> Como Ganhar Pontos?</CardTitle>
          <CardDescription>Realize ações no app e acumule pontos para trocar por benefícios e participar de sorteios!</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Cadastro completo: <span className="font-semibold text-primary">100 pontos</span></li>
            <li>Check-in em ofertas: <span className="font-semibold text-primary">50 pontos</span></li>
            <li>Comentar em ofertas: <span className="font-semibold text-primary">20 pontos</span></li>
            <li>Compartilhar ofertas: <span className="font-semibold text-primary">30 pontos</span></li>
            <li>Seguir um negócio: <span className="font-semibold text-primary">10 pontos</span></li>
          </ul>
        </CardContent>
      </Card>

      <Leaderboard />
      <SweepstakesList sweepstakes={mockSweepstakes} />
    </div>
  );
}
