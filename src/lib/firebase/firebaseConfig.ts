
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // For later
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Optional

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey) {
  console.error("Firebase API Key is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env.local file and the server is restarted.");
  // Optionally, throw an error to halt execution if the key is critical for app startup
  // throw new Error("Firebase API Key is not configured.");
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Log the config to the console for debugging
// This will appear in the BROWSER console when the app loads client-side Firebase.
console.log("Firebase Config being used:", firebaseConfig);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
// let storage: FirebaseStorage;
// let analytics: Analytics;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Error initializing Firebase App:", error);
    console.error("Firebase config used during initialization error:", firebaseConfig);
    // If initialization fails, re-throw or handle to prevent further errors
    throw error;
  }
} else {
  app = getApps()[0];
}

try {
  auth = getAuth(app);
  db = getFirestore(app);
  // storage = getStorage(app);
} catch (error) {
  console.error("Error getting Firebase services (Auth, Firestore):", error);
  console.error("Firebase config used when getting services failed:", firebaseConfig);
  // Depending on your app's needs, you might want to throw this error
  // or set auth/db to a state that indicates they are unavailable.
  // For now, re-throwing to make the issue visible.
  throw error; 
}


// if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
//   analytics = getAnalytics(app);
// }

export { app, auth, db /*, storage, analytics */ };
