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

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="m-4 shadow-lg border-destructive/50 bg-destructive/5">
        <CardContent className="p-6 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-destructive">Erro de Conexão com o Banco de Dados</h2>
          <p className="text-destructive/90 max-w-xl mx-auto">
            {message || 'Não foi possível carregar os dados. Isso geralmente acontece por dois motivos:'}
          </p>
          <ol className="text-sm text-left list-decimal list-inside bg-destructive/10 p-3 rounded-md max-w-lg mx-auto">
            <li>O valor de `NEXT_PUBLIC_FIREBASE_PROJECT_ID` no seu arquivo <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">.env.local</code> está incorreto.</li>
            <li>O banco de dados **Cloud Firestore** não foi criado ou ativado no seu projeto Firebase.</li>
          </ol>
          <Button asChild>
            <Link href={firestoreUrl} target="_blank">
              Verificar Firestore no Console <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground pt-4 border-t">
            Após corrigir, reinicie o servidor de desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
