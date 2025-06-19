import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  return (
    <Card className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Coins size={24} />
          Seu Saldo de Pontos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{points.toLocaleString('pt-BR')}</p>
        <p className="text-sm opacity-90 mt-1">Continue interagindo para ganhar mais!</p>
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
