
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Building2, PackageCheck, BarChart3, Filter, FileText, Settings2, Gift, ShieldAlert, CreditCard, HelpCircle, BarChartHorizontalBig } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/advertisers', label: 'Anunciantes', icon: Building2 },
  { href: '/admin/offers', label: 'Ofertas', icon: PackageCheck },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/categories', label: 'Categorias', icon: Filter },
  { href: '/admin/reports', label: 'Relatórios', icon: FileText },
  { href: '/admin/sweepstakes', label: 'Sorteios', icon: Gift },
  { href: '/admin/moderation', label: 'Moderação', icon: ShieldAlert },
  { href: '/admin/finance', label: 'Financeiro', icon: CreditCard },
  { href: '/admin/support', label: 'Suporte', icon: HelpCircle },
  { href: '/admin/settings', label: 'Configurações', icon: Settings2 },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-card border-r h-screen sticky top-0">
      <div className="flex items-center justify-center h-16 border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg text-primary">
          <BarChartHorizontalBig className="h-6 w-6" />
          <span>Ofertivo Admin</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {adminNavItems.map((item) => {
            // For now, only the main dashboard link will be considered "active"
            // In a full implementation, each item.href would be checked against pathname
            const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
            
            return (
              <Link
                href={item.href}
                key={item.label}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                  isActive && 'bg-primary/10 text-primary font-medium'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
       <div className="mt-auto p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} Ofertivo</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
