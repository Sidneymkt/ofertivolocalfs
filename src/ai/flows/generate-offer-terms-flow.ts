
'use server';
/**
 * @fileOverview AI flow for generating offer terms and conditions.
 * - generateOfferTerms - Generates terms and conditions for an offer.
 * - GenerateOfferTermsInput - Input type.
 * - GenerateOfferTermsOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateOfferTermsInputSchema = z.object({
  offerTitle: z.string().describe('The title of the offer.'),
  offerDescription: z.string().describe('The detailed description of the offer.'),
});
export type GenerateOfferTermsInput = z.infer<typeof GenerateOfferTermsInputSchema>;

const GenerateOfferTermsOutputSchema = z.object({
  suggestedTerms: z.string().max(1000).describe('Suggested terms and conditions for the offer, max 1000 characters.'),
});
export type GenerateOfferTermsOutput = z.infer<typeof GenerateOfferTermsOutputSchema>;

export async function generateOfferTerms(input: GenerateOfferTermsInput): Promise<GenerateOfferTermsOutput> {
  const parsedInput = GenerateOfferTermsInputSchema.parse(input);
  return generateOfferTermsFlow(parsedInput);
}

const prompt = ai.definePrompt({
  name: 'generateOfferTermsPrompt',
  input: { schema: GenerateOfferTermsInputSchema },
  output: { schema: GenerateOfferTermsOutputSchema },
  prompt: `
    Você é um assistente especializado em criar termos e condições concisos e relevantes para ofertas promocionais no Brasil.
    Seu objetivo é gerar termos e condições para uma oferta, com base no título e descrição fornecidos.
    Limite o texto dos termos a um máximo de 1000 caracteres.

    Título da Oferta: {{offerTitle}}
    Descrição da Oferta: {{offerDescription}}

    Instruções para os Termos e Condições (suggestedTerms):
    1.  **Clareza e Concisão**: Os termos devem ser fáceis de entender e diretos.
    2.  **Relevância**: Foque em condições que são diretamente aplicáveis à oferta descrita.
    3.  **Completude Essencial**: Inclua informações importantes como:
        *   Validade (se não totalmente coberta pela descrição, mencione que é conforme anunciado).
        *   Limitações (ex: "não cumulativo com outras promoções", "sujeito à disponibilidade", "uso único por CPF", "consumo no local").
        *   Exclusões (ex: "taxa de serviço/entrega não inclusa").
        *   Como usar (ex: "apresentar cupom/QR code", "mencionar a oferta").
    4.  **Linguagem**: Use uma linguagem apropriada para o público consumidor brasileiro.
    5.  **Restrição de Tamanho**: Não ultrapasse 1000 caracteres.

    Exemplos de frases comuns:
    *   "Válido enquanto durarem os estoques."
    *   "Não cumulativo com outras promoções vigentes."
    *   "Necessário apresentar o código do cupom no ato da compra."
    *   "Oferta válida apenas para consumo no local."
    *   "Imagens meramente ilustrativas."
    *   "Consulte sabores/produtos participantes."

    Formato de Saída Obrigatório (JSON):
    {
      "suggestedTerms": "Termos e condições aqui..."
    }
  `,
});

const generateOfferTermsFlow = ai.defineFlow(
  {
    name: 'generateOfferTermsFlow',
    inputSchema: GenerateOfferTermsInputSchema,
    outputSchema: GenerateOfferTermsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error('A IA não retornou uma resposta para os termos da oferta.');
    }
    return output;
  }
);

    