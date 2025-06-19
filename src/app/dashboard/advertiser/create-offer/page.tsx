
'use client';

import React, { useState, type ChangeEvent, useEffect, useMemo } from 'react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { categories, offerTypes, type OfferTypeId, type Offer, mockAdvertiserUser } from '@/types';
import { 
  CalendarIcon, UploadCloud, X, Brain, Tag, DollarSign, Percent, Clock, ListChecks, Eye, Gamepad2, Save, Send, Image as ImageIconLucide, 
  AlertCircle, CheckCircle, Info, QrCode as QrCodeIcon, Smartphone, UserCheck, CheckCheck as CheckCheckIcon, Package as PackageIcon, LocateFixed, Building as BuildingIcon,
  Zap as ZapIcon, AlertTriangle, Loader2 as SpinnerIcon, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { generateOfferContent, type GenerateOfferContentInput } from '@/ai/flows/generate-offer-content-flow';
import { generateOfferTerms, type GenerateOfferTermsInput } from '@/ai/flows/generate-offer-terms-flow';
import { QRCodeSVG } from 'react-qr-code';


const offerFormSchemaBase = z.object({
  offerType: z.custom<OfferTypeId>(
    (val) => offerTypes.some(ot => ot.id === val), 
    { message: "Tipo de oferta é obrigatório." }
  ),
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres.").max(100, "Título muito longo."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres.").max(380, "Descrição não pode exceder 380 caracteres."),
  images: z.custom<File[]>().array().min(1, "Pelo menos uma imagem é obrigatória.").max(6, "Máximo de 6 imagens.").optional(),
  category: z.string({ required_error: "Categoria é obrigatória." }),
  validityStartDate: z.date({ required_error: "Data de início é obrigatória." }),
  validityEndDate: z.date({ required_error: "Data de fim é obrigatória." }),
  terms: z.string().max(1000, "Termos e condições muito longos.").optional(),
  visibility: z.enum(["normal", "destaque", "sorteio"]).default("normal"),
  tags: z.string().optional(),
  
  discountType: z.enum(["percentage", "finalValue"]).default("finalValue"),
  originalPrice: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val).replace(',', '.'))),
    z.number({ invalid_type_error: "Deve ser um número" }).positive("Deve ser um valor positivo").optional()
  ),
  discountPercentage: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val).replace(',', '.'))),
    z.number({ invalid_type_error: "Deve ser um número" }).min(0, "Não pode ser negativo").max(100, "Máximo 100%").optional()
  ),
  discountedPrice: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val).replace(',', '.'))), 
    z.number({ invalid_type_error: "Deve ser um número" }).positive("Deve ser um valor positivo").optional() 
  ),
  
  quantity: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseInt(String(val), 10)),
    z.number().int("Deve ser um número inteiro.").positive("Deve ser um valor positivo").optional()
  ),
  isUnlimited: z.boolean().default(false),
  
  pointsForCheckin: z.preprocess(
    (val) => (String(val).trim() === "" ? 0 : parseInt(String(val), 10)),
    z.number().int().min(0).optional().default(0)
  ),
  pointsForShare: z.preprocess(
    (val) => (String(val).trim() === "" ? 0 : parseInt(String(val), 10)),
    z.number().int().min(0).optional().default(0)
  ),
  pointsForComment: z.preprocess(
    (val) => (String(val).trim() === "" ? 0 : parseInt(String(val), 10)),
    z.number().int().min(0).optional().default(0)
  ),
  isRedeemableWithPoints: z.boolean().default(false),
  isPresentialOnly: z.boolean().default(false), 

  timeLimit: z.string().optional(), 
  isForNewUsersOnly: z.boolean().default(false), 
  minCheckins: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseInt(String(val), 10)),
    z.number().int("Deve ser um número inteiro").min(1, "Mínimo de 1 check-in").optional()
  ),
  checkinReward: z.string().optional(),
  comboItem1: z.string().optional(),
  comboItem2: z.string().optional(),
  comboItem3: z.string().optional(),
  targetNeighborhood: z.string().optional(),
});

