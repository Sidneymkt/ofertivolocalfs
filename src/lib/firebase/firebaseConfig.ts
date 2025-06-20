
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // For later
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Optional

// --- Firebase Configuration Diagnostics ---
console.log("-----------------------------------------------------------");
console.log("[DEBUG] Firebase/Maps Configuration - Values from Environment Variables:");
console.log("-----------------------------------------------------------");

const apiKeyFromEnv = process.env.NEXT_PUBLIC_FIREBASE_API_KEY; // This key is often the same as Google Maps key in simple setups
const authDomainFromEnv = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucketFromEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementIdFromEnv = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const googleMapsApiKeyFromEnv = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_API_KEY:", apiKeyFromEnv ? `SET (masked)`: "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (for map display):", googleMapsApiKeyFromEnv ? `SET (masked)`: "MISSING or undefined (Map feature will fail if this is not set)");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", authDomainFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_PROJECT_ID:", projectIdFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", storageBucketFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", messagingSenderIdFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_APP_ID:", appIdFromEnv || "MISSING or undefined");
console.log("[DEBUG] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (Optional):", measurementIdFromEnv || "Not set or undefined");
console.log("-----------------------------------------------------------");


if (!apiKeyFromEnv) {
  console.error(
    "CRITICAL: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING from .env.local. Firebase services might fail. " +
    "Please add it to your .env.local file (e.g., NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY) and restart your Next.js development server."
  );
}
if (!projectIdFromEnv) {
    console.error(
    "CRITICAL: Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) is MISSING from .env.local. Firebase services (Firestore, Auth) WILL FAIL. " +
    "Please add it to your .env.local file and restart your Next.js development server."
    );
}


const firebaseConfig = {
  apiKey: apiKeyFromEnv,
  authDomain: authDomainFromEnv,
  projectId: projectIdFromEnv,
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
    console.error("[DEBUG] Review the Firebase config above. Common issues: missing projectId, malformed authDomain, or issues with API key if it's also used for Firebase services.");
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

