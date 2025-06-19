
'use client';

import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, MapPin, Phone, Mail, CheckCircle, Gift } from 'lucide-react';

interface PersonalDataCardProps {
  user: User;
}

const PersonalDataCard: React.FC<PersonalDataCardProps> = ({ user }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Dados Pessoais
        </CardTitle>
        <CardDescription>Mantenha seus dados atualizados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          {user.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground" />
              <span className="text-card-foreground">{user.email}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-muted-foreground" />
              <span className="text-card-foreground">{user.address}</span>
            </div>
          )}
          {user.city && (
             <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m12 14-4-2.5"/><path d="m12 14 4-2.5"/><path d="m12 14 4 2.5"/><path d="m12 14-4 2.5"/><path d="M12 3v11"/></svg>
              <span className="text-card-foreground">{user.city}</span>
            </div>
          )}
          {user.whatsapp && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-card-foreground">{user.whatsapp}</span>
            </div>
          )}
        </div>

        {user.isProfileComplete && (
          <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-md border border-secondary/30 text-sm">
            <Gift size={18} className="text-secondary" />
            <p className="text-secondary font-medium">Parabéns! Você ganhou +50 pontos por completar seu perfil!</p>
          </div>
        )}

        <Button variant="outline" className="w-full">
          <Edit3 size={16} className="mr-2" /> Editar Perfil
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalDataCard;

    