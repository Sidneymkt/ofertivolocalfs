'use server';
/**
 * @fileOverview AI flow for generating offer titles and descriptions.
 * - generateOfferContent - Generates title and description for an offer.
 * - GenerateOfferContentInput - Input type.
 * - GenerateOfferContentOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Genkit examples sometimes show `import {z} from 'genkit'`, but direct zod import is safer.
import { offerTypes } from '@/types'; // To get offer type names for the prompt

const GenerateOfferContentInputSchema = z.object({
  offerTypeId: z.string().describe('The ID of the offer type (e.g., relampago, combo).'),
  businessCategory: z.string().describe('The category of the business (e.g., Alimentação, Serviços).'),
  productServiceHint: z.string().min(3, "Forneça uma dica sobre o produto/serviço.").describe('A hint about the product or service being offered (e.g., Pizza, Corte de Cabelo).'),
  discountDetails: z.string().describe('A summary of the discount (e.g., "50% de desconto", "de R$70 por R$35", "Leve 2 Pague 1").'),
  currentTitle: z.string().optional().describe('Current title, if any, to refine or base suggestions on.'),
  currentDescription: z.string().optional().describe('Current description, if any, to refine or base suggestions on.'),
});
export type GenerateOfferContentInput = z.infer<typeof GenerateOfferContentInputSchema>;

const GenerateOfferContentOutputSchema = z.object({
  suggestedTitle: z.string().describe('A catchy and optimized title for the offer, max 60 characters.'),
  suggestedDescription: z.string().max(380).describe('An optimized description for the offer, max 380 characters.'),
});
export type GenerateOfferContentOutput = z.infer<typeof GenerateOfferContentOutputSchema>;

export async function generateOfferContent(input: GenerateOfferContentInput): Promise<GenerateOfferContentOutput> {
  // Validate input using Zod before calling the flow, especially if called directly from client
  const parsedInput = GenerateOfferContentInputSchema.parse(input);
  return generateOfferContentFlow(parsedInput);
}

const prompt = ai.definePrompt({
  name: 'generateOfferContentPrompt',
  input: { schema: GenerateOfferContentInputSchema.extend({ offerTypeName: z.string() }) }, // Add offerTypeName for prompt context
  output: { schema: GenerateOfferContentOutputSchema },
  prompt: `
    Você é um especialista em marketing digital e copywriting, expert em criar textos persuasivos para ofertas e promoções no Brasil.
    Seu objetivo é gerar um título chamativo e uma descrição otimizada para uma oferta, com base nos seguintes detalhes:

    Tipo de Oferta: {{offerTypeName}} (ID: {{offerTypeId}})
    Categoria do Negócio: {{businessCategory}}
    Produto/Serviço Principal (ou ideia central da oferta): {{productServiceHint}}
    Detalhes do Desconto/Benefício: {{discountDetails}}
    {{#if currentTitle}}Título Atual (para refinar ou inspirar, se aplicável): "{{currentTitle}}"{{/if}}
    {{#if currentDescription}}Descrição Atual (para refinar ou inspirar, se aplicável): "{{currentDescription}}"{{/if}}

    Instruções Detalhadas:
    1.  **Título Sugerido (suggestedTitle)**:
        *   Crie um título curto (máximo 60 caracteres), magnético, e que gere curiosidade ou destaque o principal benefício.
        *   Use emojis relevantes para aumentar o apelo visual, se apropriado para a categoria do negócio.
        *   Exemplos: "🍕 Pizza Giga 50% OFF + Refri! 🥤", "⚡ Últimas Horas: Tudo com 70% OFF!", "💇‍♂️ Visual Novo? Corte + Barba R$50!"

    2.  **Descrição Sugerida (suggestedDescription)**:
        *   Elabore uma descrição clara, concisa (máximo 380 caracteres) e persuasiva.
        *   Destaque os principais benefícios e o que torna a oferta especial.
        *   Use frases de chamariz (CTAs) como "Aproveite agora!", "Não perca!", "Garanta já o seu!".
        *   Se for relevante para o tipo de oferta (ex: 'Relâmpago'), adicione um senso de urgência.
        *   Adapte a linguagem e o tom ao tipo de oferta e à categoria do negócio.

    Seja criativo e foque em converter o interesse do usuário em uma ação!

    Formato de Saída Obrigatório (JSON):
    {
      "suggestedTitle": "Título aqui",
      "suggestedDescription": "Descrição detalhada aqui..."
    }
  `,
});

const generateOfferContentFlow = ai.defineFlow(
  {
    name: 'generateOfferContentFlow',
    inputSchema: GenerateOfferContentInputSchema,
    outputSchema: GenerateOfferContentOutputSchema,
  },
  async (input) => {
    const offerTypeDetail = offerTypes.find(ot => ot.id === input.offerTypeId);
    const offerTypeName = offerTypeDetail ? offerTypeDetail.name : input.offerTypeId;

    const { output } = await prompt({ ...input, offerTypeName });
    
    if (!output) {
      throw new Error('A IA não retornou uma resposta para o conteúdo da oferta.');
    }
    return output;
  }
);
