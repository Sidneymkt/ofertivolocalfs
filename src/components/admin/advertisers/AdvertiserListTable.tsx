
'use client';

import React from 'react';
import type { User, UserStatus, AdvertiserPlan } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, ShieldAlert, CheckCircle, ShieldCheck, DollarSign, CircleSlash } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface AdvertiserListTableProps {
  advertisers: User[]; // Using User type as it contains advertiser-specific fields
}

const StatusBadge: React.FC<{ status?: UserStatus }> = ({ status }) => {
  if (!status) return <Badge variant="outline">Desconhecido</Badge>;

  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  let Icon: React.ElementType | null = CircleSlash;
  let text = status;

  switch (status) {
    case 'active':
      variant = 'secondary';
      text = 'Ativo';
      Icon = CheckCircle;
      break;
    case 'pending_verification':
      variant = 'default';
      text = 'Pendente Verif.';
      Icon = CircleSlash;
      break;
    case 'suspended':
      variant = 'destructive';
      text = 'Suspenso';
      Icon = ShieldAlert;
      break;
    default:
      text = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <Badge variant={variant} className="flex items-center gap-1 whitespace-nowrap text-xs">
      {Icon && <Icon size={13} />}
      {text}
    </Badge>
  );
};

const PlanBadge: React.FC<{ plan?: AdvertiserPlan }> = ({ plan }) => {
  if (!plan) return <Badge variant="outline">N/A</Badge>;
  let planText = plan.charAt(0).toUpperCase() + plan.slice(1);
  let planColor: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

  switch (plan) {
    case 'basic': planColor = 'outline'; planText = 'Básico'; break;
    case 'pro': planColor = 'secondary'; planText = 'Pro'; break;
    case 'premium': planColor = 'default'; planText = 'Premium'; break; // default (primary)
    case 'trial': planColor = 'outline'; planText = 'Teste'; break;
  }
  return <Badge variant={planColor} className="text-xs">{planText}</Badge>;
};


const AdvertiserListTable: React.FC<AdvertiserListTableProps> = ({ advertisers }) => {
  const { toast } = useToast();

  const handleAction = (action: string, businessName?: string) => {
    toast({
      title: `Ação: ${action}`,
      description: `Ação "${action}" para o anunciante ${businessName || 'N/A'} (simulado).`,
    });
  };

  if (!advertisers || advertisers.length === 0) {
    return <p className="text-center text-muted-foreground py-10">Nenhum anunciante encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] hidden sm:table-cell">Logo</TableHead>
            <TableHead>Nome do Negócio</TableHead>
            <TableHead className="hidden md:table-cell">Responsável</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Plano</TableHead>
            <TableHead className="hidden lg:table-cell">Data de Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {advertisers.map((advertiser) => (
            <TableRow key={advertiser.id} className="hover:bg-muted/50">
              <TableCell className="hidden sm:table-cell">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={advertiser.businessLogoUrl} alt={advertiser.businessName} data-ai-hint={advertiser.businessLogoHint || 'store logo'} />
                  <AvatarFallback>{advertiser.businessName?.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium max-w-[180px] truncate">{advertiser.businessName || 'N/A'}</TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[150px] truncate">{advertiser.responsibleName || 'N/A'}</TableCell>
              <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[180px] truncate">{advertiser.email}</TableCell>
              <TableCell>
                <StatusBadge status={advertiser.advertiserStatus} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <PlanBadge plan={advertiser.advertiserPlan} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                {advertiser.joinDate ? format(new Date(advertiser.joinDate), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleAction('Visualizar Painel', advertiser.businessName)}>
                      <Eye className="mr-2 h-4 w-4" /> Ver Painel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Editar Cadastro', advertiser.businessName)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar Cadastro
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleAction('Gerenciar Plano', advertiser.businessName)}>
                      <DollarSign className="mr-2 h-4 w-4" /> Gerenciar Plano
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {advertiser.advertiserStatus === 'pending_verification' && (
                       <DropdownMenuItem className="text-green-600 focus:bg-green-500/10 focus:text-green-700" onClick={() => handleAction('Aprovar Anunciante', advertiser.businessName)}>
                        <ShieldCheck className="mr-2 h-4 w-4" /> Aprovar
                      </DropdownMenuItem>
                    )}
                    {advertiser.advertiserStatus !== 'suspended' && advertiser.advertiserStatus !== 'pending_verification' && (
                      <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleAction('Suspender Anunciante', advertiser.businessName)}>
                        <ShieldAlert className="mr-2 h-4 w-4" /> Suspender
                      </DropdownMenuItem>
                    )}
                    {advertiser.advertiserStatus === 'suspended' && (
                      <DropdownMenuItem className="text-green-600 focus:bg-green-500/10 focus:text-green-700" onClick={() => handleAction('Reativar Anunciante', advertiser.businessName)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Reativar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdvertiserListTable;
