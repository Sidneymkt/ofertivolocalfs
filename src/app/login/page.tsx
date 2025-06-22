
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, LogIn, Eye, EyeOff, Loader2 as SpinnerIcon } from 'lucide-react';
import { auth } from '@/lib/firebase/firebaseConfig';
import { signInWithEmailAndPassword, type User as FirebaseUser } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type UserType = 'user' | 'advertiser';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<UserType>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta! Redirecionando...`,
      });
      // TODO: Store user session globally (e.g., React Context, Zustand, Redux)
      if (activeTab === 'user') {
        router.push('/'); // Feed para usuário
      } else {
        // Here, you might want to check if the user actually IS an advertiser from Firestore
        router.push('/dashboard/advertiser'); // Painel para anunciante
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Ocorreu um erro ao tentar fazer login. Tente novamente.";
      // The 'auth/invalid-credential' code is the modern way Firebase signals a wrong email or password.
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "E-mail ou senha inválidos. Por favor, verifique seus dados e tente novamente.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "O formato do e-mail é inválido.";
      }
      toast({
        variant: "destructive",
        title: "Falha no Login",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const LoginForm = ({ userType }: { userType: UserType }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <FormControl>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                    className="pl-10 pr-10"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? <SpinnerIcon className="animate-spin" /> : 'Entrar'}
        </Button>
      </form>
    </Form>
  );

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 selection:bg-primary selection:text-primary-foreground"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="abstract gradient"
    >
      <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm border border-border/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Entrar no Ofertivo</CardTitle>
          <CardDescription>Acesse sua conta para descobrir ou criar ofertas incríveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user">Sou Usuário</TabsTrigger>
              <TabsTrigger value="advertiser">Sou Anunciante</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <LoginForm userType="user" />
            </TabsContent>
            <TabsContent value="advertiser">
              <LoginForm userType="advertiser" />
            </TabsContent>
          </Tabs>
          <div className="mt-6 text-center text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
           <Button variant="outline" className="w-full" onClick={() => alert('Login com Google (funcionalidade opcional)')}>
            <LogIn className="mr-2 h-4 w-4" /> Login com Google
          </Button>
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta?{' '}
            {activeTab === 'user' ? (
              <Link href="/signup/user" className="font-semibold text-primary hover:underline">
                Cadastre-se
              </Link>
            ) : (
              <Link href="/signup/advertiser" className="font-semibold text-primary hover:underline">
                Cadastre-se
              </Link>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
