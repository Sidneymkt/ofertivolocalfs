
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import type { Sweepstake, User as AppUser } from '@/types';
import { getSweepstake as fetchSweepstakeDetails, getSweepstakeWinners, addParticipantToSweepstake } from '@/lib/firebase/services/sweepstakeService';
import { getUserProfile, updateUserProfile } from '@/lib/firebase/services/userService';
import { auth } from '@/lib/firebase/firebaseConfig';
import { ArrowLeft, CalendarDays, CheckCircle, Coins, Gift, Loader2, Users, Ticket, Info, ExternalLink, FileText, AlertTriangle, Share2, Trophy } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

const SweepstakeStatusBadge: React.FC<{ status: Sweepstake['status'] }> = ({ status }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let text = status;
  let IconComponent: React.ElementType | null = null;

  switch (status) {
    case 'upcoming':
      variant = 'default'; text = 'Em Breve'; IconComponent = CalendarDays; break;
    case 'active':
      variant = 'secondary'; text = 'Ativo'; IconComponent = Ticket; break;
    case 'ended':
      variant = 'outline'; text = 'Encerrado'; IconComponent = CheckCircle; break;
    case 'drawing_complete':
      variant = 'default'; text = 'Sorteado'; IconComponent = Trophy; break;
    case 'cancelled':
      variant = 'destructive'; text = 'Cancelado'; IconComponent = AlertTriangle; break;
    default:
      text = status.charAt(0).toUpperCase() + status.slice(1);
  }
  return (
    <Badge variant={variant} className="text-xs whitespace-nowrap">
      {IconComponent && <IconComponent size={13} className="mr-1" />}
      {text}
    </Badge>
  );
};


