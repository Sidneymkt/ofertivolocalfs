
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminModules } from '@/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChartHorizontalBig } from 'lucide-react';

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
          {adminModules.map((module) => {
            const itemHref = module.id === 'dashboard' ? '/admin' : `/admin/${module.id}`;
            const isActive = pathname === itemHref || (pathname.startsWith(itemHref) && itemHref !== '/admin');
            
            return (
              <Link
                href={itemHref}
                key={module.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                  isActive && 'bg-primary/10 text-primary font-medium'
                )}
              >
                <module.icon className="h-5 w-5" />
                {module.title}
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

    