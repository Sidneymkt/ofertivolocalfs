
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Sweepstake, SweepstakeParticipant, SweepstakeWinner, User as AppUser } from '@/types';
import { 
  getSweepstake as fetchSweepstakeDetails, 
  getSweepstakeParticipants, 
  getSweepstakeWinners, 
  addWinnersToSweepstake,
  updateSweepstake 
} from '@/lib/firebase/services/sweepstakeService';
import { auth } from '@/lib/firebase/firebaseConfig';
import { getUserProfile } from '@/lib/firebase/services/userService';
import { ArrowLeft, CalendarDays, CheckCircle, Coins, Gift, Loader2, Settings, Ticket, Trophy, Users, AlertTriangle, ExternalLink, Share2, FileText } from 'lucide-react';
import Image from 'next/image';
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


export default function ManageSweepstakePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const sweepstakeId = params.id as string;

  const [sweepstake, setSweepstake] = useState<Sweepstake | null>(null);
  const [participants, setParticipants] = useState<SweepstakeParticipant[]>([]);
  const [winners, setWinners] = useState<SweepstakeWinner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const loadSweepstakeData = useCallback(async () => {
    setIsLoading(true);
    if (sweepstakeId) {
      const userAuth = auth.currentUser;
      if (userAuth) {
        const userProfile = await getUserProfile(userAuth.uid);
        setCurrentUser(userProfile);
        if (!(userProfile && userProfile.isAdvertiser)) {
          toast({ variant: 'destructive', title: 'Acesso Negado' });
          router.push('/dashboard/advertiser');
          return;
        }
      } else {
        router.push('/login'); // Should not happen if layout protects route
        return;
      }

      const foundSweepstake = await fetchSweepstakeDetails(sweepstakeId);
      if (foundSweepstake && foundSweepstake.createdBy === userAuth.uid) {
        setSweepstake(foundSweepstake);
        const fetchedParticipants = await getSweepstakeParticipants(sweepstakeId);
        setParticipants(fetchedParticipants);
        if (foundSweepstake.status === 'drawing_complete') {
          const fetchedWinners = await getSweepstakeWinners(sweepstakeId);
          setWinners(fetchedWinners);
        }
      } else {
        toast({ variant: 'destructive', title: 'Sorteio não encontrado ou não pertence a você' });
        router.push('/dashboard/advertiser'); 
      }
    }
    setIsLoading(false);
  }, [sweepstakeId, router, toast]);
  
  useEffect(() => {
    loadSweepstakeData();
  }, [loadSweepstakeData]);


  const handleDrawSweepstake = async () => {
    if (!sweepstake || participants.length === 0) {
      toast({ variant: 'destructive', title: 'Sem participantes', description: 'Não há participantes para realizar o sorteio.' });
      return;
    }
    if (sweepstake.status === 'drawing_complete') {
      toast({ title: 'Sorteio já realizado', description: 'Este sorteio já foi finalizado.' });
      return;
    }
    const endDate = sweepstake.endDate instanceof Timestamp ? sweepstake.endDate.toDate() : new Date(sweepstake.endDate);
    if (isFuture(endDate) && sweepstake.status !== 'ended') { // Allow draw if manually ended early
        toast({ variant: 'destructive', title: 'Sorteio ainda ativo', description: 'Aguarde a data de término para realizar o sorteio, ou finalize-o manualmente.'});
        return;
    }

    setIsDrawing(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const participantsList = [...participants];
    const drawnWinnersList: SweepstakeWinner[] = [];
    const numWinnersToDraw = Math.min(sweepstake.numberOfWinners, participantsList.length);

    for (let i = 0; i < numWinnersToDraw; i++) {
      if (participantsList.length === 0) break;
      const randomIndex = Math.floor(Math.random() * participantsList.length);
      const winnerData = participantsList.splice(randomIndex, 1)[0];
      drawnWinnersList.push({ userId: winnerData.id, userName: winnerData.name, avatarUrl: winnerData.avatarUrl, avatarHint: winnerData.avatarHint });
    }
    
    try {
      await addWinnersToSweepstake(sweepstake.id!, drawnWinnersList);
      setWinners(drawnWinnersList);
      setSweepstake(prev => prev ? ({ ...prev, status: 'drawing_complete', isDrawn: true, drawDate: Timestamp.now() }) : null);
      toast({ title: 'Sorteio Realizado!', description: `${drawnWinnersList.length} ganhador(es) selecionado(s).`, duration: 7000 });
    } catch(error) {
        console.error("Error drawing sweepstake: ", error);
        toast({variant: 'destructive', title: "Erro ao sortear", description: "Tente novamente."});
    } finally {
        setIsDrawing(false);
    }
  };
  
  const handleShareResults = () => {
    // Placeholder for sharing functionality
    toast({ title: "Compartilhar Resultados", description: "Funcionalidade de compartilhamento em breve."});
  }
  
  const handleEndSweepstakeEarly = async () => {
    if (!sweepstake || sweepstake.status !== 'active') return;
    try {
        await updateSweepstake(sweepstake.id!, { status: 'ended', endDate: Timestamp.now() });
        setSweepstake(prev => prev ? {...prev, status: 'ended', endDate: Timestamp.now()} : null);
        toast({title: "Sorteio Encerrado", description: "O sorteio foi encerrado manualmente."});
    } catch (error) {
        toast({title: "Erro", description: "Não foi possível encerrar o sorteio.", variant: "destructive"});
    }
  }


  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!sweepstake) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive text-lg">Sorteio não encontrado.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/advertiser">Voltar para o Painel</Link>
        </Button>
      </div>
    );
  }
  
  const endDate = sweepstake.endDate instanceof Timestamp ? sweepstake.endDate.toDate() : new Date(sweepstake.endDate);
  const canDraw = (sweepstake.status === 'ended' || isPast(endDate)) && sweepstake.status !== 'drawing_complete' && sweepstake.status !== 'upcoming' && sweepstake.status !== 'cancelled';
  const canEndEarly = sweepstake.status === 'active' && isFuture(endDate);

  const formattedDate = (dateInput: Date | Timestamp | undefined) => {
    if (!dateInput) return "Data Indisponível";
    const date = dateInput instanceof Timestamp ? dateInput.toDate() : new Date(dateInput);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };


  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
        <ArrowLeft size={16} className="mr-2" /> Voltar
      </Button>

      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground flex items-center gap-3">
                <Ticket className="h-8 w-8 text-primary" />
                Gerenciar Sorteio: {sweepstake.title}
            </h1>
            <SweepstakeStatusBadge status={sweepstake.status} />
        </div>
        <p className="text-muted-foreground mt-1">{sweepstake.description}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Gift size={20} className="text-primary" /> Prêmio Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full rounded-md overflow-hidden mb-3">
                <Image src={sweepstake.imageUrl} alt={sweepstake.title} layout="fill" objectFit="cover" data-ai-hint={sweepstake['data-ai-hint'] || 'prize image'}/>
              </div>
              <p className="text-lg font-semibold text-accent">{sweepstake.prizeDetails}</p>
              <p className="text-sm text-muted-foreground mt-1">Número de Ganhadores: {sweepstake.numberOfWinners}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarDays size={20} className="text-primary" /> Datas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Início:</strong> {formattedDate(sweepstake.startDate)}</p>
              <p><strong>Término (Sorteio):</strong> {formattedDate(sweepstake.endDate)}</p>
              {sweepstake.status === 'drawing_complete' && sweepstake.drawDate && (
                <p className="text-green-600 font-semibold"><strong>Sorteado em:</strong> {formattedDate(sweepstake.drawDate)}</p>
              )}
            </CardContent>
          </Card>
           <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings size={20} className="text-primary" /> Ações do Sorteio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 {sweepstake.status === 'active' && isFuture(endDate) && (
                    <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-500/10" onClick={handleEndSweepstakeEarly}>
                       <CheckCircle size={16} className="mr-2"/> Encerrar Sorteio Manualmente
                    </Button>
                )}
                
                <Button 
                  onClick={handleDrawSweepstake} 
                  disabled={!canDraw || isDrawing || sweepstake.status === 'drawing_complete'}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isDrawing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isDrawing ? 'Sorteando...' : sweepstake.status === 'drawing_complete' ? 'Sorteio Realizado' : 'Realizar Sorteio Agora'}
                </Button>
                {!canDraw && sweepstake.status === 'active' && isFuture(endDate) && (
                    <p className="text-xs text-muted-foreground text-center">O sorteio poderá ser realizado após {formattedDate(endDate)}.</p>
                )}
                <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/advertiser/create-sweepstake?editId=${sweepstake.id}`)}>
                    Editar Detalhes
                </Button>
                {sweepstake.status === 'drawing_complete' && (
                    <Button variant="secondary" className="w-full" onClick={handleShareResults}>
                       <Share2 size={16} className="mr-2"/> Compartilhar Resultados
                    </Button>
                )}
              </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {winners.length > 0 && (
            <Card className="shadow-xl border-2 border-green-500 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-green-700"><Trophy size={24} /> Ganhador(es) do Sorteio!</CardTitle>
                <CardDescription>Parabéns aos sortudos!</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {winners.map(winner => (
                    <li key={winner.userId} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <Avatar className="h-12 w-12 border-2 border-green-400">
                        <AvatarImage src={winner.avatarUrl} alt={winner.userName} data-ai-hint={winner.avatarHint || 'person avatar'}/>
                        <AvatarFallback className="bg-green-200 text-green-700">{winner.userName?.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg text-green-800">{winner.userName}</p>
                        <p className="text-xs text-green-600">ID: {winner.userId}</p>
                      </div>
                       <Button size="sm" variant="ghost" className="ml-auto text-green-700 hover:bg-green-500/20" onClick={() => alert(`Contactar ${winner.userName}`)}>
                          Contactar <ExternalLink size={14} className="ml-1.5"/>
                       </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users size={20} className="text-primary" /> Participantes Inscritos ({participants.length || 0})</CardTitle>
              <CardDescription>
                {sweepstake.maxParticipants ? `Máximo de ${sweepstake.maxParticipants} participantes.` : 'Participação ilimitada.'}
                {sweepstake.pointsToEnter > 0 && ` Custo: ${sweepstake.pointsToEnter} pontos por entrada.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] hidden sm:table-cell">Avatar</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Data de Inscrição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map(participant => (
                        <TableRow key={participant.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participant.avatarUrl} alt={participant.name} data-ai-hint={participant.avatarHint || 'person avatar'} />
                              <AvatarFallback>{participant.name?.substring(0,1)}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium text-sm max-w-[150px] truncate">{participant.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            {formattedDate(participant.entryDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => alert(`Ver perfil de ${participant.name}`)}>
                              Ver Perfil
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">Nenhum participante inscrito até o momento.</p>
              )}
            </CardContent>
             {participants.length > 0 && (
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Total de {participants.length} entradas no sorteio.</p>
                </CardFooter>
            )}
          </Card>
          
          {sweepstake.rules && (
             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><FileText size={18}/> Regras e Termos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{sweepstake.rules}</p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
