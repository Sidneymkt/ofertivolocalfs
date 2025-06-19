
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, UploadCloud, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MediaManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="h-8 w-8 text-primary" />
            Gestão de Mídia
          </h1>
          <p className="text-muted-foreground">Gerencie as imagens e ativos de mídia da plataforma Ofertivo.</p>
        </div>
        <Button>
          <UploadCloud className="mr-2 h-5 w-5" /> Fazer Upload de Nova Mídia
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Biblioteca de Mídia</CardTitle>
          <CardDescription>Visualize e gerencie todas as imagens carregadas.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center bg-muted/30 border border-dashed rounded-md p-8">
          <Construction className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Em Desenvolvimento</h2>
          <p className="text-muted-foreground max-w-md">
            A funcionalidade completa de gerenciamento de mídia, incluindo upload, visualização em galeria,
            edição e exclusão de imagens, está sendo construída.
          </p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Em breve, você poderá substituir os placeholders das ofertas e outras áreas do app por aqui.
          </p>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Otimização e Formatos</CardTitle>
          <CardDescription>Diretrizes para o upload de imagens.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Formatos recomendados: <code className="bg-muted px-1 py-0.5 rounded text-xs">JPEG</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs">PNG</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs">WEBP</code>.</p>
            <p>Resolução ideal para banners de oferta: <code className="bg-muted px-1 py-0.5 rounded text-xs">1200x600 pixels</code> (proporção 2:1).</p>
            <p>Resolução ideal para galerias de oferta: <code className="bg-muted px-1 py-0.5 rounded text-xs">800x450 pixels</code> (proporção 16:9).</p>
            <p>Tamanho máximo do arquivo: <code className="bg-muted px-1 py-0.5 rounded text-xs">2MB</code>.</p>
            <p>As imagens serão otimizadas automaticamente após o upload.</p>
        </CardContent>
      </Card>
    </div>
  );
}
