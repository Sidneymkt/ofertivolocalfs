
'use client';

import React, { useState, useEffect } from 'react';
import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Share2, Ticket, Coins, MessageSquare, Building, CalendarDays, TrendingUp, TrendingDown, PlusCircle, MinusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

interface ActivityHistoryCardProps {
  user: User;
}

const ActivityItem: React.FC<{
  title: string;
  subtitle?: string;
  timestamp?: Date | Timestamp;
  points?: number;
  isGain?: boolean;
  icon: React.ElementType;
  iconColor?: string;
}> = ({ title, subtitle, timestamp, points, isGain, icon: Icon, iconColor = 'text-primary' }) => {
  const [formattedDate, setFormattedDate] = useState<string>('Carregando data...');

  useEffect(() => {
    if (timestamp) {
      // Now receives a JS Date object from the sanitized user profile.
      setFormattedDate(format(new Date(timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }));
    } else {
      setFormattedDate('Data indisponível');
    }
  }, [timestamp]);

  return (
    <li className="p-3.5 bg-muted/50 rounded-lg shadow-sm hover:bg-muted/70 transition-colors duration-150 ease-in-out">
      <div className="flex items-start gap-3">
        <div className={`mt-1 p-1.5 bg-card rounded-full shadow-sm ${iconColor}`}>
          <Icon size={18} className="opacity-80" />
        </div>
        <div className="flex-grow">
          <p className="font-semibold text-card-foreground text-sm">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          <span className="text-xs text-muted-foreground/80">
            {formattedDate}
          </span>
        </div>
        {points !== undefined && (
          <div className={`text-sm font-semibold flex items-center gap-1 whitespace-nowrap ${isGain ? 'text-green-600' : 'text-red-600'}`}>
            {isGain ? <PlusCircle size={14} /> : <MinusCircle size={14} />}
            {points} pts
          </div>
        )}
      </div>
    </li>
  );
};


const ActivityHistoryCard: React.FC<ActivityHistoryCardProps> = ({ user }) => {
  // Combine all history items and sort by date for a "General" tab
  const allActivities = [
    ...(user.checkInHistory || []).map(item => ({ ...item, type: 'checkin', isGain: true, icon: CheckCircle, iconColor: 'text-green-600' })),
    ...(user.sharedOffersHistory || []).map(item => ({ ...item, type: 'share', pointsEarned: item.pointsEarned || 0, isGain: true, icon: Share2, iconColor: 'text-blue-500' })),
    ...(user.sweepstakeParticipations || []).map(item => ({ ...item, type: 'sweepstake', isGain: false, icon: Ticket, iconColor: 'text-orange-500' })),
    ...(user.commentsMade || []).filter(c => c.pointsEarned).map(item => ({ ...item, offerTitle: `Comentário em: ${item.offerTitle}`, type: 'comment', isGain: true, icon: MessageSquare, iconColor: 'text-purple-500' })),
  ].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
  });


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarDays className="text-primary" size={24} />
          Histórico de Atividades
        </CardTitle>
        <CardDescription>Seu registro de interações e movimentação de pontos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 h-auto mb-4">
            <TabsTrigger value="general" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <TrendingUp size={14} />Geral
            </TabsTrigger>
            <TabsTrigger value="checkins" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <CheckCircle size={14} />Check-ins
            </TabsTrigger>
            <TabsTrigger value="shares" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <Share2 size={14} />Compart.
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <MessageSquare size={14} />Coment.
            </TabsTrigger>
            <TabsTrigger value="sweepstakes" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <Ticket size={14} />Sorteios
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-80 pr-3">
            <TabsContent value="general">
              {allActivities.length > 0 ? (
                <ul className="space-y-3">
                  {allActivities.map(item => (
                    <ActivityItem
                      key={`${item.type}-${item.id}`}
                      title={item.type === 'sweepstake' ? item.sweepstakeTitle : item.offerTitle}
                      subtitle={item.type === 'checkin' ? `Em: ${item.merchantName}` : item.type === 'share' ? `Plataforma: ${item.platform}` : undefined}
                      timestamp={item.timestamp}
                      points={item.type === 'sweepstake' ? item.pointsSpent : item.pointsEarned}
                      isGain={item.isGain ?? false} // Ensure isGain has a default
                      icon={item.icon}
                      iconColor={item.iconColor}
                    />
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhuma atividade registrada.</p>}
            </TabsContent>
            
            <TabsContent value="checkins">
              {user.checkInHistory && user.checkInHistory.length > 0 ? (
                <ul className="space-y-3">
                  {user.checkInHistory.map(item => (
                    <ActivityItem
                      key={item.id}
                      title={item.offerTitle}
                      subtitle={`Em: ${item.merchantName}`}
                      timestamp={item.timestamp}
                      points={item.pointsEarned}
                      isGain
                      icon={CheckCircle}
                      iconColor="text-green-600"
                    />
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhum check-in realizado.</p>}
            </TabsContent>

            <TabsContent value="shares">
               {user.sharedOffersHistory && user.sharedOffersHistory.length > 0 ? (
                <ul className="space-y-3">
                  {user.sharedOffersHistory.map(item => (
                     <ActivityItem
                        key={item.id}
                        title={item.offerTitle}
                        subtitle={`Plataforma: ${item.platform}`}
                        timestamp={item.timestamp}
                        points={item.pointsEarned}
                        isGain
                        icon={Share2}
                        iconColor="text-blue-500"
                    />
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhuma oferta compartilhada.</p>}
            </TabsContent>

            <TabsContent value="comments">
               {user.commentsMade && user.commentsMade.filter(c => c.pointsEarned).length > 0 ? (
                <ul className="space-y-3">
                  {user.commentsMade.filter(c => c.pointsEarned).map(item => (
                     <ActivityItem
                        key={item.id}
                        title={`Comentário em: ${item.offerTitle}`}
                        subtitle={`"${item.text.substring(0,50)}..."`}
                        timestamp={item.timestamp}
                        points={item.pointsEarned}
                        isGain
                        icon={MessageSquare}
                        iconColor="text-purple-500"
                    />
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhum comentário que rendeu pontos.</p>}
            </TabsContent>

            <TabsContent value="sweepstakes">
              {user.sweepstakeParticipations && user.sweepstakeParticipations.length > 0 ? (
                <ul className="space-y-3">
                  {user.sweepstakeParticipations.map(item => (
                    <ActivityItem
                        key={item.id}
                        title={item.sweepstakeTitle}
                        timestamp={item.timestamp}
                        points={item.pointsSpent}
                        isGain={false}
                        icon={Ticket}
                        iconColor="text-orange-500"
                    />
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhuma participação em sorteios.</p>}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityHistoryCard;
