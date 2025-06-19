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
      <main className="flex-grow container mx-auto px-4 py-6 pb-20"> 
        {/* pb-20 to ensure content doesn't hide behind bottom nav */}
        {children}
      </main>
      <BottomNavigationBar />
    </div>
  );
}
