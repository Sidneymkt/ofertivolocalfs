
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage'; // For later
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Optional

// --- TEMPORARY DEBUGGING ---
// The API key provided by the user is being used directly here for debugging.
// WARNING: This is NOT a secure practice for production.
// API keys should be stored in environment variables (e.g., .env.local)
// and accessed via process.env.NEXT_PUBLIC_FIREBASE_API_KEY.
// This change should be reverted once the issue is resolved.
const hardcodedApiKey = "AIzaSyBc5qpm_dKOc94HIfV0FxU3tWikY5ZRbLo";
const apiKeyFromEnv = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

console.log("-----------------------------------------------------------");
console.log("[DEBUG] Firebase Configuration Diagnostics:");
console.log("-----------------------------------------------------------");
console.log("[DEBUG] API Key from .env (NEXT_PUBLIC_FIREBASE_API_KEY):", apiKeyFromEnv);
console.log("[DEBUG] Hardcoded API Key for test:", hardcodedApiKey);
console.log("[DEBUG] Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN):", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("[DEBUG] Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID):", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("[DEBUG] Storage Bucket (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET):", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log("[DEBUG] Messaging Sender ID (NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID):", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log("[DEBUG] App ID (NEXT_PUBLIC_FIREBASE_APP_ID):", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
console.log("[DEBUG] Measurement ID (NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID):", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
console.log("-----------------------------------------------------------");


if (!apiKeyFromEnv && !hardcodedApiKey) {
  console.error("CRITICAL: Firebase API Key is missing from both .env and hardcoded fallback. Map functionality will likely fail. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env.local file and the server is restarted, or provide a hardcoded key for testing.");
}

const firebaseConfig = {
  apiKey: hardcodedApiKey, // Using the hardcoded key for this test
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Log the full config to the console for debugging
// This will appear in the BROWSER console when the app loads client-side Firebase.
console.log("[DEBUG] FINAL Firebase Config being used for initialization:", JSON.parse(JSON.stringify(firebaseConfig))); // Deep copy for logging
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
    console.error("[DEBUG] Firebase config used during initialization error:", firebaseConfig);
    throw error;
  }
} else {
  app = getApps()[0];
  console.log("[DEBUG] Firebase App already initialized, getting existing instance.");
}

try {
  auth = getAuth(app);
  db = getFirestore(app);
  // storage = getStorage(app);
  console.log("[DEBUG] Firebase Auth and Firestore services obtained successfully.");
} catch (error) {
  console.error("[DEBUG] Error getting Firebase services (Auth, Firestore):", error);
  console.error("[DEBUG] Firebase config used when getting services failed:", firebaseConfig);
  throw error;
}


// if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
//   analytics = getAnalytics(app);
// }

export { app, auth, db /*, storage, analytics */ };