const offerFormSchema = offerFormSchemaBase.refine(data => {
  if (data.discountedPrice === undefined && data.discountType === 'finalValue' && data.originalPrice !== undefined) {
    return false; 
  }
  if (data.discountType === 'finalValue' && data.discountedPrice === undefined && data.originalPrice !== undefined) {
     return false;
  }
  return true;
}, {
  message: "Preço promocional é obrigatório para este tipo de desconto quando o preço original é informado.",
  path: ["discountedPrice"],
}).refine(data => {
  if (data.originalPrice && data.discountedPrice !== undefined && data.discountedPrice >= data.originalPrice) {
    return false;
  }
  return true;
}, {
  message: "Preço promocional deve ser menor que o preço original.",
  path: ["discountedPrice"],
}).refine(data => data.validityEndDate >= data.validityStartDate, {
  message: "Data de fim deve ser igual ou posterior à data de início.",
  path: ["validityEndDate"],
}).refine(data => {
  if (data.discountType === "percentage" && (data.discountPercentage === undefined || data.discountPercentage === null)) {
    return false;
  }
  return true;
}, {
  message: "Porcentagem de desconto é obrigatória para este tipo de desconto.",
  path: ["discountPercentage"],
}).refine(data => { 
  if (data.offerType === 'relampago' && !data.timeLimit) return false;
  if (data.offerType === 'checkin_premiado' && (!data.minCheckins || !data.checkinReward)) return false;
  if (data.offerType === 'combo' && !data.comboItem1) return false; 
  return true;
}, (data) => { 
  if (data.offerType === 'relampago' && !data.timeLimit) {
    return { message: "Horário limite é obrigatório para Oferta Relâmpago.", path: ["timeLimit"] };
  }
  if (data.offerType === 'checkin_premiado' && !data.minCheckins) {
    return { message: "Número mínimo de check-ins é obrigatório.", path: ["minCheckins"] };
  }
  if (data.offerType === 'checkin_premiado' && !data.checkinReward) {
    return { message: "Recompensa do check-in é obrigatória.", path: ["checkinReward"] };
  }
  if (data.offerType === 'combo' && !data.comboItem1) {
    return { message: "Pelo menos o Item 1 do combo é obrigatório.", path: ["comboItem1"] };
  }
  return {}; 
});


type OfferFormValues = z.infer<typeof offerFormSchema>;

const getIconForOfferType = (typeId: OfferTypeId | undefined): React.ElementType => {
  if (!typeId) return ListChecks;
  const offerTypeDetail = offerTypes.find(ot => ot.id === typeId);
  return offerTypeDetail?.icon || ListChecks;
};


