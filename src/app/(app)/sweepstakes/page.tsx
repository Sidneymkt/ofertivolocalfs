
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Sweepstake } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, CalendarDays, Coins, ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { format, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllSweepstakes, addParticipantToSweepstake } from '@/lib/firebase/services/sweepstakeService';
import { auth } from '@/lib/firebase/firebaseConfig';
import { getUserProfile, updateUserProfile } from '@/lib/firebase/services/userService';
import { Timestamp } from 'firebase/firestore';

const SweepstakeCard: React.FC<{
  sweepstake: Sweepstake;
  currentUser: import('@/types').User | null;
  onParticipate: (e: React.MouseEvent, sweepstake: Sweepstake) => void;
}> = ({ sweepstake, currentUser, onParticipate }) => {
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
    const prefix = sweepstake.status === 'upcoming' ? 'Inicia em: ' :
                   (sweepstake.status === 'ended' || sweepstake.status === 'drawing_complete') ? 'Encerrado em: ' :
                   'Termina em: ';

    setFormattedDate(`${prefix}${getFormattedDate(dateToFormat)}`);
  }, [sweepstake]);

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
          onClick={(e) => onParticipate(e, sweepstake)}
          disabled={sweepstake.status === 'ended' || sweepstake.status === 'drawing_complete' || sweepstake.status === 'cancelled' || sweepstake.status === 'upcoming' || !currentUser}
        >
          <Ticket className="w-5 h-5 mr-2" />
          {sweepstake.status === 'upcoming' ? 'Ver Detalhes (Em Breve)' : 
           sweepstake.status === 'ended' || sweepstake.status === 'drawing_complete' ? 'Ver Resultados' : 
           sweepstake.status === 'cancelled' ? 'Sorteio Cancelado' :
           'Participar do Sorteio'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AllSweepstakesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [sweepstakes, setSweepstakes] = useState<Sweepstake[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<import('@/types').User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userAuth = auth.currentUser;
        if (userAuth) {
          const userProfile = await getUserProfile(userAuth.uid);
          setCurrentUser(userProfile);
        }
        const allSweepstakesData = await getAllSweepstakes();
        setSweepstakes(allSweepstakesData);
      } catch (error) {
        console.error("Error fetching sweepstakes:", error);
        toast({ variant: "destructive", title: "Erro ao carregar sorteios" });
      }
      setLoading(false);
    };
    fetchData();
  }, [toast]);

  const handleParticipate = async (e: React.MouseEvent, sweepstake: Sweepstake) => {
    e.stopPropagation(); 
    if (!currentUser) {
      toast({ title: "Login Necessário", description: "Faça login para participar.", variant: "destructive" });
      return;
    }
    if (currentUser.points < sweepstake.pointsToEnter) {
      toast({ title: "Pontos Insuficientes", description: `Você precisa de ${sweepstake.pointsToEnter} pontos.`, variant: "destructive" });
      return;
    }

    if (isPast(new Date(sweepstake.endDate))) {
      toast({ title: "Sorteio Encerrado", description: `O sorteio "${sweepstake.title}" já foi finalizado.`});
    } else if (isFuture(new Date(sweepstake.startDate))) {
       toast({ title: "Sorteio em Breve", description: `O sorteio "${sweepstake.title}" ainda não começou.`});
    } else if (sweepstake.status === 'active') {
      try {
        const newPoints = currentUser.points - sweepstake.pointsToEnter;
        await updateUserProfile(currentUser.id, { points: newPoints });
        setCurrentUser(prev => prev ? {...prev, points: newPoints} : null);

        await addParticipantToSweepstake(sweepstake.id!, {
          userId: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl,
          avatarHint: currentUser.avatarHint,
        });

        toast({ title: "Participação Registrada!", description: `Você participou de "${sweepstake.title}". Boa sorte!` });
      } catch (error) {
        toast({ title: "Erro ao Participar", description: "Tente novamente.", variant: "destructive" });
      }
    } else {
       toast({ title: `Status: ${sweepstake.status}`, description: `Não é possível participar de "${sweepstake.title}" no momento.`});
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 pb-8">
      <div className="flex items-center justify-between mt-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground text-center flex-grow">
          Todos os Sorteios
        </h1>
        <div className="w-16"></div> 
      </div>
      
      {sweepstakes.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">Nenhum sorteio disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sweepstakes.map((item) => (
            <SweepstakeCard 
              key={item.id}
              sweepstake={item}
              currentUser={currentUser}
              onParticipate={handleParticipate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
