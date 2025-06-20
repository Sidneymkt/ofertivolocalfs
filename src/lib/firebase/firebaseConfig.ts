
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // For later
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Optional

// --- Firebase Configuration Diagnostics ---
// This section helps debug issues related to Firebase and Google Maps API key setup.
// Ensure your .env.local file in the project root has the correct values.
console.log("-----------------------------------------------------------");
console.log("[DEBUG] Firebase/Maps Configuration - Values from Environment Variables:");
console.log("-----------------------------------------------------------");

const apiKeyFromEnv = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const authDomainFromEnv = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucketFromEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

console.log("[DEBUG] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:", apiKeyFromEnv ? `"${apiKeyFromEnv.substring(0, 4)}...${apiKeyFromEnv.substring(apiKeyFromEnv.length - 4)}"`: "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", authDomainFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_PROJECT_ID:", projectIdFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", storageBucketFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", messagingSenderIdFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_APP_ID:", appIdFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:", measurementIdFromEnv || "Not required / undefined");
console.log("-----------------------------------------------------------");


if (!apiKeyFromEnv) {
  console.error(
    "CRITICAL: Google Maps API Key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) is MISSING from .env.local. Map functionality WILL FAIL. " +
    "Please add it to your .env.local file (e.g., NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY) and restart your Next.js development server."
  );
}
if (!projectIdFromEnv) {
    console.error(
    "CRITICAL: Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is MISSING from .env.local. Firebase services (Firestore, Auth) WILL FAIL. " +
    "Please add it to your .env.local file and restart your Next.js development server."
    );
}


const firebaseConfig = {
  apiKey: apiKeyFromEnv, // CRITICAL: This MUST be correctly set in .env.local for Google Maps and Firebase
  authDomain: authDomainFromEnv,
  projectId: projectIdFromEnv, // CRITICAL: This MUST be correctly set for Firestore/Auth
  storageBucket: storageBucketFromEnv,
  messagingSenderId: messagingSenderIdFromEnv,
  appId: appIdFromEnv,
  measurementId: measurementIdFromEnv, // Optional for Analytics
};

// Log the final config being used (masking API key for safety in logs)
const configForLogging = { ...firebaseConfig, apiKey: apiKeyFromEnv ? `SET (masked)` : 'MISSING' };
console.log("[DEBUG] FINAL Firebase Config being used for initialization:", JSON.parse(JSON.stringify(configForLogging)));
console.log("-----------------------------------------------------------");


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
// let storage: FirebaseStorage;
// let analytics: Analytics;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("[DEBUG] Firebase App initialized successfully.");
  } catch (error) {
    console.error("[DEBUG] Error initializing Firebase App:", error);
    console.error("[DEBUG] Review the Firebase config above. Common issues: missing projectId, malformed authDomain.");
    // It's often better to let the app try to run so other parts might work,
    // but errors in map/DB components will indicate the specific failure.
    // throw error; // Optionally re-throw to halt execution if Firebase is absolutely critical for startup
  }
} else {
  app = getApps()[0];
  console.log("[DEBUG] Firebase App already initialized, getting existing instance.");
}

// Attempt to get services only if app was initialized or retrieved
// @ts-ignore app might be uninitialized if initializeApp threw and wasn't caught
if (app) {
  try {
    auth = getAuth(app);
    db = getFirestore(app);
    // storage = getStorage(app);
    console.log("[DEBUG] Firebase Auth and Firestore services obtained (or attempted).");
  } catch (error) {
    console.error("[DEBUG] Error getting Firebase services (Auth, Firestore):", error);
    console.error("[DEBUG] This usually happens if firebaseConfig.projectId is missing or incorrect, or if Firebase SDKs have issues.");
  }
} else {
    console.error("[DEBUG] Firebase App object is not available. Auth and Firestore services cannot be initialized.");
}


// if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
//   // analytics = getAnalytics(app); // Enable if Analytics is needed
// }

export { app, auth, db /*, storage, analytics */ };
