
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

// Helper function to check for environment variables and log errors
const checkEnvVar = (value: string | undefined, varName: string): string => {
    if (!value) {
        const errorMessage = `
        ================================================================================
        Firebase Config Error: A variável de ambiente ${varName} está faltando.

        AÇÃO NECESSÁRIA:
        1. Verifique se o arquivo '.env.local' existe no diretório raiz do seu projeto.
        2. Garanta que ele contém a linha: ${varName}="SEU_VALOR_AQUI"
        3. **IMPORTANTE: Você deve REINICIAR seu servidor de desenvolvimento depois de criar ou alterar o arquivo '.env.local'.**
        ================================================================================
        `;
        console.error(errorMessage);
    }
    return value || ''; // Retorna string vazia para evitar crash, deixando o SDK do Firebase lidar com o erro final.
};


// These environment variables are now expected to be in your .env.local file
// and also configured in your Firebase App Hosting backend settings.
const firebaseConfig = {
  apiKey: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: checkEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, 'NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;


if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
            isSupported().then(supported => {
                if (supported) {
                    analytics = getAnalytics(app);
                }
            });
        }
    } catch (error) {
        console.error("Firebase initialization error. Make sure your environment variables are set correctly.", error);
    }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      isSupported().then(supported => {
          if (supported) {
              analytics = getAnalytics(app);
          }
      });
  }
}

// @ts-ignore
export { app, auth, db, storage, analytics };
    