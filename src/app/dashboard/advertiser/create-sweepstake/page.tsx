
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, PlusCircle, Construction } from 'lucide-react';
import Link from 'next/link';

export default function CreateSweepstakePage() {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground flex items-center gap-3">
          <Gift className="h-8 w-8 text-primary" />
          Criar Novo Sorteio
        </h1>
        <p className="text-muted-foreground">Preencha os detalhes abaixo para configurar seu sorteio.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes do Sorteio</CardTitle>
          <CardDescription>Defina o prêmio, regras, datas e como participar.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center bg-muted/30 border border-dashed rounded-md p-8">
          <Construction className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Em Breve: Formulário de Criação de Sorteios</h2>
          <p className="text-muted-foreground max-w-md">
            Estamos trabalhando para trazer um formulário completo e intuitivo para você criar e gerenciar seus sorteios.
            Você poderá definir prêmios, datas, custo em pontos para participar, e muito mais!
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/dashboard/advertiser">
              Voltar ao Painel
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-md bg-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="text-secondary text-lg flex items-center gap-2"><PlusCircle size={20} /> Dicas para um Sorteio de Sucesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-secondary/80">
            <p>✓ Ofereça um prêmio atraente e relevante para seu público.</p>
            <p>✓ Defina regras claras e fáceis de entender.</p>
            <p>✓ Promova seu sorteio nas suas redes sociais e para seus clientes.</p>
            <p>✓ Utilize os sorteios para aumentar o engajamento e fidelizar clientes.</p>
          </CardContent>
        </Card>
    </div>
  );
}
