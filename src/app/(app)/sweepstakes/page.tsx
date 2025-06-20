
'use client';

import React from 'react';
import Image from 'next/image';
import type { Sweepstake } from '@/types';
import { mockSweepstakes } from '@/types'; // Importa todos os sorteios
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, CalendarDays, Coins, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { format, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AllSweepstakesPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleParticipate = (e: React.MouseEvent, sweepstake: Sweepstake) => {
    e.stopPropagation(); // Prevent click from bubbling to the parent Link
    const now = new Date();
    if (isPast(new Date(sweepstake.endDate))) {
      toast({
        title: "Sorteio Encerrado",
        description: `O sorteio "${sweepstake.title}" já foi finalizado.`,
        variant: "default",
      });
    } else if (isFuture(new Date(sweepstake.startDate))) {
       toast({
        title: "Sorteio em Breve",
        description: `O sorteio "${sweepstake.title}" ainda não começou. Aguarde!`,
        variant: "default",
      });
    } else if (sweepstake.status === 'active') {
      toast({
        title: "Participação Registrada!",
        description: `Você participou do sorteio "${sweepstake.title}". ${sweepstake.pointsToEnter} pontos foram deduzidos (simulado). Boa sorte!`,
        variant: "default",
      });
    } else {
       toast({
        title: `Status: ${sweepstake.status}`,
        description: `Não é possível participar do sorteio "${sweepstake.title}" neste momento.`,
        variant: "default",
      });
    }
  };

  const getFormattedDate = (dateString: Date) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between mt-4 mb-6 px-4 md:px-0">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground text-center flex-grow">
          Todos os Sorteios
        </h1>
        <div className="w-16"></div> {/* Spacer to balance the back button */}
      </div>
      
      {mockSweepstakes.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">Nenhum sorteio disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
          {mockSweepstakes.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col bg-card group">
              <Link href={`/sweepstake/${item.id}`} className="flex flex-col flex-grow">
                <CardHeader className="p-0 relative">
                    <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={600}
                    height={200}
                    className="object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
                    data-ai-hint={item['data-ai-hint'] as string}
                    />
                    <Badge variant="secondary" className="absolute top-3 left-3 flex items-center gap-1.5 py-1 px-2.5 text-xs bg-black/50 text-white backdrop-blur-sm">
                    <CalendarDays size={14} /> 
                    {item.status === 'upcoming' ? `Inicia em: ${getFormattedDate(item.startDate)}` : 
                    item.status === 'ended' || item.status === 'drawing_complete' ? `Encerrado em: ${getFormattedDate(item.endDate)}` :
                    `Termina em: ${getFormattedDate(item.endDate)}`}
                    </Badge>
                </CardHeader>
                <CardContent className="p-5 flex-grow">
                    <CardTitle className="text-lg font-headline mb-2 leading-tight group-hover:text-primary transition-colors">{item.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</CardDescription>
                    <div className="flex items-center gap-2 text-base font-semibold text-primary">
                    <Coins size={18} className="text-amber-500"/>
                    Custo: {item.pointsToEnter} pontos por bilhete
                    </div>
                    {(item.status === 'ended' || item.status === 'drawing_complete' || item.status === 'cancelled') && (
                    <Badge variant={item.status === 'cancelled' ? "destructive" : "outline"} className="mt-2 text-sm">
                        {item.status === 'cancelled' ? 'Cancelado' : 'Sorteio Encerrado'}
                    </Badge>
                    )}
                </CardContent>
              </Link>
              <CardFooter className="p-5 pt-0 border-t mt-auto">
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3"
                  onClick={(e) => handleParticipate(e, item)}
                  disabled={item.status === 'ended' || item.status === 'drawing_complete' || item.status === 'cancelled'}
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {item.status === 'upcoming' ? 'Ver Detalhes' : 
                   item.status === 'ended' || item.status === 'drawing_complete' ? 'Ver Resultados' : 
                   item.status === 'cancelled' ? 'Sorteio Cancelado' :
                   'Participar do Sorteio'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
