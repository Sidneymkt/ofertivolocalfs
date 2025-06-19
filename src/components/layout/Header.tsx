import React from 'react';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-headline font-semibold">Ofertivo Local</h1>
        {/* Placeholder for potential icons like notifications or search */}
      </div>
    </header>
  );
};

export default Header;
