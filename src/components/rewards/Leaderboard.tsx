import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockLeaderboard = [
  { id: '1', name: 'Usuário Top 1', points: 5820, avatar: 'https://placehold.co/40x40.png', rank: 1, 'data-ai-hint': 'person avatar' },
  { id: '2', name: 'Maria Gamer', points: 4500, avatar: 'https://placehold.co/40x40.png', rank: 2, 'data-ai-hint': 'person avatar' },
  { id: '3', name: 'João Ofertas', points: 3100, avatar: 'https://placehold.co/40x40.png', rank: 3, 'data-ai-hint': 'person avatar' },
];

const Leaderboard = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-accent" /> Ranking Local
        </CardTitle>
        <CardDescription>Veja quem mais interage e ganha pontos!</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockLeaderboard.map((user, index) => (
            <li key={user.id} className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant={index < 1 ? "destructive" : "secondary"} className="text-sm w-8 h-8 flex items-center justify-center rounded-full">
                  {user.rank}
                </Badge>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user['data-ai-hint']}/>
                  <AvatarFallback>{user.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-card-foreground">{user.name}</span>
              </div>
              <div className="font-semibold text-primary flex items-center gap-1">
                {user.points.toLocaleString('pt-BR')} <TrendingUp size={16} className="text-green-500"/>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
