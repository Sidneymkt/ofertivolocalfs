
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

// Helper function to check for environment variables and log errors
const checkEnvVar = (value: string | undefined, varName: string): string => {
    if (!value) {
        console.error(`Firebase Config Warning: A variável de ambiente ${varName} está faltando. Isso pode causar erros.`);
    }
    return value || ''; // Retorna string vazia para evitar crash, deixando o SDK do Firebase lidar com o erro final.
};

const firebaseConfig = {
  apiKey: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Project ID é a chave mais crítica.
  storageBucket: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, 'NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | undefined;


if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    const errorMessage = `
    ================================================================================
    FATAL FIREBASE CONFIG ERROR: A variável de ambiente NEXT_PUBLIC_FIREBASE_PROJECT_ID está faltando.

    O aplicativo não pode ser inicializado sem um ID de projeto do Firebase.
    Isso causará um "Internal Server Error".

    AÇÃO NECESSÁRIA:
    1. Verifique se o arquivo '.env.local' existe no diretório raiz do seu projeto.
    2. Garanta que ele contém a linha: NEXT_PUBLIC_FIREBASE_PROJECT_ID="SEU_VALOR_AQUI"
    3. **IMPORTANTE: Você deve REINICIAR seu servidor de desenvolvimento depois de criar ou alterar o arquivo '.env.local'.**
    ================================================================================
    `;
    console.error(errorMessage);
} else {
    if (!getApps().length) {
        try {
            app = initializeApp(firebaseConfig);
        } catch (error) {
            console.error("Firebase initialization error. Make sure your environment variables are set correctly.", error);
            app = null;
        }
    } else {
        app = getApps()[0];
    }

    if (app) {
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
            isSupported().then(supported => {
                if (app && supported) { // Verifique se app não é nulo aqui também
                    analytics = getAnalytics(app);
                }
            });
        }
    }
}

// @ts-ignore
export { app, auth, db, storage, analytics };
