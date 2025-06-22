
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Sweepstake } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, CalendarDays, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { format, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';

interface SweepstakesListProps {
  sweepstakes: Sweepstake[];
  showViewAllButton?: boolean;
}

const SweepstakeItemCard: React.FC<{ sweepstake: Sweepstake }> = ({ sweepstake }) => {
  const { toast } = useToast();
  const [formattedDate, setFormattedDate] = useState('...');

  useEffect(() => {
    const getFormattedDate = (dateString: Date | Timestamp) => {
      try {
        const date = dateString instanceof Timestamp ? dateString.toDate() : dateString;
        return format(date, "dd/MM/yyyy", { locale: ptBR });
      } catch (error) {
        return "Data inválida";
      }
    };
    
    const dateToFormat = sweepstake.status === 'upcoming' ? sweepstake.startDate : sweepstake.endDate;
    const prefix = sweepstake.status === 'upcoming' ? 'Inicia em: ' : 'Termina em: ';
    setFormattedDate(`${prefix}${getFormattedDate(dateToFormat)}`);
  }, [sweepstake]);

  const handleParticipate = (e: React.MouseEvent, currentSweepstake: Sweepstake) => {
    e.stopPropagation(); 
    if (isPast(new Date(currentSweepstake.endDate))) {
      toast({ title: "Sorteio Encerrado" });
    } else if (isFuture(new Date(currentSweepstake.startDate))) {
       toast({ title: "Sorteio em Breve" });
    } else if (currentSweepstake.status === 'active') {
      toast({ title: "Participação Registrada! (Simulado)" });
    } else {
       toast({ title: `Status: ${currentSweepstake.status}` });
    }
  };

  return (
    <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col bg-card group">
      <Link href={`/sweepstake/${sweepstake.id}`} className="flex flex-col flex-grow">
        <CardHeader className="p-0 relative">
          <Image
            src={sweepstake.imageUrl}
            alt={sweepstake.title}
            width={600}
            height={200}
            className="object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
            data-ai-hint={sweepstake['data-ai-hint'] as string}
          />
          <Badge variant="secondary" className="absolute top-3 left-3 flex items-center gap-1.5 py-1 px-2.5 text-xs bg-black/50 text-white backdrop-blur-sm">
            <CalendarDays size={14} /> 
            {formattedDate}
          </Badge>
        </CardHeader>
        <CardContent className="p-5 flex-grow">
          <CardTitle className="text-lg font-headline mb-2 leading-tight group-hover:text-primary transition-colors">{sweepstake.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">{sweepstake.description}</CardDescription>
          <div className="flex items-center gap-2 text-base font-semibold text-primary">
            <Coins size={18} className="text-amber-500"/>
            Custo: {sweepstake.pointsToEnter} pontos por bilhete
          </div>
          {(sweepstake.status === 'ended' || sweepstake.status === 'drawing_complete' || sweepstake.status === 'cancelled') && (
            <Badge variant={sweepstake.status === 'cancelled' ? "destructive" : "outline"} className="mt-2 text-sm">
              {sweepstake.status === 'cancelled' ? 'Cancelado' : 'Sorteio Encerrado'}
            </Badge>
          )}
        </CardContent>
      </Link>
      <CardFooter className="p-5 pt-0 border-t mt-auto">
        <Button 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3"
          onClick={(e) => handleParticipate(e, sweepstake)}
          disabled={sweepstake.status === 'ended' || sweepstake.status === 'drawing_complete' || sweepstake.status === 'cancelled'}
        >
          <Ticket className="w-5 h-5 mr-2" />
          {sweepstake.status === 'upcoming' ? 'Ver Detalhes' : 
           sweepstake.status === 'ended' || sweepstake.status === 'drawing_complete' ? 'Ver Resultados' : 
           sweepstake.status === 'cancelled' ? 'Sorteio Cancelado' :
           'Participar do Sorteio'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const SweepstakesList: React.FC<SweepstakesListProps> = ({ sweepstakes, showViewAllButton = false }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-headline font-semibold flex items-center gap-2">
          <Ticket className="text-primary" size={24}/> Sorteios Ativos e Próximos
        </h3>
      </div>
      {sweepstakes.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Nenhum sorteio ativo ou programado no momento. Volte em breve!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sweepstakes.map((item) => (
            <SweepstakeItemCard key={item.id} sweepstake={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SweepstakesList;
