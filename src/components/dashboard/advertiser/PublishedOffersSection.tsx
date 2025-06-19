
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit3, Copy, Trash2, Star, Eye, MousePointerClick, ListChecks } from 'lucide-react';
import Image from 'next/image'; // For placeholder images
import type { PublishedOfferSummary } from '@/types';

interface PublishedOffersSectionProps {
  offers: PublishedOfferSummary[];
}

const StatusBadge: React.FC<{ status: PublishedOfferSummary['status'] }> = ({ status }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let text = status.charAt(0).toUpperCase() + status.slice(1);

  if (status === 'active') {
    variant = 'secondary'; // Greenish
    text = 'Ativa';
  } else if (status === 'expired') {
    variant = 'destructive';
    text = 'Expirada';
  } else if (status === 'pending') {
    variant = 'default'; // Bluish (primary)
    text = 'Pendente';
  } else if (status === 'draft') {
    variant = 'outline';
    text = 'Rascunho';
  }

  return <Badge variant={variant}>{text}</Badge>;
};

const PublishedOffersSection: React.FC<PublishedOffersSectionProps> = ({ offers }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary" />
          Ofertas Publicadas
        </CardTitle>
        <CardDescription>Gerencie suas ofertas ativas, pendentes e expiradas.</CardDescription>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">Nenhuma oferta publicada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden md:table-cell">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Visualizações</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Cliques</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id} className="hover:bg-muted/50">
                    <TableCell className="hidden md:table-cell">
                      <Image 
                        src={offer.imageUrl || `https://placehold.co/64x64.png?text=Oferta`} 
                        alt={offer.title} 
                        width={48} 
                        height={48} 
                        className="rounded-md object-cover"
                        data-ai-hint={offer.dataAiHint || "offer image"}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {offer.title}
                        {offer.isFeatured && <Star className="h-4 w-4 text-accent fill-accent" title="Oferta Destaque" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={offer.status} />
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Eye size={14}/> {offer.views}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                       <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <MousePointerClick size={14}/> {offer.clicks}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" title="Editar">
                        <Edit3 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-secondary" title="Duplicar">
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Excluir">
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublishedOffersSection;
