
import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from '@/components/ui/toaster'; // Assuming Toaster is globally used

export const metadata = {
  title: 'Painel Admin - Ofertivo',
  description: 'Painel de Administração da Plataforma Ofertivo',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-muted/40">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex flex-col flex-1">
            <AdminHeader />
            <main className="flex-grow p-6 md:p-8 lg:p-10">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

    