export default function SweepstakeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const sweepstakeId = params.id as string;

  const [sweepstake, setSweepstake] = useState<Sweepstake | null>(null);
  const [winners, setWinners] = useState<import('@/types').SweepstakeWinner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (sweepstakeId) {
        const userAuth = auth.currentUser;
        if(userAuth) {
            const userProfile = await getUserProfile(userAuth.uid);
            setCurrentUser(userProfile);
        }

        const foundSweepstake = await fetchSweepstakeDetails(sweepstakeId);
        if (foundSweepstake) {
          setSweepstake(foundSweepstake);
          if (foundSweepstake.status === 'drawing_complete') {
            const fetchedWinners = await getSweepstakeWinners(sweepstakeId);
            setWinners(fetchedWinners);
          }
        } else {
          toast({ variant: 'destructive', title: 'Sorteio não encontrado' });
          router.push('/rewards'); 
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, [sweepstakeId, router, toast]);

  const handleParticipate = async (e: React.MouseEvent, currentSweepstake: Sweepstake) => {
    e.stopPropagation(); 
    if (!currentUser) {
      toast({ title: "Login Necessário", description: "Faça login para participar.", variant: "destructive" });
      return;
    }
    if (currentUser.points < currentSweepstake.pointsToEnter) {
      toast({ title: "Pontos Insuficientes", description: `Você precisa de ${currentSweepstake.pointsToEnter} pontos.`, variant: "destructive" });
      return;
    }
    const now = new Date();
    const endDate = currentSweepstake.endDate instanceof Timestamp ? currentSweepstake.endDate.toDate() : new Date(currentSweepstake.endDate);
    const startDate = currentSweepstake.startDate instanceof Timestamp ? currentSweepstake.startDate.toDate() : new Date(currentSweepstake.startDate);

    if (isPast(endDate)) {
      toast({ title: "Sorteio Encerrado", description: `O sorteio "${currentSweepstake.title}" já foi finalizado.`});
    } else if (isFuture(startDate)) {
       toast({ title: "Sorteio em Breve", description: `O sorteio "${currentSweepstake.title}" ainda não começou.`});
    } else if (currentSweepstake.status === 'active') {
      try {
        const newPoints = currentUser.points - currentSweepstake.pointsToEnter;
        await updateUserProfile(currentUser.id, { points: newPoints });
        setCurrentUser(prev => prev ? {...prev, points: newPoints} : null);

        await addParticipantToSweepstake(currentSweepstake.id!, {
          userId: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl,
          avatarHint: currentUser.avatarHint,
        });
        toast({ title: "Participação Registrada!", description: `Você participou do sorteio "${currentSweepstake.title}". Boa sorte!` });
      } catch (error) {
        toast({ title: "Erro ao Participar", variant: "destructive", description: "Tente novamente."});
      }
    } else {
       toast({ title: `Status: ${currentSweepstake.status}`, description: `Não é possível participar do sorteio "${currentSweepstake.title}" neste momento.`});
    }
  };
  
  const handleShare = (currentSweepstake: Sweepstake) => {
    if (navigator.share) {
      navigator.share({
        title: `Confira este sorteio: ${currentSweepstake.title}!`,
        text: currentSweepstake.description,
        url: window.location.href,
      })
      .then(() => toast({ title: "Sorteio Compartilhado!", description: "Obrigado por espalhar a notícia!"}))
      .catch((error) => console.error('Erro ao compartilhar:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link do Sorteio Copiado!", description: "Compartilhe com seus amigos."});
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Carregando detalhes do sorteio...</p>
      </div>
    );
  }

  if (!sweepstake) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive text-lg">Sorteio não encontrado.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/rewards">Voltar para Recompensas</Link>
        </Button>
      </div>
    );
  }
  
  const formattedDate = (dateInput: Date | Timestamp | undefined) => {
    if (!dateInput) return "Data Indisponível";
    const date = dateInput instanceof Timestamp ? dateInput.toDate() : new Date(dateInput);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="space-y-6 pb-8">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mt-4 ml-4 md:ml-0">
        <ArrowLeft size={16} className="mr-2" /> Voltar
      </Button>

      <Card className="overflow-hidden shadow-xl m-4 md:m-0">
        <CardHeader className="p-0 relative">
          <div className="w-full aspect-[16/9] md:aspect-[2/1] relative">
            <Image
              src={sweepstake.imageUrl}
              alt={sweepstake.title}
              layout="fill"
              objectFit="cover"
              className="bg-muted"
              data-ai-hint={sweepstake['data-ai-hint'] as string || 'sweepstake prize image'}
            />
          </div>
           <div className="absolute top-3 right-3">
             <SweepstakeStatusBadge status={sweepstake.status} />
           </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <CardTitle className="text-2xl md:text-3xl font-headline">{sweepstake.title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">{sweepstake.description}</CardDescription>
          
          <div className="space-y-2 pt-3 border-t">
            <h3 className="font-semibold text-md flex items-center gap-2"><Gift size={18} className="text-primary"/> Prêmio Principal</h3>
            <p className="text-muted-foreground">{sweepstake.prizeDetails}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              <Coins size={20} className="text-amber-500"/>
              <div>
                <p className="text-xs text-muted-foreground">Custo para Entrar</p>
                <p className="font-semibold text-card-foreground">{sweepstake.pointsToEnter} pontos por bilhete</p>
              </div>
            </div>
             <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              <Users size={20} className="text-primary"/>
              <div>
                <p className="text-xs text-muted-foreground">Ganhadores</p>
                <p className="font-semibold text-card-foreground">{sweepstake.numberOfWinners}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1 text-sm">
             <p className="flex items-center gap-1.5"><CalendarDays size={15} className="text-muted-foreground"/> <strong>Início:</strong> {formattedDate(sweepstake.startDate)}</p>
             <p className="flex items-center gap-1.5"><CalendarDays size={15} className="text-muted-foreground"/> <strong>Término:</strong> {formattedDate(sweepstake.endDate)}</p>
          </div>

          {sweepstake.rules && (
             <div className="space-y-2 pt-3 border-t">
                <h3 className="font-semibold text-md flex items-center gap-2"><FileText size={18} className="text-primary"/> Regras e Condições</h3>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{sweepstake.rules}</p>
            </div>
          )}

          {sweepstake.status === 'drawing_complete' && winners.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-green-600"><Trophy size={20}/> Ganhador(es) do Sorteio!</h3>
                <ul className="space-y-2">
                {winners.map(winner => (
                    <li key={winner.userId} className="flex items-center gap-3 p-2 bg-green-500/10 rounded-md">
                    <Image src={winner.avatarUrl || `https://placehold.co/40x40.png?text=${winner.userName.substring(0,1)}`} alt={winner.userName} width={40} height={40} className="rounded-full" data-ai-hint={winner.avatarHint || 'person avatar'}/>
                    <span className="font-medium text-green-700">{winner.userName}</span>
                    </li>
                ))}
                </ul>
            </div>
          )}
          
        </CardContent>
        <CardFooter className="p-5 border-t flex-col sm:flex-row gap-3">
          <Button 
            className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3"
            onClick={(e) => handleParticipate(e, sweepstake)}
            disabled={sweepstake.status === 'ended' || sweepstake.status === 'drawing_complete' || sweepstake.status === 'cancelled' || sweepstake.status === 'upcoming' || !currentUser}
          >
            <Ticket className="w-5 h-5 mr-2" />
            {sweepstake.status === 'active' ? 'Participar Agora' : 
             sweepstake.status === 'upcoming' ? 'Inicia em Breve' :
             'Verificar Status'}
          </Button>
          <Button variant="outline" className="w-full sm:flex-1" onClick={() => handleShare(sweepstake)}>
            <Share2 size={18} className="mr-2"/> Compartilhar Sorteio
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
