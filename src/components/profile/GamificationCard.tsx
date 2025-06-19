
'use client';

import type React from 'react';
import type { User, Badge as BadgeType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award as AwardIconLucide, TrendingUp, Gift, Star as StarIcon, Shield, Zap as ZapIcon, MessageSquare as MessageSquareIcon, Users as UsersIcon, type LucideProps } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GamificationCardProps {
  user: User;
}

const badgeIconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Star: StarIcon,
  Users: UsersIcon,
  Award: AwardIconLucide, // Using alias to avoid conflict with the component's main icon
  MessageSquare: MessageSquareIcon,
  Zap: ZapIcon,
};

const GamificationCard: React.FC<GamificationCardProps> = ({ user }) => {
  const xpProgress = user.currentXp && user.xpToNextLevel && user.xpToNextLevel > 0 
    ? Math.min((user.currentXp / user.xpToNextLevel) * 100, 100) 
    : 0;

  // Placeholder for weekly/monthly goals
  const weeklyGoalProgress = 60; // Example: 60%
  const monthlyGoalProgress = 30; // Example: 30%

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <AwardIconLucide className="text-primary" size={24} />
          Seu Progresso e Conquistas
        </CardTitle>
        <CardDescription>Acompanhe seu nível, XP, pontos e emblemas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <p className="text-sm font-medium text-muted-foreground">
              Nível: <span className="font-bold text-primary">{user.level || 'Iniciante'}</span>
            </p>
            {user.xpToNextLevel !== Infinity && (
              <p className="text-xs font-semibold text-primary">
                {user.currentXp || 0} / {user.xpToNextLevel || 0} XP
              </p>
            )}
          </div>
          {user.xpToNextLevel !== Infinity ? (
            <Progress value={xpProgress} className="h-3 bg-primary/20 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-blue-400" />
          ) : (
            <div className="text-center py-2 text-sm text-accent font-semibold flex items-center justify-center gap-2">
              <Shield size={18} className="text-amber-500"/> Nível Máximo Atingido!
            </div>
          )}
          {user.xpToNextLevel !== Infinity && (
            <p className="text-xs text-muted-foreground mt-1 text-right">
              Para o próximo nível
            </p>
          )}
        </div>

        {/* Placeholder for Weekly/Monthly Goals */}
        <div className="space-y-3 pt-3 border-t">
           <h4 className="font-medium text-card-foreground text-sm mb-1">Metas (Exemplo):</h4>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
              <span>Meta Semanal</span>
              <span>{weeklyGoalProgress}%</span>
            </div>
            <Progress value={weeklyGoalProgress} className="h-2 bg-green-500/20 [&>div]:bg-green-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
              <span>Meta Mensal</span>
              <span>{monthlyGoalProgress}%</span>
            </div>
            <Progress value={monthlyGoalProgress} className="h-2 bg-orange-500/20 [&>div]:bg-orange-500" />
          </div>
        </div>


        {user.badges && user.badges.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="font-medium text-card-foreground mb-3">Emblemas Desbloqueados:</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-3 justify-center">
              <TooltipProvider>
                {user.badges.map((badge: BadgeType) => {
                  const IconComponent = badgeIconMap[badge.icon];
                  return (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center text-center w-16 cursor-pointer group">
                          <div className="p-2.5 bg-card border-2 border-accent/30 rounded-full shadow-sm group-hover:shadow-md group-hover:border-accent transition-all duration-200 group-hover:scale-110">
                            {IconComponent ? <IconComponent className="w-7 h-7 text-accent" data-ai-hint={badge['data-ai-hint']} /> : null}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 group-hover:text-accent">{badge.name}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground max-w-xs text-center">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs">{badge.description}</p>
                        {badge.unlockedDate && <p className="text-xs text-muted-foreground/80 mt-0.5">Em: {new Date(badge.unlockedDate).toLocaleDateString('pt-BR')}</p>}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        )}
         <div className="text-center p-4 bg-gradient-to-r from-primary/80 to-blue-500 rounded-lg shadow-inner text-primary-foreground">
            <p className="text-3xl font-bold">{user.points.toLocaleString('pt-BR')}</p>
            <p className="text-sm opacity-90">Pontos disponíveis para usar!</p>
        </div>

        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3">
          <Link href="/rewards">
            <Gift size={20} className="mr-2" /> Ver Recompensas e Sorteios
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GamificationCard;
