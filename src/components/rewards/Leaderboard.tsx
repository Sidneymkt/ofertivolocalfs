'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, TrendingUp, Star, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';
import { getLeaderboardUsers } from '@/lib/firebase/services/userService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LeaderboardProps {
  currentUser: User | null; // Pass the current user
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const topUsers = await getLeaderboardUsers(10);
        
        // Ensure current user is in the list if they are in top N or add them for display
        if (currentUser && !topUsers.find(u => u.id === currentUser.id)) {
            const tempLeaderboard = [...topUsers, currentUser].sort((a, b) => b.points - a.points);
            setLeaderboardData(tempLeaderboard.slice(0,10)); // Still show top N
        } else {
            setLeaderboardData(topUsers);
        }

      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [currentUser]);

  if (loading) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="text-accent fill-accent" size={24} /> Ranking da Comunidade
          </CardTitle>
          <CardDescription>Carregando ranking...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  const currentUserRank = leaderboardData.findIndex(user => user.id === currentUser?.id) + 1;


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="text-accent fill-accent" size={24} /> Ranking da Comunidade
        </CardTitle>
        <CardDescription>Veja quem mais interage e ganha pontos na sua região!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboardData.length > 0 ? (
          <ScrollArea className="h-72">
            <ul className="space-y-3 pr-4">
              {leaderboardData.map((user, index) => {
                const rank = index + 1;
                const isCurrentUserEntry = user.id === currentUser?.id;
                return (
                  <li 
                    key={user.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ease-in-out
                                ${isCurrentUserEntry ? 'bg-primary/10 ring-2 ring-primary shadow-md' : 'bg-card hover:bg-muted/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={rank === 1 ? "destructive" : rank <= 3 ? "secondary" : "outline"} 
                        className="text-sm w-8 h-8 flex items-center justify-center rounded-full font-bold shrink-0"
                      >
                        {rank}
                      </Badge>
                      <Avatar className="h-10 w-10 border-2 border-primary/30">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint || 'person avatar'}/>
                        <AvatarFallback className="bg-muted text-muted-foreground">{user.name?.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className={`font-medium ${isCurrentUserEntry ? 'text-primary' : 'text-card-foreground'}`}>{user.name} {isCurrentUserEntry && "(Você)"}</span>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star size={12} className={isCurrentUserEntry ? "text-accent fill-accent" : "text-amber-400 fill-amber-400"}/> Nível: {user.level}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold flex items-center gap-1 text-primary`}>
                      {user.points.toLocaleString('pt-BR')} pts
                      <TrendingUp size={16} className="text-green-500"/>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground py-6">Ranking indisponível no momento.</p>
        )}
        {currentUser && currentUserRank > 10 && (
           <div className="text-center text-sm text-muted-foreground pt-3 border-t">
             Sua Posição: <span className="font-bold text-primary">{currentUserRank}º</span>
           </div>
        )}
         {currentUser && !leaderboardData.find(u => u.id === currentUser.id) && leaderboardData.length > 0 && (
           <div className="text-center text-sm text-muted-foreground pt-3 border-t">
             Você não está no Top {leaderboardData.length} no momento. Continue participando!
           </div>
        )}
        <p className="text-xs text-center text-muted-foreground pt-2">O ranking é atualizado periodicamente.</p>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
