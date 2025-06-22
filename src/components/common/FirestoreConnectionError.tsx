'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface FirestoreConnectionErrorProps {
  message?: string;
}

export const FirestoreConnectionError: React.FC<FirestoreConnectionErrorProps> = ({ message }) => {
  const { toast } = useToast();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // If projectId is missing, the issue is almost certainly the environment variables.
  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="m-4 shadow-lg border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold text-destructive mt-4">Erro de Configuração do Firebase</h2>
              <p className="text-destructive/90 max-w-xl mx-auto mt-2">
                A variável de ambiente <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">NEXT_PUBLIC_FIREBASE_PROJECT_ID</code> não foi encontrada.
              </p>
            </div>
            
            <div className="text-sm text-left bg-destructive/10 p-4 rounded-md max-w-2xl mx-auto space-y-3">
                <p className="font-semibold">Ação Necessária: Configure seu arquivo <code className="font-mono">.env.local</code></p>
                <p>
                  Para desenvolvimento local, você precisa de um arquivo chamado <code className="font-mono">.env.local</code> na raiz do seu projeto com as chaves do Firebase.
                </p>
                <div>
                  <p className="mb-2 font-medium">1. Crie o arquivo <code className="font-mono">.env.local</code> se ele não existir.</p>
                  <p className="mb-2 font-medium">2. Adicione todas as suas chaves do Firebase, como no exemplo abaixo:</p>
                  <pre className="mt-2 text-left p-3 bg-background rounded-md text-card-foreground overflow-x-auto text-xs">
                    <code>
{`NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
GEMINI_API_KEY=...`}
                    </code>
                  </pre>
                </div>
                 <div>
                  <p className="font-bold text-lg mt-2">3. Reinicie seu servidor de desenvolvimento!</p>
                  <p>Esta é a etapa mais importante. Depois de salvar o arquivo, você deve parar (Ctrl+C) e reiniciar o servidor (`npm run dev`).</p>
                 </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If projectId is present, the issue is likely Firestore Rules.
  const firestoreRulesUrl = `https://console.firebase.google.com/project/${projectId}/firestore/rules`;
  const rulesToCopy = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de ofertas, usuários e sorteios
    match /offers/{offerId} {
      allow read: if true;
      allow write: if request.auth != null; // Permitir escrita se autenticado
    }
    match /offers/{offerId}/{subcollection}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId; // Usuário pode escrever no seu próprio perfil
    }
    match /sweepstakes/{sweepstakeId} {
      allow read: if true;
      allow write: if request.auth != null; // Apenas autenticados (ou admins) podem criar
    }
     match /sweepstakes/{sweepstakeId}/{subcollection}/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(rulesToCopy);
    toast({
      title: "Regras Copiadas!",
      description: "Cole estas regras na aba 'Regras' do seu Firestore.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="m-4 shadow-lg border-destructive/50 bg-destructive/5">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold text-destructive mt-4">Erro de Conexão com o Banco de Dados</h2>
            <p className="text-destructive/90 max-w-xl mx-auto mt-2">
              {message || 'Não foi possível carregar os dados. A causa mais comum são as Regras de Segurança do Firestore bloqueando o acesso.'}
            </p>
          </div>
          
          <div className="text-sm text-left bg-destructive/10 p-4 rounded-md max-w-2xl mx-auto space-y-3">
              <p className="font-semibold">Ação Sugerida: Atualizar Regras de Segurança</p>
              <p>
                Se você iniciou o banco de dados no "modo de produção", por padrão ele bloqueia todas as leituras e escritas. Você precisa permitir o acesso público para coleções como 'offers'.
              </p>
              <div>
                <p className="mb-2 font-medium">1. Copie as regras de segurança abaixo:</p>
                <div className="relative">
                    <pre className="mt-2 text-left p-3 bg-background rounded-md text-card-foreground overflow-x-auto text-xs">
                        <code>{rulesToCopy}</code>
                    </pre>
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-7 w-7" onClick={handleCopyRules}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
              </div>
               <div>
                <p className="mb-2 font-medium">2. Cole as regras no seu Console do Firebase:</p>
                 <Button asChild>
                    <Link href={firestoreRulesUrl} target="_blank">
                      Abrir Editor de Regras do Firestore <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
               </div>
          </div>
          <p className="text-xs text-muted-foreground pt-4 border-t text-center">
            Após publicar as novas regras, atualize esta página. A mudança é instantânea e não requer um novo deploy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
