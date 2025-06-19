
'use client';

import React, { useState, type ChangeEvent, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { categories } from '@/types';
import { CalendarIcon, UploadCloud, X, Brain, Tag, DollarSign, Percent, Clock, ListChecks, Eye, Gamepad2, Save, Send, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Added missing import

const offerFormSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres.").max(100, "Título muito longo."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres.").max(500, "Descrição muito longa."),
  originalPrice: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val).replace(',', '.'))),
    z.number({ invalid_type_error: "Deve ser um número" }).positive("Deve ser um valor positivo").optional()
  ),
  discountedPrice: z.preprocess(
    (val) => parseFloat(String(val).replace(',', '.')),
    z.number({ required_error: "Preço promocional é obrigatório.", invalid_type_error: "Deve ser um número" }).positive("Deve ser um valor positivo")
  ),
  tags: z.string().optional(),
  validityStartDate: z.date({ required_error: "Data de início é obrigatória." }),
  validityEndDate: z.date({ required_error: "Data de fim é obrigatória." }),
  quantity: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseInt(String(val), 10)),
    z.number().int("Deve ser um número inteiro.").positive("Deve ser um valor positivo").optional()
  ),
  isUnlimited: z.boolean().default(false),
  terms: z.string().max(1000, "Termos e condições muito longos.").optional(),
  category: z.string({ required_error: "Categoria é obrigatória." }),
  visibility: z.enum(["normal", "destaque", "sorteio"]).default("normal"),
  isPresentialOnly: z.boolean().default(false),
  pointsForCheckin: z.preprocess(
    (val) => (String(val).trim() === "" ? 0 : parseInt(String(val), 10)),
    z.number().int().min(0, "Não pode ser negativo.").optional().default(0)
  ),
  pointsForShare: z.preprocess(
    (val) => (String(val).trim() === "" ? 0 : parseInt(String(val), 10)),
    z.number().int().min(0, "Não pode ser negativo.").optional().default(0)
  ),
  pointsForComment: z.preprocess(
    (val) => (String(val).trim() === "" ? 0 : parseInt(String(val), 10)),
    z.number().int().min(0, "Não pode ser negativo.").optional().default(0)
  ),
  isRedeemableWithPoints: z.boolean().default(false),
  images: z.custom<File[]>().array().max(6, "Máximo de 6 imagens.").optional(),
}).refine(data => {
  if (data.originalPrice && data.discountedPrice >= data.originalPrice) {
    return false;
  }
  return true;
}, {
  message: "Preço promocional deve ser menor que o preço original.",
  path: ["discountedPrice"],
}).refine(data => data.validityEndDate >= data.validityStartDate, {
  message: "Data de fim deve ser igual ou posterior à data de início.",
  path: ["validityEndDate"],
});

