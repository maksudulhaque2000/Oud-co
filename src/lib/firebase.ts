import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  googleProvider: GoogleAuthProvider;
};

let cachedServices: FirebaseServices | null = null;
let firebaseConfigError: string | null = null;

function readFirebaseConfig(): FirebaseOptions | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim();
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || (projectId ? `${projectId}.firebaseapp.com` : undefined);
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || (projectId ? `${projectId}.appspot.com` : undefined);
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim();

  const missing = [
    !apiKey ? "NEXT_PUBLIC_FIREBASE_API_KEY" : null,
    !projectId ? "NEXT_PUBLIC_FIREBASE_PROJECT_ID" : null,
    !appId ? "NEXT_PUBLIC_FIREBASE_APP_ID" : null,
  ].filter(Boolean);

  if (missing.length > 0) {
    firebaseConfigError = `Missing Firebase environment variables: ${missing.join(", ")}. Add them to Vercel and your local .env.local file.`;
    return null;
  }

  firebaseConfigError = null;

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

export function getFirebaseConfigError() {
  return firebaseConfigError;
}

export function getFirebaseServices(): FirebaseServices | null {
  if (cachedServices) {
    return cachedServices;
  }

  const firebaseConfig = readFirebaseConfig();
  if (!firebaseConfig) {
    return null;
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  cachedServices = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    googleProvider: new GoogleAuthProvider(),
  };

  return cachedServices;
}
