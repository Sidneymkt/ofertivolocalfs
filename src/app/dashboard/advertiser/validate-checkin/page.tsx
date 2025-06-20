
'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { KeyRound, CheckCircle, AlertTriangle, Loader2 as SpinnerIcon, Gift, UserCircle, ShoppingBag } from 'lucide-react';
import { mockOffers, mockUser } from '@/types'; // For mock data

const checkinValidationSchema = z.object({
  checkinCode: z.string()
    .length(6, { message: 'O código de check-in deve ter exatamente 6 dígitos.' })
    .regex(/^\d{6}$/, { message: 'O código deve conter apenas números.' }),
});

type CheckinValidationFormValues = z.infer<typeof checkinValidationSchema>;

interface ValidationResult {
  success: boolean;
  message: string;
  offerTitle?: string;
  userName?: string;
  pointsAwarded?: number;
}

export default function ValidateCheckinPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const form = useForm<CheckinValidationFormValues>({
    resolver: zodResolver(checkinValidationSchema),
    defaultValues: {
      checkinCode: '',
    },
  });

  const onSubmit: SubmitHandler<CheckinValidationFormValues> = async (data) => {
    setIsSubmitting(true);
    setValidationResult(null);

    // Simulate API call / validation logic
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation: Code '123456' is valid for mockOffer[0] and mockUser
    if (data.checkinCode === '123456') {
      const offer = mockOffers[0];
      const user = mockUser;
      const points = offer.pointsAwarded || 10;

      setValidationResult({
        success: true,
        message: 'Check-in validado com sucesso!',
        offerTitle: offer.title,
        userName: user.name,
        pointsAwarded: points,
      });
      toast({
        title: 'Check-in Validado!',
        description: `${user.name} ganhou ${points} pontos pela oferta "${offer.title}".`,
        variant: 'default',
      });
    } else {
      setValidationResult({
        success: false,
        message: 'Código de check-in inválido, expirado ou já utilizado.',
      });
      toast({
        variant: 'destructive',
        title: 'Falha na Validação',
        description: 'O código informado não é válido. Verifique e tente novamente.',
      });
    }
    setIsSubmitting(false);
    form.reset(); // Reset form after submission
  };

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground flex items-center gap-3">
          <KeyRound className="h-8 w-8 text-primary" />
          Validar Check-in de Oferta
        </h1>
        <p className="text-muted-foreground">
          Insira o código numérico de 6 dígitos apresentado pelo cliente para validar a oferta e conceder os pontos.
        </p>
      </header>

      <Card className="shadow-lg max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Validação de Código</CardTitle>
          <CardDescription>Digite o código fornecido pelo usuário.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="checkinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="checkinCode" className="text-base">Código de Check-in</FormLabel>
                    <FormControl>
                      <Input
                        id="checkinCode"
                        placeholder="000000"
                        {...field}
                        className="text-2xl h-14 tracking-[0.3em] text-center font-mono"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <SpinnerIcon className="mr-2 h-5 w-5 animate-spin" /> Validando...
                  </>
                ) : (
                  'Validar Código'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {validationResult && (
        <Card className={`shadow-lg max-w-lg mx-auto mt-8 ${validationResult.success ? 'border-green-500 bg-green-500/5' : 'border-destructive bg-destructive/5'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${validationResult.success ? 'text-green-600' : 'text-destructive'}`}>
              {validationResult.success ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
              {validationResult.success ? 'Validação Bem-Sucedida' : 'Falha na Validação'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-base font-medium">{validationResult.message}</p>
            {validationResult.success && (
              <div className="space-y-2 text-sm text-muted-foreground border-t pt-3 mt-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} className="text-primary" />
                  <strong>Oferta:</strong> {validationResult.offerTitle}
                </div>
                <div className="flex items-center gap-2">
                  <UserCircle size={16} className="text-primary" />
                  <strong>Cliente:</strong> {validationResult.userName}
                </div>
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-primary" />
                  <strong>Pontos Concedidos:</strong> {validationResult.pointsAwarded}
                </div>
              </div>
            )}
            {!validationResult.success && (
              <p className="text-sm text-muted-foreground">
                Por favor, verifique se o código foi digitado corretamente e se ainda está dentro do período de validade.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
