import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const expoConfig = Constants.expoConfig ?? Constants.manifest;
const extra = expoConfig?.extra;

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    extra?.firebaseApiKey ??
    "YOUR_FIREBASE_API_KEY",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    extra?.firebaseAuthDomain ??
    "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ??
    extra?.firebaseProjectId ??
    "YOUR_FIREBASE_PROJECT_ID",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    extra?.firebaseStorageBucket ??
    "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    extra?.firebaseMessagingSenderId ??
    "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ??
    extra?.firebaseAppId ??
    "YOUR_FIREBASE_APP_ID",
};

const hasConfigValues = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.length > 0 && !value.includes("YOUR_FIREBASE")
);

let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;
const isFirebaseEnabled = hasConfigValues;

if (isFirebaseEnabled) {
  firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
} else {
  // Do not throw in environments without Firebase; app can use local storage fallback.
  // Keep exports defined (null) so imports don't crash.
  console.warn(
    'Firebase não configurado — usando fallback local. Defina EXPO_PUBLIC_FIREBASE_* se precisar do Firebase.'
  );
}

export { isFirebaseEnabled };
export const auth = firebaseAuth;
export const db = firebaseDb;
