
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Menu, Search, Home, MapPin, Award, User as UserIcon, Settings, LogOut, BarChartHorizontalBig, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const sidebarNavItems = [
  { href: '/', label: 'Ofertas', icon: Home },
  { href: '/map', label: 'Mapa', icon: MapPin },
  { href: '/rewards', label: 'Prêmios', icon: Award },
  { href: '/profile', label: 'Perfil', icon: UserIcon },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, you'd clear session/token here
    // For now, simulate logout and redirect
    toast({
      title: "Logout Realizado",
      description: "Você foi desconectado com sucesso. Redirecionando...",
    });
    router.push('/login');
  };

  return (
    <header className="bg-card text-foreground shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:w-80 p-0 flex flex-col">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <BarChartHorizontalBig className="h-6 w-6 text-primary" />
                Ofertivo
              </SheetTitle>
            </SheetHeader>
            <nav className="flex-grow p-4 space-y-2">
              {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
                        isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')} />
                      {item.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
            <Separator />
            <div className="p-4 space-y-2 border-t">
              <SheetClose asChild>
                <Link
                  href="/settings" // Placeholder for settings page
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted text-foreground hover:text-primary',
                    pathname === '/settings' && 'bg-primary/10 text-primary'
                  )}
                >
                  <Settings className={cn('h-5 w-5 text-muted-foreground group-hover:text-primary', pathname === '/settings' && 'text-primary')} />
                  Configurações
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </Button>
              </SheetClose>
            </div>
            <div className="p-4 mt-auto text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Ofertivo
            </div>
          </SheetContent>
        </Sheet>
        
        <Link href="/" className="text-xl font-headline font-semibold text-primary">
          Ofertivo
        </Link>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
