
'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, LifeBuoy } from 'lucide-react';

const faqs = [
  {
    question: "Como ganho pontos no Ofertivo?",
    answer: "Você ganha pontos realizando diversas ações no aplicativo, como fazer check-in em ofertas, compartilhar ofertas com amigos, avaliar ofertas e comerciantes, completar seu perfil e participando de promoções especiais. Cada ação tem uma pontuação específica.",
  },
  {
    question: "Como uso meus pontos?",
    answer: "Seus pontos podem ser usados para participar de sorteios exclusivos, resgatar ofertas especiais que permitem pagamento com pontos, ou trocar por outros benefícios que podem ser anunciados. Fique de olho na seção 'Prêmios'!",
  },
  {
    question: "Como valido uma oferta no estabelecimento?",
    answer: "Ao obter uma oferta, o aplicativo gerará um QR Code único ou um código numérico. Apresente este código ao atendente no estabelecimento para que ele possa validar sua oferta e aplicar o desconto ou benefício.",
  },
  {
    question: "Esqueci minha senha, como recupero?",
    answer: "Na tela de login, clique em 'Esqueceu sua senha?'. Você será instruído a inserir seu e-mail cadastrado para receber um link de redefinição de senha.",
  },
  {
    question: "Como um anunciante pode cadastrar ofertas?",
    answer: "Anunciantes devem criar uma conta de 'Anunciante'. Após o login, terão acesso a um painel onde poderão criar, gerenciar e acompanhar o desempenho de suas ofertas e sorteios.",
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8 pb-8">
      <header className="text-center py-6 bg-card shadow-sm rounded-lg">
        <h1 className="text-3xl font-headline font-bold text-foreground flex items-center justify-center gap-3">
          <LifeBuoy className="h-8 w-8 text-primary" />
          Central de Ajuda
        </h1>
        <p className="text-muted-foreground mt-2">Encontre respostas para suas dúvidas.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
          <CardDescription>Respostas rápidas para as dúvidas mais comuns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ainda precisa de ajuda?</CardTitle>
          <CardDescription>Entre em contato conosco.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Se você não encontrou a resposta para sua dúvida em nosso FAQ, nossa equipe de suporte está pronta para ajudar.
          </p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 text-base h-12" asChild>
              <a href="mailto:suporte@ofertivo.app">
                <Mail className="text-primary" /> Enviar E-mail para suporte@ofertivo.app
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-base h-12" asChild>
              <a href="tel:+5592999990000">
                <Phone className="text-primary" /> Ligar para (92) 99999-0000
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Nosso horário de atendimento é de Segunda a Sexta, das 09h às 18h (Horário de Manaus).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
