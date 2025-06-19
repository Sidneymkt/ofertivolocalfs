
'use client';

import React from 'react';
import type { User, UserStatus } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, ShieldAlert, CheckCircle, CircleSlash } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface UserListTableProps {
  users: User[];
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
    case 'inactive':
      variant = 'outline';
      text = 'Inativo';
      break;
    case 'suspended':
      variant = 'destructive';
      text = 'Suspenso';
      Icon = ShieldAlert;
      break;
    case 'pending_verification':
      variant = 'default';
      text = 'Pendente';
      Icon = CircleSlash;
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

const UserListTable: React.FC<UserListTableProps> = ({ users }) => {
  const { toast } = useToast();

  const handleAction = (action: string, userName: string) => {
    toast({
      title: `Ação: ${action}`,
      description: `Ação "${action}" para o usuário ${userName} (simulado).`,
    });
  };

  if (!users || users.length === 0) {
    return <p className="text-center text-muted-foreground py-10">Nenhum usuário encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] hidden sm:table-cell">Avatar</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Pontos</TableHead>
            <TableHead className="hidden lg:table-cell">Data de Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell className="hidden sm:table-cell">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint || 'person avatar'} />
                  <AvatarFallback>{user.name?.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium max-w-[150px] truncate">{user.name}</TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[200px] truncate">{user.email}</TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">{user.points.toLocaleString('pt-BR')}</TableCell>
              <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                {user.joinDate ? format(new Date(user.joinDate), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
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
                    <DropdownMenuItem onClick={() => handleAction('Visualizar Perfil', user.name)}>
                      <Eye className="mr-2 h-4 w-4" /> Visualizar Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Editar Usuário', user.name)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar Usuário
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status !== 'suspended' ? (
                      <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleAction('Suspender Usuário', user.name)}>
                        <ShieldAlert className="mr-2 h-4 w-4" /> Suspender
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-green-600 focus:bg-green-500/10 focus:text-green-700" onClick={() => handleAction('Reativar Usuário', user.name)}>
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

export default UserListTable;
