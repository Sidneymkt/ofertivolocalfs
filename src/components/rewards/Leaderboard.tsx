
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, TrendingUp, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types'; // Assuming User type has name, points, avatar
import { mockUser } from '@/types'; // For the current user's position

// Expanded mock leaderboard data
const mockLeaderboardData: Pick<User, 'id' | 'name' | 'points' | 'avatarUrl' | 'avatarHint' | 'level'>[] = [
  { id: 'userTop1', name: 'Carlos Campeão', points: 15820, avatarUrl: 'https://placehold.co/40x40.png?text=CC', avatarHint: 'man avatar', level: 'Platina' },
  { id: 'userTop2', name: 'Beatriz Pontuadora', points: 14500, avatarUrl: 'https://placehold.co/40x40.png?text=BP', avatarHint: 'woman avatar', level: 'Ouro' },
  { id: 'userTop3', name: 'Lucas Ofertas', points: 13100, avatarUrl: 'https://placehold.co/40x40.png?text=LO', avatarHint: 'person smiling', level: 'Ouro' },
  { id: 'user123', name: mockUser.name, points: mockUser.points, avatarUrl: mockUser.avatarUrl, avatarHint: mockUser.avatarHint, level: mockUser.level }, // Current user
  { id: 'userTop4', name: 'Fernanda Fidelidade', points: 9500, avatarUrl: 'https://placehold.co/40x40.png?text=FF', avatarHint: 'woman glasses', level: 'Prata' },
  { id: 'userTop5', name: 'Rafael Checkin', points: 8800, avatarUrl: 'https://placehold.co/40x40.png?text=RC', avatarHint: 'man happy', level: 'Prata' },
].sort((a, b) => b.points - a.points); // Sort by points descending

const Leaderboard = () => {
  const currentUserRank = mockLeaderboardData.findIndex(user => user.id === mockUser.id) + 1;

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="text-accent fill-accent" size={24} /> Ranking da Comunidade
        </CardTitle>
        <CardDescription>Veja quem mais interage e ganha pontos na sua região!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {mockLeaderboardData.slice(0, 5).map((user, index) => { // Show top 5
            const rank = index + 1;
            const isCurrentUser = user.id === mockUser.id;
            return (
              <li 
                key={user.id} 
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ease-in-out
                            ${isCurrentUser ? 'bg-primary/10 ring-2 ring-primary shadow-md scale-105' : 'bg-card hover:bg-muted/50'}`}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={rank === 1 ? "destructive" : rank <= 3 ? "secondary" : "outline"} 
                    className="text-sm w-8 h-8 flex items-center justify-center rounded-full font-bold shrink-0"
                  >
                    {rank}
                  </Badge>
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint}/>
                    <AvatarFallback className="bg-muted text-muted-foreground">{user.name?.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className={`font-medium ${isCurrentUser ? 'text-primary-foreground' : 'text-card-foreground'}`}>{user.name} {isCurrentUser && "(Você)"}</span>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star size={12} className={isCurrentUser ? "text-accent fill-accent" : "text-amber-400 fill-amber-400"}/> Nível: {user.level}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold flex items-center gap-1 ${isCurrentUser ? 'text-primary-foreground' : 'text-primary'}`}>
                  {user.points.toLocaleString('pt-BR')} pts
                  <TrendingUp size={16} className={isCurrentUser ? "text-green-300" : "text-green-500"}/>
                </div>
              </li>
            );
          })}
        </ul>
        {currentUserRank > 5 && (
           <div className="text-center text-sm text-muted-foreground pt-3 border-t">
             Sua Posição: <span className="font-bold text-primary">{currentUserRank}º</span>
           </div>
        )}
        <p className="text-xs text-center text-muted-foreground pt-2">O ranking é atualizado periodicamente.</p>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;

    