
import React from 'react';
import AdminMetricsGrid from '@/components/admin/AdminMetricsGrid';
import { mockAdminMetrics, adminModules } from '@/types';
import RevenueChartPlaceholder from '@/components/admin/charts/RevenueChartPlaceholder';
import AdminModuleCard from '@/components/admin/AdminModuleCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Zap, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground">Visão geral da plataforma Ofertivo.</p>
        </div>
        <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <Select defaultValue="month">
                <SelectTrigger className="w-[180px] bg-card">
                    <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="quarter">Este Trimestre</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <AdminMetricsGrid metrics={mockAdminMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <RevenueChartPlaceholder />
        </div>
        <div className="space-y-6">
            <AdminModuleCard 
                title="Ações Rápidas" 
                icon={Zap}
                description="Atalhos para tarefas comuns."
                bgColorClass="bg-primary/5"
            >
                <div className="space-y-2">
                    <Button className="w-full" variant="outline">Verificar Anunciantes Pendentes</Button>
                    <Button className="w-full" variant="outline">Moderar Comentários Recentes</Button>
                    <Button className="w-full" variant="outline">Gerar Relatório Semanal</Button>
                </div>
            </AdminModuleCard>
             <AdminModuleCard 
                title="Status do Sistema" 
                icon={ShieldCheck}
                description="Saúde geral da plataforma."
                 bgColorClass="bg-green-500/5"
            >
                <div className="text-sm space-y-1">
                    <p className="flex justify-between"><span>Servidores:</span> <span className="text-green-600 font-semibold">Online</span></p>
                    <p className="flex justify-between"><span>Banco de Dados:</span> <span className="text-green-600 font-semibold">Operacional</span></p>
                    <p className="flex justify-between"><span>API:</span> <span className="text-green-600 font-semibold">Estável</span></p>
                </div>
            </AdminModuleCard>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4 text-foreground">Módulos de Gestão</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.filter(module => module.id !== 'dashboard').map((module) => (
            <AdminModuleCard 
              key={module.id} 
              title={module.title} 
              icon={module.icon}
              description={module.description}
            >
                <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/10">
                    Gerenciar {module.title.split(' ').length > 1 ? module.title.split(' ')[1] : module.title.split(' ')[0]}
                </Button>
            </AdminModuleCard>
          ))}
        </div>
      </div>

    </div>
  );
}

    