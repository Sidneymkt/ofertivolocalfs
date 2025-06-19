
'use client';

import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Share2, Ticket, Coins, MessageSquare, Building, CalendarDays } from 'lucide-react';
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
          <CalendarDays className="text-primary" />
          Histórico de Atividades
        </CardTitle>
        <CardDescription>Seu registro de interações no aplicativo.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checkins" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 h-auto mb-4">
            <TabsTrigger value="checkins" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <CheckCircle size={14} />Check-ins
            </TabsTrigger>
            <TabsTrigger value="shares" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <Share2 size={14} />Compart.
            </TabsTrigger>
            <TabsTrigger value="sweepstakes" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <Ticket size={14} />Sorteios
            </TabsTrigger>
            <TabsTrigger value="points" className="text-xs px-2 py-1.5 md:text-sm md:px-3 md:py-2.5 flex items-center gap-1.5">
              <Coins size={14} />Pontos
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-72 pr-3">
            <TabsContent value="checkins">
              {user.checkInHistory && user.checkInHistory.length > 0 ? (
                <ul className="space-y-3">
                  {user.checkInHistory.map(item => (
                    <li key={item.id} className="p-3 bg-muted/50 rounded-lg shadow-sm text-sm hover:bg-muted/70 transition-colors">
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
                    <li key={item.id} className="p-3 bg-muted/50 rounded-lg shadow-sm text-sm hover:bg-muted/70 transition-colors">
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
                    <li key={item.id} className="p-3 bg-muted/50 rounded-lg shadow-sm text-sm hover:bg-muted/70 transition-colors">
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
              <div className="p-3 bg-muted/50 rounded-lg shadow-sm text-sm hover:bg-muted/70 transition-colors">
                <p className="font-semibold text-card-foreground">Total de Pontos Acumulados</p>
                <p className="text-2xl font-bold text-primary">{user.points} pts</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Um histórico detalhado de pontos ganhos e gastos por transação estará disponível em breve.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityHistoryCard;

    

    