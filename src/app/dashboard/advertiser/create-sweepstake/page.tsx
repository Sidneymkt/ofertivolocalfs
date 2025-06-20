
'use client';

import React, { useState, type ChangeEvent, useEffect, useRef } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from "@/hooks/use-toast";
import type { Sweepstake, User as AppUser } from '@/types'; 
import { 
  CalendarIcon, UploadCloud, X, Brain, Tag, DollarSign, Percent, Clock, ListChecks, Eye, Gamepad2, Save, Send, Image as ImageIconLucide, 
  AlertCircle, CheckCircle, Info, QrCode as QrCodeIconLucide, Smartphone, UserCheck, CheckCheck as CheckCheckIcon, Package as PackageIcon, LocateFixed, Building as BuildingIcon,
  Zap as ZapIcon, AlertTriangle, Loader2 as SpinnerIcon, FileText, Star as StarIcon, Gift, Coins, Award, Users, Trophy, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase/firebaseConfig';
import { getUserProfile } from '@/lib/firebase/services/userService';
import { createSweepstake, getSweepstake, updateSweepstake } from '@/lib/firebase/services/sweepstakeService';
import { Timestamp } from 'firebase/firestore';

const sweepstakeFormSchema = z.object({
  title: z.string().min(5, "Título do sorteio deve ter pelo menos 5 caracteres.").max(100, "Título muito longo."),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres.").max(500, "Descrição não pode exceder 500 caracteres."),
  prizeDetails: z.string().min(5, "Detalhes do prêmio devem ter pelo menos 5 caracteres.").max(300, "Detalhes do prêmio muito longos."),
  image: z.custom<File | null>((val) => val === null || val instanceof File, {
    message: "Por favor, envie um arquivo de imagem.",
  }).optional(), // Image is optional on edit if one already exists
  startDate: z.date({ required_error: "Data de início é obrigatória." }),
  endDate: z.date({ required_error: "Data de fim é obrigatória." }),
  pointsToEnter: z.preprocess(
    (val) => String(val).trim() === "" ? 0 : parseInt(String(val), 10),
    z.number().int("Deve ser um número inteiro.").min(0, "Custo em pontos não pode ser negativo.").default(0)
  ),
  numberOfWinners: z.preprocess(
    (val) => String(val).trim() === "" ? 1 : parseInt(String(val), 10),
    z.number().int("Deve ser um número inteiro.").min(1, "Deve haver pelo menos 1 ganhador.").default(1)
  ),
  maxParticipants: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseInt(String(val), 10)),
    z.number().int("Deve ser um número inteiro.").positive("Deve ser um valor positivo.").optional()
  ),
  rules: z.string().max(1000, "Regras muito longas.").optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "Data de fim deve ser igual ou posterior à data de início.",
  path: ["endDate"],
});

type SweepstakeFormValues = z.infer<typeof sweepstakeFormSchema>;

