'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Helper function to check for environment variables and log clear errors
const checkEnvVar = (value: string | undefined, varName: string): string => {
    if (!value) {
        const errorMessage = `
        ================================================================================
        Genkit Config Error: A variável de ambiente ${varName} está faltando.

        As funcionalidades de IA serão desativadas, mas o aplicativo continuará funcionando.
        Para ativar a IA, siga os passos abaixo:

        AÇÃO NECESSÁRIA:
        1. Verifique se o arquivo '.env.local' existe no diretório raiz do seu projeto.
        2. Garanta que ele contém a linha: ${varName}="SEU_VALOR_AQUI"
        3. **IMPORTANTE: Você deve REINICIAR seu servidor de desenvolvimento depois de criar ou alterar o arquivo '.env.local'.**
        ================================================================================
        `;
        console.warn(errorMessage);
    }
    return value || ''; // Retorna string vazia para evitar crash
};


const apiKey = checkEnvVar(process.env.GEMINI_API_KEY, 'GEMINI_API_KEY');

const plugins = [];
if (apiKey) {
    plugins.push(googleAI({apiKey}));
}

export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-2.0-flash',
});
