
'use client';

import React, { useRef, useState, type ChangeEvent } from 'react';
import type { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Settings, Edit3, Building, Phone, Link2, MapPin, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AdvertiserProfileSettingsCardProps {
  advertiserUser: User; // Assuming User type includes businessName, businessLogoUrl etc.
}

const AdvertiserProfileSettingsCard: React.FC<AdvertiserProfileSettingsCardProps> = ({ advertiserUser }) => {
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(advertiserUser.businessLogoUrl || null);
  
  // State for other form fields (simplified for now)
  const [businessName, setBusinessName] = useState(advertiserUser.businessName || '');
  const [businessAddress, setBusinessAddress] = useState(advertiserUser.address || '');
  const [businessWhatsapp, setBusinessWhatsapp] = useState(advertiserUser.whatsapp || '');

  const handleEditLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreviewUrl(reader.result as string);
        toast({
          title: "Logo Selecionada",
          description: `Nova imagem de logo "${file.name}" pronta para upload.`,
        });
      };
      reader.readAsDataURL(file);
      // In a real app, you would then upload the 'file' object.
      console.log("Selected logo file:", file.name);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, collect all form data and send to backend
    console.log("Saving changes:", { businessName, businessAddress, businessWhatsapp, logoPreviewUrl });
    toast({
      title: "Alterações Salvas (Simulado)",
      description: "As informações do seu negócio foram atualizadas.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Settings className="h-6 w-6 text-primary" />
          Configurações do Perfil do Negócio
        </CardTitle>
        <CardDescription>Atualize as informações do seu negócio, logo e horário de funcionamento.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Logo Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="businessLogo" className="text-base font-medium">Logo do Negócio</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-muted">
                <Image 
                  src={logoPreviewUrl || "https://placehold.co/150x150.png?text=Logo"} 
                  alt="Logo do Negócio" 
                  layout="fill" 
                  objectFit="cover"
                  data-ai-hint={advertiserUser.businessLogoHint || "business logo"}
                />
              </div>
              <Button type="button" variant="outline" onClick={handleEditLogoClick}>
                <Edit3 size={16} className="mr-2" /> Alterar Logo
              </Button>
              <input
                type="file"
                id="businessLogo"
                ref={logoInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Business Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="businessName">Nome do Negócio</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex: Pizzaria Saborosa" className="pl-10" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="businessWhatsapp">WhatsApp Comercial</Label>
               <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="businessWhatsapp" type="tel" value={businessWhatsapp} onChange={(e) => setBusinessWhatsapp(e.target.value)} placeholder="(XX) XXXXX-XXXX" className="pl-10"/>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="businessAddress">Endereço Completo</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="businessAddress" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Rua Exemplo, 123, Bairro, Cidade - Estado, CEP" className="pl-10" />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="businessDescription">Descrição Breve do Negócio</Label>
            <Textarea id="businessDescription" placeholder="Conte sobre seus produtos/serviços..." rows={3} defaultValue={advertiserUser.businessDescription || ''} />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="socialLink">Link de Rede Social (Ex: Instagram)</Label>
            <div className="relative">
                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="socialLink" placeholder="https://instagram.com/seunegocio" className="pl-10" defaultValue={""}/>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="openingHours">Horário de Funcionamento</Label>
             <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="openingHours" placeholder="Seg-Sex: 09h-18h, Sáb: 09h-13h" className="pl-10" defaultValue={""}/>
            </div>
          </div>
          
          {/* Placeholder for Map Integration */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Localização no Mapa</Label>
            <div className="w-full h-40 bg-muted rounded-md border flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Integração com mapa em breve.</p>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90">
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvertiserProfileSettingsCard;
