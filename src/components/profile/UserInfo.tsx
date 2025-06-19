
'use client';

import type React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3, Star as StarIcon, Users as UsersIcon, Award as AwardIcon, MessageSquare as MessageSquareIcon, Zap as ZapIcon, type LucideProps } from 'lucide-react';
import type { User, Badge as BadgeType } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';

interface UserInfoProps {
  user: User;
}

const badgeIconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Star: StarIcon,
  Users: UsersIcon,
  Award: AwardIcon,
  MessageSquare: MessageSquareIcon,
  Zap: ZapIcon,
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const xpProgress = user.currentXp && user.xpToNextLevel ? (user.currentXp / user.xpToNextLevel) * 100 : 0;

  return (
    <Card className="shadow-xl overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center bg-gradient-to-b from-primary/10 to-background">
        <div className="relative mb-4">
          <Avatar className="w-28 h-28 border-4 border-primary shadow-lg ring-2 ring-offset-background ring-offset-2 ring-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint || "profile person"} />
            <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
              {user.name?.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-card border-primary text-primary hover:bg-primary/10">
            <Edit3 size={14} />
            <span className="sr-only">Editar foto</span>
          </Button>
        </div>

        <h2 className="text-2xl font-headline font-bold text-foreground mb-1">{user.name}</h2>
        
        <div className="text-sm text-primary font-semibold mb-1">
          Nível {user.level || 1}
        </div>
        
        {user.currentXp !== undefined && user.xpToNextLevel !== undefined && user.xpToNextLevel !== Infinity && (
          <div className="w-full max-w-xs mb-3 px-4">
            <Progress value={xpProgress} className="h-2 bg-primary/20" />
            <p className="text-xs text-muted-foreground mt-1">
              {user.currentXp} / {user.xpToNextLevel} XP para o próximo nível
            </p>
          </div>
        )}

        <p className="text-xl font-semibold text-accent mb-4">
          {user.points.toLocaleString('pt-BR')} Pontos
        </p>

        {user.badges && user.badges.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Emblemas Conquistados:</h4>
            <div className="flex justify-center gap-3 flex-wrap">
              <TooltipProvider>
                {user.badges.map((badge: BadgeType) => {
                  const IconComponent = badgeIconMap[badge.icon];
                  return (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <div className="p-2 bg-card border border-primary/20 rounded-full shadow-sm hover:scale-110 transition-transform">
                          {IconComponent ? <IconComponent className="w-6 h-6 text-primary" data-ai-hint={badge['data-ai-hint']}/> : null}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs">{badge.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default UserInfo;
