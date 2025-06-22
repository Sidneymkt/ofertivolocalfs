
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigationBar from '@/components/layout/BottomNavigationBar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex flex-col flex-grow pb-20 bg-gradient-to-b from-muted/50 to-background"> 
        {children}
      </main>
      <BottomNavigationBar />
    </div>
  );
}
