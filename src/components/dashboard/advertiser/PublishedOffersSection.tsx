
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Edit3, 
  Copy, 
  Trash2, 
  Star, 
  Eye, 
  MousePointerClick, 
  ListChecks, 
  AlertTriangle, 
  ClockIcon, 
  Hourglass,
  CheckCircle // Added CheckCircle
} from 'lucide-react';
import Image from 'next/image'; 
import type { PublishedOfferSummary } from '@/types';

interface PublishedOffersSectionProps {
  offers: PublishedOfferSummary[];
}

const StatusBadge: React.FC<{ status: PublishedOfferSummary['status'] }> = ({ status }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let text = status.charAt(0).toUpperCase() + status.slice(1);
  let Icon: React.ElementType | null = null;

  switch (status) {
    case 'active':
      variant = 'secondary'; 
      text = 'Ativa';
      Icon = CheckCircle;
      break;
    case 'expired':
      variant = 'destructive';
      text = 'Expirada';
      Icon = Hourglass;
      break;
    case 'pending':
    case 'awaiting_approval':
      variant = 'default'; 
      text = 'Pendente';
      Icon = ClockIcon;
      break;
    case 'draft':
      variant = 'outline';
      text = 'Rascunho';
      Icon = Edit3;
      break;
    case 'rejected':
      variant = 'destructive';
      text = 'Rejeitada';
      Icon = AlertTriangle;
      break;
    default:
      Icon = ListChecks;
      text = status;
  }


  return <Badge variant={variant} className="flex items-center gap-1 whitespace-nowrap">
    {Icon && <Icon size={13}/>}
    {text}
    </Badge>;
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
                  <TableHead className="w-[60px] hidden md:table-cell">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Preço</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Usos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id} className="hover:bg-muted/50">
                    <TableCell className="hidden md:table-cell p-2">
                      <Image 
                        src={offer.imageUrl || `https://placehold.co/48x48.png?text=Img`} 
                        alt={offer.title} 
                        width={48} 
                        height={48} 
                        className="rounded-md object-cover"
                        data-ai-hint={offer.dataAiHint || "offer image"}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      <div className="flex items-center gap-2">
                        {offer.title}
                        {offer.visibility === 'destaque' && <Star className="h-4 w-4 text-accent fill-accent shrink-0" title="Oferta Destaque" />}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{offer.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={offer.status} />
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-primary">R${offer.discountedPrice.toFixed(2)}</span>
                        {offer.originalPrice && <span className="text-xs text-muted-foreground line-through">R${offer.originalPrice.toFixed(2)}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden lg:table-cell text-sm text-muted-foreground">
                        {offer.usersUsedCount || 0}
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
