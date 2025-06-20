import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card text-foreground shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-headline font-semibold text-primary">Ofertivo</h1>
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
