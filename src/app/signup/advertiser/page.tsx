
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { categories as businessCategories } from '@/types';
import { User, Briefcase, Building as BuildingIcon, Mail, Lock, Phone, MapPin, Link2, FileText, List, Eye, EyeOff, CheckCircle } from 'lucide-react';

const advertiserSignupSchema = z.object({
  responsibleName: z.string().min(3, { message: 'Nome do responsável deve ter pelo menos 3 caracteres.' }),
  businessName: z.string().min(2, { message: 'Nome do negócio deve ter pelo menos 2 caracteres.' }),
  cnpjOrCpf: z.string().min(11, { message: 'CNPJ ou CPF deve ter pelo menos 11 caracteres.' }), // Simplified validation
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string().min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres.' }),
  commercialWhatsapp: z.string().min(10, { message: 'WhatsApp comercial deve ter pelo menos 10 dígitos.' }),
  fullAddress: z.string().min(5, { message: 'Endereço completo deve ter pelo menos 5 caracteres.' }),
  businessCategory: z.string({ required_error: 'Por favor, selecione uma categoria.' }),
  socialLink: z.string().url({ message: 'Por favor, insira uma URL válida.' }).optional().or(z.literal('')),
  businessDescription: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres.' }).max(300, { message: 'Descrição não pode exceder 300 caracteres.' }),
  terms: z.boolean().refine(value => value === true, { message: 'Você deve aceitar os termos comerciais.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
});

type AdvertiserSignupFormValues = z.infer<typeof advertiserSignupSchema>;

// Helper to get Lucide icon component by name
const getIconComponent = (iconName?: string) => {
  if (!iconName) return List; // Default icon
  const icons: { [key: string]: React.ElementType } = {
    Utensils: require('lucide-react').Utensils,
    Wrench: require('lucide-react').Wrench,
    ShoppingCart: require('lucide-react').ShoppingCart,
    Smile: require('lucide-react').Smile,
    HeartPulse: require('lucide-react').HeartPulse,
    BookOpen: require('lucide-react').BookOpen,
  };
  return icons[iconName] || List;
};


export default function AdvertiserSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<AdvertiserSignupFormValues>({
    resolver: zodResolver(advertiserSignupSchema),
    defaultValues: {
      responsibleName: '',
      businessName: '',
      cnpjOrCpf: '',
      email: '',
      password: '',
      confirmPassword: '',
      commercialWhatsapp: '',
      fullAddress: '',
      businessCategory: undefined,
      socialLink: '',
      businessDescription: '',
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<AdvertiserSignupFormValues> = (data) => {
    console.log('Advertiser signup data:', data);
    toast({
      title: "Cadastro de anunciante realizado com sucesso!",
      description: "Seu negócio agora faz parte do Ofertivo! Redirecionando para o painel...",
    });
    // Lógica para salvar anunciante, CRM, plano inicial.
    router.push('/dashboard/advertiser'); // Placeholder
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 selection:bg-primary selection:text-primary-foreground">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Criar Conta como Anunciante</CardTitle>
          <CardDescription>Cadastre seu negócio e comece a divulgar suas ofertas!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="responsibleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="responsibleName">Nome do Responsável</FormLabel>
                       <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="responsibleName" placeholder="Seu nome" {...field} className="pl-10" /></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="businessName">Nome do Negócio</FormLabel>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="businessName" placeholder="Nome fantasia do seu negócio" {...field} className="pl-10" /></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cnpjOrCpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="cnpjOrCpf">CNPJ (ou CPF, se MEI)</FormLabel>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="cnpjOrCpf" placeholder="Seu CNPJ ou CPF" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">E-mail</FormLabel>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="email" type="email" placeholder="emailcomercial@exemplo.com" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="passwordAdv">Senha</FormLabel>
                       <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="passwordAdv" type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-10 pr-10" /></FormControl>
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-primary" onClick={togglePasswordVisibility}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPasswordAdv">Confirmar Senha</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="confirmPasswordAdv" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-10 pr-10" /></FormControl>
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-primary" onClick={toggleConfirmPasswordVisibility}>
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="commercialWhatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="commercialWhatsapp">WhatsApp Comercial</FormLabel>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="commercialWhatsapp" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fullAddress">Endereço Completo do Negócio</FormLabel>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="fullAddress" placeholder="Rua, número, bairro, cidade, estado, CEP" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="businessCategory">Categoria do Negócio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="businessCategory" className="[&>span]:line-clamp-1">
                           <div className="flex items-center">
                            {field.value ? React.createElement(getIconComponent(businessCategories.find(c=>c.name === field.value)?.icon), { className: "mr-2 h-4 w-4 text-muted-foreground" }) : <List className="mr-2 h-4 w-4 text-muted-foreground" /> }
                            <SelectValue placeholder="Selecione uma categoria" />
                           </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessCategories.map(category => {
                          const IconComponent = getIconComponent(category.icon);
                          return (
                            <SelectItem key={category.name} value={category.name}>
                              <div className="flex items-center">
                                <IconComponent className="mr-2 h-4 w-4 text-muted-foreground" />
                                {category.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="socialLink">Link de Rede Social (Opcional)</FormLabel>
                    <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="socialLink" placeholder="https://instagram.com/seunegocio" {...field} className="pl-10" /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="businessDescription">Descrição Breve do Negócio</FormLabel>
                     <FormControl>
                        <Textarea
                            id="businessDescription"
                            placeholder="Conte um pouco sobre seu negócio, seus produtos ou serviços principais."
                            className="resize-none"
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>Máximo de 300 caracteres.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="termsAdvertiser" />
                    </FormControl>
                     <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="termsAdvertiser" className="font-normal">
                        Li e aceito os <Link href="/commercial-terms" className="text-primary hover:underline">Termos Comerciais do Ofertivo</Link>.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="button" variant="outline" className="w-full" onClick={() => alert('Solicitar verificação do perfil (funcionalidade pendente).')}>
                <CheckCircle className="mr-2 h-4 w-4 text-secondary" /> Solicitar Verificação do Perfil
              </Button>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar e Criar Primeira Oferta'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Já tem uma conta de anunciante?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

