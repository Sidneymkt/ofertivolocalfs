'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Award, User, Rocket } from 'lucide-react'; // Added Rocket as a placeholder
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Ofertas', icon: Home },
  { href: '/map', label: 'Mapa', icon: MapPin },
  { href: '/rewards', label: 'Prêmios', icon: Award },
  { href: '/profile', label: 'Perfil', icon: User },
];

const BottomNavigationBar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-t-lg h-16 z-40">
      <div className="container mx-auto h-full flex justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center text-center px-2 py-1 rounded-md transition-colors duration-200 ease-in-out',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className={cn('h-6 w-6 mb-0.5', isActive ? 'stroke-[2.5px]' : '')} />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
