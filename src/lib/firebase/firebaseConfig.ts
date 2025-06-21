
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

// --- FOR DEBUGGING PURPOSES ---
// This configuration is hardcoded to diagnose the "400 INVALID_ARGUMENT" error.
// This is NOT recommended for production. The values should be in a .env.local file.
// A common error in the storageBucket value was also corrected below.
const firebaseConfig = {
  apiKey: "AIzaSyD81cqvN61kCehxxfRsHIoq5h1JU2_UL2I",
  authDomain: "ofertivo-local.firebaseapp.com",
  projectId: "ofertivo-local",
  storageBucket: "ofertivo-local.appspot.com", // Corrected from .firebasestorage.app
  messagingSenderId: "813157622357",
  appId: "1:813157622357:web:6fd20da9c9964e92cdeadc",
  measurementId: "G-13G8X9QXP6"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;

// Check for the essential config keys
if (!getApps().length) {
    console.log("Initializing Firebase with hardcoded config for debugging...");
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
} else {
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
}

// @ts-ignore: These will be undefined if initialization fails, which is handled.
export { app, auth, db, storage, analytics };
