import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Fern's User ID (you can set this in .env.local)
export const FERN_UID = process.env.NEXT_PUBLIC_FERN_UID || "FERN_UID_HERE";

// Helper functions
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

export const isFern = (uid?: string) => {
  const checkUid = uid || auth.currentUser?.uid;
  return checkUid === FERN_UID || checkUid === process.env.NEXT_PUBLIC_OWNER_UID;
};

export type { User } from 'firebase/auth';
export type { DatabaseReference, DataSnapshot } from 'firebase/database';
export type { StorageReference, UploadResult } from 'firebase/storage';
