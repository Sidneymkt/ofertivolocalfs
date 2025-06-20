
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Sweepstake, SweepstakeParticipant, SweepstakeWinner } from '@/types';
import { mockSweepstakes, getMockSweepstakeById, mockAdvertiserUser } from '@/types';
import { ArrowLeft, CalendarDays, CheckCircle, Coins, Gift, Loader2, Settings, Ticket, Trophy, Users, AlertTriangle, ExternalLink, Share2 } from 'lucide-react';
import Image from 'next/image';
import { format, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnWinners, setDrawnWinners] = useState<SweepstakeWinner[]>([]);

  useEffect(() => {
    if (sweepstakeId) {
      // Simulate fetching sweepstake details
      const foundSweepstake = getMockSweepstakeById(sweepstakeId);
      if (foundSweepstake) {
        setSweepstake(foundSweepstake);
        if (foundSweepstake.isDrawn && foundSweepstake.winners) {
          setDrawnWinners(foundSweepstake.winners);
        }
      } else {
        toast({ variant: 'destructive', title: 'Sorteio não encontrado' });
        router.push('/dashboard/advertiser'); // Redirect if not found
      }
      setIsLoading(false);
    }
  }, [sweepstakeId, router, toast]);

  const handleDrawSweepstake = async () => {
    if (!sweepstake || !sweepstake.participants || sweepstake.participants.length === 0) {
      toast({ variant: 'destructive', title: 'Sem participantes', description: 'Não há participantes para realizar o sorteio.' });
      return;
    }
    if (sweepstake.isDrawn) {
      toast({ title: 'Sorteio já realizado', description: 'Este sorteio já foi finalizado.' });
      return;
    }
    if (isFuture(new Date(sweepstake.endDate))) {
        toast({ variant: 'destructive', title: 'Sorteio ainda ativo', description: 'Aguarde a data de término para realizar o sorteio.'});
        return;
    }

    setIsDrawing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate draw time

    const participantsList = [...sweepstake.participants];
    const winners: SweepstakeWinner[] = [];
    const numWinnersToDraw = Math.min(sweepstake.numberOfWinners, participantsList.length);

    for (let i = 0; i < numWinnersToDraw; i++) {
      if (participantsList.length === 0) break;
      const randomIndex = Math.floor(Math.random() * participantsList.length);
      const winner = participantsList.splice(randomIndex, 1)[0];
      winners.push({ userId: winner.id, userName: winner.name, avatarUrl: winner.avatarUrl, avatarHint: winner.avatarHint });
    }
    
    setDrawnWinners(winners);
    setSweepstake(prev => prev ? ({ ...prev, isDrawn: true, status: 'drawing_complete', winners, drawDate: new Date() }) : null);
    setIsDrawing(false);

    toast({
      title: 'Sorteio Realizado!',
      description: `${winners.length} ganhador(es) selecionado(s).`,
      duration: 7000,
    });
  };
  
  const handleShareResults = () => {
    // Placeholder for sharing functionality
    toast({ title: "Compartilhar Resultados", description: "Funcionalidade de compartilhamento em breve."});
  }

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
          <Link href="/dashboard/advertiser">Voltar para o Painel</Link>
        </Button>
      </div>
    );
  }
  
  const canDraw = !sweepstake.isDrawn && isPast(new Date(sweepstake.endDate));

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
        {/* Coluna de Detalhes e Ações */}
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
              <p><strong>Início:</strong> {format(new Date(sweepstake.startDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              <p><strong>Término (Sorteio):</strong> {format(new Date(sweepstake.endDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              {sweepstake.isDrawn && sweepstake.drawDate && (
                <p className="text-green-600 font-semibold"><strong>Sorteado em:</strong> {format(new Date(sweepstake.drawDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              )}
            </CardContent>
          </Card>
           <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings size={20} className="text-primary" /> Ações do Sorteio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 {sweepstake.status === 'active' && isFuture(new Date(sweepstake.endDate)) && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md text-sm text-blue-700">
                        Este sorteio está ativo e aceitando participantes.
                    </div>
                )}
                {sweepstake.status === 'upcoming' && (
                     <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-sm text-yellow-700">
                        Este sorteio começará em {format(new Date(sweepstake.startDate), "dd/MM/yyyy", { locale: ptBR })}.
                    </div>
                )}
                
                <Button 
                  onClick={handleDrawSweepstake} 
                  disabled={!canDraw || isDrawing || sweepstake.isDrawn}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isDrawing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isDrawing ? 'Sorteando...' : sweepstake.isDrawn ? 'Sorteio Realizado' : 'Realizar Sorteio Agora'}
                </Button>
                {!canDraw && !sweepstake.isDrawn && isFuture(new Date(sweepstake.endDate)) && (
                    <p className="text-xs text-muted-foreground text-center">O sorteio poderá ser realizado após {format(new Date(sweepstake.endDate), "dd/MM/yyyy HH:mm", { locale: ptBR })}.</p>
                )}
                 <Button variant="outline" className="w-full" onClick={() => alert("Editar detalhes do sorteio (funcionalidade em breve)")}>
                    Editar Detalhes
                </Button>
                {sweepstake.isDrawn && (
                    <Button variant="secondary" className="w-full" onClick={handleShareResults}>
                       <Share2 size={16} className="mr-2"/> Compartilhar Resultados
                    </Button>
                )}
              </CardContent>
            </Card>
        </div>

        {/* Coluna de Participantes e Ganhadores */}
        <div className="lg:col-span-2 space-y-6">
          {drawnWinners.length > 0 && (
            <Card className="shadow-xl border-2 border-green-500 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-green-700"><Trophy size={24} /> Ganhador(es) do Sorteio!</CardTitle>
                <CardDescription>Parabéns aos sortudos!</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {drawnWinners.map(winner => (
                    <li key={winner.userId} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <Avatar className="h-12 w-12 border-2 border-green-400">
                        <AvatarImage src={winner.avatarUrl} alt={winner.userName} data-ai-hint={winner.avatarHint || 'person avatar'}/>
                        <AvatarFallback className="bg-green-200 text-green-700">{winner.userName?.substring(0,1)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg text-green-800">{winner.userName}</p>
                        <p className="text-xs text-green-600">ID: {winner.userId}</p>
                      </div>
                       <Button size="sm" variant="ghost" className="ml-auto text-green-700 hover:bg-green-500/20">
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
              <CardTitle className="flex items-center gap-2"><Users size={20} className="text-primary" /> Participantes Inscritos ({sweepstake.participants?.length || 0})</CardTitle>
              <CardDescription>
                {sweepstake.maxParticipants ? `Máximo de ${sweepstake.maxParticipants} participantes.` : 'Participação ilimitada.'}
                {sweepstake.pointsToEnter > 0 && ` Custo: ${sweepstake.pointsToEnter} pontos por entrada.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sweepstake.participants && sweepstake.participants.length > 0 ? (
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
                      {sweepstake.participants.map(participant => (
                        <TableRow key={participant.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participant.avatarUrl} alt={participant.name} data-ai-hint={participant.avatarHint || 'person avatar'} />
                              <AvatarFallback>{participant.name?.substring(0,1)}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium text-sm max-w-[150px] truncate">{participant.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            {format(new Date(participant.entryDate), 'dd/MM/yy HH:mm', { locale: ptBR })}
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
             {sweepstake.participants && sweepstake.participants.length > 0 && (
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Total de {sweepstake.participants.length} entradas no sorteio.</p>
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


    