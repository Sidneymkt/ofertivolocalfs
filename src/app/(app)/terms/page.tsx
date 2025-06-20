
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, FileText } from 'lucide-react';

export default function TermsAndPrivacyPage() {
  const placeholderText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

1.  **Introdução:** Bem-vindo ao Ofertivo. Ao usar nosso aplicativo, você concorda com estes termos.
2.  **Uso do Serviço:**
    *   Você deve ter pelo menos 18 anos para usar o Ofertivo ou a idade legal para formar um contrato vinculativo.
    *   Você é responsável por manter a confidencialidade da sua conta e senha.
3.  **Conteúdo do Usuário:**
    *   Ao postar comentários ou avaliações, você concede ao Ofertivo uma licença mundial, não exclusiva, para usar esse conteúdo.
    *   Não poste conteúdo ilegal, difamatório ou que infrinja direitos de terceiros.
4.  **Ofertas e Anunciantes:**
    *   Ofertivo não é responsável pela qualidade, segurança ou legalidade das ofertas publicadas pelos anunciantes.
    *   Disputas sobre ofertas devem ser resolvidas diretamente com o anunciante.
5.  **Propriedade Intelectual:**
    *   O conteúdo do Ofertivo (excluindo conteúdo do usuário) é propriedade do Ofertivo e protegido por leis de direitos autorais.
6.  **Limitação de Responsabilidade:** O Ofertivo não será responsável por quaisquer danos indiretos, incidentais ou consequenciais.
7.  **Modificações nos Termos:** Podemos modificar estes termos a qualquer momento. Notificaremos sobre mudanças significativas.
8.  **Lei Aplicável:** Estes termos serão regidos pelas leis do Brasil.

Última atualização: ${new Date().toLocaleDateString('pt-BR')}
  `;

  const privacyPolicyText = `
Sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações.

1.  **Informações que Coletamos:**
    *   **Informações Fornecidas por Você:** Nome, e-mail, endereço, informações de perfil, comentários, etc.
    *   **Informações Coletadas Automaticamente:** Dados de uso, informações do dispositivo, localização (com sua permissão).
2.  **Como Usamos Suas Informações:**
    *   Para fornecer e melhorar nossos serviços.
    *   Para personalizar sua experiência.
    *   Para comunicação sobre sua conta ou nossos serviços.
    *   Para fins de marketing (com seu consentimento).
3.  **Compartilhamento de Informações:**
    *   Com anunciantes (apenas dados agregados ou com seu consentimento para ofertas específicas).
    *   Com provedores de serviço que nos auxiliam.
    *   Por motivos legais ou para proteger nossos direitos.
4.  **Segurança dos Dados:** Implementamos medidas para proteger suas informações, mas nenhum sistema é 100% seguro.
5.  **Seus Direitos:** Você pode acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco.
6.  **Cookies e Tecnologias Semelhantes:** Usamos cookies para melhorar sua experiência.
7.  **Privacidade de Crianças:** Nosso serviço não é direcionado a menores de 13 anos.
8.  **Alterações nesta Política:** Podemos atualizar esta política. Notificaremos sobre mudanças.

Última atualização: ${new Date().toLocaleDateString('pt-BR')}
  `;


  return (
    <div className="space-y-8 pb-8">
      <header className="text-center py-6 bg-card shadow-sm rounded-lg">
        <h1 className="text-3xl font-headline font-bold text-foreground flex items-center justify-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Termos e Privacidade
        </h1>
        <p className="text-muted-foreground mt-2">Leia nossos termos de uso e política de privacidade.</p>
      </header>

      <Card className="shadow-lg">
        <CardContent className="p-0">
            <Tabs defaultValue="terms" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sticky top-16 z-10 bg-card border-b rounded-t-lg rounded-b-none">
                    <TabsTrigger value="terms" className="py-3 text-base flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none">
                       <FileText size={18} /> Termos de Uso
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="py-3 text-base flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none">
                       <ShieldCheck size={18} /> Política de Privacidade
                    </TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-18rem)]"> {/* Adjust height as needed */}
                    <TabsContent value="terms" className="p-6 mt-0">
                        <article className="prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-line">
                          <h2 className="text-xl font-semibold text-foreground mb-4">Termos de Uso do Ofertivo</h2>
                          {placeholderText}
                        </article>
                    </TabsContent>
                    <TabsContent value="privacy" className="p-6 mt-0">
                        <article className="prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-line">
                           <h2 className="text-xl font-semibold text-foreground mb-4">Política de Privacidade do Ofertivo</h2>
                           {privacyPolicyText}
                        </article>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
