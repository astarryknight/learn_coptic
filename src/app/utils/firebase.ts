import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const requiredEnvKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

type FirebaseEnvKey = (typeof requiredEnvKeys)[number];

function getEnvValue(key: FirebaseEnvKey): string {
  return String(import.meta.env[key] || '').trim();
}

function validateFirebaseEnv() {
  const problems: string[] = [];
  const values = Object.fromEntries(
    requiredEnvKeys.map((key) => [key, getEnvValue(key)]),
  ) as Record<FirebaseEnvKey, string>;

  for (const key of requiredEnvKeys) {
    if (!values[key]) problems.push(`${key} is missing or empty`);
  }

  if (values.VITE_FIREBASE_API_KEY && !values.VITE_FIREBASE_API_KEY.startsWith('AIza')) {
    problems.push('VITE_FIREBASE_API_KEY does not look like a Firebase Web API key');
  }

  if (values.VITE_FIREBASE_AUTH_DOMAIN && !values.VITE_FIREBASE_AUTH_DOMAIN.includes('.')) {
    problems.push('VITE_FIREBASE_AUTH_DOMAIN looks invalid');
  }

  if (values.VITE_FIREBASE_APP_ID && !values.VITE_FIREBASE_APP_ID.includes(':web:')) {
    problems.push('VITE_FIREBASE_APP_ID should contain ":web:"');
  }

  if (problems.length > 0) {
    throw new Error(
      `Firebase environment configuration is invalid:\n- ${problems.join('\n- ')}`,
    );
  }

  return values;
}

const firebaseEnv = validateFirebaseEnv();

const firebaseConfig = {
  apiKey: firebaseEnv.VITE_FIREBASE_API_KEY,
  authDomain: firebaseEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseEnv.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}
