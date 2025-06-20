
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, FileText, Download, Search, Filter, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Mock data for leads
const mockLeads = [
  { id: 'lead1', name: 'Ana Clara Explorer', email: 'anaclara@exemplo.com', phone: '(92) 99999-8888', avatar: 'https://placehold.co/40x40.png?text=AE', lastInteraction: 'Favoritou "Pizza Gigante"', interactionDate: '2024-07-28' },
  { id: 'lead2', name: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '(92) 98877-1234', avatar: 'https://placehold.co/40x40.png?text=BC', lastInteraction: 'Check-in em "Corte Masculino"', interactionDate: '2024-07-27' },
  { id: 'lead3', name: 'Carlos Pizzaiolo', email: 'carlos.pizza@saborosa.com', phone: '(92) 98877-6655', avatar: 'https://placehold.co/40x40.png?text=CP', lastInteraction: 'Seguiu seu negócio', interactionDate: '2024-07-26' },
  { id: 'lead4', name: 'Daniela Silva', email: 'daniela.s@test.dev', phone: '(11) 91234-5678', avatar: 'https://placehold.co/40x40.png?text=DS', lastInteraction: 'Comentou em "Happy Hour"', interactionDate: '2024-07-25' },
];


export default function LeadsCrmPage() {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-headline font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            CRM de Leads
            </h1>
            <p className="text-muted-foreground">Gerencie seus contatos e interações com clientes.</p>
        </div>
        <Button onClick={() => alert('Funcionalidade de exportação em breve!')}>
          <Download className="mr-2 h-5 w-5" /> Exportar Leads (CSV/Excel)
        </Button>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>Visualize os usuários que interagiram com suas ofertas e seu negócio. Use estas informações para campanhas futuras.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar lead por nome, email..." className="pl-8 bg-background" />
            </div>
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtrar Leads
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] hidden sm:table-cell">Avatar</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                    <TableHead>Última Interação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/50">
                      <TableCell className="hidden sm:table-cell">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={lead.avatar} alt={lead.name} data-ai-hint="person avatar" />
                          <AvatarFallback>{lead.name.substring(0,1)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium max-w-[150px] truncate">{lead.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[180px] truncate">{lead.email}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{lead.phone}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {lead.lastInteraction} ({new Date(lead.interactionDate).toLocaleDateString('pt-BR')})
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Enviar Email (simulado)" onClick={() => alert(`Simulando envio de email para ${lead.email}`)}>
                            <Mail size={16} />
                        </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8" title="Ligar (simulado)" onClick={() => alert(`Simulando ligação para ${lead.phone}`)}>
                            <Phone size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="min-h-[200px] flex flex-col items-center justify-center text-center bg-muted/30 border border-dashed rounded-md p-8">
                <Users className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium text-foreground">Nenhum lead encontrado ainda.</p>
                <p className="text-sm text-muted-foreground">Quando os usuários interagirem com suas ofertas, eles aparecerão aqui.</p>
             </div>
          )}
        </CardContent>
      </Card>

       <Card className="shadow-md bg-blue-500/5 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-blue-600 text-lg flex items-center gap-2"><FileText size={20} /> Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-700/80">
            <p>✓ Em breve: Filtros avançados por tipo de interação, data, tags de ofertas.</p>
            <p>✓ Em breve: Integração para campanhas de E-mail Marketing e WhatsApp.</p>
            <p>✓ Em breve: Segmentação de leads para ofertas personalizadas.</p>
             <Button asChild variant="link" className="p-0 h-auto text-blue-600">
                <Link href="/dashboard/advertiser/create-offer">
                Crie mais ofertas para atrair leads!
                </Link>
            </Button>
          </CardContent>
        </Card>

    </div>
  );
}
