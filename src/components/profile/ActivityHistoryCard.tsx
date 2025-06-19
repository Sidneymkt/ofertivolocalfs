
'use client';

import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Share2, Ticket, Coins, MessageSquare, Building } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityHistoryCardProps {
  user: User;
}

const ActivityHistoryCard: React.FC<ActivityHistoryCardProps> = ({ user }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Histórico de Atividades
        </CardTitle>
        <CardDescription>Seu registro de interações no aplicativo.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checkins" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 h-auto">
            <TabsTrigger value="checkins" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5">
              <CheckCircle size={14} className="mr-1 md:mr-2" />Check-ins
            </TabsTrigger>
            <TabsTrigger value="shares" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5">
              <Share2 size={14} className="mr-1 md:mr-2" />Compart.
            </TabsTrigger>
            <TabsTrigger value="sweepstakes" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5">
              <Ticket size={14} className="mr-1 md:mr-2" />Sorteios
            </TabsTrigger>
            <TabsTrigger value="points" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5">
              <Coins size={14} className="mr-1 md:mr-2" />Pontos
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-72 mt-4 pr-3">
            <TabsContent value="checkins">
              {user.checkInHistory && user.checkInHistory.length > 0 ? (
                <ul className="space-y-3">
                  {user.checkInHistory.map(item => (
                    <li key={item.id} className="p-3 bg-muted/50 rounded-md text-sm">
                      <p className="font-semibold text-card-foreground">{item.offerTitle}</p>
                      <p className="text-xs text-muted-foreground">Em: {item.merchantName}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {format(item.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="text-xs font-semibold text-green-600">+{item.pointsEarned} pts</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhum check-in realizado.</p>}
            </TabsContent>

            <TabsContent value="shares">
               {user.sharedOffersHistory && user.sharedOffersHistory.length > 0 ? (
                <ul className="space-y-3">
                  {user.sharedOffersHistory.map(item => (
                    <li key={item.id} className="p-3 bg-muted/50 rounded-md text-sm">
                      <p className="font-semibold text-card-foreground">{item.offerTitle}</p>
                      <p className="text-xs text-muted-foreground">Plataforma: {item.platform}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {format(item.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        {item.pointsEarned && <span className="text-xs font-semibold text-green-600">+{item.pointsEarned} pts</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhuma oferta compartilhada.</p>}
            </TabsContent>

            <TabsContent value="sweepstakes">
              {user.sweepstakeParticipations && user.sweepstakeParticipations.length > 0 ? (
                <ul className="space-y-3">
                  {user.sweepstakeParticipations.map(item => (
                    <li key={item.id} className="p-3 bg-muted/50 rounded-md text-sm">
                      <p className="font-semibold text-card-foreground">{item.sweepstakeTitle}</p>
                       <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                           {format(item.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="text-xs font-semibold text-destructive">-{item.pointsSpent} pts</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-center text-muted-foreground py-6">Nenhuma participação em sorteios.</p>}
            </TabsContent>

            <TabsContent value="points">
              {/* Placeholder for detailed points history (earned/spent) */}
              <p className="text-center text-muted-foreground py-6">
                Histórico detalhado de pontos ganhos e gastos em breve.
              </p>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityHistoryCard;

    