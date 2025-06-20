
'use client';

import React, { useState, useEffect } from 'react';
import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, MapPin, Phone, Mail, CheckCircle, Gift, Save, XCircle, User as UserIconLucide } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface PersonalDataCardProps {
  user: User;
  onSaveChanges?: (updatedData: Partial<User>) => void; // Optional: Callback for actual save
}

const PersonalDataCard: React.FC<PersonalDataCardProps> = ({ user, onSaveChanges }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [editableName, setEditableName] = useState(user.name);
  const [editableEmail, setEditableEmail] = useState(user.email || '');
  const [editableAddress, setEditableAddress] = useState(user.address || '');
  const [editableCity, setEditableCity] = useState(user.city || '');
  const [editableWhatsapp, setEditableWhatsapp] = useState(user.whatsapp || '');

  useEffect(() => {
    // Reset fields if user prop changes (e.g., after a real save and re-fetch)
    setEditableName(user.name);
    setEditableEmail(user.email || '');
    setEditableAddress(user.address || '');
    setEditableCity(user.city || '');
    setEditableWhatsapp(user.whatsapp || '');
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset fields to original user data
    setEditableName(user.name);
    setEditableEmail(user.email || '');
    setEditableAddress(user.address || '');
    setEditableCity(user.city || '');
    setEditableWhatsapp(user.whatsapp || '');
    setIsEditing(false);
  };

  const handleSave = () => {
    const updatedData = {
      name: editableName,
      email: editableEmail,
      address: editableAddress,
      city: editableCity,
      whatsapp: editableWhatsapp,
    };

    if (onSaveChanges) {
      onSaveChanges(updatedData); // Call parent save function if provided
    } else {
      // Simulate saving
      console.log('Saving data (simulated):', updatedData);
      toast({
        title: 'Dados Salvos!',
        description: 'Suas informações foram atualizadas com sucesso (simulado).',
      });
    }
    setIsEditing(false);
  };

  const inputIconProps = { size: 16, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" };
  const inputClassName = "pl-10";

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserIconLucide className="text-primary" />
          Dados Pessoais
        </CardTitle>
        <CardDescription>Mantenha seus dados atualizados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName">Nome Completo</Label>
              <div className="relative mt-1">
                <UserIconLucide {...inputIconProps} />
                <Input id="userName" value={editableName} onChange={(e) => setEditableName(e.target.value)} className={inputClassName} />
              </div>
            </div>
            <div>
              <Label htmlFor="userEmail">E-mail</Label>
              <div className="relative mt-1">
                <Mail {...inputIconProps} />
                <Input id="userEmail" type="email" value={editableEmail} onChange={(e) => setEditableEmail(e.target.value)} className={inputClassName} />
              </div>
            </div>
            <div>
              <Label htmlFor="userAddress">Endereço Completo</Label>
              <div className="relative mt-1">
                <MapPin {...inputIconProps} />
                <Input id="userAddress" value={editableAddress} onChange={(e) => setEditableAddress(e.target.value)} className={inputClassName} />
              </div>
            </div>
            <div>
              <Label htmlFor="userCity">Cidade</Label>
              <div className="relative mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...inputIconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m12 14-4-2.5"/><path d="m12 14 4-2.5"/><path d="m12 14 4 2.5"/><path d="m12 14-4 2.5"/><path d="M12 3v11"/></svg>
                <Input id="userCity" value={editableCity} onChange={(e) => setEditableCity(e.target.value)} className={inputClassName} />
              </div>
            </div>
            <div>
              <Label htmlFor="userWhatsapp">WhatsApp</Label>
              <div className="relative mt-1">
                <Phone {...inputIconProps} />
                <Input id="userWhatsapp" type="tel" value={editableWhatsapp} onChange={(e) => setEditableWhatsapp(e.target.value)} className={inputClassName} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={handleSave} className="w-full sm:flex-1 bg-primary hover:bg-primary/90">
                <Save size={16} className="mr-2" /> Salvar Alterações
              </Button>
              <Button variant="outline" onClick={handleCancel} className="w-full sm:flex-1">
                <XCircle size={16} className="mr-2" /> Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                  <UserIconLucide size={16} className="text-muted-foreground" />
                  <span className="text-card-foreground font-medium">{user.name}</span>
              </div>
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

            {user.isProfileComplete && !isEditing && ( // Only show if not editing and profile was initially complete
              <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-md border border-secondary/30 text-sm">
                <Gift size={18} className="text-secondary" />
                <p className="text-secondary font-medium">Parabéns! Você ganhou +50 pontos por completar seu perfil!</p>
              </div>
            )}

            <Button variant="outline" onClick={handleEdit} className="w-full mt-4">
              <Edit3 size={16} className="mr-2" /> Editar Perfil
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalDataCard;