export default function CreateOfferPage() {
  const { toast } = useToast();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoadingAIContent, setIsLoadingAIContent] = useState(false);
  const [isLoadingAITerms, setIsLoadingAITerms] = useState(false);

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      offerType: 'padrao',
      title: '',
      description: '',
      images: [],
      category: undefined,
      validityStartDate: new Date(),
      validityEndDate: new Date(Date.now() + 7 * 86400000), 
      terms: '',
      visibility: "normal",
      tags: '',
      discountType: "finalValue",
      originalPrice: undefined,
      discountPercentage: undefined,
      discountedPrice: undefined,
      quantity: undefined,
      isUnlimited: false,
      pointsForCheckin: 0,
      pointsForShare: 0,
      pointsForComment: 0,
      isRedeemableWithPoints: false,
      isPresentialOnly: false,
      timeLimit: '',
      isForNewUsersOnly: false,
      minCheckins: undefined,
      checkinReward: '',
      comboItem1: '',
      comboItem2: '',
      comboItem3: '',
      targetNeighborhood: '',
    },
  });

  const { watch, setValue, getValues, trigger, control } = form;
  const isUnlimited = watch("isUnlimited");
  const selectedOfferType = watch("offerType");
  const discountType = watch("discountType");
  const originalPrice = watch("originalPrice");
  const discountPercentage = watch("discountPercentage");
  const discountedPrice = watch("discountedPrice");
  const offerTitleForQRCode = watch("title");

  const currentOfferTypeDetails = useMemo(() => {
    return offerTypes.find(ot => ot.id === selectedOfferType);
  }, [selectedOfferType]);

  useEffect(() => {
    if (isUnlimited) {
      setValue("quantity", undefined, { shouldValidate: true });
    }
  }, [isUnlimited, setValue]);

  useEffect(() => {
    const op = originalPrice;
    const dp = discountedPrice;
    const discPerc = discountPercentage;

    if (discountType === "percentage" && op !== undefined && discPerc !== undefined && discPerc >=0 && discPerc <=100) {
      const calculatedDiscountedPrice = parseFloat((op * (1 - discPerc / 100)).toFixed(2));
      if (getValues("discountedPrice") !== calculatedDiscountedPrice) {
        setValue("discountedPrice", calculatedDiscountedPrice, { shouldValidate: true });
      }
    } else if (discountType === "finalValue" && op !== undefined && dp !== undefined && op > 0 && dp < op) {
      const calculatedPercentage = parseFloat(((op - dp) / op * 100).toFixed(2));
      if (getValues("discountPercentage") !== calculatedPercentage && calculatedPercentage >= 0 && calculatedPercentage <= 100) {
         setValue("discountPercentage", calculatedPercentage, { shouldValidate: true });
      }
    } else if (discountType === "percentage" && (op === undefined || discPerc === undefined || discPerc < 0 || discPerc > 100)) {
        if (getValues("discountedPrice") !== undefined) {
            setValue("discountedPrice", undefined, { shouldValidate: true });
        }
    } else if (discountType === "finalValue" && (op === undefined || dp === undefined || dp >= op)) {
        if (getValues("discountPercentage") !== undefined) {
            setValue("discountPercentage", undefined, { shouldValidate: true });
        }
    }
  }, [originalPrice, discountPercentage, discountedPrice, discountType, setValue, getValues]);

  useEffect(() => {
    if (selectedOfferType === 'exclusiva_app' || selectedOfferType === 'cupom_qr') {
      setValue('isPresentialOnly', true, { shouldValidate: true });
    }
  }, [selectedOfferType, setValue]);


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newFiles = filesArray.slice(0, 6 - selectedFiles.length);
      
      const newSelectedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(newSelectedFiles);
      form.setValue("images", newSelectedFiles, { shouldValidate: true });

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
    form.setValue("images", newSelectedFiles, { shouldValidate: true });

    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newImagePreviews);
    URL.revokeObjectURL(imagePreviews[index]); 
  };

  const onSubmit: SubmitHandler<OfferFormValues> = (data) => {
    const imageFileNames = selectedFiles.map(file => file.name);
    const galleryImageHints = imageFileNames.map((_, index) => `${data.title.split(" ")[0]} ${data.category}`.toLowerCase().slice(0,20)); 

    const newOffer: Offer = {
      id: `offer-${Date.now()}-${Math.random().toString(36).substring(2,7)}`, 
      ...data,
      status: 'awaiting_approval', 
      createdBy: mockAdvertiserUser.advertiserProfileId || 'unknown_advertiser',
      merchantId: mockAdvertiserUser.advertiserProfileId || 'unknown_advertiser',
      merchantName: mockAdvertiserUser.businessName || 'Nome do Anunciante',
      merchantIsVerified: mockAdvertiserUser.isProfileComplete, 
      imageUrl: imagePreviews[0] || 'https://placehold.co/600x300.png?text=Oferta', 
      'data-ai-hint': `${data.title.split(" ")[0]} ${data.category}`.toLowerCase().slice(0,20),
      galleryImages: imagePreviews,
      galleryImageHints: galleryImageHints,
      createdAt: new Date(),
      updatedAt: new Date(),
      originalPrice: data.originalPrice,
      discountPercentage: data.discountPercentage,
      discountedPrice: data.discountedPrice || 0, 
      timeLimit: data.timeLimit,
      isForNewUsersOnly: data.isForNewUsersOnly,
      minCheckins: data.minCheckins,
      checkinReward: data.checkinReward,
      comboItem1: data.comboItem1,
      comboItem2: data.comboItem2,
      comboItem3: data.comboItem3,
      targetNeighborhood: data.targetNeighborhood,
      pointsAwarded: (data.pointsForCheckin || 0) + (data.pointsForShare || 0) + (data.pointsForComment || 0) || 5, 
    };

    console.log('Simulating saving offer to Firestore:', newOffer);
    
    toast({
      title: "Oferta Enviada para Aprovação!",
      description: `Sua oferta "${newOffer.title}" foi cadastrada e está aguardando moderação.`,
      variant: "default",
      duration: 7000,
    });
  };

  const handleGenerateContentWithAI = async () => {
    const offerTypeId = getValues("offerType");
    const businessCategory = getValues("category");
    const currentTitle = getValues("title");
    const currentDescription = getValues("description");
    const op = getValues("originalPrice");
    const dp = getValues("discountedPrice");
    const discPerc = getValues("discountPercentage");

    if (!offerTypeId) {
      toast({ variant: "destructive", title: "Seleção Necessária", description: "Por favor, selecione um Tipo de Oferta primeiro." });
      return;
    }
    if (!businessCategory) {
      toast({ variant: "destructive", title: "Seleção Necessária", description: "Por favor, selecione uma Categoria do Negócio." });
      return;
    }
    if (!currentTitle && !currentDescription && !op && !dp && !discPerc) {
        toast({ variant: "destructive", title: "Informação Necessária", description: "Forneça ao menos um título, descrição ou detalhes de preço para a IA." });
        return;
    }

    let discountDetails = "Nenhum desconto principal informado.";
    if (dp !== undefined) {
        discountDetails = `Preço promocional de R$${dp.toFixed(2)}`;
        if (op !== undefined) {
            discountDetails += `, original R$${op.toFixed(2)}`;
        }
        if (discPerc !== undefined && discPerc > 0 && discPerc <= 100) {
             discountDetails += ` (${discPerc.toFixed(0)}% de desconto)`;
        }
    } else if (discPerc !== undefined && discPerc > 0 && discPerc <= 100) {
        discountDetails = `${discPerc.toFixed(0)}% de desconto`;
        if (op !== undefined) {
            discountDetails += ` sobre R$${op.toFixed(2)}`;
        }
    }
    
    const productServiceHint = currentTitle || businessCategory; 

    setIsLoadingAIContent(true);
    toast({ title: "Gerando com IA...", description: "Aguarde enquanto criamos sugestões de título e descrição." });

    try {
      const input: GenerateOfferContentInput = {
        offerTypeId,
        businessCategory,
        productServiceHint,
        discountDetails,
        currentTitle: currentTitle || undefined,
        currentDescription: currentDescription || undefined,
      };
      
      const result = await generateOfferContent(input);
      
      if (result.suggestedTitle) {
        setValue("title", result.suggestedTitle, { shouldValidate: true });
      }
      if (result.suggestedDescription) {
        setValue("description", result.suggestedDescription, { shouldValidate: true });
      }
      toast({ title: "Conteúdo Gerado pela IA!", description: "Título e descrição atualizados com as sugestões." });
    } catch (error: any) {
      console.error("AI content generation error:", error);
      toast({ variant: "destructive", title: "Erro na IA", description: error.message || "Não foi possível gerar conteúdo com IA." });
    } finally {
      setIsLoadingAIContent(false);
    }
  };

  const handleGenerateTermsWithAI = async () => {
    const offerTitle = getValues("title");
    const offerDescription = getValues("description");

    if (!offerTitle || !offerDescription) {
      toast({ variant: "destructive", title: "Informação Necessária", description: "Por favor, preencha o título e a descrição da oferta primeiro." });
      return;
    }

    setIsLoadingAITerms(true);
    toast({ title: "Gerando Termos com IA...", description: "Aguarde enquanto criamos sugestões de termos e condições." });

    try {
      const input: GenerateOfferTermsInput = {
        offerTitle,
        offerDescription,
      };
      const result = await generateOfferTerms(input);
      if (result.suggestedTerms) {
        setValue("terms", result.suggestedTerms, { shouldValidate: true });
        toast({ title: "Termos Gerados pela IA!", description: "Os termos e condições foram atualizados." });
      } else {
        toast({ variant: "destructive", title: "Sem Sugestões", description: "A IA não retornou sugestões de termos." });
      }
    } catch (error: any) {
      console.error("AI terms generation error:", error);
      toast({ variant: "destructive", title: "Erro na IA", description: error.message || "Não foi possível gerar termos com IA." });
    } finally {
      setIsLoadingAITerms(false);
    }
  };


  const handleSaveDraft = () => {
    const data = form.getValues();
    console.log('Saving draft:', data);
    toast({
      title: "Rascunho Salvo (Simulado)!",
      description: "Sua oferta foi salva como rascunho.",
    });
  };
  
  const OfferSpecificFields = () => {
    if (!selectedOfferType) return null;

    switch (selectedOfferType) {
      case 'relampago':
        return (
          <>
            <FormField
              control={form.control}
              name="timeLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="timeLimit">Horário Limite (HH:mm)</FormLabel>
                  <FormControl>
                    <Input id="timeLimit" type="time" placeholder="Ex: 23:59" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>Defina o horário final para a oferta relâmpago no último dia de validade.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-md text-sm flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5"/>
              <p className="font-medium">Ofertas Relâmpago criam um senso de urgência!</p>
            </div>
          </>
        );
      case 'exclusiva_app':
        return (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md text-sm flex items-center gap-2 text-blue-700">
            <Smartphone className="h-5 w-5"/>
            <p className="font-medium">Esta oferta será validada por QR Code diretamente no app do usuário. O campo "Oferta válida apenas presencialmente" foi marcado automaticamente.</p>
          </div>
        );
      case 'cupom_qr':
        const qrValue = `https://ofertivo.app/coupon?title=${encodeURIComponent(offerTitleForQRCode || "Oferta")}`;
        return (
           <>
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md text-sm flex items-center gap-2 text-green-700">
              <QrCodeIcon className="h-5 w-5"/>
              <p className="font-medium">Um QR Code será gerado para esta oferta. O campo "Oferta válida apenas presencialmente" foi marcado automaticamente.</p>
            </div>
            <div className="mt-4 p-4 border rounded-md bg-muted/30 flex flex-col items-center justify-center">
                <h4 className="font-semibold mb-2 text-sm">QR Code (Prévia)</h4>
                {offerTitleForQRCode && (
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                        <QRCodeSVG value={qrValue} size={120} />
                    </div>
                )}
                {!offerTitleForQRCode && (
                    <Image src="https://placehold.co/150x150.png?text=QR+CODE" alt="Placeholder QR Code" width={120} height={120} data-ai-hint="qr code"/>
                )}
                <p className="text-xs text-muted-foreground mt-2">O QR Code real será vinculado ao ID da oferta ao publicar.</p>
            </div>
           </>
        );
      case 'primeiro_uso':
        return (
          <FormField
            control={form.control}
            name="isForNewUsersOnly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="isForNewUsersOnly" /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="isForNewUsersOnly" className="font-normal">Visível apenas para novos usuários</FormLabel>
                  <FormDescription>Esta oferta será exibida prioritariamente para usuários que ainda não fizeram check-in no seu estabelecimento.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        );
      case 'checkin_premiado':
        return (
          <>
            <FormField
              control={form.control}
              name="minCheckins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="minCheckins">Nº Mínimo de Check-ins</FormLabel>
                  <FormControl><Input id="minCheckins" type="number" placeholder="Ex: 5" {...field} value={field.value ?? ''} /></FormControl>
                  <FormDescription>Quantos check-ins (em qualquer oferta sua) o usuário precisa para ganhar esta recompensa.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkinReward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="checkinReward">Recompensa do Check-in</FormLabel>
                  <FormControl><Textarea id="checkinReward" placeholder="Ex: Um café expresso grátis, 10% off na próxima compra" {...field} value={field.value ?? ''} /></FormControl>
                  <FormDescription>Descreva o prêmio que o usuário receberá ao atingir o nº de check-ins.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 'combo':
        return (
          <>
            <FormField control={form.control} name="comboItem1" render={({ field }) => ( <FormItem> <FormLabel>Item 1 do Combo</FormLabel> <FormControl><Input placeholder="Ex: Hambúrguer Clássico" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="comboItem2" render={({ field }) => ( <FormItem> <FormLabel>Item 2 do Combo (Opcional)</FormLabel> <FormControl><Input placeholder="Ex: Batata Frita Média" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="comboItem3" render={({ field }) => ( <FormItem> <FormLabel>Item 3 do Combo (Opcional)</FormLabel> <FormControl><Input placeholder="Ex: Refrigerante Lata" {...field} value={field.value ?? ''} /></FormControl> <FormMessage /> </FormItem> )}/>
          </>
        );
      case 'bairro':
        return (
          <FormField
            control={form.control}
            name="targetNeighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="targetNeighborhood">Bairro Alvo</FormLabel>
                 <div className="relative">
                    <LocateFixed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl><Input id="targetNeighborhood" placeholder="Ex: Centro (comece a digitar para sugestões)" {...field} className="pl-10" value={field.value ?? ''}/></FormControl>
                 </div>
                <FormDescription>Esta oferta será destacada para usuários no bairro especificado. (Dropdown dinâmico em breve).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'padrao':
         return <p className="text-sm text-muted-foreground">Configure os campos comuns para esta oferta padrão.</p>;
      default:
        return <p className="text-sm text-muted-foreground">Selecione um tipo de oferta para ver campos específicos.</p>;
    }
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
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary" /> Tipo de Oferta</CardTitle>
              <CardDescription>Selecione o tipo de promoção que deseja criar. Isso adaptará os campos disponíveis.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="offerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="offerType">Selecione o Tipo de Oferta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="offerType">
                          <div className="flex items-center gap-2">
                            {selectedOfferType && React.createElement(getIconForOfferType(selectedOfferType), {className: "h-4 w-4 text-muted-foreground"})}
                            <SelectValue placeholder="Escolha um tipo de oferta..." />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {offerTypes.map(ot => {
                           const Icon = ot.icon;
                           return(
                            <SelectItem key={ot.id} value={ot.id}>
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 w-full">
                                      <Icon className="h-4 w-4 text-muted-foreground"/>
                                      <span>{ot.name}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" align="start" className="max-w-xs">
                                    <p className="font-semibold">{ot.name}</p>
                                    <p className="text-xs">{ot.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </SelectItem>
                           );
                        })}
                      </SelectContent>
                    </Select>
                    {currentOfferTypeDetails && <FormDescription className="mt-2 flex items-center gap-1.5 text-xs"><Info size={13}/> {currentOfferTypeDetails.description}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

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
                      <Input id="title" placeholder="Ex: 50% Off em TODO o cardápio!" {...field} value={field.value ?? ''} />
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
                      <Textarea id="description" placeholder="Descreva os detalhes, diferenciais e o que está incluso na sua oferta..." {...field} rows={4} value={field.value ?? ''}/>
                    </FormControl>
                    <FormDescription>Limite de 380 caracteres.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" onClick={handleGenerateContentWithAI} className="w-full md:w-auto" disabled={isLoadingAIContent || isLoadingAITerms || !selectedOfferType || !form.getValues("category")}>
                {isLoadingAIContent ? <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                {isLoadingAIContent ? "Gerando..." : "Gerar Título/Descrição com IA"}
                {!selectedOfferType && !isLoadingAIContent && <span className="text-xs ml-1 text-muted-foreground">(Selecione tipo)</span>}
                {selectedOfferType && !form.getValues("category") && !isLoadingAIContent && <span className="text-xs ml-1 text-muted-foreground">(Selecione categoria)</span>}
              </Button>
            </CardContent>
          </Card>

          {/* Imagens da Oferta */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIconLucide className="text-primary" /> Imagens da Oferta</CardTitle>
              <CardDescription>Adicione de 1 a 6 imagens para ilustrar sua oferta. A primeira será a principal.</CardDescription>
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
                    <div key={index} className="relative aspect-video group"> 
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
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Desconto</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={(value) => {
                          field.onChange(value);
                          if (value === "percentage") {
                            setValue("discountedPrice", undefined, {shouldValidate: true}); 
                          } else { 
                            setValue("discountPercentage", undefined, {shouldValidate: true}); 
                          }
                        }}
                        defaultValue={field.value} className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="finalValue" id="finalValue" /></FormControl>
                          <FormLabel htmlFor="finalValue" className="font-normal">Definir Preço Final Promocional</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl><RadioGroupItem value="percentage" id="percentage" /></FormControl>
                          <FormLabel htmlFor="percentage" className="font-normal">Aplicar Desconto Percentual (%)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="originalPrice">Preço Original (R$) <span className="text-xs text-muted-foreground">(Opcional)</span></FormLabel>
                        <FormControl><Input id="originalPrice" type="text" placeholder="Ex: 100,00" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value.replace(/[^0-9,.]/g, ''))} /></FormControl>
                        <FormDescription>Preço antes do desconto.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                {discountType === "percentage" ? (
                  <FormField
                      control={form.control}
                      name="discountPercentage"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="discountPercentage">Desconto (%)</FormLabel>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <FormControl><Input id="discountPercentage" type="text" placeholder="Ex: 25" {...field} value={field.value ?? ''} className="pl-10" onChange={e => field.onChange(e.target.value.replace(/[^0-9,.]/g, ''))}/></FormControl>
                          </div>
                          <FormDescription>Porcentagem de desconto.</FormDescription>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                ) : (
                     <div className="text-muted-foreground text-center text-2xl hidden md:block">→</div>
                )}

                <FormField
                    control={form.control}
                    name="discountedPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="discountedPrice">Preço Promocional (R$)</FormLabel>
                        <FormControl><Input id="discountedPrice" type="text" placeholder="Ex: 79,90" {...field} value={field.value ?? ''} readOnly={discountType === 'percentage' && originalPrice !== undefined && discountPercentage !== undefined && discountPercentage >=0 && discountPercentage <=100} onChange={e => field.onChange(e.target.value.replace(/[^0-9,.]/g, ''))}/></FormControl>
                        <FormDescription>
                          {discountType === 'percentage' && originalPrice !== undefined && discountPercentage !== undefined && discountPercentage >=0 && discountPercentage <=100 ? 'Calculado automaticamente.' : 'Preço final para o cliente.'}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              {discountType === 'finalValue' && originalPrice !== undefined && discountedPrice !== undefined && discountedPrice < originalPrice && (
                 <p className="text-sm text-green-600 font-medium">
                    Desconto de {(( (originalPrice - discountedPrice) / originalPrice ) * 100).toFixed(0)}% aplicado!
                 </p>
              )}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="validityStartDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Início da Validade</FormLabel>
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
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } initialFocus/>
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
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("validityStartDate") || new Date(new Date().setHours(0,0,0,0))) } initialFocus />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="quantity">Quantidade Disponível (Opcional)</FormLabel>
                          <FormControl><Input id="quantity" type="number" placeholder="Ex: 50" {...field} value={field.value ?? ''} disabled={isUnlimited} /></FormControl>
                          <FormDescription>Deixe em branco ou 0 se ilimitado, ou marque abaixo.</FormDescription>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField control={form.control} name="isUnlimited" render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="isUnlimited"/></FormControl>
                        <FormLabel htmlFor="isUnlimited" className="font-normal">Oferta com quantidade ilimitada</FormLabel>
                      </FormItem>
                    )}
                  />
              </div>
              <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                      <FormLabel htmlFor="tags">Tags (Opcional)</FormLabel>
                       <div className="relative">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl><Input id="tags" placeholder="Ex: #relampago, #exclusivo, #diadasmaes" {...field} className="pl-10" value={field.value ?? ''} /></FormControl>
                      </div>
                      <FormDescription>Separe as tags por vírgula. Ajuda os usuários a encontrar sua oferta.</FormDescription>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <div className="md:col-span-2">
                <FormField control={form.control} name="terms" render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="terms">Termos e Condições (Opcional)</FormLabel>
                        <FormControl><Textarea id="terms" placeholder="Ex: Válido apenas para consumo no local. Não cumulativo com outras promoções." {...field} rows={3} value={field.value ?? ''}/></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateTermsWithAI} className="mt-2" disabled={isLoadingAITerms || isLoadingAIContent || !form.getValues("title") || !form.getValues("description")}>
                    {isLoadingAITerms ? <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4 text-purple-600" />}
                    {isLoadingAITerms ? "Gerando..." : "Gerar Termos com IA"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campos específicos do tipo de oferta */}
          {selectedOfferType && (
            <Card className={cn("shadow-lg", currentOfferTypeDetails?.colorClass || 'border-border')}>
              <CardHeader className={cn(currentOfferTypeDetails?.colorClass ? currentOfferTypeDetails.colorClass.replace('border-', 'bg-').replace('-500', '-500/10') : '', "py-4 px-6")}>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {React.createElement(getIconForOfferType(selectedOfferType), {className: "text-primary h-5 w-5"})}
                    Configurações para: {currentOfferTypeDetails?.name}
                  </CardTitle>
                  {currentOfferTypeDetails?.description && <CardDescription className="text-xs">{currentOfferTypeDetails.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <OfferSpecificFields />
              </CardContent>
            </Card>
          )}

          {/* Categoria e Visibilidade */}
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Eye className="text-primary"/> Categoria e Visibilidade</CardTitle>
                <CardDescription>Escolha como sua oferta será classificada e exibida.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="category">Categoria da Oferta</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger id="category"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger></FormControl>
                        <SelectContent>{categories.map(cat => (<SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField control={form.control} name="visibility" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Visibilidade da Oferta</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="normal" id="vis-normal"/></FormControl>
                            <FormLabel htmlFor="vis-normal" className="font-normal">Pública (Normal)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="destaque" id="vis-destaque"/></FormControl>
                            <FormLabel htmlFor="vis-destaque" className="font-normal">Destaque (consome créditos)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="sorteio" id="vis-sorteio"/></FormControl>
                            <FormLabel htmlFor="vis-sorteio" className="font-normal">Parte de um Sorteio</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                    <FormField control={form.control} name="isPresentialOnly" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="isPresentialOnly" 
                                disabled={selectedOfferType === 'exclusiva_app' || selectedOfferType === 'cupom_qr'}
                            /></FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="isPresentialOnly" className="font-normal">Oferta válida apenas presencialmente</FormLabel>
                            <FormDescription>Ativa validação por QR Code na loja. Marcado automaticamente para alguns tipos de oferta.</FormDescription>
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
                <FormField control={form.control} name="pointsForCheckin" render={({ field }) => ( <FormItem> <FormLabel htmlFor="pointsForCheckin">Pontos por Check-in</FormLabel> <FormControl><Input id="pointsForCheckin" type="number" placeholder="Ex: 5" {...field} value={field.value ?? 0} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="pointsForShare" render={({ field }) => ( <FormItem> <FormLabel htmlFor="pointsForShare">Pontos por Compartilhamento</FormLabel> <FormControl><Input id="pointsForShare" type="number" placeholder="Ex: 3" {...field} value={field.value ?? 0} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="pointsForComment" render={({ field }) => ( <FormItem> <FormLabel htmlFor="pointsForComment">Pontos por Comentário</FormLabel> <FormControl><Input id="pointsForComment" type="number" placeholder="Ex: 1" {...field} value={field.value ?? 0} /></FormControl> <FormMessage /> </FormItem> )}/>
                <div className="sm:col-span-2 lg:col-span-3">
                     <FormField control={form.control} name="isRedeemableWithPoints" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} id="isRedeemableWithPoints"/></FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel htmlFor="isRedeemableWithPoints" className="font-normal">Permitir que usuários resgatem esta oferta usando pontos</FormLabel>
                            <FormDescription>Se marcado, defina o custo em pontos em outra seção (funcionalidade avançada).</FormDescription>
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
                    <h4 className="font-semibold mb-2 text-sm">Mini Pré-visualização da Oferta (Exemplo)</h4>
                    {getValues("title") && <p className="text-sm font-medium">Título: {getValues("title")}</p>}
                    {getValues("offerType") && <p className="text-xs text-muted-foreground">Tipo: {offerTypes.find(ot => ot.id === getValues("offerType"))?.name}</p>}
                    {getValues("discountedPrice") !== undefined && <p className="text-lg font-bold text-primary">R$ {getValues("discountedPrice")?.toFixed(2)}</p>}
                     <p className="text-xs text-muted-foreground text-center py-3"> (Pré-visualização mais detalhada em breve) </p>
                </div>

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
                <p className="text-xs text-muted-foreground">Dica: Preencha todos os campos relevantes para o tipo de oferta escolhido para melhor performance.</p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="button" variant="outline" onClick={handleSaveDraft} className="w-full sm:w-auto">
                        <Save className="mr-2 h-4 w-4" /> Salvar como Rascunho
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting || isLoadingAIContent || isLoadingAITerms}>
                        {form.formState.isSubmitting ? <><SpinnerIcon className="mr-2 h-4 w-4 animate-spin" /> Publicando...</> : <><Send className="mr-2 h-4 w-4" /> Publicar Oferta</>}
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
