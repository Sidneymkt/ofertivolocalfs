
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';
import UserListTable from '@/components/admin/users/UserListTable';
import { mockUserList } from '@/types';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground">Gerencie todos os usuários da plataforma Ofertivo.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-5 w-5" /> Adicionar Novo Usuário
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Usuários Cadastrados</CardTitle>
          <CardDescription>Visualize, edite e gerencie as contas dos usuários.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserListTable users={mockUserList} />
        </CardContent>
      </Card>
    </div>
  );
}