export default function CreateSweepstakePage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSweepstakeId = searchParams.get('editId');

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<SweepstakeFormValues>({
    resolver: zodResolver(sweepstakeFormSchema),
    defaultValues: {
      title: '',
      description: '',
      prizeDetails: '',
      image: null,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 86400000), 
      pointsToEnter: 10,
      numberOfWinners: 1,
      maxParticipants: undefined,
      rules: '',
    },
  });

  const { watch, setValue, getValues, trigger, control, reset } = form;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userProfile = await getUserProfile(userAuth.uid);
        if (userProfile && userProfile.isAdvertiser) {
          setCurrentUser(userProfile);
          if (editSweepstakeId) {
            const sweepstakeToEdit = await getSweepstake(editSweepstakeId);
            if (sweepstakeToEdit && sweepstakeToEdit.createdBy === userAuth.uid) {
              reset({
                ...sweepstakeToEdit,
                startDate: sweepstakeToEdit.startDate instanceof Timestamp ? sweepstakeToEdit.startDate.toDate() : new Date(sweepstakeToEdit.startDate),
                endDate: sweepstakeToEdit.endDate instanceof Timestamp ? sweepstakeToEdit.endDate.toDate() : new Date(sweepstakeToEdit.endDate),
                image: null, // File input is handled separately
              });
              setExistingImageUrl(sweepstakeToEdit.imageUrl);
              setImagePreview(sweepstakeToEdit.imageUrl); // Show existing image
            } else {
              toast({ title: "Erro", description: "Sorteio não encontrado ou não pertence a você.", variant: "destructive" });
              router.push('/dashboard/advertiser');
            }
          }
        } else {
          toast({ title: "Acesso Negado", description: "Você precisa ser um anunciante.", variant: "destructive" });
          router.push('/');
        }
      } else {
        router.push('/login');
      }
      setPageLoading(false);
    });
    return () => unsubscribe();
  }, [editSweepstakeId, reset, router, toast]);


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file); // Store the file for upload
      form.setValue("image", file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // For local preview
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(editSweepstakeId ? existingImageUrl : null); // Revert to existing or null
    form.setValue("image", null, { shouldValidate: true });
    if (imageInputRef.current) {
      imageInputRef.current.value = ""; 
    }
  };

  const onSubmit: SubmitHandler<SweepstakeFormValues> = async (data) => {
     if (!currentUser || !currentUser.id) {
      toast({ title: "Erro", description: "Anunciante não identificado.", variant: "destructive" });
      return;
    }
    if (!editSweepstakeId && !selectedFile) { // Require image on create
        form.setError("image", { type: "manual", message: "Imagem é obrigatória." });
        toast({ variant: "destructive", title: "Imagem faltando", description: "Adicione uma imagem para o sorteio."});
        return;
    }
    form.clearErrors("image");

    // TODO: Implement actual image upload to Firebase Storage
    // For now, if a new file is selected, use a placeholder. Otherwise, keep existingImageUrl.
    let finalImageUrl = existingImageUrl;
    if (selectedFile) {
      finalImageUrl = `https://placehold.co/600x300.png?text=${selectedFile.name.substring(0,10)}`; // Placeholder for new upload
    }
    if (!finalImageUrl){ // Fallback if no image at all
        finalImageUrl = 'https://placehold.co/600x300.png?text=Sorteio';
    }


    const sweepstakePayload: Omit<Sweepstake, 'id' | 'status' | 'isDrawn' | 'drawDate' | 'participantCount'> = {
      ...data,
      startDate: Timestamp.fromDate(data.startDate),
      endDate: Timestamp.fromDate(data.endDate),
      imageUrl: finalImageUrl,
      'data-ai-hint': data.title.substring(0, 20).toLowerCase() + ' prize',
      createdBy: currentUser.id,
    };
    
    try {
      if (editSweepstakeId) {
        await updateSweepstake(editSweepstakeId, sweepstakePayload);
        toast({ title: "Sorteio Atualizado!", description: `O sorteio "${data.title}" foi atualizado.` });
      } else {
        await createSweepstake(sweepstakePayload);
        toast({ title: "Sorteio Criado!", description: `Seu sorteio "${data.title}" foi cadastrado.` });
      }
      router.push('/dashboard/advertiser');
    } catch (error: any) {
      console.error("Error saving sweepstake:", error);
      toast({ variant: "destructive", title: "Erro ao Salvar Sorteio", description: error.message || "Não foi possível salvar o sorteio." });
    }
  };
  
  const handleSaveDraft = () => {
    const data = form.getValues();
    // TODO: Implement actual draft saving logic
    console.log('Saving sweepstake draft:', data);
    toast({
      title: "Rascunho Salvo (Simulado)!",
      description: "Seu sorteio foi salvo como rascunho.",
    });
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.back()}>
          <ArrowLeft size={18} />
          <span className="sr-only">Voltar</span>
        </Button>
        <header className="flex-grow">
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-foreground flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            {editSweepstakeId ? 'Editar Sorteio' : 'Criar Novo Sorteio'}
          </h1>
          <p className="text-muted-foreground">
            {editSweepstakeId ? 'Modifique os detalhes do seu sorteio.' : 'Preencha os detalhes abaixo para configurar seu sorteio.'}
          </p>
        </header>
      </div>


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="text-primary" /> Detalhes Básicos</CardTitle>
              <CardDescription>Defina o nome, descrição e imagem do seu sorteio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title">Título do Sorteio</FormLabel>
                    <FormControl>
                      <Input id="title" placeholder="Ex: Sorteio de Verão: Kit Churrasco Completo!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Descrição Detalhada</FormLabel>
                    <FormControl>
                      <Textarea id="description" placeholder="Descreva o sorteio, como participar, o que será sorteado..." {...field} rows={4}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel htmlFor="image-upload">Imagem Principal do Sorteio {editSweepstakeId ? '(Opcional se já existir)' : ''}</FormLabel>
                    <FormControl>
                       <Input 
                          id="image-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleImageChange}
                          ref={imageInputRef}
                        />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} className="w-full">
                        <UploadCloud className="mr-2 h-4 w-4" /> 
                        {selectedFile ? `Alterar Imagem (${selectedFile.name.substring(0,20)}...)` : (imagePreview ? "Alterar Imagem Existente" : "Selecionar Imagem")}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreview && (
                <div className="mt-4 relative aspect-video w-full max-w-md mx-auto group"> 
                  <Image src={imagePreview} alt="Prévia da Imagem do Sorteio" layout="fill" objectFit="contain" className="rounded-md border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                  >
                    <X size={14} />
                    <span className="sr-only">Remover imagem</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gift className="text-primary"/> Prêmio e Participação</CardTitle>
                <CardDescription>Defina o prêmio, o custo para entrar e quantos ganharão.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="prizeDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="prizeDetails">Descrição do(s) Prêmio(s)</FormLabel>
                    <FormControl>
                      <Textarea id="prizeDetails" placeholder="Ex: 1x Vale-compras de R$200, 1x Kit de Produtos X, 1x Serviço Y" {...field} rows={3}/>
                    </FormControl>
                    <FormDescription>Seja claro sobre o que será sorteado.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pointsToEnter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="pointsToEnter">Custo em Pontos para Participar</FormLabel>
                      <div className="relative">
                        <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="pointsToEnter" type="number" placeholder="Ex: 50" {...field} className="pl-10" /></FormControl>
                      </div>
                      <FormDescription>Quantos pontos o usuário gastará por bilhete/chance.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfWinners"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="numberOfWinners">Número de Ganhadores</FormLabel>
                       <div className="relative">
                        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="numberOfWinners" type="number" placeholder="Ex: 1" {...field} className="pl-10"/></FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="maxParticipants">Nº Máx. de Participantes (Opcional)</FormLabel>
                    <FormControl><Input id="maxParticipants" type="number" placeholder="Deixe em branco para ilimitado" {...field} value={field.value ?? ''} /></FormControl>
                    <FormDescription>Limite o número total de participantes se desejar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarIcon className="text-primary"/> Datas e Regras</CardTitle>
                <CardDescription>Configure o período de validade e as regras do sorteio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Início do Sorteio</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } initialFocus/>
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Fim do Sorteio (e Sorteio)</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} disabled={(date) => date < (form.getValues("startDate") || new Date(new Date().setHours(0,0,0,0))) } initialFocus />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="rules">Regras/Termos Adicionais (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea id="rules" placeholder="Ex: O sorteio será realizado ao vivo no Instagram. Ganhador deve retirar o prêmio em até 7 dias..." {...field} rows={3} value={field.value ?? ''}/>
                    </FormControl>
                    <FormDescription>Qualquer informação adicional importante para os participantes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Send className="text-primary"/> Ações</CardTitle>
                <CardDescription>Revise seu sorteio e escolha uma ação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {form.formState.isValid && form.formState.isSubmitted && (
                   <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md text-sm flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5"/>
                        <p className="font-medium">Todos os campos obrigatórios parecem preenchidos corretamente!</p>
                    </div>
                )}
                {!form.formState.isValid && form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0 && (
                     <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5"/>
                        <p className="font-medium">Verifique os campos em vermelho. Alguns dados estão pendentes ou inválidos.</p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="button" variant="outline" onClick={handleSaveDraft} className="w-full sm:w-auto">
                        <Save className="mr-2 h-4 w-4" /> Salvar como Rascunho
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? <><SpinnerIcon className="mr-2 h-4 w-4 animate-spin" /> {editSweepstakeId ? 'Atualizando...' : 'Publicando...'}</> : <><Send className="mr-2 h-4 w-4" /> {editSweepstakeId ? 'Atualizar Sorteio' : 'Publicar Sorteio'}</>}
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground text-center">Ao publicar, seu sorteio ficará visível para os usuários elegíveis.</p>
            </CardContent>
          </Card>

        </form>
      </Form>
      
      <Card className="shadow-md bg-secondary/10 border-secondary mt-12">
          <CardHeader>
            <CardTitle className="text-secondary text-lg flex items-center gap-2"><CheckCircle size={20} /> Dicas para um Sorteio de Sucesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-secondary/80">
            <p>✓ Ofereça um prêmio atraente e relevante para seu público.</p>
            <p>✓ Defina regras claras e fáceis de entender.</p>
            <p>✓ Promova seu sorteio nas suas redes sociais e para seus clientes.</p>
            <p>✓ Utilize os sorteios para aumentar o engajamento e fidelizar clientes.</p>
            <p>✓ Considere um custo em pontos baixo para incentivar a participação inicial.</p>
          </CardContent>
        </Card>
    </div>
  );
}
