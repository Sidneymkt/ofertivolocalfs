'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface FirestoreConnectionErrorProps {
  message?: string;
}

export const FirestoreConnectionError: React.FC<FirestoreConnectionErrorProps> = ({ message }) => {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const firestoreUrl = projectId
    ? `https://console.firebase.google.com/project/${projectId}/firestore`
    : 'https://console.firebase.google.com/';

  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="m-4 shadow-lg border-destructive/50 bg-destructive/5">
        <CardContent className="p-6 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-destructive">Erro de Conexão com o Banco de Dados</h2>
          <p className="text-destructive/90 max-w-xl mx-auto">
            {message || 'Não foi possível carregar os dados. Isso geralmente acontece pelos seguintes motivos:'}
          </p>
          
          {isProduction ? (
            <div className="text-sm text-left bg-destructive/10 p-4 rounded-md max-w-2xl mx-auto space-y-2">
              <p className="font-semibold">Ocorreu um erro no ambiente de produção. Verifique:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Se todos os secrets listados no seu arquivo <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">apphosting.yaml</code> foram criados no <Link href={`https://console.cloud.google.com/security/secret-manager?project=${projectId || ''}`} target="_blank" className="underline">Google Secret Manager</Link>.</li>
                <li>Se os nomes dos secrets no Google Secret Manager são **exatamente** iguais aos nomes no <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">apphosting.yaml</code> (ex: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`).</li>
                <li>Se o banco de dados **Cloud Firestore** está ativado e com as regras de segurança corretas para o projeto.</li>
              </ol>
            </div>
          ) : (
             <ol className="text-sm text-left list-decimal list-inside bg-destructive/10 p-3 rounded-md max-w-lg mx-auto">
              <li>O valor de `NEXT_PUBLIC_FIREBASE_PROJECT_ID` no seu arquivo <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">.env.local</code> está incorreto.</li>
              <li>O banco de dados **Cloud Firestore** não foi criado ou ativado no seu projeto Firebase.</li>
            </ol>
          )}

          <Button asChild>
            <Link href={firestoreUrl} target="_blank">
              Verificar Firestore no Console <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground pt-4 border-t">
            Após corrigir, um novo deploy (git push) é necessário para o ambiente de produção, ou reinicie o servidor para o ambiente de desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
