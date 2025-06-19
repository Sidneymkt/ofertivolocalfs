
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, UserPlus } from 'lucide-react';
import AdvertiserListTable from '@/components/admin/advertisers/AdvertiserListTable';
import { mockAdvertiserList } from '@/types';

export default function AdminAdvertisersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Gestão de Anunciantes
          </h1>
          <p className="text-muted-foreground">Gerencie todos os anunciantes e negócios cadastrados na plataforma.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-5 w-5" /> Adicionar Novo Anunciante
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Anunciantes</CardTitle>
          <CardDescription>Visualize, edite, aprove ou suspenda contas de anunciantes.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdvertiserListTable advertisers={mockAdvertiserList} />
        </CardContent>
      </Card>
    </div>
  );
}
