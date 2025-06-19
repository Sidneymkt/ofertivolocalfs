
'use client';

import type { User, Badge as BadgeType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Gift, Star } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GamificationCardProps {
  user: User;
}

const GamificationCard: React.FC<GamificationCardProps> = ({ user }) => {
  const xpProgress = user.currentXp && user.xpToNextLevel ? (user.currentXp / user.xpToNextLevel) * 100 : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Award className="text-primary" />
          Suas Conquistas e Progresso
        </CardTitle>
        <CardDescription>Acompanhe seus pontos, nível e emblemas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-sm font-medium text-muted-foreground">Nível {user.level || 1}</p>
            <p className="text-sm font-semibold text-primary">
              {user.currentXp || 0} / {user.xpToNextLevel || 0} XP
            </p>
          </div>
          <Progress value={xpProgress} className="h-3 bg-primary/20 [&>div]:bg-primary" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            Para o próximo nível
          </p>
        </div>

        {user.badges && user.badges.length > 0 && (
          <div>
            <h4 className="font-medium text-card-foreground mb-2">Emblemas Desbloqueados:</h4>
            <div className="flex flex-wrap gap-3">
              <TooltipProvider>
                {user.badges.map((badge: BadgeType) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div className="p-2 bg-card border-2 border-accent/50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <badge.icon className="w-7 h-7 text-accent" data-ai-hint={badge['data-ai-hint']} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground">
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-xs">{badge.description}</p>
                      {badge.unlockedDate && <p className="text-xs text-muted-foreground">Desbloqueado em: {new Date(badge.unlockedDate).toLocaleDateString('pt-BR')}</p>}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        )}
         <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">{user.points.toLocaleString('pt-BR')}</p>
            <p className="text-sm text-muted-foreground">Pontos disponíveis para resgate!</p>
        </div>

        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/rewards">
            <Gift size={18} className="mr-2" /> Ver Recompensas e Sorteios
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GamificationCard;

    