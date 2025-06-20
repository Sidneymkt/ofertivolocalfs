
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { mockUser } from '@/types'; // Para simular dados do usuário
import { Gift, Users, Share2, ClipboardCopy, Link as LinkIcon, Award } from 'lucide-react';
import Head from 'next/head';

// Simulação de pontos por indicação
const POINTS_FOR_REFERRAL_SUCCESS = 50;

export default function InviteFriendsPage() {
  const { toast } = useToast();

  // Simulação de código e link de referência
  const referralCode = `${mockUser.name.split(' ')[0].toUpperCase().substring(0,5)}${mockUser.id.substring(0,4).toUpperCase()}`;
  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/signup/user?ref=${referralCode}` : `https://ofertivo.app/signup/user?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: 'Código Copiado!',
      description: 'Seu código de indicação foi copiado para a área de transferência.',
    });
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Convite para o Ofertivo!',
        text: `Junte-se a mim no Ofertivo e ganhe ${POINTS_FOR_REFERRAL_SUCCESS} pontos! Use meu código: ${referralCode}`,
        url: referralLink,
      })
      .then(() => toast({ title: 'Link Compartilhado!', description: 'Convite enviado com sucesso.' }))
      .catch((error) => {
        console.error('Erro ao compartilhar:', error);
        // Fallback para copiar o link se o compartilhamento nativo falhar ou for cancelado
        navigator.clipboard.writeText(referralLink);
        toast({ title: 'Link Copiado!', description: 'O link de convite foi copiado para a área de transferência.' });
      });
    } else {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: 'Link Copiado!',
        description: 'O link de convite foi copiado para a área de transferência.',
      });
    }
  };

  return (
    <>
      <Head>
        <title>Convidar Amigos - Ofertivo</title>
      </Head>
      <div className="space-y-8 pb-8">
        <header className="text-center py-6 bg-card shadow-sm rounded-lg">
          <h1 className="text-3xl font-headline font-bold text-foreground flex items-center justify-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            Convide Amigos e Ganhe Pontos!
          </h1>
          <p className="text-muted-foreground mt-2">
            Compartilhe o Ofertivo e ambos ganham <span className="font-bold text-accent">{POINTS_FOR_REFERRAL_SUCCESS} pontos</span>!
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardCopy size={20} className="text-primary" /> Seu Código de Indicação</CardTitle>
            <CardDescription>Compartilhe este código com seus amigos para que eles insiram durante o cadastro.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input 
              readOnly 
              value={referralCode} 
              className="text-2xl font-mono tracking-wider text-center h-14 bg-muted/50"
            />
            <Button onClick={handleCopyCode} className="w-full">
              <ClipboardCopy size={18} className="mr-2" /> Copiar Código
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon size={20} className="text-primary" /> Seu Link de Convite Exclusivo</CardTitle>
            <CardDescription>Ou compartilhe este link diretamente. Ele já contém seu código!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input 
              readOnly 
              value={referralLink} 
              className="text-sm h-12 bg-muted/50 truncate"
            />
            <Button onClick={handleShareLink} className="w-full bg-secondary hover:bg-secondary/90">
              <Share2 size={18} className="mr-2" /> Compartilhar Link
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary"><Award size={20}/> Como Funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-primary/90">
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary text-lg">1.</span>
              <p>Compartilhe seu código único ou link de convite com seus amigos.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary text-lg">2.</span>
              <p>Seu amigo se cadastra no Ofertivo usando seu código ou através do seu link.</p>
            </div>
             <div className="flex items-start gap-3">
              <span className="font-bold text-primary text-lg">3.</span>
              <p>Quando seu amigo fizer o primeiro check-in em qualquer oferta válida...</p>
            </div>
            <div className="flex items-center justify-center gap-3 p-3 bg-background/70 rounded-md text-center">
              <Users size={24} className="text-accent"/>
              <p className="font-semibold text-accent text-lg">
                Vocês dois ganham {POINTS_FOR_REFERRAL_SUCCESS} pontos!
              </p>
               <Users size={24} className="text-accent"/>
            </div>
             <p className="text-xs text-center text-primary/70 pt-2">
              Quanto mais amigos você convidar, mais pontos você pode acumular! Não há limites.
            </p>
          </CardContent>
        </Card>
        
        {/* Placeholder for invited friends list - Future enhancement */}
        {/* 
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Amigos Convidados</CardTitle>
            <CardDescription>Acompanhe o status dos seus convites.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-4"> (Lista de amigos convidados e status da recompensa em breve) </p>
          </CardContent>
        </Card>
        */}
      </div>
    </>
  );
}
