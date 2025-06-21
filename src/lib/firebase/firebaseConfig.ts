
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

// This is the recommended way to use environment variables.
// It ensures that the app doesn't build if the variables are missing.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// --- Robust check for environment variables ---
const essentialKeys: (keyof typeof firebaseConfig)[] = [
  'apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId'
];

const missingKeys = essentialKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
    const errorMessage = `Firebase config is missing the following required environment variables: ${missingKeys.join(', ')}. Please check your .env.local file.`;
    console.error(errorMessage);
    // In a browser environment, you might want to display this error to the user
    // For now, we throw an error to halt initialization.
    if (typeof window !== 'undefined') {
        // A simple alert or a more sophisticated UI element could be used here.
        // For developer visibility, the console error is most important.
    }
    // We don't throw an error here to allow the app to render and show other potential errors,
    // but Firebase services will not be initialized.
}


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;


if (missingKeys.length === 0 && !getApps().length) {
    console.log("Initializing Firebase...");
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
        isSupported().then((supported) => {
            if (supported) {
                analytics = getAnalytics(app);
            }
        });
    }
} else if (getApps().length > 0) {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
     isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
     });
  }
} else {
    console.error("Firebase not initialized due to missing configuration.");
}


// @ts-ignore: These will be undefined if initialization fails, which is handled by the checks above.
export { app, auth, db, storage, analytics };
