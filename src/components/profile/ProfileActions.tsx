
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, History, HelpCircle, LogOut, ShieldCheck, UserPlus, Gift } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const actionItems = [
  { label: 'Histórico de Check-ins', icon: History, href: '/profile/history' },
  // { label: 'Configurações da Conta', icon: Settings, href: '/profile/settings' }, // Removido
  { label: 'Central de Ajuda', icon: HelpCircle, href: '/help' },
  { label: 'Termos e Privacidade', icon: ShieldCheck, href: '/terms' },
];

const ProfileActions = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, you'd clear session/token here
    toast({
      title: "Logout Realizado",
      description: "Você foi desconectado com sucesso. Redirecionando...",
    });
    router.push('/login');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Ações e Suporte</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ul className="space-y-2">
          {actionItems.map((item) => (
            <li key={item.label}>
              <Button variant="ghost" className="w-full justify-between h-12 px-3 group" asChild>
                <Link href={item.href}>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-card-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </Button>
            </li>
          ))}
          <li>
            <Button variant="ghost" className="w-full justify-between h-12 px-3 group text-green-600 hover:bg-green-500/10 hover:text-green-700">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 transition-colors" />
                <span>Convidar Amigos (Ganhe Pontos!)</span>
              </div>
              <ChevronRight className="w-5 h-5 transition-colors" />
            </Button>
          </li>
           <li>
              <Button 
                variant="ghost" 
                className="w-full justify-between h-12 px-3 text-destructive hover:bg-destructive/10 group"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 group-hover:text-destructive transition-colors" />
                  <span>Sair da Conta</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:text-destructive transition-colors" />
              </Button>
            </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProfileActions;
