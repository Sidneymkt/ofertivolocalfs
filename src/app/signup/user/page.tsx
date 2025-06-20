
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Phone, MapPin, Building, Eye, EyeOff, Loader2 as SpinnerIcon } from 'lucide-react';
import { auth, db } from '@/lib/firebase/firebaseConfig';
import { createUserWithEmailAndPassword, type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User as AppUser } from '@/types';
import { POINTS_SIGNUP_WELCOME, USER_LEVELS } from '@/types';

const userSignupSchema = z.object({
  fullName: z.string().min(3, { message: 'Nome completo deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string().min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres.' }),
  whatsapp: z.string().min(10, { message: 'WhatsApp deve ter pelo menos 10 dígitos.' }).optional().or(z.literal('')),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' }),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres.' }),
  terms: z.boolean().refine(value => value === true, { message: 'Você deve aceitar os termos e condições.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
});

type UserSignupFormValues = z.infer<typeof userSignupSchema>;

export default function UserSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserSignupFormValues>({
    resolver: zodResolver(userSignupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      whatsapp: '',
      address: '',
      city: '',
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<UserSignupFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      const newUserProfile: AppUser = {
        id: firebaseUser.uid,
        name: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp || undefined,
        address: data.address,
        city: data.city,
        points: POINTS_SIGNUP_WELCOME,
        level: USER_LEVELS.INICIANTE.name,
        currentXp: 0,
        xpToNextLevel: USER_LEVELS.INICIANTE.nextLevelXp,
        joinDate: serverTimestamp() as unknown as Date, // Firestore will convert this
        isAdvertiser: false,
        status: 'active',
        isProfileComplete: false, // Can be updated later
        // Initialize other optional fields as needed
        avatarUrl: `https://placehold.co/100x100.png?text=${data.fullName.substring(0,1).toUpperCase()}`,
        avatarHint: 'person avatar',
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUserProfile);

      toast({
        title: "Cadastro realizado com sucesso!",
        description: `Bem-vindo(a) ao Ofertivo, ${data.fullName}! Você ganhou ${POINTS_SIGNUP_WELCOME} pontos!`,
      });
      router.push('/'); 
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Ocorreu um erro ao tentar se cadastrar.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este e-mail já está cadastrado.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "O formato do e-mail é inválido.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "A senha é muito fraca. Tente uma mais forte.";
      }
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 selection:bg-primary selection:text-primary-foreground"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="abstract gradient"
    >
      <Card className="w-full max-w-lg shadow-xl bg-card/90 backdrop-blur-sm border border-border/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Criar Conta de Usuário</CardTitle>
          <CardDescription>Junte-se ao Ofertivo e comece a economizar agora mesmo!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fullName">Nome completo</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input id="fullName" placeholder="Seu nome completo" {...field} className="pl-10" />
                      </FormControl>
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
                        <FormControl>
                          <Input id="email" type="email" placeholder="seuemail@exemplo.com" {...field} className="pl-10" />
                        </FormControl>
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
                      <FormLabel htmlFor="password">Senha</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-10 pr-10" />
                        </FormControl>
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-primary" onClick={togglePasswordVisibility} aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}>
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
                      <FormLabel htmlFor="confirmPassword">Confirmar Senha</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                          <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} className="pl-10 pr-10" />
                        </FormControl>
                         <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-primary" onClick={toggleConfirmPasswordVisibility} aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}>
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
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="whatsapp">WhatsApp (Opcional)</FormLabel>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                           <Input id="whatsapp" type="tel" placeholder="(XX) XXXXX-XXXX" {...field} value={field.value ?? ''} className="pl-10" />
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">Endereço completo</FormLabel>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                           <Input id="address" placeholder="Sua rua, número, bairro" {...field} className="pl-10" />
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="city">Cidade</FormLabel>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                            <Input id="city" placeholder="Sua cidade" {...field} className="pl-10" />
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/70">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel htmlFor="terms" className="font-normal">
                        Aceito os <Link href="/terms" className="text-primary hover:underline">Termos de Uso</Link> e <Link href="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? <SpinnerIcon className="animate-spin" /> : 'Cadastrar e Começar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