type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function CreateOfferPage() {
  const { toast } = useToast();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: '',
      description: '',
      originalPrice: undefined,
      discountedPrice: undefined,
      tags: '',
      validityStartDate: undefined,
      validityEndDate: undefined,
      quantity: undefined,
      isUnlimited: false,
      terms: '',
      category: undefined,
      visibility: "normal",
      isPresentialOnly: false,
      pointsForCheckin: 0,
      pointsForShare: 0,
      pointsForComment: 0,
      isRedeemableWithPoints: false,
      images: [],
    },
  });

  const { watch, setValue } = form;
  const isUnlimited = watch("isUnlimited");

  useEffect(() => {
    if (isUnlimited) {
      setValue("quantity", undefined);
    }
  }, [isUnlimited, setValue]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newFiles = filesArray.slice(0, 6 - selectedFiles.length);
      
      const newSelectedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(newSelectedFiles);
      form.setValue("images", newSelectedFiles);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
    form.setValue("images", newSelectedFiles);

    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newImagePreviews);
    URL.revokeObjectURL(imagePreviews[index]); // Clean up object URL
  };

  const onSubmit: SubmitHandler<OfferFormValues> = (data) => {
    console.log('Offer data:', data);
    toast({
      title: "Oferta Publicada (Simulado)!",
      description: `Sua oferta "${data.title}" foi enviada para publicação.`,
      variant: "default"
    });
    form.reset();
    setImagePreviews([]);
    setSelectedFiles([]);
  };

  const handleGenerateWithAI = () => {
    toast({
      title: "Gerando com IA (Simulado)",
      description: "Em breve, sugestões de título e descrição serão geradas aqui!",
    });
    // Placeholder: set some dummy data
    form.setValue("title", "Super Desconto Imperdível em Pizzas!");
    form.setValue("description", "Aproveite nossa deliciosa pizza artesanal com um desconto incrível. Massa fresca, ingredientes selecionados e muito sabor para você e sua família. Peça já!");
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    console.log('Saving draft:', data);
    toast({
      title: "Rascunho Salvo (Simulado)!",
      description: "Sua oferta foi salva como rascunho.",
    });
  };
  

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      <header className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">
          Criar Nova Oferta
        </h1>
        <p className="text-muted-foreground">Preencha os detalhes abaixo para cadastrar sua promoção.</p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Informações Básicas */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary" /> Informações Básicas</CardTitle>
              <CardDescription>Defina o título e a descrição da sua oferta. Seja criativo!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title">Nome da Oferta (Título)</FormLabel>
                    <FormControl>
                      <Input id="title" placeholder="Ex: 50% Off em TODO o cardápio!" {...field} />
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
                    <FormLabel htmlFor="description">Descrição da Oferta</FormLabel>
                    <FormControl>
                      <Textarea id="description" placeholder="Descreva os detalhes, diferenciais e o que está incluso na sua oferta..." {...field} rows={4}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" onClick={handleGenerateWithAI} className="w-full md:w-auto">
                <Brain className="mr-2 h-4 w-4" /> Gerar Título e Descrição com IA (Simulado)
              </Button>
            </CardContent>
          </Card>

          {/* Imagens da Oferta */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="text-primary" /> Imagens da Oferta</CardTitle>
              <CardDescription>Adicione até 6 imagens para ilustrar sua oferta. A primeira será a principal.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="images-upload" className={cn("flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70", imagePreviews.length >= 6 && "cursor-not-allowed opacity-60")}>
                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (Máx. 800x400px, até 6 imagens)</p>
                        </div>
                      <FormControl>
                        <Input 
                          id="images-upload" 
                          type="file" 
                          className="hidden" 
                          multiple 
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleImageChange}
                          disabled={imagePreviews.length >= 6}
                        />
                      </FormControl>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square group">
                      <Image src={preview} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X size={14} />
                        <span className="sr-only">Remover imagem</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detalhes Comerciais */}
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign className="text-primary"/> Detalhes Comerciais</CardTitle>
                <CardDescription>Defina os preços, validade e outras condições da sua oferta.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="originalPrice">Preço Original (R$) (Opcional)</FormLabel>
                        <FormControl><Input id="originalPrice" type="text" placeholder="Ex: 100,00" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9,.]/g, ''))} /></FormControl>
                        <FormDescription>Preço antes do desconto.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="discountedPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="discountedPrice">Preço Promocional (R$)</FormLabel>
                        <FormControl><Input id="discountedPrice" type="text" placeholder="Ex: 79,90" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9,.]/g, ''))} /></FormControl>
                        <FormDescription>Preço final para o cliente.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="validityStartDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Início da Validade</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="validityEndDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Fim da Validade</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < (form.getValues("validityStartDate") || new Date(new Date().setHours(0,0,0,0))) }
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="md:col-span-2 space-y-1">
                  <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="quantity">Quantidade Disponível (Opcional)</FormLabel>
                          <FormControl><Input id="quantity" type="number" placeholder="Ex: 50" {...field} disabled={isUnlimited} /></FormControl>
                          <FormDescription>Deixe em branco se ilimitado ou marque abaixo.</FormDescription>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                    control={form.control}
                    name="isUnlimited"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="isUnlimited"
                          />
                        </FormControl>
                        <FormLabel htmlFor="isUnlimited" className="font-normal">
                          Oferta com quantidade ilimitada
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel htmlFor="tags">Tags (Opcional)</FormLabel>
                         <div className="relative">
                          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <FormControl><Input id="tags" placeholder="Ex: #relampago, #exclusivo, #diadasmaes" {...field} className="pl-10" /></FormControl>
                        </div>
                        <FormDescription>Separe as tags por vírgula. Ajuda os usuários a encontrar sua oferta.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel htmlFor="terms">Termos e Condições (Opcional)</FormLabel>
                        <FormControl><Textarea id="terms" placeholder="Ex: Válido apenas para consumo no local. Não cumulativo com outras promoções." {...field} rows={3}/></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
          </Card>

          {/* Categoria e Visibilidade */}
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Eye className="text-primary"/> Categoria e Visibilidade</CardTitle>
                <CardDescription>Escolha como sua oferta será classificada e exibida.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="category">Categoria da Oferta</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map(category => (
                            <SelectItem key={category.name} value={category.name}>
                                {category.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Visibilidade da Oferta</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="normal" id="vis-normal"/>
                            </FormControl>
                            <FormLabel htmlFor="vis-normal" className="font-normal">Normal</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="destaque" id="vis-destaque"/>
                            </FormControl>
                            <FormLabel htmlFor="vis-destaque" className="font-normal">Destaque (consome créditos)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="sorteio" id="vis-sorteio"/>
                            </FormControl>
                            <FormLabel htmlFor="vis-sorteio" className="font-normal">Parte de um Sorteio</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                    <FormField
                        control={form.control}
                        name="isPresentialOnly"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="isPresentialOnly"
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="isPresentialOnly" className="font-normal">
                                Oferta válida apenas presencialmente (Ativa validação por QR Code na loja)
                            </FormLabel>
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
            </CardContent>
          </Card>

          {/* Gamificação e Engajamento */}
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gamepad2 className="text-primary"/> Gamificação e Engajamento</CardTitle>
                <CardDescription>Defina quantos pontos os usuários ganharão ao interagir com esta oferta.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="pointsForCheckin"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="pointsForCheckin">Pontos por Check-in</FormLabel>
                        <FormControl><Input id="pointsForCheckin" type="number" placeholder="Ex: 5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pointsForShare"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="pointsForShare">Pontos por Compartilhamento</FormLabel>
                        <FormControl><Input id="pointsForShare" type="number" placeholder="Ex: 3" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pointsForComment"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="pointsForComment">Pontos por Comentário</FormLabel>
                        <FormControl><Input id="pointsForComment" type="number" placeholder="Ex: 1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="sm:col-span-2 lg:col-span-3">
                     <FormField
                        control={form.control}
                        name="isRedeemableWithPoints"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="isRedeemableWithPoints"
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="isRedeemableWithPoints" className="font-normal">
                                Permitir que usuários resgatem esta oferta usando pontos (funcionalidade avançada)
                            </FormLabel>
                            <FormDescription>Se marcado, defina o custo em pontos em outra seção.</FormDescription>
                            </div>
                        </FormItem>
                        )}
                    />
                </div>
            </CardContent>
          </Card>

          {/* Ações e Publicação */}
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Send className="text-primary"/> Ações e Publicação</CardTitle>
                <CardDescription>Revise sua oferta e escolha uma ação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/30">
                    <h4 className="font-semibold mb-2 text-sm">Mini Pré-visualização da Oferta</h4>
                    <p className="text-xs text-muted-foreground text-center py-6"> (Pré-visualização da oferta aparecerá aqui em breve) </p>
                </div>

                {form.formState.isValid && (
                   <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md text-sm flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5"/>
                        <p className="font-medium">Todos os campos obrigatórios parecem preenchidos corretamente!</p>
                    </div>
                )}
                {!form.formState.isValid && form.formState.isSubmitted && (
                     <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5"/>
                        <p className="font-medium">Verifique os campos em vermelho. Alguns dados estão pendentes ou inválidos.</p>
                    </div>
                )}


                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="button" variant="outline" onClick={handleSaveDraft} className="w-full sm:w-auto">
                        <Save className="mr-2 h-4 w-4" /> Salvar como Rascunho
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                        <Send className="mr-2 h-4 w-4" /> Publicar Oferta
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground text-center">Ao publicar, sua oferta poderá passar por uma breve moderação.</p>
            </CardContent>
          </Card>

        </form>
      </Form>
    </div>
  );
}

